import { browser } from "wxt/browser";
import ExtMessage, { MessageType } from "@/entrypoints/types.ts";

interface WikipediaPreviewData {
    title: string;
    excerpt: string;
    image: string | null;
    imageWidth: number;
    imageHeight: number;
    url: string;
}

async function fetchWikipediaPreview(searchText: string): Promise<WikipediaPreviewData> {
    try {
        // Use Wikipedia REST API for page summary
        const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchText)}`;
        const response = await fetch(searchUrl);

        if (!response.ok) {
            throw new Error('Wikipedia API request failed');
        }

        const data = await response.json();

        return {
            title: data.title || searchText,
            excerpt: data.extract || 'No preview available.',
            image: data.thumbnail?.source || null,
            imageWidth: data.thumbnail?.width || 0,
            imageHeight: data.thumbnail?.height || 0,
            url: data.content_urls?.desktop?.page || ''
        };
    } catch (error) {
        console.error('Error fetching Wikipedia data:', error);
        // Return fallback data
        return {
            title: searchText,
            excerpt: 'Could not load Wikipedia preview. Click to search in sidebar.',
            image: null,
            imageWidth: 0,
            imageHeight: 0,
            url: ''
        };
    }
}

export default defineContentScript({
    matches: ['*://*/*'],
    runAt: 'document_end',
    main() {
        let previewCard: HTMLElement | null = null;
        let ignoreNextMouseUp = false;
        let highlightedRanges: { range: Range; text: string; element: HTMLElement }[] = [];
        let currentHighlightedElement: HTMLElement | null = null;
        let trackingIndicator: HTMLElement | null = null;
        let isTracking = false;
        let currentTreeNodes: any[] = [];
        let currentActiveNodeId: string | null = null;

        // Function to update minimap content
        function updateMinimapContent() {
            if (!trackingIndicator) return;
            
            if (currentTreeNodes.length === 0) {
                // Show empty state - just leave it empty
                trackingIndicator.innerHTML = '';
                return;
            }

            // Render minimap SVG with active node
            const svg = renderMinimapSVG(currentTreeNodes, currentActiveNodeId || undefined);
            trackingIndicator.innerHTML = svg;
        }

        // Function to render the minimap as SVG (using exact same algorithm as main tree)
        function renderMinimapSVG(nodes: any[], activeNodeId?: string): string {
            const svgWidth = 200;  // Match container width
            const svgHeight = 150; // Match container height
            const nodeWidth = 14;
            const nodeHeight = 10;
            const horizontalSpacing = 22;  // Scaled down from main tree
            const verticalSpacing = 20;   // Scaled down from main tree

            // Build parent-children map (same as main tree)
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

            // Position root node at center (anchored) - same as main tree
            const nodePositions: { [id: string]: { x: number; y: number } } = {};
            nodePositions[rootNode.id] = { x: 0, y: 0 };

            // Calculate total width needed for the entire tree - same as main tree
            const calculateTreeWidth = (node: any): number => {
                const children = childrenMap[node.id] || [];
                if (children.length === 0) return 1;
                return children.reduce((sum: number, child: any) => sum + calculateTreeWidth(child), 0);
            };

            const totalTreeWidth = calculateTreeWidth(rootNode);
            const startX = -(totalTreeWidth - 1) * horizontalSpacing / 2;
            
            // Position nodes recursively starting from root - same as main tree
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

            // Generate SVG with drop shadow filter and animations
            let svgContent = `<svg width="${svgWidth}" height="${svgHeight}" style="display: block; margin: 0 auto;">
                <defs>
                    <filter id="nodeShadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="1" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.3)"/>
                    </filter>
                </defs>
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
                </style>`;
            
            // Draw edges first (same as main tree - SmoothStep style)
            nodes.forEach(node => {
                if (node.parentId && nodePositions[node.parentId] && nodePositions[node.id]) {
                    const parent = nodePositions[node.parentId];
                    const child = nodePositions[node.id];
                    
                    const parentX = parent.x + offsetX;
                    const parentY = parent.y + offsetY;
                    const childX = child.x + offsetX;
                    const childY = child.y + offsetY;
                    
                    // Create smooth step path (simplified version of React Flow's SmoothStep)
                    const midY = parentY + (childY - parentY) / 2;
                    const pathData = `M ${parentX} ${parentY} L ${parentX} ${midY} L ${childX} ${midY} L ${childX} ${childY}`;
                    
                    const isActive = node.id === activeNodeId;
                    svgContent += `<path d="${pathData}" fill="none" stroke="${isActive ? 'hsl(var(--primary) / 0.6)' : 'hsl(var(--muted-foreground) / 0.2)'}" stroke-width="${isActive ? '2' : '1.5'}" class="blur-fade-in"/>`;
                }
            });

            // Draw nodes as circles with drop shadow - drawn AFTER edges so they're on top
            nodes.forEach(node => {
                const pos = nodePositions[node.id];
                if (pos) {
                    const isActive = node.id === activeNodeId;
                    const isRoot = node.parentId === null;
                    
                    let fillColor;
                    if (isActive) {
                        fillColor = 'hsl(var(--primary))'; // Primary color for active node
                    } else if (isRoot) {
                        fillColor = 'hsl(var(--card))'; // Card background for root
                    } else {
                        fillColor = 'hsl(var(--muted))'; // Muted color for others
                    }
                    
                    const radius = 6; // Circle radius
                    svgContent += `<circle cx="${pos.x + offsetX}" cy="${pos.y + offsetY}" r="${radius}" fill="${fillColor}" stroke="black" stroke-width="0.5" filter="url(#nodeShadow)" class="blur-fade-in"/>`;
                }
            });

            svgContent += '</svg>';
            return svgContent;
        }

        // Create RabbitHole minimap
        function showTrackingIndicator() {
            if (trackingIndicator) return; // Already visible

            trackingIndicator = document.createElement('div');
            trackingIndicator.className = 'rabbithole-minimap';

            // Styles for minimap container
            Object.assign(trackingIndicator.style, {
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                width: '200px',
                height: '150px',
                background: 'rgba(0, 0, 0, 0.5)', // 50% black translucent
                borderRadius: '8px',
                border: '2px solid rgba(255, 255, 255, 0.7)', // White/grey solid border
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.4)',
                zIndex: '999998',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                overflow: 'hidden'
            });

            // Hover effect
            trackingIndicator.addEventListener('mouseenter', () => {
                if (trackingIndicator) {
                    trackingIndicator.style.background = 'rgba(0, 0, 0, 0.65)';
                    trackingIndicator.style.transform = 'scale(1.05)';
                    trackingIndicator.style.borderColor = 'rgba(255, 255, 255, 0.9)';
                }
            });

            trackingIndicator.addEventListener('mouseleave', () => {
                if (trackingIndicator) {
                    trackingIndicator.style.background = 'rgba(0, 0, 0, 0.5)';
                    trackingIndicator.style.transform = 'scale(1)';
                    trackingIndicator.style.borderColor = 'rgba(255, 255, 255, 0.7)';
                }
            });

            // Click to open side panel (no transition - keep minimap visible)
            trackingIndicator.addEventListener('click', () => {
                console.log('[Content] Minimap clicked, opening sidepanel');
                
                // Brief click feedback animation
                if (trackingIndicator) {
                    trackingIndicator.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        if (trackingIndicator) {
                            trackingIndicator.style.transform = 'scale(1)';
                        }
                    }, 100);
                }
                
                // Open sidepanel immediately
                browser.runtime.sendMessage({
                    messageType: MessageType.openSidePanel
                }).catch((err: any) => {
                    console.log('[Content] Could not send open sidepanel message:', err);
                });
            });

            // Initial render
            updateMinimapContent();

            document.body.appendChild(trackingIndicator);

            // Animate in
            requestAnimationFrame(() => {
                if (trackingIndicator) {
                    trackingIndicator.style.opacity = '0';
                    trackingIndicator.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        if (trackingIndicator) {
                            trackingIndicator.style.opacity = '1';
                            trackingIndicator.style.transform = 'translateY(0)';
                        }
                    }, 10);
                }
            });
        }

        function hideTrackingIndicator() {
            if (!trackingIndicator) return;

            // Animate out
            trackingIndicator.style.opacity = '0';
            trackingIndicator.style.transform = 'translateY(20px)';

            setTimeout(() => {
                if (trackingIndicator) {
                    trackingIndicator.remove();
                    trackingIndicator = null;
                }
            }, 200);
        }

        // Initialize minimap on page load (only on Wikipedia)
        if (window.location.hostname.includes('wikipedia.org')) {
            showTrackingIndicator();
        }

        // Listen for tracking mode messages
        browser.runtime.onMessage.addListener((message: ExtMessage) => {
            if (message.messageType === MessageType.startTracking) {
                console.log('[Content] Starting tracking mode');
                isTracking = true;
                showTrackingIndicator();
            } else if (message.messageType === MessageType.stopTracking) {
                console.log('[Content] Stopping tracking mode');
                isTracking = false;
                // Keep button visible - don't hide it
            }
        });

        // Listen for tree updates from background
        browser.runtime.onMessage.addListener((message: any) => {
            if (message.messageType === 'updateTreeMinimap' && message.treeNodes) {
                currentTreeNodes = message.treeNodes;
                currentActiveNodeId = message.activeNodeId || null;
                updateMinimapContent();
            }
        });

        // Handle text selection
        document.addEventListener('mouseup', handleTextSelection);

        function handleTextSelection(e: MouseEvent) {
            // Ignore if we just clicked the preview card
            if (ignoreNextMouseUp) {
                ignoreNextMouseUp = false;
                return;
            }
            
            // Ignore if clicking inside the card
            if (previewCard && previewCard.contains(e.target as Node)) {
                return;
            }
            
            const selection = window.getSelection();
            const selectedText = selection?.toString().trim() || '';
            
            if (selectedText.length > 0) {
                // Clear previous highlights
                clearHighlights();
                
                // Create highlight for the selected text
                highlightSelectedText(selection!);
            }
        }

        function clearHighlights() {
            highlightedRanges.forEach(({ element }) => {
                if (element && element.parentNode) {
                    element.parentNode.replaceChild(
                        document.createTextNode(element.textContent || ''),
                        element
                    );
                }
            });
            highlightedRanges = [];
            currentHighlightedElement = null;
            hidePreviewCard();
        }

        function highlightSelectedText(selection: Selection) {
            const range = selection.getRangeAt(0);
            const selectedText = selection.toString().trim();
            
            // Create a highlight element
            const highlightElement = document.createElement('span');
            highlightElement.className = 'rabbithole-highlight';
            highlightElement.style.cursor = 'pointer';
            highlightElement.style.backgroundColor = 'hsl(var(--primary) / 0.3)';
            highlightElement.style.borderRadius = '2px';
            highlightElement.style.padding = '0 2px';
            highlightElement.style.transition = 'background-color 0.2s ease';
            
            try {
                range.surroundContents(highlightElement);
                
                // Store the range info
                highlightedRanges.push({
                    range: range.cloneRange(),
                    text: selectedText,
                    element: highlightElement
                });
                
                // Set as current highlighted element
                currentHighlightedElement = highlightElement;
                
                // Add hover event listeners
                highlightElement.addEventListener('mouseenter', (e) => {
                    highlightElement.style.backgroundColor = 'hsl(var(--primary) / 0.5)';
                    showPreviewCard(selectedText, highlightElement);
                });
                
                highlightElement.addEventListener('mouseleave', (e) => {
                    highlightElement.style.backgroundColor = 'hsl(var(--primary) / 0.3)';
                    // Check if mouse is moving to tooltip
                    const relatedTarget = e.relatedTarget as Node;
                    if (previewCard && previewCard.contains(relatedTarget)) {
                        // Mouse is moving to tooltip, don't hide
                        return;
                    }
                    // Add small delay to allow moving to tooltip
                    setTimeout(() => {
                        if (previewCard && !isHoveringTooltip() && !currentHighlightedElement?.matches(':hover')) {
                            hidePreviewCard();
                        }
                    }, 150);
                });
                
            } catch (error) {
                console.warn('Could not highlight text:', error);
            }
        }

        function isHoveringTooltip(): boolean {
            if (!previewCard) return false;
            return previewCard.matches(':hover') || previewCard.contains(document.querySelector(':hover') as Node);
        }

        async function showPreviewCard(text: string, highlightedElement: HTMLElement) {
            // Remove old card if exists
            if (previewCard) {
                previewCard.remove();
            }

            // Fetch Wikipedia data
            const wikiData = await fetchWikipediaPreview(text);

            // Determine layout based on image aspect ratio
            // Landscape layout (320×398): aspect ratio >= 1.3
            // Portrait layout (450×250): aspect ratio < 1.3 OR no image
            const aspectRatio = wikiData.image && wikiData.imageHeight > 0
                ? wikiData.imageWidth / wikiData.imageHeight
                : 0;
            const isLandscape = aspectRatio >= 1.3;
            const cardWidth = isLandscape ? 320 : 450;
            const cardHeight = isLandscape ? 398 : 250;

            // Create Wikipedia preview card
            previewCard = document.createElement('div');
            previewCard.className = 'rabbithole-wikipedia-card';

            if (isLandscape) {
                // Landscape layout: image on top
                previewCard.innerHTML = `
                    ${wikiData.image ? `<div class="wiki-card-image-top"><img src="${wikiData.image}" alt="${wikiData.title}"></div>` : ''}
                    <div class="wiki-card-content">
                        <h3 class="wiki-card-title">${wikiData.title}</h3>
                        <p class="wiki-card-excerpt">${wikiData.excerpt}</p>
                    </div>
                `;
            } else {
                // Portrait layout: image on left
                previewCard.innerHTML = `
                    <div class="wiki-card-horizontal">
                        ${wikiData.image ? `<div class="wiki-card-image-left"><img src="${wikiData.image}" alt="${wikiData.title}"></div>` : ''}
                        <div class="wiki-card-content-right">
                            <h3 class="wiki-card-title">${wikiData.title}</h3>
                            <p class="wiki-card-excerpt">${wikiData.excerpt}</p>
                        </div>
                    </div>
                `;
            }
            
            // Get positioning and determine placement
            const rect = highlightedElement.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const spacing = 10;
            const arrowInset = 30; // Arrow is 20px from the edge of card

            // Calculate optimal position
            let cardX: number;
            let cardY: number;

            // Determine which side of the page the highlighted text is on
            const highlightCenterX = rect.left + rect.width / 2;
            const isLeftSide = highlightCenterX < viewportWidth / 2;

            // Position card so arrow (20px from edge) points at highlighted text
            if (isLeftSide) {
                // Text on left side: arrow 20px from left edge of card
                cardX = highlightCenterX - arrowInset;
            } else {
                // Text on right side: arrow 20px from right edge of card
                cardX = highlightCenterX - (cardWidth - arrowInset);
            }

            // Ensure card stays within viewport
            cardX = Math.max(spacing, Math.min(cardX, viewportWidth - cardWidth - spacing));

            // Position below highlighted text by default
            cardY = rect.bottom + spacing;

            // If not enough space below, position above
            const isCardAbove = cardY + cardHeight > viewportHeight - spacing;
            if (isCardAbove) {
                cardY = rect.top - cardHeight - spacing;
            }


            // Apply Wikipedia card styles
            Object.assign(previewCard.style, {
                position: 'fixed',
                left: cardX + 'px',
                top: cardY + 'px',
                width: cardWidth + 'px',
                height: cardHeight + 'px',
                zIndex: '999999',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                pointerEvents: 'auto',
                opacity: '0',
                transform: 'scale(0.95)',
                transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
                cursor: 'pointer',
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
                boxShadow: '0 2px 8px hsl(var(--foreground) / 0.15)',
                overflow: 'hidden'
            });

            // Style image top (landscape)
            const imageTop = previewCard.querySelector('.wiki-card-image-top') as HTMLElement;
            if (imageTop) {
                Object.assign(imageTop.style, {
                    width: '100%',
                    height: '192px',
                    overflow: 'hidden',
                    background: 'hsl(var(--muted))'
                });
                const img = imageTop.querySelector('img') as HTMLImageElement;
                if (img) {
                    Object.assign(img.style, {
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    });
                }
            }

            // Style horizontal container (portrait)
            const horizontal = previewCard.querySelector('.wiki-card-horizontal') as HTMLElement;
            if (horizontal) {
                Object.assign(horizontal.style, {
                    display: 'flex',
                    height: '100%'
                });
            }

            // Style image left (portrait)
            const imageLeft = previewCard.querySelector('.wiki-card-image-left') as HTMLElement;
            if (imageLeft) {
                Object.assign(imageLeft.style, {
                    width: '203px',
                    height: '100%',
                    overflow: 'hidden',
                    flexShrink: '0',
                    background: 'hsl(var(--muted))'
                });
                const img = imageLeft.querySelector('img') as HTMLImageElement;
                if (img) {
                    Object.assign(img.style, {
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    });
                }
            }

            // Style content area
            const content = previewCard.querySelector('.wiki-card-content, .wiki-card-content-right') as HTMLElement;
            if (content) {
                Object.assign(content.style, {
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: '1',
                    overflow: 'hidden'
                });
            }

            // Style title
            const title = previewCard.querySelector('.wiki-card-title') as HTMLElement;
            if (title) {
                Object.assign(title.style, {
                    margin: '0 0 8px 0',
                    fontSize: '18px',
                    fontWeight: '600',
                    lineHeight: '1.3',
                    color: 'hsl(var(--foreground))',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: '2',
                    WebkitBoxOrient: 'vertical'
                });
            }

            // Style excerpt
            const excerpt = previewCard.querySelector('.wiki-card-excerpt') as HTMLElement;
            if (excerpt) {
                Object.assign(excerpt.style, {
                    margin: '0 0 12px 0',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    color: 'hsl(var(--muted-foreground))',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: isLandscape ? '5' : '4',
                    WebkitBoxOrient: 'vertical',
                    flex: '1'
                });
            }

            // Style footer
            const footer = previewCard.querySelector('.wiki-card-footer') as HTMLElement;
            if (footer) {
                Object.assign(footer.style, {
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: 'auto'
                });
            }

            // Style source
            const source = previewCard.querySelector('.wiki-card-source') as HTMLElement;
            if (source) {
                Object.assign(source.style, {
                    fontSize: '12px',
                    color: 'hsl(var(--muted-foreground))',
                    fontWeight: '500'
                });
            }

            document.body.appendChild(previewCard);
            
            // Add hover persistence to tooltip
            previewCard.addEventListener('mouseenter', () => {
                // Keep tooltip visible when hovering over it
            });
            
            previewCard.addEventListener('mouseleave', (e) => {
                // Check if mouse is moving to highlighted text
                const relatedTarget = e.relatedTarget as Node;
                if (currentHighlightedElement && 
                    (currentHighlightedElement.contains(relatedTarget) || currentHighlightedElement === relatedTarget)) {
                    // Mouse is moving to highlighted text, don't hide
                    return;
                }
                // Hide tooltip when leaving it
                hidePreviewCard();
            });
            
            // Animate in
            requestAnimationFrame(() => {
                if (previewCard) {
                    previewCard.style.opacity = '1';
                    previewCard.style.transform = 'scale(1)';
                }
            });

            // Add click handler to entire card - navigates main window to Wikipedia
            previewCard.addEventListener('click', async function(e) {
                e.preventDefault();
                e.stopPropagation();

                console.log('[Content] Card clicked, navigating to Wikipedia...');

                try {
                    // Get Wikipedia URL for the search term
                    const searchUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(text)}&limit=1&format=json&origin=*`;
                    const searchResponse = await fetch(searchUrl);
                    const searchData = await searchResponse.json();

                    if (searchData[1] && searchData[1].length > 0) {
                        const articleTitle = searchData[1][0];
                        const wikipediaUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(articleTitle.replace(/ /g, '_'))}`;

                        // Send message to background to navigate tab
                        browser.runtime.sendMessage({
                            messageType: MessageType.navigateToWikipedia,
                            articleUrl: wikipediaUrl,
                            articleTitle: articleTitle
                        }).then(() => {
                            console.log('[Content] Navigation message sent successfully');
                        }).catch((error) => {
                            console.error('[Content] Error sending navigation message:', error);
                        });
                    }
                } catch (error) {
                    console.error('[Content] Error fetching Wikipedia URL:', error);
                }

                if (previewCard) {
                    previewCard.remove();
                    previewCard = null;
                }
            });
        }

        function hidePreviewCard() {
            if (previewCard) {
                // Animate out
                previewCard.style.opacity = '0';
                previewCard.style.transform = 'scale(0.95)';

                // Remove after animation
                setTimeout(() => {
                    if (previewCard) {
                        previewCard.remove();
                        previewCard = null;
                    }
                }, 200);
            }
        }

        // Close card when clicking outside
        document.addEventListener('mousedown', function(e) {
            if (previewCard && !previewCard.contains(e.target as Node)) {
                hidePreviewCard();
            }
        });

        // Clear highlights when clicking outside highlighted text
        document.addEventListener('mousedown', function(e) {
            const target = e.target as Node;
            const isHighlighted = highlightedRanges.some(({ element }) => 
                element.contains(target) || element === target
            );
            
            if (!isHighlighted) {
                clearHighlights();
            }
        });
    },
});
