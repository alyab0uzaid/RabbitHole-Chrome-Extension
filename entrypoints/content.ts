import { browser } from "wxt/browser";
import ExtMessage, { MessageType } from "@/entrypoints/types.ts";

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

        function showPreviewCard(text: string, highlightedElement: HTMLElement) {
            // Remove old card if exists
            if (previewCard) {
                previewCard.remove();
            }
            
            // Create new tooltip with shadcn-inspired styling
            previewCard = document.createElement('div');
            previewCard.className = 'rabbithole-tooltip';
            previewCard.innerHTML = `
                <div class="tooltip-content">
                    <div class="tooltip-text">Selected: "${text}"</div>
                    <button class="tooltip-button">Open in Sidebar</button>
                </div>
                <div class="tooltip-arrow"></div>
            `;
            
            // Get positioning and determine placement
            const rect = highlightedElement.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const tooltipWidth = 200; // Estimated tooltip width
            const tooltipHeight = 80; // Estimated tooltip height
            const spacing = 10;
            
            // Determine position quadrant
            const isLeftSide = rect.left < viewportWidth / 2;
            const isTopSide = rect.top < viewportHeight / 2;
            
            let tooltipX: number;
            let tooltipY: number;
            let arrowPosition: 'left' | 'right' | 'top' | 'bottom';
            let arrowSide: 'left' | 'right';
            
            if (isTopSide) {
                // Position tooltip below highlighted text
                tooltipY = rect.bottom + spacing;
                arrowPosition = 'top';
                
                if (isLeftSide) {
                    // Top-left: tooltip below, arrow on left side
                    tooltipX = Math.max(spacing, rect.left);
                    arrowSide = 'left';
                } else {
                    // Top-right: tooltip below, arrow on right side
                    tooltipX = Math.min(viewportWidth - tooltipWidth - spacing, rect.right - tooltipWidth);
                    arrowSide = 'right';
                }
            } else {
                // Position tooltip above highlighted text with more spacing
                tooltipY = rect.top - tooltipHeight - (spacing * 2);
                arrowPosition = 'bottom';
                
                if (isLeftSide) {
                    // Bottom-left: tooltip above, arrow on left side
                    tooltipX = Math.max(spacing, rect.left);
                    arrowSide = 'left';
                } else {
                    // Bottom-right: tooltip above, arrow on right side
                    tooltipX = Math.min(viewportWidth - tooltipWidth - spacing, rect.right - tooltipWidth);
                    arrowSide = 'right';
                }
            }
            
            // Apply shadcn-inspired tooltip styles
            Object.assign(previewCard.style, {
                position: 'fixed',
                left: tooltipX + 'px',
                top: tooltipY + 'px',
                zIndex: '999999',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                pointerEvents: 'auto',
                opacity: '0',
                transform: 'translateY(-4px) scale(0.95)',
                transition: 'opacity 0.15s ease-out, transform 0.15s ease-out',
                maxWidth: '320px',
                minWidth: '200px'
            });

            // Style the tooltip content
            const tooltipContent = previewCard.querySelector('.tooltip-content') as HTMLElement;
            if (tooltipContent) {
                Object.assign(tooltipContent.style, {
                    background: 'hsl(0 0% 100%)',
                    border: '1px solid hsl(214.3 31.8% 91.4%)',
                    borderRadius: '6px',
                    padding: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    overflow: 'hidden'
                });
            }

            // Style the text
            const textElement = previewCard.querySelector('.tooltip-text') as HTMLElement;
            if (textElement) {
                Object.assign(textElement.style, {
                    marginBottom: '8px',
                    fontSize: '14px',
                    color: 'hsl(222.2 84% 4.9%)',
                    lineHeight: '1.4',
                    fontWeight: '500'
                });
            }

            // Style the button with shadcn button styling
            const button = previewCard.querySelector('.tooltip-button') as HTMLButtonElement;
            if (button) {
                Object.assign(button.style, {
                    width: '100%',
                    height: '36px',
                    padding: '0 16px',
                    background: 'hsl(222.2 84% 4.9%)',
                    color: 'hsl(210 40% 98%)',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color 0.2s ease',
                    whiteSpace: 'nowrap'
                });

                // Add hover effects
                button.addEventListener('mouseenter', () => {
                    button.style.background = 'hsl(222.2 84% 4.9% / 0.9)';
                });
                button.addEventListener('mouseleave', () => {
                    button.style.background = 'hsl(222.2 84% 4.9%)';
                });
            }

            // Style the tooltip arrow based on position
            const arrow = previewCard.querySelector('.tooltip-arrow') as HTMLElement;
            if (arrow) {
                // Calculate arrow position relative to highlighted text
                const highlightCenterX = rect.left + rect.width / 2;
                const tooltipLeft = parseFloat(previewCard.style.left);
                
                // Calculate where the arrow should be positioned on the tooltip
                let arrowOffset: number;
                if (arrowSide === 'left') {
                    arrowOffset = Math.max(10, Math.min(20, highlightCenterX - tooltipLeft));
                } else {
                    arrowOffset = Math.max(tooltipWidth - 30, Math.min(tooltipWidth - 10, highlightCenterX - tooltipLeft));
                }
                
                // Set arrow styles based on position
                if (arrowPosition === 'top') {
                    // Arrow pointing up (tooltip below text)
                    Object.assign(arrow.style, {
                        position: 'absolute',
                        top: '-5px',
                        left: arrowOffset + 'px',
                        width: '10px',
                        height: '10px',
                        background: 'hsl(0 0% 100%)',
                        border: '1px solid hsl(214.3 31.8% 91.4%)',
                        borderRight: 'none',
                        borderBottom: 'none',
                        transform: 'rotate(45deg)',
                        zIndex: '1000000'
                    });
                } else {
                    // Arrow pointing down (tooltip above text)
                    Object.assign(arrow.style, {
                        position: 'absolute',
                        bottom: '-5px',
                        left: arrowOffset + 'px',
                        width: '10px',
                        height: '10px',
                        background: 'hsl(0 0% 100%)',
                        border: '1px solid hsl(214.3 31.8% 91.4%)',
                        borderLeft: 'none',
                        borderTop: 'none',
                        transform: 'rotate(45deg)',
                        zIndex: '1000000'
                    });
                }
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
                    previewCard.style.transform = 'translateY(0) scale(1)';
                }
            });
            
            // Add click handlers
            if (button) {
                button.addEventListener('mousedown', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    ignoreNextMouseUp = true;
                });
                
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    console.log('Button clicked, sending message...');
                    
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
        }

        function hidePreviewCard() {
            if (previewCard) {
                // Animate out
                previewCard.style.opacity = '0';
                previewCard.style.transform = 'translateY(-4px) scale(0.95)';
                
                // Remove after animation
                setTimeout(() => {
                    if (previewCard) {
                        previewCard.remove();
                        previewCard = null;
                    }
                }, 150);
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
