let lastSelectedText = '';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'openSidePanel') {
      lastSelectedText = message.selectedText || '';
      chrome.sidePanel.open({ windowId: sender.tab.windowId });
    } else if (message.action === 'getSelectedText') {
      sendResponse({ selectedText: lastSelectedText });
    }
  });