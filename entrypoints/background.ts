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

    // Store session state per tab - each tab has its own independent tree
    const tabSessions: Map<number, TrackingState> = new Map();

    // Current active tab state (for sidepanel display)
    let activeTabId: number | null = null;

    // Load tab sessions from storage on startup (in case service worker was restarted)
    browser.storage.local.get('rabbithole_tab_sessions').then((data) => {
        if (data.rabbithole_tab_sessions) {
            const sessions = data.rabbithole_tab_sessions;
            console.log('[Background] Restoring', Object.keys(sessions).length, 'tab sessions from storage');
            for (const [tabId, session] of Object.entries(sessions)) {
                tabSessions.set(parseInt(tabId), session as TrackingState);
            }
        }
    }).catch(err => console.error('[Background] Error loading tab sessions:', err));

    // Helper: Get or create session for a tab
    function getTabSession(tabId: number): TrackingState {
        if (!tabSessions.has(tabId)) {
            tabSessions.set(tabId, {
        isTracking: false,
                tabId: tabId,
        sessionId: null,
        currentUrl: null,
        mode: BrowsingMode.LOOKUP,
        treeNodes: [],
        activeNodeId: null,
        isLoadedTree: false,
        originalTreeId: null,
        originalTreeName: null,
        initialLoadedArticle: null
            });
        }
        return tabSessions.get(tabId)!;
    }

    // Helper: Get current active session (for sidepanel)
    function getCurrentSession(): TrackingState | null {
        if (activeTabId && tabSessions.has(activeTabId)) {
            return tabSessions.get(activeTabId)!;
        }
        return null;
    }

    // Helper: Persist tab sessions to storage
    async function persistTabSessions() {
        try {
            const sessionsObject: Record<number, TrackingState> = {};
            tabSessions.forEach((session, tabId) => {
                // Only persist sessions with trees
                if (session.treeNodes.length > 0) {
                    sessionsObject[tabId] = session;
                }
            });
            await browser.storage.local.set({
                rabbithole_tab_sessions: sessionsObject
            });
            console.log('[Background] Persisted', Object.keys(sessionsObject).length, 'tab sessions to storage');
        } catch (err) {
            console.error('[Background] Error persisting tab sessions:', err);
        }
    }

    // No longer needed - tabs manage their own sessions

    // @ts-ignore
    browser.sidePanel.setPanelBehavior({openPanelOnActionClick: true}).catch((error: any) => console.error(error));

    // Handle tab activation to update sidepanel
    browser.tabs.onActivated.addListener(async (activeInfo) => {
        activeTabId = activeInfo.tabId;
        
        try {
            const tab = await browser.tabs.get(activeTabId);
            const session = tabSessions.get(activeTabId);
            
            // Check if this is a Wikipedia tab
            const isWikipediaTab = tab.url?.includes('wikipedia.org');
            
            if (isWikipediaTab && session && session.treeNodes.length > 0) {
                // Wikipedia tab with tree - show it
                console.log('[Background] Switched to Wikipedia tab', activeTabId, 'with tree of', session.treeNodes.length, 'nodes');
                updateSidepanelForTab(activeTabId);
                browser.runtime.sendMessage({
                    messageType: MessageType.modeChanged,
                    mode: BrowsingMode.TRACKING,
                    tabId: activeTabId
                }).catch(err => console.log('[Background] Could not notify mode change:', err));
            } else if (isWikipediaTab && (!session || session.treeNodes.length === 0)) {
                // Wikipedia tab but no tree yet - clear sidepanel, show welcome screen
                console.log('[Background] Switched to Wikipedia tab without tree - showing welcome screen');
                browser.runtime.sendMessage({
                    messageType: MessageType.switchToTabTree,
                    tabId: null,
                    nodes: [],
                    activeNodeId: null,
                    sessionId: null,
                    sessionName: ''
                }).catch(err => console.log('[Background] Could not clear sidepanel:', err));
                
                browser.runtime.sendMessage({
                    messageType: MessageType.modeChanged,
                    mode: BrowsingMode.TRACKING,
                    tabId: activeTabId
                }).catch(err => console.log('[Background] Could not notify mode change:', err));
            } else {
                // Not a Wikipedia tab - clear sidepanel and show welcome screen
                console.log('[Background] Switched to non-Wikipedia tab - clearing sidepanel');
                browser.runtime.sendMessage({
                    messageType: MessageType.switchToTabTree,
                    tabId: null,
                    nodes: [],
                    activeNodeId: null,
                    sessionId: null,
                    sessionName: ''
                }).catch(err => console.log('[Background] Could not clear sidepanel:', err));
                
                browser.runtime.sendMessage({
                    messageType: MessageType.modeChanged,
                    mode: BrowsingMode.LOOKUP,
                    tabId: null
                }).catch(err => console.log('[Background] Could not notify mode change:', err));
            }
        } catch (err) {
            console.error('[Background] Error handling tab activation:', err);
        }
    });

    // Helper: Add node to tree and persist
    function addTreeNode(tabId: number, articleTitle: string, articleUrl: string) {
        const session = getTabSession(tabId);
        console.log('[Background] Adding tree node to tab', tabId, ':', articleTitle);

        // Check if node already exists in this tab's tree
        const existingNode = session.treeNodes.find(node => node.title === articleTitle);

        if (existingNode) {
            session.activeNodeId = existingNode.id;
            console.log('[Background] Node already exists in tab', tabId, ', setting as active');
        } else {
            // Create new node
            const newNode = {
                id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                title: articleTitle,
                url: articleUrl,
                parentId: session.activeNodeId,
                timestamp: Date.now()
            };

            session.treeNodes.push(newNode);
            session.activeNodeId = newNode.id;
            
            // Auto-generate session name if this is the first node
            if (session.treeNodes.length === 1) {
                session.sessionId = `session-${Date.now()}-${tabId}`;
                // Auto-name based on root node + date
                session.originalTreeName = `${newNode.title} - ${new Date().toLocaleDateString()}`;
            }
            
            console.log('[Background] Added new node to tab', tabId, ':', newNode.id, 'Total nodes:', session.treeNodes.length);
        }

        // Update sidepanel if this is the active tab
        if (tabId === activeTabId) {
            updateSidepanelForTab(tabId);
        }

        // Update minimap for this tab
        updateMinimapForTab(tabId);
        
        // Auto-save the tree to storage
        autoSaveTabTree(tabId);
        
        // Persist tab sessions to survive service worker restarts
        persistTabSessions();
    }

    // Helper: Auto-save a tab's tree to storage
    async function autoSaveTabTree(tabId: number) {
        const session = tabSessions.get(tabId);
        if (!session || session.treeNodes.length === 0) return;
        if (!session.sessionId || !session.originalTreeName) return;

        const treeId = session.sessionId;
        const treeName = session.originalTreeName;

        // Get existing saved trees
        const data = await browser.storage.local.get('rabbithole_saved_sessions');
        const savedTrees = data.rabbithole_saved_sessions || [];

        // Find if tree already exists
        const existingIndex = savedTrees.findIndex((t: any) => t.id === treeId);

        if (existingIndex >= 0) {
            // Update existing tree
            savedTrees[existingIndex] = {
                id: treeId,
                name: treeName,
                nodes: session.treeNodes,
                createdAt: Date.now()
            };
            console.log('[Background] Auto-saved: Updated existing tree', treeId);
        } else {
            // Create new tree
            savedTrees.push({
                id: treeId,
                name: treeName,
                nodes: session.treeNodes,
                createdAt: Date.now()
            });
            console.log('[Background] Auto-saved: Created new tree', treeId);
        }

        // Save back to storage
        await browser.storage.local.set({
            rabbithole_saved_sessions: savedTrees
        });
    }

    // Helper: Update sidepanel for specific tab
    function updateSidepanelForTab(tabId: number) {
        const session = tabSessions.get(tabId);
        if (!session) return;

            browser.runtime.sendMessage({
            messageType: MessageType.switchToTabTree,
            tabId: tabId,
            nodes: session.treeNodes,
            activeNodeId: session.activeNodeId,
            sessionId: session.sessionId,
            sessionName: session.originalTreeName || `Rabbit Hole - ${new Date().toLocaleDateString()}`
        }).catch(err => console.log('[Background] Could not update sidepanel for tab', tabId, ':', err));
    }

    // Helper: Update minimap for specific tab
    function updateMinimapForTab(tabId: number) {
        const session = tabSessions.get(tabId);
        if (!session) return;

        browser.tabs.sendMessage(tabId, {
                    messageType: 'updateTreeMinimap',
            treeNodes: session.treeNodes,
            activeNodeId: session.activeNodeId
        }).catch(err => console.log('[Background] Could not update minimap for tab', tabId, ':', err));
    }

    // Helper: Start tracking session for a tab
    function startTrackingSession(tabId: number, url: string) {
        const session = getTabSession(tabId);
        
        // Check if this tab already has a tree
        if (session.treeNodes.length > 0) {
            // Tab already has a tree - just resume tracking
            console.log('[Background] Resuming tracking for tab', tabId, 'with existing tree of', session.treeNodes.length, 'nodes');
            session.isTracking = true;
            session.currentUrl = url;
            session.mode = BrowsingMode.TRACKING;
        } else {
            // Start new tracking session for this tab
            console.log('[Background] Starting new tracking session for tab', tabId);
            session.isTracking = true;
            session.currentUrl = url;
            session.mode = BrowsingMode.TRACKING;
            session.sessionId = `session-${Date.now()}-${tabId}`;

            // Add initial article to tree
            const articleTitle = getWikipediaArticleTitle(url);
            if (articleTitle) {
                addTreeNode(tabId, articleTitle, url);
            }
        }

        // Notify content script to show tracking indicator
        browser.tabs.sendMessage(tabId, {
            messageType: MessageType.startTracking,
            sessionId: session.sessionId
        }).catch(err => console.log('[Background] Could not notify content script for tab', tabId, ':', err));

        // Update sidepanel if this is the active tab
        if (tabId === activeTabId) {
            updateSidepanelForTab(tabId);
        }

        // Notify sidepanel about mode change
        browser.runtime.sendMessage({
            messageType: MessageType.modeChanged,
            mode: BrowsingMode.TRACKING,
            tabId
        }).catch(err => console.log('[Background] Could not notify sidepanel:', err));
    }

    // Helper: Stop tracking session for a tab
    async function stopTrackingSession(tabId: number) {
        const session = tabSessions.get(tabId);
        if (!session || !session.isTracking) return;

        console.log('[Background] Stopping tracking session for tab', tabId);

        // Just stop tracking for this tab - keep the tree
        session.isTracking = false;
        session.mode = BrowsingMode.LOOKUP;
        
        console.log('[Background] Tab', tabId, 'session paused with', session.treeNodes.length, 'articles (preserved)');
            
            // Notify content script to hide indicator
        browser.tabs.sendMessage(tabId, {
                messageType: MessageType.stopTracking
        }).catch(err => console.log('[Background] Could not notify content script for tab', tabId, ':', err));
    }


    // Listen for new tabs being created (like when preview card opens Wikipedia in new tab)
    browser.tabs.onCreated.addListener((tab) => {
        console.log('[Background] New tab created:', tab.id, tab.url);
        if (tab.url && isWikipediaUrl(tab.url)) {
            console.log('[Background] New tab is Wikipedia - will start tracking when loaded');
        }
    });

    // Listen for tab closes - clean up tab sessions
    browser.tabs.onRemoved.addListener((tabId, removeInfo) => {
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

            const session = getTabSession(tabId);
            const oldUrl = session.currentUrl;

            console.log('[Background] Tab updated:', tabId, newUrl);

            // Entering Wikipedia
            if (oldUrl && isEnteringWikipedia(oldUrl, newUrl)) {
                console.log('[Background] Tab', tabId, 'entering Wikipedia - starting tracking');
                startTrackingSession(tabId, newUrl);
            }
            // Leaving Wikipedia
            else if (oldUrl && isLeavingWikipedia(oldUrl, newUrl)) {
                console.log('[Background] Tab', tabId, 'leaving Wikipedia - stopping tracking');
                stopTrackingSession(tabId);
            }
            // Already on Wikipedia, track navigation
            else if (session.isTracking && isWikipediaUrl(newUrl)) {
                console.log('[Background] Tab', tabId, 'Wikipedia navigation detected');
                const articleTitle = getWikipediaArticleTitle(newUrl);
                if (articleTitle) {
                    // Check if this article already exists in the tree
                    const existingNode = session.treeNodes.find(node => node.title === articleTitle);
                    if (existingNode) {
                        // Just update active node, don't add duplicate
                        console.log('[Background] Navigating to existing node in tree:', articleTitle);
                        session.activeNodeId = existingNode.id;
                        // Update sidepanel and minimap
                        if (tabId === activeTabId) {
                            updateSidepanelForTab(tabId);
                        }
                        updateMinimapForTab(tabId);
                    } else {
                        // New article, add to tree
                        addTreeNode(tabId, articleTitle, newUrl);
                    }
                }
                session.currentUrl = newUrl;
            }
            // User just opened Wikipedia directly (no previous URL)
            else if (!session.isTracking && isWikipediaUrl(newUrl)) {
                console.log('[Background] Tab', tabId, 'opened Wikipedia directly - starting tracking');
                startTrackingSession(tabId, newUrl);
            }

            // Update current URL for next check
            session.currentUrl = newUrl;
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
            // Return current mode for active tab
            const session = getCurrentSession();
            sendResponse({
                mode: session?.mode || BrowsingMode.LOOKUP,
                isTracking: session?.isTracking || false,
                sessionId: session?.sessionId || null
            });
            return true;
        } else if (message.messageType === MessageType.trackNavigation) {
            // Forward navigation tracking to sidepanel/tree
            console.log('[Background] Forwarding navigation tracking:', message.articleTitle);
            return true;
        } else if (message.messageType === MessageType.navigateToWikipedia) {
            // Navigate the currently active Wikipedia tab, or create new one if none exists
            console.log('[Background] Navigating to Wikipedia URL:', message.articleUrl);
            
            const session = getCurrentSession();
            if (session && session.isTracking && activeTabId) {
                // Navigate the currently active tracked tab
                console.log('[Background] Navigating active Wikipedia tab:', activeTabId);
                browser.tabs.update(activeTabId, { 
                    url: message.articleUrl,
                    active: true 
                }).catch((error) => {
                    console.error('[Background] Error navigating tab:', error);
                });
            } else {
                // No active tracked tab, create new one
                console.log('[Background] No active tracked tab, creating new Wikipedia tab');
                browser.tabs.create({ url: message.articleUrl, active: true }).catch((error) => {
                    console.error('[Background] Error creating tab:', error);
                });
            }
            // Don't return true or send response - fire and forget
        } else if (message.messageType === 'loadTreeIntoCurrentTab') {
            // Load a saved tree into the current tab
            console.log('[Background] Loading tree into current tab:', message.treeName);
            
            // Get current active tab
            browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
                const currentTab = tabs[0];
                if (!currentTab?.id) return;
                
                const tabId = currentTab.id;
                const isCurrentTabWikipedia = currentTab.url?.includes('wikipedia.org');
                
                if (isCurrentTabWikipedia) {
                    // Same Wikipedia tab - just replace the tree (no auto-save, direct replacement)
                    console.log('[Background] Loading tree into same Wikipedia tab:', tabId);
                    const session = getTabSession(tabId);
                    
                    // Replace tree completely - DON'T mark as loaded tree so additions continue this tree
                    session.treeNodes = message.treeNodes || [];
                    session.activeNodeId = message.lastVisitedNodeId || null;
                    session.isLoadedTree = false; // Key: NOT a loaded tree, just the active tree now
                    session.originalTreeId = message.treeId || null;
                    session.originalTreeName = message.treeName || null;
                    session.sessionId = message.treeId || null; // Use the tree ID as session ID
                    session.initialLoadedArticle = message.treeNodes?.[0]?.title || null;
                    
                    // Navigate to the last visited node
                    browser.tabs.update(tabId, { url: message.lastVisitedNodeUrl });
                    
                    // Update sidepanel
                    updateSidepanelForTab(tabId);
                    
                    // Persist tab sessions
                    persistTabSessions();
                } else {
                    // Non-Wikipedia tab - create new tab
                    console.log('[Background] Creating new tab for loaded tree:', message.lastVisitedNodeUrl);
                    browser.tabs.create({ url: message.lastVisitedNodeUrl, active: true }).then((newTab) => {
                        // Set up the loaded tree in the NEW tab
                        const newSession = getTabSession(newTab.id!);
                        newSession.treeNodes = message.treeNodes || [];
                        newSession.activeNodeId = message.lastVisitedNodeId || null;
                        newSession.isLoadedTree = false; // Not a loaded tree, just active tree
                        newSession.originalTreeId = message.treeId || null;
                        newSession.originalTreeName = message.treeName || null;
                        newSession.sessionId = message.treeId || null; // Use tree ID as session ID
                        newSession.initialLoadedArticle = message.treeNodes?.[0]?.title || null;
                        
                        // Update sidepanel to show the new tab's tree
                        activeTabId = newTab.id!;
                        updateSidepanelForTab(newTab.id!);
                        
                        // Persist tab sessions
                        persistTabSessions();
                    });
                }
            }).catch(err => console.log('[Background] Error loading tree:', err));
            
            return true;
        } else if (message.messageType === 'getCurrentTree') {
            // Sidepanel is requesting the current tree state
            console.log('[Background] Sidepanel requesting current tree, activeTabId:', activeTabId, 'hasSession:', activeTabId ? tabSessions.has(activeTabId) : false);
            
            // Get the active tab and send its tree
            if (activeTabId && tabSessions.has(activeTabId)) {
                const session = tabSessions.get(activeTabId)!;
                console.log('[Background] Sending current tree with', session.treeNodes.length, 'nodes');
                browser.runtime.sendMessage({
                    messageType: MessageType.switchToTabTree,
                    tabId: activeTabId,
                    nodes: session.treeNodes,
                    activeNodeId: session.activeNodeId,
                    sessionId: session.sessionId,
                    sessionName: session.originalTreeName || ''
                }).catch(err => console.log('[Background] Could not send current tree:', err));
            } else {
                // No active tree, send empty
                console.log('[Background] No active session found, sending empty tree');
                browser.runtime.sendMessage({
                    messageType: MessageType.switchToTabTree,
                    tabId: null,
                    nodes: [],
                    activeNodeId: null,
                    sessionId: null,
                    sessionName: ''
                }).catch(err => console.log('[Background] Could not send empty tree:', err));
            }
            return true;
        }
    });
});
