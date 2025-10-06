import {browser} from "wxt/browser";
import ExtMessage, {MessageFrom, MessageType} from "@/entrypoints/types.ts";

export default defineBackground(() => {
    console.log('RabbitHole background script loaded!', {id: browser.runtime.id});
    
    let lastSelectedText = '';

    // @ts-ignore
    browser.sidePanel.setPanelBehavior({openPanelOnActionClick: true}).catch((error: any) => console.error(error));

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
