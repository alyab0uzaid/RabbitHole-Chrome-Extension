import React, {useEffect, useRef, useState} from 'react';
import './App.module.css';
import '../../assets/main.css'
import Sidebar, {SidebarType} from "@/entrypoints/sidebar.tsx";
import {browser} from "wxt/browser";
import ExtMessage, {MessageType} from "@/entrypoints/types.ts";
import {Button} from "@/components/ui/button.tsx";
import {Card} from "@/components/ui/card.tsx";
import {Home} from "@/entrypoints/sidepanel/home.tsx";
import {SettingsPage} from "@/entrypoints/sidepanel/settings.tsx";
import {SessionsPage} from "@/entrypoints/sidepanel/sessions.tsx";
import {useTheme} from "@/components/theme-provider.tsx";
import {useTranslation} from 'react-i18next';
import Header from "@/entrypoints/sidepanel/header.tsx";
import TreeView from "@/components/tree/TreeView.tsx";
import {TreeProvider, useTree} from "@/lib/tree-context.tsx";
import {BrowsingMode} from "@/lib/mode-manager.ts";

function AppContent() {
    const [showButton, setShowButton] = useState(false)
    const [showCard, setShowCard] = useState(false)
    const [sidebarType, setSidebarType] = useState<SidebarType>(SidebarType.tree);
    const [headTitle, setHeadTitle] = useState("tree")
    const [buttonStyle, setButtonStyle] = useState<any>();
    const [cardStyle, setCardStyle] = useState<any>();
    const [currentMode, setCurrentMode] = useState<BrowsingMode>(BrowsingMode.LOOKUP);
    const cardRef = useRef<HTMLDivElement>(null);
    const {theme, toggleTheme} = useTheme();
    const {t, i18n} = useTranslation();

    async function initI18n() {
        let data = await browser.storage.local.get('i18n');
        if (data.i18n) {
            await i18n.changeLanguage(data.i18n)
        }
    }

    useEffect(() => {
        // Query current mode on mount
        browser.runtime.sendMessage({ messageType: MessageType.getMode })
            .then((response: any) => {
                if (response?.mode) {
                    setCurrentMode(response.mode);
                    console.log('[Sidepanel] Initial mode:', response.mode);
                }
            })
            .catch(err => console.log('[Sidepanel] Could not get mode:', err));

        const messageListener = (message: ExtMessage, sender: any, sendResponse: any) => {
            console.log('[Sidepanel] Received message:', message.messageType);

            if (message.messageType == MessageType.changeLocale) {
                i18n.changeLanguage(message.content)
            } else if (message.messageType == MessageType.changeTheme) {
                toggleTheme(message.content)
            } else if (message.messageType === MessageType.modeChanged) {
                // Update current mode
                console.log('[Sidepanel] Mode changed to:', message.mode);
                setCurrentMode(message.mode as BrowsingMode);

                // If in tracking mode, switch to tree view
                if (message.mode === BrowsingMode.TRACKING) {
                    setSidebarType(SidebarType.tree);
                    setHeadTitle('tree');
                }
            }
        };

        browser.runtime.onMessage.addListener(messageListener);

        initI18n();

        // Cleanup listener on unmount
        return () => {
            browser.runtime.onMessage.removeListener(messageListener);
        };
    }, []);

    return (
        <div className={theme}>
            {<div
                className="fixed top-0 right-0 h-screen w-full bg-background z-[1000000000000] rounded-l-xl shadow-2xl">
                <Header headTitle={sidebarType === SidebarType.tree ? '' : headTitle}/>
                <Sidebar
                    currentMode={currentMode}
                    sideNav={(sidebarType: SidebarType) => {
                        setSidebarType(sidebarType);
                        setHeadTitle(sidebarType);
                    }}
                />
                <main className="mr-14 grid gap-4 p-4 md:gap-8 md:p-8">
                    {sidebarType === SidebarType.home && <Home/>}
                    {sidebarType === SidebarType.tree && (
                        <div className="h-[calc(100vh-4rem)]">
                            {currentMode === BrowsingMode.TRACKING ? (
                                <TreeView onNodeClick={async (nodeId, nodeData) => {
                                    console.log('[Sidepanel] Tree node clicked, navigating to:', nodeData.url);

                                    // Ask background script to navigate to this URL in the tracked Wikipedia tab
                                    try {
                                        await browser.runtime.sendMessage({
                                            messageType: MessageType.navigateToWikipedia,
                                            articleUrl: nodeData.url
                                        });
                                    } catch (error) {
                                        console.error('[Sidepanel] Failed to navigate Wikipedia tab:', error);
                                        // Fallback: create new tab
                                        await browser.tabs.create({ url: nodeData.url, active: true });
                                    }
                                }}/>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4 p-8 text-center">
                                    <div className="text-6xl">🌐</div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground mb-2">No Wikipedia Tab Active</h3>
                                        <p className="text-sm">
                                            Open a Wikipedia article to start building your research tree.
                                            <br />
                                            Your trees will be preserved when you switch between tabs.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {sidebarType === SidebarType.sessions && (
                        <div className="h-[calc(100vh-4rem)]">
                            <SessionsPage
                                onSwitchToTree={() => {
                                    setSidebarType(SidebarType.tree);
                                    setHeadTitle('tree');
                                }}
                            />
                        </div>
                    )}
                    {sidebarType === SidebarType.settings && <SettingsPage/>}
                </main>
            </div>
            }
        {showButton &&
            <Button className="absolute z-[100000]" style={buttonStyle}>send Message</Button>
        }
        {
            <Card ref={cardRef}
                  className={`absolute z-[100000] w-[300px] h-[200px] ${showCard ? 'block' : 'hidden'}`}
                  style={cardStyle}></Card>
        }
        </div>
    )
}

export default () => {
    return (
        <TreeProvider>
            <AppContent />
        </TreeProvider>
    );
};
