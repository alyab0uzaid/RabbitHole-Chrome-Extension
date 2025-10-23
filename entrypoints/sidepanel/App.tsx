import React, {useEffect, useRef, useState} from 'react';
import './App.module.css';
import '../../assets/main.css'
import Sidebar, {SidebarType} from "@/entrypoints/sidebar.tsx";
import {browser} from "wxt/browser";
import ExtMessage, {MessageType} from "@/entrypoints/types.ts";
import {Button} from "@/components/ui/button.tsx";
import {Card} from "@/components/ui/card.tsx";
import {SettingsPage} from "@/entrypoints/sidepanel/settings.tsx";
import {SessionsPage} from "@/entrypoints/sidepanel/sessions.tsx";
import {useTheme} from "@/components/theme-provider.tsx";
import {useTranslation} from 'react-i18next';
import {TreeProvider, useTree} from "@/lib/tree-context.tsx";
import {BrowsingMode} from "@/lib/mode-manager.ts";
import {AdaptiveHome} from "@/entrypoints/sidepanel/adaptive-home.tsx";

function AppContent() {
    const [showButton, setShowButton] = useState(false)
    const [showCard, setShowCard] = useState(false)
    const [sidebarType, setSidebarType] = useState<SidebarType>(SidebarType.home);
    const [isTransitioning, setIsTransitioning] = useState(false);
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

                // If in tracking mode, ensure we're on home (which will show tree)
                if (message.mode === BrowsingMode.TRACKING) {
                    setSidebarType(SidebarType.home);
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
                className="fixed top-0 right-0 h-screen w-full bg-background z-[1000000000000] rounded-l-xl shadow-2xl flex flex-col">
                <Sidebar
                    currentMode={currentMode}
                    activeSidebarType={sidebarType}
                    sideNav={(newSidebarType: SidebarType) => {
                        if (newSidebarType !== sidebarType) {
                            setIsTransitioning(true);
                            setTimeout(() => {
                                setSidebarType(newSidebarType);
                                setTimeout(() => {
                                    setIsTransitioning(false);
                                }, 50);
                            }, 300);
                        }
                    }}
                />
                <main className="flex-1 overflow-auto">
                    {sidebarType === SidebarType.home && (
                        <div key="home" className={`h-full transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100 animate-in fade-in-0 duration-700'}`}>
                            <AdaptiveHome 
                                currentMode={currentMode}
                                onNavigateToSessions={() => {
                                    setIsTransitioning(true);
                                    setTimeout(() => {
                                        setSidebarType(SidebarType.sessions);
                                        setTimeout(() => {
                                            setIsTransitioning(false);
                                        }, 50);
                                    }, 500);
                                }}
                            />
                        </div>
                    )}
                    {sidebarType === SidebarType.sessions && (
                        <div key="sessions" className={`h-full transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100 animate-in fade-in-0 duration-700'}`}>
                            <SessionsPage
                                onSwitchToTree={() => {
                                    setIsTransitioning(true);
                                    setTimeout(() => {
                                        setSidebarType(SidebarType.home);
                                        setTimeout(() => {
                                            setIsTransitioning(false);
                                        }, 50);
                                    }, 500);
                                }}
                            />
                        </div>
                    )}
                    {sidebarType === SidebarType.settings && (
                        <div key="settings" className={`h-full transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100 animate-in fade-in-0 duration-700'}`}>
                            <SettingsPage/>
                        </div>
                    )}
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
