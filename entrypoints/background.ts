import {browser} from "wxt/browser";
import ExtMessage, {MessageFrom, MessageType} from "@/entrypoints/types.ts";
import {BrowsingMode, getModeForUrl, getWikipediaArticleTitle, isWikipediaUrl, isLeavingWikipedia, isEnteringWikipedia} from "@/lib/mode-manager.ts";

export default defineBackground(() => {
    console.log('RabbitHole background script loaded!', {id: browser.runtime.id});

    let lastSelectedText = '';

    // Tracking state
    interface TrackingState {
        isTracking: boolean;
        tabId: number | null;
        sessionId: string | null;
        currentUrl: string | null;
        mode: BrowsingMode;
        treeNodes: Array<{
            id: string;
            title: string;
            url: string;
            parentId: string | null;
            timestamp: number;
        }>;
        activeNodeId: string | null;
        isLoadedTree: boolean;
        originalTreeId: string | null;
        originalTreeName: string | null;
        initialLoadedArticle: string | null;
    }

    const trackingState: TrackingState = {
        isTracking: false,
        tabId: null,
        sessionId: null,
        currentUrl: null,
        mode: BrowsingMode.LOOKUP,
        treeNodes: [],
        activeNodeId: null,
        isLoadedTree: false,
        originalTreeId: null,
        originalTreeName: null,
        initialLoadedArticle: null
    };

    // Load tree state from storage on startup
    browser.storage.local.get('rabbithole_current_session').then((data) => {
        if (data.rabbithole_current_session) {
            const session = data.rabbithole_current_session;
            trackingState.treeNodes = session.nodes || [];
            trackingState.activeNodeId = session.activeNodeId || null;
            trackingState.sessionId = session.sessionId || null;
            console.log('[Background] Loaded tree from storage:', trackingState.treeNodes.length, 'nodes');
        }
    });

    // @ts-ignore
    browser.sidePanel.setPanelBehavior({openPanelOnActionClick: true}).catch((error: any) => console.error(error));

    // Helper: Add node to tree and persist
    function addTreeNode(articleTitle: string, articleUrl: string) {
        console.log('[Background] Adding tree node:', articleTitle);

        // Check if node already exists
        const existingNode = trackingState.treeNodes.find(node => node.title === articleTitle);

        if (existingNode) {
            trackingState.activeNodeId = existingNode.id;
            console.log('[Background] Node already exists, setting as active');
        } else {
            // Create new node
            const newNode = {
                id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                title: articleTitle,
                url: articleUrl,
                parentId: trackingState.activeNodeId,
                timestamp: Date.now()
            };

            trackingState.treeNodes.push(newNode);
            trackingState.activeNodeId = newNode.id;
            console.log('[Background] Added new node:', newNode.id, 'Total nodes:', trackingState.treeNodes.length);
        }

        // Persist to storage
        browser.storage.local.set({
            rabbithole_current_session: {
                nodes: trackingState.treeNodes,
                activeNodeId: trackingState.activeNodeId,
                sessionId: trackingState.sessionId
            }
        }).then(() => {
            console.log('[Background] Tree persisted to storage');

            // Notify sidepanel if open
            browser.runtime.sendMessage({
                messageType: MessageType.trackNavigation,
                articleTitle,
                articleUrl,
                sessionId: trackingState.sessionId
            }).catch(err => console.log('[Background] Could not notify sidepanel:', err));
        });
    }

    // Helper: Start tracking session
    function startTrackingSession(tabId: number, url: string) {
        const sessionId = `session-${Date.now()}`;
        trackingState.isTracking = true;
        trackingState.tabId = tabId;
        trackingState.sessionId = sessionId;
        trackingState.currentUrl = url;
        trackingState.mode = BrowsingMode.TRACKING;

        console.log('[Background] Started tracking session:', sessionId, 'on tab', tabId);

        // Notify content script to show tracking indicator
        browser.tabs.sendMessage(tabId, {
            messageType: MessageType.startTracking,
            sessionId
        }).catch(err => console.log('[Background] Could not notify content script:', err));

        // Notify sidepanel about mode change
        browser.runtime.sendMessage({
            messageType: MessageType.modeChanged,
            mode: BrowsingMode.TRACKING,
            tabId
        }).catch(err => console.log('[Background] Could not notify sidepanel:', err));

        // Add initial article to tree
        const articleTitle = getWikipediaArticleTitle(url);
        if (articleTitle) {
            addTreeNode(articleTitle, url);
        }
    }

    // Helper: Stop tracking session
    async function stopTrackingSession() {
        if (!trackingState.isTracking) return;

        console.log('[Background] Stopping tracking session:', trackingState.sessionId);

        // Notify content script to hide indicator
        if (trackingState.tabId) {
            browser.tabs.sendMessage(trackingState.tabId, {
                messageType: MessageType.stopTracking
            }).catch(err => console.log('[Background] Could not notify content script:', err));
        }

        // No prompts - everything auto-saves via tree-context
        console.log('[Background] Session ended with', trackingState.treeNodes.length, 'articles (auto-saved)');

        trackingState.isTracking = false;
        trackingState.tabId = null;
        trackingState.sessionId = null;
        trackingState.currentUrl = null;
        trackingState.mode = BrowsingMode.LOOKUP;

        // Clear current tree
        trackingState.treeNodes = [];
        trackingState.activeNodeId = null;
        trackingState.isLoadedTree = false;
        trackingState.originalTreeId = null;
        trackingState.originalTreeName = null;
        trackingState.initialLoadedArticle = null;

        // Clear from storage
        browser.storage.local.set({
            rabbithole_current_session: {
                nodes: [],
                activeNodeId: null,
                sessionId: null
            }
        });

        // Notify sidepanel to clear the tree UI
        browser.runtime.sendMessage({
            messageType: MessageType.clearSession
        }).catch(err => console.log('[Background] Could not notify sidepanel:', err));

        // Notify sidepanel about mode change
        browser.runtime.sendMessage({
            messageType: MessageType.modeChanged,
            mode: BrowsingMode.LOOKUP
        }).catch(err => console.log('[Background] Could not notify sidepanel:', err));
    }

    // Helper: Save current tree to saved sessions
    async function saveCurrentTreeToSavedSessions() {
        if (trackingState.treeNodes.length === 0) return;

        const savedTree = {
            id: trackingState.sessionId || `tree-${Date.now()}`,
            name: `Session ${new Date().toLocaleString()}`,
            nodes: [...trackingState.treeNodes],
            createdAt: Date.now()
        };

        // Get existing saved trees
        const data = await browser.storage.local.get('rabbithole_saved_sessions');
        const savedTrees = data.rabbithole_saved_sessions || [];
        savedTrees.push(savedTree);

        // Save back to storage
        await browser.storage.local.set({
            rabbithole_saved_sessions: savedTrees
        });

        console.log('[Background] Saved tree to saved sessions:', savedTree.name);
    }

    // Listen for new tabs being created (like when preview card opens Wikipedia in new tab)
    browser.tabs.onCreated.addListener((tab) => {
        console.log('[Background] New tab created:', tab.id, tab.url);
        if (tab.url && isWikipediaUrl(tab.url)) {
            console.log('[Background] New tab is Wikipedia - will start tracking when loaded');
        }
    });

    // Listen for tab closes - if tracking tab is closed, stop tracking
    browser.tabs.onRemoved.addListener((tabId, removeInfo) => {
        if (trackingState.isTracking && trackingState.tabId === tabId) {
            console.log('[Background] Tracking tab closed, stopping session');
            stopTrackingSession();
        }
    });

    // Listen for tab navigation to detect mode changes
    browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        // Process when page is complete
        if (changeInfo.status === 'complete') {
            // Use tab.url if changeInfo.url is not provided
            const newUrl = changeInfo.url || tab.url;

            if (!newUrl) return;

            const oldUrl = trackingState.currentUrl;

            console.log('[Background] Tab updated:', tabId, newUrl);

            // Entering Wikipedia
            if (oldUrl && isEnteringWikipedia(oldUrl, newUrl)) {
                console.log('[Background] Entering Wikipedia - starting tracking');
                startTrackingSession(tabId, newUrl);
            }
            // Leaving Wikipedia
            else if (oldUrl && isLeavingWikipedia(oldUrl, newUrl)) {
                console.log('[Background] Leaving Wikipedia - stopping tracking');
                stopTrackingSession();
            }
            // Already on Wikipedia, track navigation
            else if (trackingState.isTracking && trackingState.tabId === tabId && isWikipediaUrl(newUrl)) {
                console.log('[Background] Wikipedia navigation detected');
                const articleTitle = getWikipediaArticleTitle(newUrl);
                if (articleTitle) {
                    addTreeNode(articleTitle, newUrl);
                }
                trackingState.currentUrl = newUrl;
            }
            // User just opened Wikipedia directly (no previous URL)
            else if (!trackingState.isTracking && isWikipediaUrl(newUrl)) {
                const articleTitle = getWikipediaArticleTitle(newUrl);

                // Always start tracking when opening Wikipedia (even for loaded trees)
                // This ensures the tree clears when the tab is closed
                console.log('[Background] Opened Wikipedia - starting tracking');
                startTrackingSession(tabId, newUrl);
            }

            // Update current URL for next check
            if (!trackingState.isTracking) {
                trackingState.currentUrl = newUrl;
            }
        }
    });

    // Listen for active tab changes
    browser.tabs.onActivated.addListener(async (activeInfo) => {
        const tab = await browser.tabs.get(activeInfo.tabId);
        if (tab.url) {
            const mode = getModeForUrl(tab.url);

            // Check if we need to update tracking state
            if (mode === BrowsingMode.TRACKING && !trackingState.isTracking) {
                startTrackingSession(activeInfo.tabId, tab.url);
            } else if (mode === BrowsingMode.LOOKUP && trackingState.isTracking && trackingState.tabId === activeInfo.tabId) {
                stopTrackingSession();
            }

            // Always notify sidepanel of current mode
            browser.runtime.sendMessage({
                messageType: MessageType.modeChanged,
                mode,
                tabId: activeInfo.tabId
            }).catch(err => console.log('[Background] Could not notify sidepanel:', err));
        }
    });

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
        } else if (message.messageType === MessageType.getMode) {
            // Return current mode
            sendResponse({
                mode: trackingState.mode,
                isTracking: trackingState.isTracking,
                sessionId: trackingState.sessionId
            });
            return true;
        } else if (message.messageType === MessageType.trackNavigation) {
            // Forward navigation tracking to sidepanel/tree
            console.log('[Background] Forwarding navigation tracking:', message.articleTitle);
            return true;
        } else if (message.messageType === MessageType.navigateToWikipedia) {
            // Open Wikipedia URL in a NEW tab
            console.log('[Background] Opening Wikipedia in new tab:', message.articleUrl);
            browser.tabs.create({ url: message.articleUrl, active: true }).then(() => {
                sendResponse({ success: true });
            }).catch((error) => {
                console.error('[Background] Error creating tab:', error);
                sendResponse({ success: false, error: error.message });
            });
            return true; // Keep message channel open for async response
        } else if (message.messageType === MessageType.setLoadedTreeInfo) {
            // Mark that we're continuing from a loaded tree
            console.log('[Background] Setting loaded tree info:', message.originalTreeId, 'name:', message.originalTreeName, 'article:', message.initialArticleTitle);
            trackingState.isLoadedTree = true;
            trackingState.originalTreeId = message.originalTreeId || null;
            trackingState.originalTreeName = message.originalTreeName || null;
            trackingState.initialLoadedArticle = message.initialArticleTitle || null;
            return true;
        }
    });
});
