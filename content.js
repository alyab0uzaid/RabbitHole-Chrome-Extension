let previewCard = null;
let ignoreNextMouseUp = false;

document.addEventListener('mouseup', handleTextSelection);

function handleTextSelection(e) {
  // Ignore if we just clicked the preview card
  if (ignoreNextMouseUp) {
    ignoreNextMouseUp = false;
    return;
  }
  
  // Ignore if clicking inside the card
  if (previewCard && previewCard.contains(e.target)) {
    return;
  }
  
  const selectedText = window.getSelection().toString().trim();
  
  if (selectedText.length > 0) {
    showPreviewCard(selectedText, e.clientX, e.clientY);
  }
}

function showPreviewCard(text, x, y) {
  // Remove old card if exists
  if (previewCard) {
    previewCard.remove();
  }
  
  // Create new card
  previewCard = document.createElement('div');
  previewCard.className = 'rabbithole-preview-card';
  previewCard.innerHTML = `
    <div class="preview-text">Selected: ${text}</div>
    <button class="preview-button">Open in Sidebar</button>
  `;
  
  previewCard.style.position = 'fixed';
  previewCard.style.left = x + 'px';
  previewCard.style.top = (y + 20) + 'px';
  
  document.body.appendChild(previewCard);
  
  // Add click handler to button
  const button = previewCard.querySelector('.preview-button');
  button.addEventListener('mousedown', function(e) {
    e.preventDefault();
    e.stopPropagation();
    ignoreNextMouseUp = true;
  });
  
  button.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Button clicked, sending message...');
    
    chrome.runtime.sendMessage({
      action: 'openSidePanel',
      selectedText: text
    }, function(response) {
      if (chrome.runtime.lastError) {
        console.error('Error:', chrome.runtime.lastError);
      } else {
        console.log('Message sent successfully');
      }
    });
    
    if (previewCard) {
      previewCard.remove();
      previewCard = null;
    }
  });
}

// Close card when clicking outside
document.addEventListener('mousedown', function(e) {
  if (previewCard && !previewCard.contains(e.target)) {
    if (previewCard) {
      previewCard.remove();
      previewCard = null;
    }
  }
});