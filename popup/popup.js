// Initialize popup
document.addEventListener('DOMContentLoaded', function() {
  const copyCobaltBtn = document.getElementById('copyCobalt');
  const copyCharacterBtn = document.getElementById('copyCharacter');
  const cobaltStatus = document.getElementById('cobaltStatus');
  const characterStatus = document.getElementById('characterStatus');

  // Copy Cobalt Cookie
  copyCobaltBtn.addEventListener('click', async function() {
    try {
      // Get cobalt cookie from dndbeyond.com
      const cookies = await browser.cookies.getAll({
        domain: '.dndbeyond.com',
        name: 'CobaltSession'
      });

      if (cookies.length > 0) {
        const cobaltCookie = cookies[0].value;
        
        // Copy to clipboard
        await navigator.clipboard.writeText(cobaltCookie);
        
        // Show success message
        showStatus(cobaltStatus, 'success', 'Cobalt cookie copied to clipboard!');
      } else {
        showStatus(cobaltStatus, 'error', 'Cobalt cookie not found. Please log in to DnD Beyond first.');
      }
    } catch (error) {
      console.error('Error copying cobalt cookie:', error);
      showStatus(cobaltStatus, 'error', 'Failed to copy cobalt cookie: ' + error.message);
    }
  });

  // Copy Character Data
  copyCharacterBtn.addEventListener('click', async function() {
    try {
      // Get the active tab
      const tabs = await browser.tabs.query({ active: true, currentWindow: true });
      const activeTab = tabs[0];

      // Check if we're on a DnD Beyond character page
      if (!activeTab.url || !activeTab.url.includes('dndbeyond.com/characters/')) {
        showStatus(characterStatus, 'error', 'Please navigate to a DnD Beyond character page first.');
        return;
      }

      // Send message to content script to extract character data
      showStatus(characterStatus, 'info', 'Extracting character data...');
      
      const response = await browser.tabs.sendMessage(activeTab.id, { action: 'getCharacterData' });

      if (response && response.success) {
        // Copy character data to clipboard
        await navigator.clipboard.writeText(JSON.stringify(response.data, null, 2));
        showStatus(characterStatus, 'success', 'Character data copied to clipboard!');
      } else {
        showStatus(characterStatus, 'error', response.error || 'Failed to extract character data.');
      }
    } catch (error) {
      console.error('Error copying character data:', error);
      showStatus(characterStatus, 'error', 'Failed to copy character data: ' + error.message);
    }
  });

  // Helper function to show status messages
  function showStatus(element, type, message) {
    element.className = 'status ' + type;
    element.textContent = message;
    element.style.display = 'block';

    // Auto-hide after 5 seconds for success messages
    if (type === 'success') {
      setTimeout(() => {
        element.style.display = 'none';
      }, 5000);
    }
  }
});
