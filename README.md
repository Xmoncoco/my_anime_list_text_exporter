# My Anime List to Obsidian
This plugin creates a page in Obsidian from your anime list.

## road map

- [x] have a link to jikan
- [x] create a page for each anime
- [ ] add settings to the plugin (the path to the anime list, chose what tags to add, create a custom template)
- [x] add tags to each page with the data
- [ ] add a synosis to each page
- [ ] add a link to the anime page
- [ ] add character to the page

## build

```bash
git clone https://github.com/Xmoncoco/my_anime_list_to_obsidian.git
cd my_anime_list_to_obsidian
npm install
npm run dev
```
## Installation
### From Obsidian comunity plugin page (Recommended) (not yet available)
1. Open Obsidian
2. Go to Settings > Third-party plugin
3. Make sure Safe mode is **off**
4. Click Browse community plugins
5. Search for "My Anime List to Obsidian"

### From GitHub code.
1. Download the latest release from the [GitHub releases page]
2. Extract the zip archive in `<vault>/.obsidian/plugins/` so that the `main.js` file is located in `<vault>/.obsidian/plugins/my_anime_list_to_obsidian/`
3. remove all the files exept the 'main.js' and the 'manifest.json' files
4. go to obsidian
5. go to settings > plugins
6. activate the plugin

## Usage

1. open the commad palette (ctrl + p or cmd + p)
2. search for "add a page for an anime"
3. enter the name of the anime
4. click sumbit.
and that's it.

## Contributing

Contributions are welcome! If you have a feature request, bug report, or want to improve the plugin, feel free to fork the repository and submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.