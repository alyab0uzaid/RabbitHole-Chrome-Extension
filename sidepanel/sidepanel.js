// Get the selected text from background script and load Wikipedia
async function init() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'getSelectedText' });
    if (response && response.selectedText) {
      loadWikipedia(response.selectedText);
    } else {
      showError('No text selected. Please select text on a webpage and try again.');
    }
  } catch (error) {
    showError('Error loading article: ' + error.message);
  }
}

async function loadWikipedia(searchTerm) {
  const loadingElement = document.getElementById('loading');
  const errorElement = document.getElementById('error');
  const wikiContainer = document.getElementById('wiki-container');

  // Show loading state
  loadingElement.classList.remove('hidden');
  errorElement.classList.add('hidden');
  wikiContainer.innerHTML = '';

  try {
    // First, search for the article to get the correct title
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(searchTerm)}&limit=1&format=json&origin=*`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (!searchData[1] || searchData[1].length === 0) {
      throw new Error('No Wikipedia article found for this term');
    }

    const articleTitle = searchData[1][0];

    // Load the mobile Wikipedia page in an iframe with custom CSS to hide headers
    const mobileUrl = `https://en.m.wikipedia.org/wiki/${encodeURIComponent(articleTitle.replace(/ /g, '_'))}`;

    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.src = mobileUrl;
    iframe.style.width = '100%';
    iframe.style.height = '100vh';
    iframe.style.border = 'none';

    // Handle iframe load - inject CSS to hide headers
    iframe.onload = function() {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        const style = iframeDoc.createElement('style');
        style.textContent = `
          /* Hide Wikipedia mobile header and navigation */
          .header-container,
          .page-actions,
          #page-secondary-actions,
          .post-content,
          footer,
          .minerva-footer,
          #mw-mf-page-center > .banner,
          .navigation-drawer,
          #mw-mf-page-left,
          .overlay,
          .last-modified-bar,
          .page-actions-menu,
          .mw-mf-user,
          .branding-box {
            display: none !important;
          }

          /* Adjust content to fill space */
          .content {
            margin-top: 0 !important;
            padding-top: 10px !important;
          }

          body {
            padding-top: 0 !important;
          }
        `;
        iframeDoc.head.appendChild(style);
      } catch (e) {
        // Cross-origin restrictions prevent CSS injection, but iframe will still work
        console.log('Could not inject CSS into iframe');
      }
      loadingElement.classList.add('hidden');
    };

    iframe.onerror = function() {
      loadingElement.classList.add('hidden');
      showError('Failed to load Wikipedia article');
    };

    wikiContainer.appendChild(iframe);

  } catch (error) {
    loadingElement.classList.add('hidden');
    showError(error.message);
  }
}

function showError(message) {
  const errorElement = document.getElementById('error');
  errorElement.textContent = message;
  errorElement.classList.remove('hidden');
}

// Initialize when the page loads
init();
