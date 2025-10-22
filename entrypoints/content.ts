import { browser } from "wxt/browser";

export default defineContentScript({
    matches: ['*://*.wikipedia.org/*'],
    runAt: 'document_end',
    main() {
        console.log('[Content Script] Loaded on Wikipedia page');

        // Minimap state
        let currentTreeNodes: any[] = [];
        let currentActiveNodeId: string | null = null;
        let trackingIndicator: HTMLDivElement | null = null;

        // Initialize minimap
        initializeMinimap();

        function initializeMinimap() {
            // Create tracking indicator (minimap container)
            trackingIndicator = document.createElement('div');
            trackingIndicator.id = 'rabbithole-tracking-indicator';
            Object.assign(trackingIndicator.style, {
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                width: '200px',
                height: '150px',
                zIndex: '999999',
                pointerEvents: 'auto',
                borderRadius: '8px',
                background: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 255, 255, 0.7)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.4)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
            });

            // Add hover effect
            trackingIndicator.addEventListener('mouseenter', () => {
                if (trackingIndicator) {
                    trackingIndicator.style.transform = 'scale(1.05)';
                    trackingIndicator.style.background = 'rgba(0, 0, 0, 0.65)';
                    trackingIndicator.style.borderColor = 'rgba(255, 255, 255, 0.9)';
                }
            });

            trackingIndicator.addEventListener('mouseleave', () => {
                if (trackingIndicator) {
                    trackingIndicator.style.transform = 'scale(1)';
                    trackingIndicator.style.background = 'rgba(0, 0, 0, 0.5)';
                    trackingIndicator.style.borderColor = 'rgba(255, 255, 255, 0.7)';
                }
            });

            // Add click handler to open side panel
            trackingIndicator.addEventListener('click', () => {
                console.log('[Content] Minimap clicked, opening side panel');
                // Open the side panel
                browser.runtime.sendMessage({
                    messageType: 'openSidePanel',
                    selectedText: '' // No selected text when clicking minimap
                }).catch((error) => {
                    console.error('[Content] Failed to send openSidePanel message:', error);
                });
            });

            document.body.appendChild(trackingIndicator);
            updateMinimapContent();
        }

        // Listen for tree updates from background
        browser.runtime.onMessage.addListener((message: any) => {
            if (message.messageType === 'updateTreeMinimap' && message.treeNodes) {
                currentTreeNodes = message.treeNodes;
                currentActiveNodeId = message.activeNodeId || null;
                updateMinimapContent();
            }
        });

        function updateMinimapContent() {
            if (!trackingIndicator) return;
            
            if (currentTreeNodes.length === 0) {
                trackingIndicator.innerHTML = '';
                trackingIndicator.style.opacity = '0';
                return;
            }

            // Show minimap
            trackingIndicator.style.opacity = '1';
            
            // Check if dark mode
            const isDark = document.documentElement.classList.contains('skin-theme-clientpref-night') || 
                          document.body.classList.contains('skin-theme-clientpref-night');
            
            if (isDark) {
                trackingIndicator.style.background = 'rgba(0, 0, 0, 0.65)';
                trackingIndicator.style.backdropFilter = 'blur(10px)';
                trackingIndicator.style.borderColor = 'rgba(255, 255, 255, 0.9)';
            } else {
                // Light mode
                trackingIndicator.style.background = 'rgba(0, 0, 0, 0.5)';
                trackingIndicator.style.backdropFilter = 'blur(10px)';
                trackingIndicator.style.borderColor = 'rgba(255, 255, 255, 0.7)';
            }

            // Render minimap SVG
            const svgContent = renderMinimapSVG(currentTreeNodes, currentActiveNodeId);
            trackingIndicator.innerHTML = svgContent;
        }

        function renderMinimapSVG(nodes: any[], activeNodeId: string | null): string {
            const svgWidth = 200;
            const svgHeight = 150;
            const nodeWidth = 14;
            const nodeHeight = 10;
            const horizontalSpacing = 22;
            const verticalSpacing = 20;

            // Build parent-children map
            const childrenMap: { [id: string]: any[] } = {};
            nodes.forEach(node => {
                if (node.parentId) {
                    if (!childrenMap[node.parentId]) {
                        childrenMap[node.parentId] = [];
                    }
                    childrenMap[node.parentId].push(node);
                }
            });

            const rootNode = nodes.find(n => n.parentId === null);
            if (!rootNode) return '<svg></svg>';

            // Position root node at center (anchored)
            const nodePositions: { [id: string]: { x: number; y: number } } = {};
            nodePositions[rootNode.id] = { x: 0, y: 0 };

            // Calculate total width needed for the entire tree
            const calculateTreeWidth = (node: any): number => {
                const children = childrenMap[node.id] || [];
                if (children.length === 0) return 1;
                return children.reduce((sum: number, child: any) => sum + calculateTreeWidth(child), 0);
            };

            const totalTreeWidth = calculateTreeWidth(rootNode);
            const startX = -(totalTreeWidth - 1) * horizontalSpacing / 2;
            
            // Position nodes recursively starting from root
            let currentX = startX;
            
            const positionSubtree = (node: any, depth: number): { minX: number; maxX: number } => {
                const children = childrenMap[node.id] || [];
                
                if (children.length === 0) {
                    // Leaf node - position at current X
                    const x = currentX;
                    currentX += horizontalSpacing;
                    nodePositions[node.id] = { x, y: depth * verticalSpacing };
                    return { minX: x, maxX: x };
                }

                // Position all children first to get their range
                const childRanges = children.map((child: any) => {
                    const range = positionSubtree(child, depth + 1);
                    return range;
                });

                // Calculate the range of all children
                const minChildX = Math.min(...childRanges.map(r => r.minX));
                const maxChildX = Math.max(...childRanges.map(r => r.maxX));
                
                // For non-root nodes, position parent at the center of its children
                if (node.id !== rootNode.id) {
                    const x = (minChildX + maxChildX) / 2;
                    nodePositions[node.id] = { x, y: depth * verticalSpacing };
                }
                
                return { minX: minChildX, maxX: maxChildX };
            };

            // Start positioning from root (root is already positioned at center)
            positionSubtree(rootNode, 0);

            // Always center the active node in the viewport
            let offsetX, offsetY;
            
            if (activeNodeId && nodePositions[activeNodeId]) {
                // Always center the active node
                const activePos = nodePositions[activeNodeId];
                offsetX = svgWidth / 2 - activePos.x;
                offsetY = svgHeight / 2 - activePos.y;
            } else {
                // No active node - center the root node
                const rootPos = nodePositions[rootNode.id];
                offsetX = svgWidth / 2 - rootPos.x;
                offsetY = svgHeight / 2 - rootPos.y;
            }

            // Start building SVG
            let svgContent = `<svg width="${svgWidth}" height="${svgHeight}" style="display: block;">`;
            
            // Add definitions for filters and animations
            svgContent += `
                <defs>
                    <filter id="nodeShadow">
                        <feDropShadow dx="1" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.3)"/>
                    </filter>
                    <style>
                        @keyframes blurFadeIn {
                            from { 
                                opacity: 0; 
                                filter: blur(8px);
                            }
                            to { 
                                opacity: 1; 
                                filter: blur(0px);
                            }
                        }
                        .blur-fade-in {
                            opacity: 0;
                            animation: blurFadeIn 0.3s ease-out forwards;
                        }
                    </style>
                </defs>
            `;

            // Draw edges first (so nodes appear on top)
            nodes.forEach(node => {
                if (node.parentId) {
                    const parent = nodes.find(n => n.id === node.parentId);
                    if (parent && nodePositions[parent.id] && nodePositions[node.id]) {
                        const parentX = nodePositions[parent.id].x + offsetX;
                        const parentY = nodePositions[parent.id].y + offsetY;
                        const childX = nodePositions[node.id].x + offsetX;
                        const childY = nodePositions[node.id].y + offsetY;
                        
                        // Create smooth step path
                    const midY = parentY + (childY - parentY) / 2;
                    const pathData = `M ${parentX} ${parentY} L ${parentX} ${midY} L ${childX} ${midY} L ${childX} ${childY}`;
                    
                    const isActive = node.id === activeNodeId;
                        // Use actual color values since CSS variables don't work in SVG strings
                        const isDark = document.documentElement.classList.contains('skin-theme-clientpref-night') || 
                                      document.body.classList.contains('skin-theme-clientpref-night');
                        const strokeColor = isActive 
                            ? (isDark ? 'rgba(89, 162, 217, 0.6)' : 'rgba(89, 162, 217, 0.6)')
                            : (isDark ? 'rgba(195, 192, 182, 0.2)' : 'rgba(61, 57, 41, 0.2)');
                        svgContent += `<path d="${pathData}" fill="none" stroke="${strokeColor}" stroke-width="${isActive ? '2' : '1.5'}" class="blur-fade-in"/>`;
                    }
                }
            });

            // Draw nodes as circles with drop shadow - drawn AFTER edges so they're on top
            nodes.forEach(node => {
                const pos = nodePositions[node.id];
                if (pos) {
                    const isActive = node.id === activeNodeId;
                    const isRoot = node.parentId === null;
                    
                    // Use actual color values since CSS variables don't work in SVG strings
                    const isDark = document.documentElement.classList.contains('skin-theme-clientpref-night') || 
                                  document.body.classList.contains('skin-theme-clientpref-night');
                    let fillColor;
                    if (isActive) {
                        fillColor = isDark ? 'rgb(89, 162, 217)' : 'rgb(89, 162, 217)'; // Primary blue
                    } else if (isRoot) {
                        fillColor = isDark ? 'rgb(38, 38, 36)' : 'rgb(250, 249, 245)'; // Card background
                    } else {
                        fillColor = isDark ? 'rgb(27, 27, 25)' : 'rgb(237, 233, 222)'; // Muted
                    }
                    
                    const radius = 6; // Circle radius
                    svgContent += `<circle cx="${pos.x + offsetX}" cy="${pos.y + offsetY}" r="${radius}" fill="${fillColor}" stroke="black" stroke-width="0.5" filter="url(#nodeShadow)" class="blur-fade-in"/>`;
                }
            });

            svgContent += '</svg>';
            return svgContent;
        }
    }
});
