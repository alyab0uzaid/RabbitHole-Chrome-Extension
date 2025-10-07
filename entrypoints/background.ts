import {browser} from "wxt/browser";
import ExtMessage, {MessageFrom, MessageType} from "@/entrypoints/types.ts";

export default defineBackground(() => {
    console.log('RabbitHole background script loaded!', {id: browser.runtime.id});

    let lastSelectedText = '';

    // @ts-ignore
    browser.sidePanel.setPanelBehavior({openPanelOnActionClick: true}).catch((error: any) => console.error(error));

    // Listen for iframe navigation in Wikipedia
    if (browser.webNavigation) {
        console.log('[Background] webNavigation API available, adding listeners');

        // Listen to all navigation events for debugging
        const logNavigation = (eventName: string) => (details: any) => {
            if (details.url.includes('wikipedia.org')) {
                console.log(`[Background] ${eventName}:`, {
                    url: details.url,
                    frameId: details.frameId,
                    tabId: details.tabId,
                    parentFrameId: details.parentFrameId
                });
            }
        };

        browser.webNavigation.onBeforeNavigate.addListener(logNavigation('onBeforeNavigate'));
        browser.webNavigation.onCommitted.addListener(logNavigation('onCommitted'));
        browser.webNavigation.onCompleted.addListener(logNavigation('onCompleted'));

        // Main handler for Wikipedia iframe navigation
        browser.webNavigation.onCommitted.addListener((details) => {
            // Only track Wikipedia navigations in frames (not main page)
            if (details.frameId !== 0 && details.url.includes('wikipedia.org/wiki/')) {
                console.log('[Background] ✓ Wikipedia iframe navigation detected:', details.url);

                // Extract article title
                const match = details.url.match(/\/wiki\/([^#?]+)/);
                if (match) {
                    const articleTitle = decodeURIComponent(match[1].replace(/_/g, ' '));
                    console.log('[Background] Extracted title:', articleTitle);

                    // Forward to sidepanel
                    browser.runtime.sendMessage({
                        messageType: MessageType.wikipediaNavigation,
                        articleTitle: articleTitle,
                        articleUrl: details.url
                    }).then(() => {
                        console.log('[Background] Message sent to sidepanel');
                    }).catch((error) => {
                        console.log('[Background] Could not send to sidepanel:', error);
                    });
                }
            }
        });
    } else {
        console.error('[Background] webNavigation API NOT available!');
    }

    //monitor the event from extension icon click
    browser.action.onClicked.addListener((tab) => {
        console.log("Extension icon clicked", tab);
        browser.tabs.sendMessage(tab.id!, {messageType: MessageType.clickExtIcon});
    });

    // Handle messages from content script and sidepanel
    browser.runtime.onMessage.addListener((message: ExtMessage, sender, sendResponse: (message: any) => void) => {
        console.log("Background received message:", message);

        if (message.messageType === MessageType.openSidePanel) {
            // Store the selected text and open sidepanel
            lastSelectedText = message.selectedText || '';
            console.log("Stored selected text:", lastSelectedText);
            if (sender.tab?.windowId) {
                // @ts-ignore
                browser.sidePanel.open({ windowId: sender.tab.windowId });
                
                // Send message to sidepanel to switch to Wikipedia view
                setTimeout(() => {
                    browser.runtime.sendMessage({
                        messageType: MessageType.openSidePanel,
                        selectedText: lastSelectedText
                    }).catch((error) => {
                        console.log("Could not send message to sidepanel:", error);
                    });
                }, 100); // Small delay to ensure sidepanel is loaded
            }
            return true;
        } else if (message.messageType === MessageType.getSelectedText) {
            // Return the stored selected text
            console.log("Returning selected text:", lastSelectedText);
            sendResponse({ selectedText: lastSelectedText });
            return true;
        } else if (message.messageType === MessageType.clickExtIcon) {
            console.log("Extension icon click handled");
            return true;
        } else if (message.messageType === MessageType.wikipediaNavigation) {
            // Forward Wikipedia navigation to sidepanel
            console.log("Wikipedia navigation detected:", message);
            browser.runtime.sendMessage(message).catch((error) => {
                console.log("Could not forward to sidepanel:", error);
            });
            return true;
        } else if (message.messageType === MessageType.changeTheme || message.messageType === MessageType.changeLocale) {
            // Broadcast theme/locale changes to all tabs
            (async () => {
                let tabs = await browser.tabs.query({active: true, currentWindow: true});
                console.log(`Broadcasting to ${tabs.length} tabs`);
                if (tabs) {
                    for (const tab of tabs) {
                        await browser.tabs.sendMessage(tab.id!, message);
                    }
                }
            })();
            return true;
        }
    });
});
