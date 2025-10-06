import { browser } from "wxt/browser";
import ExtMessage, { MessageType } from "@/entrypoints/types.ts";

export default defineContentScript({
    matches: ['*://*/*'],
    runAt: 'document_end',
    main() {
        let previewCard: HTMLElement | null = null;
        let ignoreNextMouseUp = false;

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
            
            const selectedText = window.getSelection()?.toString().trim() || '';
            
            if (selectedText.length > 0) {
                showPreviewCard(selectedText, e.clientX, e.clientY);
            }
        }

        function showPreviewCard(text: string, x: number, y: number) {
            // Remove old card if exists
            if (previewCard) {
                previewCard.remove();
            }
            
            // Create new card with modern styling
            previewCard = document.createElement('div');
            previewCard.className = 'rabbithole-preview-card';
            previewCard.innerHTML = `
                <div class="preview-text">Selected: ${text}</div>
                <button class="preview-button">Open in Sidebar</button>
            `;
            
            // Apply styles
            Object.assign(previewCard.style, {
                position: 'fixed',
                left: x + 'px',
                top: (y + 20) + 'px',
                background: 'white',
                border: '2px solid #333',
                borderRadius: '8px',
                padding: '12px',
                zIndex: '999999',
                fontFamily: 'Arial, sans-serif',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                minWidth: '200px'
            });

            // Style the text
            const textElement = previewCard.querySelector('.preview-text') as HTMLElement;
            if (textElement) {
                Object.assign(textElement.style, {
                    marginBottom: '8px',
                    fontSize: '13px',
                    color: '#666'
                });
            }

            // Style the button
            const button = previewCard.querySelector('.preview-button') as HTMLButtonElement;
            if (button) {
                Object.assign(button.style, {
                    width: '100%',
                    padding: '8px',
                    background: '#0066cc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                });

                // Add hover effect
                button.addEventListener('mouseenter', () => {
                    button.style.background = '#0052a3';
                });
                button.addEventListener('mouseleave', () => {
                    button.style.background = '#0066cc';
                });
            }
            
            document.body.appendChild(previewCard);
            
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

        // Close card when clicking outside
        document.addEventListener('mousedown', function(e) {
            if (previewCard && !previewCard.contains(e.target as Node)) {
                if (previewCard) {
                    previewCard.remove();
                    previewCard = null;
                }
            }
        });
    },
});
