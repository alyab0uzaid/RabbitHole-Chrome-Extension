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
                    showPreviewCard(selectedText, highlightElement);
                });
                
                highlightElement.addEventListener('mouseleave', (e) => {
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
                background: '#ffffff',
                border: '1px solid #ebecf0',
                borderRadius: '6px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                overflow: 'hidden'
            });

            // Style image top (landscape)
            const imageTop = previewCard.querySelector('.wiki-card-image-top') as HTMLElement;
            if (imageTop) {
                Object.assign(imageTop.style, {
                    width: '100%',
                    height: '192px',
                    overflow: 'hidden',
                    background: '#eaecf0'
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
                    background: '#eaecf0'
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
                    color: '#202122',
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
                    color: '#54595d',
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
                    color: '#72777d',
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

            // Add click handler to entire card
            previewCard.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                console.log('Card clicked, opening sidebar...');

                const message: ExtMessage = {
                    messageType: MessageType.openSidePanel,
                    selectedText: text
                };

                browser.runtime.sendMessage(message).then(() => {
                    console.log('Message sent successfully');
                }).catch((error) => {
                    console.error('Error sending message:', error);
                });

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
