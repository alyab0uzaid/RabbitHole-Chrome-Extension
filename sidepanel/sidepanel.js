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
  const searchTermElement = document.getElementById('search-term');
  const loadingElement = document.getElementById('loading');
  const errorElement = document.getElementById('error');
  const wikiContainer = document.getElementById('wiki-container');

  // Show search term
  searchTermElement.textContent = `Searching for: "${searchTerm}"`;

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

    // Update the search term to show what we found
    searchTermElement.textContent = `Article: "${articleTitle}"`;

    // Load the mobile Wikipedia page in an iframe
    const mobileUrl = `https://en.m.wikipedia.org/wiki/${encodeURIComponent(articleTitle.replace(/ /g, '_'))}`;

    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.src = mobileUrl;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';

    // Handle iframe load
    iframe.onload = function() {
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
