import React, { useEffect, useState } from 'react';
import { browser } from "wxt/browser";
import { Spinner } from "@/components/ui/spinner";
import { useTree } from "@/lib/tree-context";
import { SourceContextType } from "@/lib/tree-types";
import { Button } from "@/components/ui/button";
import { Network } from "lucide-react";
import TreeView from "@/components/tree/TreeView";

interface WikipediaState {
    loading: boolean;
    error: string | null;
    articleTitle: string | null;
    articleUrl: string | null;
}

export const WikipediaViewer: React.FC = () => {
    const [state, setState] = useState<WikipediaState>({
        loading: true,
        error: null,
        articleTitle: null,
        articleUrl: null
    });
    const [showTree, setShowTree] = useState(false);

    const { addNode, setActiveNode, nodes: treeNodes, activeNodeId } = useTree();

    // Use refs to always get current values in message listener
    const activeNodeIdRef = React.useRef(activeNodeId);
    const treeNodesRef = React.useRef(treeNodes);

    // Update refs whenever values change
    React.useEffect(() => {
        activeNodeIdRef.current = activeNodeId;
        treeNodesRef.current = treeNodes;
    }, [activeNodeId, treeNodes]);

    useEffect(() => {
        let hasLoadedInitialArticle = false;

        // Listen for new text selection messages and Wikipedia navigation
        const messageListener = async (message: any) => {
            if (message.messageType === 'openSidePanel') {
                // Only load if we haven't loaded an initial article yet
                if (!hasLoadedInitialArticle) {
                    hasLoadedInitialArticle = true;

                    // Get the selected text
                    const response = await browser.runtime.sendMessage({
                        messageType: 'getSelectedText'
                    });

                    if (response && response.selectedText) {
                        await loadWikipedia(response.selectedText);
                    }
                }
            } else if (message.messageType === 'wikipediaNavigation') {
                // Handle Wikipedia navigation from iframe
                const { articleTitle, articleUrl } = message;

                // Update state
                setState(prev => ({
                    ...prev,
                    articleTitle,
                    articleUrl,
                    loading: false
                }));

                // Check if node already exists - use ref for current value
                const existingNode = treeNodesRef.current.find(node => node.title === articleTitle);

                if (existingNode) {
                    setActiveNode(existingNode.id);
                } else {
                    // Add to tree as child of current node
                    addNode(
                        articleTitle,
                        articleUrl,
                        { type: SourceContextType.MODAL_NAVIGATION }
                    );
                }
            }
        };

        browser.runtime.onMessage.addListener(messageListener);

        // Cleanup listener on unmount
        return () => {
            browser.runtime.onMessage.removeListener(messageListener);
        };
    }, []);

    // Ref for the iframe
    const iframeRef = React.useRef<HTMLIFrameElement>(null);

    async function loadWikipedia(searchTerm: string) {
        setState(prev => ({
            ...prev,
            loading: true,
            error: null
        }));

        try {
            const searchUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(searchTerm)}&limit=1&format=json&origin=*`;
            const searchResponse = await fetch(searchUrl);
            const searchData = await searchResponse.json();

            if (!searchData[1] || searchData[1].length === 0) {
                throw new Error('No Wikipedia article found for this term');
            }

            const articleTitle = searchData[1][0];
            const articleUrl = searchData[3]?.[0] || `https://en.wikipedia.org/wiki/${encodeURIComponent(articleTitle.replace(/ /g, '_'))}`;

            setState(prev => ({
                ...prev,
                loading: false,
                articleTitle,
                articleUrl
            }));

            // Add node to tree
            try {
                // Check if this article already exists
                const existingNode = treeNodes.find(node => node.title === articleTitle);

                if (existingNode) {
                    setActiveNode(existingNode.id);
                } else {
                    // If tree is empty, this is SESSION_START, otherwise TEXT_SELECTION
                    const contextType = treeNodes.length === 0
                        ? SourceContextType.SESSION_START
                        : SourceContextType.TEXT_SELECTION;

                    addNode(articleTitle, articleUrl, { type: contextType });
                }
            } catch (err) {
                console.error('Error adding node to tree:', err);
            }

        } catch (error) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: (error as Error).message
            }));
        }
    }

    if (state.loading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                width: '100%'
            }}>
                <Spinner style={{
                    width: '48px',
                    height: '48px'
                }} />
            </div>
        );
    }

    if (state.error) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                padding: '20px',
                textAlign: 'center'
            }}>
                <p style={{ color: 'red' }}>{state.error}</p>
            </div>
        );
    }

    if (state.articleTitle) {
        return (
            <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
                {/* Tree toggle button */}
                <Button
                    onClick={() => setShowTree(!showTree)}
                    className="fixed top-4 right-4 z-[9999] shadow-lg"
                    variant={showTree ? "default" : "outline"}
                    size="icon"
                >
                    <Network className="h-5 w-5" />
                </Button>

                {/* Tree panel - always mounted but hidden when closed */}
                <div
                    className="fixed top-0 right-0 h-screen w-96 bg-background border-l shadow-2xl z-[9998] transition-transform duration-200 ease-linear"
                    style={{
                        transform: showTree ? 'translateX(0)' : 'translateX(100%)'
                    }}
                >
                    <div className="flex items-center justify-between p-4 border-b">
                        <h2 className="text-lg font-semibold">Research Tree</h2>
                        <Button
                            onClick={() => setShowTree(false)}
                            variant="ghost"
                            size="sm"
                        >
                            Close
                        </Button>
                    </div>
                    <div className="h-[calc(100vh-4rem)]">
                        <TreeView onNodeClick={(nodeId, nodeData) => {
                            // Navigate to the article when clicking a node (don't add new node)
                            console.log('[WikipediaViewer] Tree node clicked:', nodeData.title);
                            setActiveNode(nodeId);

                            // Update iframe to show this article
                            setState(prev => ({
                                ...prev,
                                articleTitle: nodeData.title,
                                articleUrl: nodeData.url
                            }));
                        }} />
                    </div>
                </div>

                <iframe
                    ref={iframeRef}
                    src={`https://en.m.wikipedia.org/wiki/${encodeURIComponent(state.articleTitle.replace(/ /g, '_'))}`}
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                    style={{
                        width: '100%',
                        height: '100vh',
                        border: 'none',
                        margin: 0,
                        padding: 0
                    }}
                    title={`Wikipedia article: ${state.articleTitle}`}
                />
                <style>
                    {`
                        iframe {
                            /* Hide mobile Wikipedia header elements */
                            transform: translateY(-60px);
                            height: calc(100vh + 60px) !important;
                        }

                        /* Additional CSS to hide header elements if accessible */
                        iframe::before {
                            content: '';
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            height: 60px;
                            background: white;
                            z-index: 1000;
                        }
                    `}
                </style>
            </div>
        );
    }

    return null;
};
