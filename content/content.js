// Content script for DnD Beyond character pages
console.log('DnD Beyond to FoundryVTT content script loaded');

// Listen for messages from the popup
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getCharacterData') {
    try {
      const characterData = extractCharacterData();
      sendResponse({ success: true, data: characterData });
    } catch (error) {
      console.error('Error extracting character data:', error);
      sendResponse({ success: false, error: error.message });
    }
    return true; // Keep the message channel open for async response
  }
});

// Function to extract character data from the page
function extractCharacterData() {
  const data = {
    timestamp: new Date().toISOString(),
    url: window.location.href
  };

  // Try to get character ID from URL
  const urlMatch = window.location.pathname.match(/\/characters\/(\d+)/);
  if (urlMatch) {
    data.characterId = urlMatch[1];
  }

  // Try to extract character name
  const nameElement = document.querySelector('.ddbc-character-name') || 
                      document.querySelector('.ct-character-header__name') ||
                      document.querySelector('.ct-character-sheet__name');
  if (nameElement) {
    data.name = nameElement.textContent.trim();
  }

  // Try to extract character level
  const levelElement = document.querySelector('.ddbc-character-progression-summary__level') ||
                       document.querySelector('.ct-character-header-desktop__level') ||
                       document.querySelector('.ct-character-header-mobile__level');
  if (levelElement) {
    data.level = levelElement.textContent.trim();
  }

  // Try to extract race
  const raceElement = document.querySelector('.ddbc-character-summary__race') ||
                      document.querySelector('.ct-character-header-desktop__race') ||
                      document.querySelector('.ct-character-header-mobile__race');
  if (raceElement) {
    data.race = raceElement.textContent.trim();
  }

  // Try to extract class
  const classElement = document.querySelector('.ddbc-character-summary__classes') ||
                       document.querySelector('.ct-character-header-desktop__classes') ||
                       document.querySelector('.ct-character-header-mobile__classes');
  if (classElement) {
    data.class = classElement.textContent.trim();
  }

  // Try to extract ability scores
  data.abilities = {};
  const abilityNames = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
  
  abilityNames.forEach(ability => {
    const abilityElement = document.querySelector(`[data-ability="${ability}"]`) ||
                           document.querySelector(`.ct-ability-${ability}`);
    if (abilityElement) {
      const scoreElement = abilityElement.querySelector('.ddbc-ability-summary__primary') ||
                          abilityElement.querySelector('.ct-ability-summary__primary');
      const modifierElement = abilityElement.querySelector('.ddbc-ability-summary__modifier') ||
                             abilityElement.querySelector('.ct-ability-summary__modifier');
      
      if (scoreElement || modifierElement) {
        data.abilities[ability] = {
          score: scoreElement ? parseInt(scoreElement.textContent.trim()) : null,
          modifier: modifierElement ? modifierElement.textContent.trim() : null
        };
      }
    }
  });

  // Try to extract HP
  const hpElement = document.querySelector('.ct-health-summary__hp-number') ||
                    document.querySelector('.ddbc-health-summary__hp-number');
  if (hpElement) {
    data.hitPoints = hpElement.textContent.trim();
  }

  // Try to extract AC
  const acElement = document.querySelector('.ct-armor-class-box__value') ||
                    document.querySelector('.ddbc-armor-class-box__value');
  if (acElement) {
    data.armorClass = acElement.textContent.trim();
  }

  // Try to extract speed
  const speedElement = document.querySelector('.ct-speed-box__box-value') ||
                       document.querySelector('.ddbc-speed-box__box-value');
  if (speedElement) {
    data.speed = speedElement.textContent.trim();
  }

  // Try to get raw character data from the page's JavaScript context
  // DnD Beyond often stores character data in window.characterData or similar
  try {
    const scriptElements = document.querySelectorAll('script');
    for (const script of scriptElements) {
      const scriptContent = script.textContent;
      
      // Look for character data JSON
      if (scriptContent.includes('window.characterData') || 
          scriptContent.includes('character":') ||
          scriptContent.includes('"id":')) {
        
        // Try to extract JSON data
        const jsonMatch = scriptContent.match(/window\.characterData\s*=\s*({.+?});/s) ||
                         scriptContent.match(/"character":\s*({.+?})[,}]/s);
        
        if (jsonMatch && jsonMatch[1]) {
          try {
            const parsedData = JSON.parse(jsonMatch[1]);
            data.rawCharacterData = parsedData;
            break;
          } catch (e) {
            console.log('Failed to parse character JSON:', e);
          }
        }
      }
    }
  } catch (error) {
    console.log('Could not extract raw character data:', error);
  }

  // Add a note about the data
  data.note = 'This is extracted character data from DnD Beyond. For full functionality, you may need to use the DnD Beyond API with your cobalt cookie.';

  return data;
}
