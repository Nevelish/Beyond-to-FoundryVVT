# Beyond-to-FoundryVVT

A Firefox extension for importing characters from DnD Beyond into FoundryVTT with ease.

## Features

- **Easy Cobalt Cookie Copy**: Copy your DnD Beyond authentication cookie with a single click
- **Character Data Export**: Extract character information from DnD Beyond character pages
- **Simple Interface**: Clean, user-friendly popup interface
- **Context Menu Integration**: Right-click on DnD Beyond pages for quick access

## Installation

### From Source

1. Clone this repository:
   ```bash
   git clone https://github.com/Nevelish/Beyond-to-FoundryVVT.git
   cd Beyond-to-FoundryVVT
   ```

2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`

3. Click "Load Temporary Add-on"

4. Navigate to the extension directory and select the `manifest.json` file

The extension will now be installed and active!

### From Firefox Add-ons (Coming Soon)

The extension will be available on the Firefox Add-ons store once published.

## Usage

### Copying the Cobalt Cookie

1. Make sure you're logged in to [DnD Beyond](https://www.dndbeyond.com)
2. Click the extension icon in your Firefox toolbar
3. Click "Copy Cobalt Cookie" button
4. The cookie will be copied to your clipboard

### Copying Character Data

1. Navigate to a character page on DnD Beyond (e.g., `https://www.dndbeyond.com/characters/12345`)
2. Click the extension icon in your Firefox toolbar
3. Click "Copy Character Data" button
4. The character data will be extracted and copied to your clipboard as JSON

### Using with FoundryVTT

1. Copy the cobalt cookie using the extension
2. Copy the character data using the extension
3. In FoundryVTT, use your preferred import module (like VTTA Beyond or DDB Importer)
4. Paste the cobalt cookie when prompted for authentication
5. Paste or import the character data

## Development

### Project Structure

```
Beyond-to-FoundryVVT/
├── manifest.json          # Extension manifest
├── popup/                 # Extension popup UI
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── content/               # Content scripts
│   └── content.js
├── background/            # Background scripts
│   └── background.js
└── icons/                 # Extension icons
    ├── icon-48.png
    └── icon-96.png
```

### Building

No build step is required! The extension runs directly from source.

### Testing

1. Load the extension in Firefox using the installation instructions above
2. Navigate to DnD Beyond and log in
3. Test the cobalt cookie copy functionality
4. Navigate to a character page and test the character data extraction

## Permissions

The extension requires the following permissions:

- `cookies`: To access the DnD Beyond cobalt cookie
- `activeTab`: To interact with the current tab
- `clipboardWrite`: To copy data to the clipboard
- `*://*.dndbeyond.com/*`: To access DnD Beyond pages

## Privacy

This extension:
- Only accesses data from DnD Beyond domains
- Does not send any data to external servers
- Only copies data to your clipboard when you explicitly click the buttons
- Stores no user data

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

See [LICENSE](LICENSE) file for details.

## Disclaimer

This extension is not affiliated with, endorsed by, or sponsored by Wizards of the Coast or D&D Beyond. All D&D Beyond trademarks and copyrights are owned by Wizards of the Coast.

## Support

If you encounter any issues or have suggestions, please [open an issue](https://github.com/Nevelish/Beyond-to-FoundryVVT/issues) on GitHub.