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

        // Helper function to get CSS variable value as RGB
        function getCSSVariableAsRGB(variableName: string, alpha: number = 1): string {
            // Theme color fallbacks (no tan - use primary, foreground, border, background, muted-foreground)
            const colorMap: { [key: string]: string } = {
                '--primary': '89, 138, 217',
                '--foreground': '30, 30, 35',
                '--background': '255, 255, 255',
                '--muted-foreground': '100, 100, 110',
                '--border': '180, 180, 190',
            };
            
            if (!document.body) {
                const rgb = colorMap[variableName] || '136, 136, 136';
                return `rgba(${rgb}, ${alpha})`;
            }
            
            try {
                const root = document.documentElement;
                const value = getComputedStyle(root).getPropertyValue(variableName).trim();
                if (!value) {
                    const rgb = colorMap[variableName] || '136, 136, 136';
                    return `rgba(${rgb}, ${alpha})`;
                }
                
                // Create a temporary element to get the computed color value
                const tempEl = document.createElement('div');
                tempEl.style.position = 'absolute';
                tempEl.style.visibility = 'hidden';
                tempEl.style.width = '1px';
                tempEl.style.height = '1px';
                tempEl.style.color = `oklch(${value})`;
                document.body.appendChild(tempEl);
                
                const computedColor = getComputedStyle(tempEl).color;
                document.body.removeChild(tempEl);
                
                // Extract RGB values from computed color
                const match = computedColor.match(/(\d+),\s*(\d+),\s*(\d+)/);
                if (match && match[1] !== '0' && match[2] !== '0' && match[3] !== '0') {
                    // Only use if not black
                    return `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${alpha})`;
                }
            } catch (e) {
                // Fall through to fallback
            }
            
            // Fallback to theme colors
            const rgb = colorMap[variableName] || '136, 136, 136';
            return `rgba(${rgb}, ${alpha})`;
        }

        function initializeMinimap() {
            // Create tracking indicator (minimap container)
            trackingIndicator = document.createElement('div');
            trackingIndicator.id = 'rabbithole-tracking-indicator';
            
            // Get theme colors - semi-opaque background with blur
            const bgColor = getCSSVariableAsRGB('--background', 0.7);
            const borderColor = getCSSVariableAsRGB('--border', 1);
            const shadowColor = getCSSVariableAsRGB('--foreground', 0.15);
            
            Object.assign(trackingIndicator.style, {
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                width: '200px',
                height: '150px',
                zIndex: '999999',
                pointerEvents: 'auto',
                borderRadius: '4px',
                background: bgColor,
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: `2px solid ${borderColor}`,
                boxShadow: `0 4px 12px ${shadowColor}`,
                transition: 'all 0.3s ease',
                cursor: 'pointer'
            });

            // Add hover effect
            trackingIndicator.addEventListener('mouseenter', () => {
                if (trackingIndicator) {
                    trackingIndicator.style.transform = 'scale(1.05)';
                    trackingIndicator.style.background = getCSSVariableAsRGB('--background', 0.85);
                    trackingIndicator.style.borderColor = getCSSVariableAsRGB('--border', 1);
                }
            });

            trackingIndicator.addEventListener('mouseleave', () => {
                if (trackingIndicator) {
                    trackingIndicator.style.transform = 'scale(1)';
                    trackingIndicator.style.background = getCSSVariableAsRGB('--background', 0.7);
                    trackingIndicator.style.borderColor = getCSSVariableAsRGB('--border', 1);
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
                console.log('[Content] Updating minimap with', message.treeNodes.length, 'nodes');
                currentTreeNodes = message.treeNodes;
                currentActiveNodeId = message.activeNodeId || null;
                updateMinimapContent();
            }
        });
        
        // Also update minimap when page loads if we have nodes
        if (document.readyState === 'complete') {
            // Request initial tree state
            browser.runtime.sendMessage({ messageType: 'getTreeForMinimap' }).then((response: any) => {
                if (response && response.treeNodes) {
                    console.log('[Content] Got initial tree state:', response.treeNodes.length, 'nodes');
                    currentTreeNodes = response.treeNodes;
                    currentActiveNodeId = response.activeNodeId || null;
                    updateMinimapContent();
                }
            }).catch(() => {
                // Ignore errors
            });
        }

        function updateMinimapContent() {
            if (!trackingIndicator) return;
            
            if (currentTreeNodes.length === 0) {
                trackingIndicator.innerHTML = '';
                trackingIndicator.style.opacity = '0';
                return;
            }

            // Show minimap - semi-opaque blurry background
            trackingIndicator.style.opacity = '1';
            trackingIndicator.style.background = getCSSVariableAsRGB('--background', 0.7);
            trackingIndicator.style.backdropFilter = 'blur(12px)';
            trackingIndicator.style.WebkitBackdropFilter = 'blur(12px)';
            trackingIndicator.style.borderColor = getCSSVariableAsRGB('--border', 1);

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
            
            // Get shadow color for filter - minimal transparency for depth
            const shadowColor = getCSSVariableAsRGB('--foreground', 0.2);

            // Add definitions for filters and animations
            svgContent += `
                <defs>
                    <filter id="nodeShadow">
                        <feDropShadow dx="1" dy="2" stdDeviation="2" flood-color="${shadowColor}"/>
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

            // Draw edges first (behind), then circles on top
            nodes.forEach(node => {
                if (node.parentId) {
                    const parent = nodes.find(n => n.id === node.parentId);
                    if (parent && nodePositions[parent.id] && nodePositions[node.id]) {
                        const parentX = nodePositions[parent.id].x + offsetX;
                        const parentY = nodePositions[parent.id].y + offsetY;
                        const childX = nodePositions[node.id].x + offsetX;
                        const childY = nodePositions[node.id].y + offsetY;
                        const midY = parentY + (childY - parentY) / 2;
                        const pathData = `M ${parentX} ${parentY} L ${parentX} ${midY} L ${childX} ${midY} L ${childX} ${childY}`;
                        const isActive = node.id === activeNodeId;
                        const strokeColor = isActive
                            ? getCSSVariableAsRGB('--primary', 1)
                            : getCSSVariableAsRGB('--muted-foreground', 1);
                        svgContent += `<path d="${pathData}" fill="none" stroke="${strokeColor}" stroke-width="${isActive ? '2' : '1.5'}" class="blur-fade-in"/>`;
                    }
                }
            });

            // Draw nodes as circles
            nodes.forEach(node => {
                const pos = nodePositions[node.id];
                if (pos) {
                    const isActive = node.id === activeNodeId;
                    const isRoot = node.parentId === null;
                    const outlineColor = getCSSVariableAsRGB('--muted-foreground', 1);
                    let fillColor;
                    if (isActive) {
                        fillColor = getCSSVariableAsRGB('--primary', 1);
                    } else {
                        fillColor = 'rgb(255, 255, 255)';
                    }
                    const strokeColor = isActive ? getCSSVariableAsRGB('--primary', 1) : outlineColor;
                    const radius = 6;
                    svgContent += `<circle cx="${pos.x + offsetX}" cy="${pos.y + offsetY}" r="${radius}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="1.5" filter="url(#nodeShadow)" class="blur-fade-in"/>`;
                }
            });

            svgContent += '</svg>';
            return svgContent;
        }
    }
});
