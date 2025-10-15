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

    // Store session state per tab to preserve trees when switching tabs
    const tabSessions: Map<number, TrackingState> = new Map();

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
                sessionId: trackingState.sessionId,
                tabId: trackingState.tabId
            }).catch(err => console.log('[Background] Could not notify sidepanel:', err));

            // Update minimap in content script
            if (trackingState.tabId) {
                browser.tabs.sendMessage(trackingState.tabId, {
                    messageType: 'updateTreeMinimap',
                    treeNodes: trackingState.treeNodes,
                    activeNodeId: trackingState.activeNodeId
                }).catch(err => console.log('[Background] Could not notify content script:', err));
            }
        });
    }

    // Helper: Start tracking session
    function startTrackingSession(tabId: number, url: string) {
        // Check if we have a saved session for this tab
        const savedSession = tabSessions.get(tabId);
        
        if (savedSession && savedSession.treeNodes.length > 0) {
            // Restore existing session for this tab
            console.log('[Background] Restoring existing session for tab', tabId, 'with', savedSession.treeNodes.length, 'nodes');
            Object.assign(trackingState, savedSession);
            trackingState.isTracking = true;
            trackingState.tabId = tabId;
            trackingState.currentUrl = url;
            trackingState.mode = BrowsingMode.TRACKING;
        } else {
            // Create new session
            const sessionId = `session-${Date.now()}-${tabId}`; // Include tabId to make it unique per tab
            trackingState.isTracking = true;
            trackingState.tabId = tabId;
            trackingState.sessionId = sessionId;
            trackingState.currentUrl = url;
            trackingState.mode = BrowsingMode.TRACKING;
            trackingState.treeNodes = [];
            trackingState.activeNodeId = null;
            trackingState.isLoadedTree = false;
            trackingState.originalTreeId = null;
            trackingState.originalTreeName = null;
            trackingState.initialLoadedArticle = null;

            console.log('[Background] Started new tracking session:', sessionId, 'on tab', tabId);

            // Add initial article to tree only for new sessions
            const articleTitle = getWikipediaArticleTitle(url);
            if (articleTitle) {
                addTreeNode(articleTitle, url);
            }
        }

        // Save this session to tab sessions
        tabSessions.set(tabId, { ...trackingState });

        // Notify content script to show tracking indicator
        browser.tabs.sendMessage(tabId, {
            messageType: MessageType.startTracking,
            sessionId: trackingState.sessionId
        }).catch(err => console.log('[Background] Could not notify content script:', err));

        // Notify sidepanel about mode change
        browser.runtime.sendMessage({
            messageType: MessageType.modeChanged,
            mode: BrowsingMode.TRACKING,
            tabId
        }).catch(err => console.log('[Background] Could not notify sidepanel:', err));

        // Tell sidepanel to show this tab's tree
        browser.runtime.sendMessage({
            messageType: MessageType.switchToTabTree,
            tabId: tabId,
            nodes: trackingState.treeNodes,
            activeNodeId: trackingState.activeNodeId,
            sessionId: trackingState.sessionId,
            sessionName: trackingState.treeNodes.length > 0 
              ? `${trackingState.treeNodes[0].title} - ${new Date().toLocaleDateString()}`
              : `Rabbit Hole - ${new Date().toLocaleDateString()}`
        }).catch(err => console.log('[Background] Could not switch sidepanel tree:', err));
    }

    // Helper: Stop tracking session
    async function stopTrackingSession() {
        if (!trackingState.isTracking) return;

        console.log('[Background] Stopping tracking session:', trackingState.sessionId);

        // Save current session state to tab sessions before stopping
        if (trackingState.tabId) {
            tabSessions.set(trackingState.tabId, { ...trackingState });
            console.log('[Background] Saved session state for tab', trackingState.tabId, 'with', trackingState.treeNodes.length, 'nodes');
            
            // Notify content script to hide indicator
            browser.tabs.sendMessage(trackingState.tabId, {
                messageType: MessageType.stopTracking
            }).catch(err => console.log('[Background] Could not notify content script:', err));
        }

        // No prompts - everything auto-saves via tree-context
        console.log('[Background] Session paused with', trackingState.treeNodes.length, 'articles (preserved)');

        trackingState.isTracking = false;
        trackingState.tabId = null;
        trackingState.sessionId = null;
        trackingState.currentUrl = null;
        trackingState.mode = BrowsingMode.LOOKUP;

        // DON'T clear the tree - just stop tracking
        // The tree will be restored when user returns to Wikipedia tab

        // Clear from storage (but preserve in tabSessions)
        browser.storage.local.set({
            rabbithole_current_session: {
                nodes: [],
                activeNodeId: null,
                sessionId: null
            }
        });

        // Don't notify sidepanel to clear the tree - let it stay visible
        // Just notify about mode change
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
            name: trackingState.treeNodes.length > 0 
              ? `${trackingState.treeNodes[0].title} - ${new Date().toLocaleDateString()}`
              : `Rabbit Hole - ${new Date().toLocaleDateString()}`,
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

    // Listen for tab closes - if tracking tab is closed, stop tracking and clean up
    browser.tabs.onRemoved.addListener((tabId, removeInfo) => {
        if (trackingState.isTracking && trackingState.tabId === tabId) {
            console.log('[Background] Tracking tab closed, stopping session');
            stopTrackingSession();
        }
        
        // Clean up saved session for this tab
        if (tabSessions.has(tabId)) {
            console.log('[Background] Cleaning up session for closed tab', tabId);
            tabSessions.delete(tabId);
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

            // Always save current session before switching
            if (trackingState.isTracking && trackingState.tabId) {
                tabSessions.set(trackingState.tabId, { ...trackingState });
                console.log('[Background] Saved session for tab', trackingState.tabId, 'before switching');
            }

            // If switching to a Wikipedia tab, show its tree in the sidepanel
            if (mode === BrowsingMode.TRACKING) {
                const savedSession = tabSessions.get(activeInfo.tabId);
                
                if (savedSession && savedSession.treeNodes.length > 0) {
                    // Switch to show this tab's tree in sidepanel
                    console.log('[Background] Switching to Wikipedia tab with existing tree, showing in sidepanel');
                    
                    // Update tracking state to this tab's session
                    Object.assign(trackingState, savedSession);
                    trackingState.isTracking = true;
                    trackingState.tabId = activeInfo.tabId;
                    trackingState.currentUrl = tab.url;
                    trackingState.mode = BrowsingMode.TRACKING;
                    
                    // Tell sidepanel to show this tab's tree
                    browser.runtime.sendMessage({
                        messageType: MessageType.switchToTabTree,
                        tabId: activeInfo.tabId,
                        nodes: trackingState.treeNodes,
                        activeNodeId: trackingState.activeNodeId,
                        sessionId: trackingState.sessionId,
                        sessionName: trackingState.treeNodes.length > 0 
                          ? `${trackingState.treeNodes[0].title} - ${new Date(trackingState.treeNodes[0].timestamp).toLocaleDateString()}`
                          : `Rabbit Hole - ${new Date().toLocaleDateString()}`
                    }).catch(err => console.log('[Background] Could not switch sidepanel tree:', err));

                    // Update minimap in content script
                    browser.tabs.sendMessage(activeInfo.tabId, {
                        messageType: 'updateTreeMinimap',
                        treeNodes: trackingState.treeNodes,
                        activeNodeId: trackingState.activeNodeId
                    }).catch(err => console.log('[Background] Could not update minimap:', err));
                    
                } else {
                    // Start new tracking session for this tab
                    console.log('[Background] Starting new tracking session for Wikipedia tab');
                    startTrackingSession(activeInfo.tabId, tab.url);
                }
            } else {
                // Not a Wikipedia tab, stop tracking
                trackingState.isTracking = false;
                trackingState.tabId = null;
                trackingState.mode = BrowsingMode.LOOKUP;
                
                // Tell sidepanel to hide the tree since we're not on Wikipedia
                browser.runtime.sendMessage({
                    messageType: MessageType.switchToTabTree,
                    tabId: null,
                    nodes: [],
                    activeNodeId: null,
                    sessionId: null,
                    sessionName: ''
                }).catch(err => console.log('[Background] Could not hide tree:', err));
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
                console.log('[Background] Opening sidepanel for window:', sender.tab.windowId);
                // @ts-ignore
                browser.sidePanel.open({ windowId: sender.tab.windowId }).then(() => {
                    console.log('[Background] Sidepanel opened successfully');
                    
                    // Send message to sidepanel to switch to Wikipedia view
                    setTimeout(() => {
                        browser.runtime.sendMessage({
                            messageType: MessageType.openSidePanel,
                            selectedText: lastSelectedText
                        }).catch((error) => {
                            console.log("Could not send message to sidepanel:", error);
                        });
                    }, 100); // Small delay to ensure sidepanel is loaded
                }).catch((error: any) => {
                    console.error('[Background] Failed to open sidepanel:', error);
                });
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
            // Navigate the currently tracked Wikipedia tab, or create new one if none exists
            console.log('[Background] Navigating to Wikipedia URL:', message.articleUrl);
            
            if (trackingState.isTracking && trackingState.tabId) {
                // Navigate the currently tracked tab
                console.log('[Background] Navigating tracked Wikipedia tab:', trackingState.tabId);
                browser.tabs.update(trackingState.tabId, { 
                    url: message.articleUrl,
                    active: true 
                }).then(() => {
                    sendResponse({ success: true });
                }).catch((error) => {
                    console.error('[Background] Error navigating tab:', error);
                    sendResponse({ success: false, error: error.message });
                });
            } else {
                // No tracked tab, create new one
                console.log('[Background] No tracked tab, creating new Wikipedia tab');
                browser.tabs.create({ url: message.articleUrl, active: true }).then(() => {
                    sendResponse({ success: true });
                }).catch((error) => {
                    console.error('[Background] Error creating tab:', error);
                    sendResponse({ success: false, error: error.message });
                });
            }
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
