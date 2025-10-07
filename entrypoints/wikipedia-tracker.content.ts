// Wikipedia click tracker - runs in ALL frames including iframes
export default defineContentScript({
  matches: ['*://*.wikipedia.org/*'],
  runAt: 'document_end',
  allFrames: true, // CRITICAL: Run in iframes too!

  main(ctx) {
    console.log('[Wikipedia Tracker] Content script loaded on Wikipedia page', {
      isTopFrame: window.self === window.top,
      url: location.href
    });

    // Listen for clicks on Wikipedia links
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (link && link.href && link.href.includes('wikipedia.org/wiki/')) {
        console.log('[Wikipedia Tracker] Wikipedia link clicked:', link.href);

        // Extract article title
        const match = link.href.match(/\/wiki\/([^#?]+)/);
        if (match) {
          const articleTitle = decodeURIComponent(match[1].replace(/_/g, ' '));

          // Send message to background script
          browser.runtime.sendMessage({
            messageType: 'wikipediaNavigation',
            articleTitle: articleTitle,
            articleUrl: link.href
          }).catch(err => {
            console.error('[Wikipedia Tracker] Failed to send message:', err);
          });
        }
      }
    });

    // Also track navigation via History API
    let lastUrl = location.href;
    new MutationObserver(() => {
      const currentUrl = location.href;
      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;

        const match = currentUrl.match(/\/wiki\/([^#?]+)/);
        if (match) {
          const articleTitle = decodeURIComponent(match[1].replace(/_/g, ' '));

          console.log('[Wikipedia Tracker] URL changed to:', articleTitle);

          browser.runtime.sendMessage({
            messageType: 'wikipediaNavigation',
            articleTitle: articleTitle,
            articleUrl: currentUrl
          }).catch(err => {
            console.error('[Wikipedia Tracker] Failed to send message:', err);
          });
        }
      }
    }).observe(document, { subtree: true, childList: true });
  }
});
