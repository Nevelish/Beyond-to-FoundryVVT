// Background script for DnD Beyond to FoundryVTT extension
console.log('DnD Beyond to FoundryVTT background script loaded');

// Listen for extension installation
browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('DnD Beyond to FoundryVTT extension installed');
    
    // Open a welcome page or show notification
    browser.tabs.create({
      url: 'https://github.com/Nevelish/Beyond-to-FoundryVVT'
    });
  } else if (details.reason === 'update') {
    console.log('DnD Beyond to FoundryVTT extension updated');
  }
});

// Handle messages from content scripts or popup
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getCobaltCookie') {
    // Get cobalt cookie
    browser.cookies.getAll({
      domain: '.dndbeyond.com',
      name: 'CobaltSession'
    }).then(cookies => {
      if (cookies.length > 0) {
        sendResponse({ success: true, cookie: cookies[0].value });
      } else {
        sendResponse({ success: false, error: 'Cobalt cookie not found' });
      }
    }).catch(error => {
      sendResponse({ success: false, error: error.message });
    });
    
    return true; // Keep the message channel open for async response
  }
});

// Optional: Add context menu for quick access
browser.contextMenus.create({
  id: 'copy-cobalt',
  title: 'Copy Cobalt Cookie',
  contexts: ['page'],
  documentUrlPatterns: ['*://*.dndbeyond.com/*']
});

browser.contextMenus.create({
  id: 'copy-character',
  title: 'Copy Character Data',
  contexts: ['page'],
  documentUrlPatterns: ['*://*.dndbeyond.com/characters/*']
});

// Handle context menu clicks
browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'copy-cobalt') {
    browser.cookies.getAll({
      domain: '.dndbeyond.com',
      name: 'CobaltSession'
    }).then(cookies => {
      if (cookies.length > 0) {
        // Send to content script to copy to clipboard
        browser.tabs.sendMessage(tab.id, {
          action: 'copyToClipboard',
          text: cookies[0].value
        });
      }
    });
  } else if (info.menuItemId === 'copy-character') {
    // Request character data from content script
    browser.tabs.sendMessage(tab.id, {
      action: 'getCharacterData'
    }).then(response => {
      if (response && response.success) {
        // Copy to clipboard via content script
        browser.tabs.sendMessage(tab.id, {
          action: 'copyToClipboard',
          text: JSON.stringify(response.data, null, 2)
        });
      }
    });
  }
});
