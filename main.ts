/*
anime to obsidian plugin by xmoncocox
is a plugin who take data from jiikan api and create a page with the data
c'est un plugin qui prend les données de l'api jikan et crée une page avec les données

hello note from xmoncocox I'm a french student and is why my english is bad and all the comment are in french. but you can't pass the code to a translator if you want.
bonjour note de xmoncocox je suis un étudiant français mais j'ai codé avec les élément de l'ui en anglais mais les commentaires sont en français. vous pouvez passer le code dans un traducteur si vous voulez (mais en vrai si vous êtes la c'est que vous savez déjà parler anglais)
*/

import { App, Plugin, Modal, TFile, TFolder, Notice, requestUrl, RequestUrlParam, MarkdownView, FuzzySuggestModal, PluginSettingTab, Setting } from 'obsidian';
import * as moment from 'moment';
import { animeToObsidianSettings, DEFAULT_SETTINGS, animeToObsidianSettingsTab } from './settings';


const translations = {
    en: {
        addPageTitle: "Add a page for an anime",
        submitButton: "Submit",
        animeHistory: "Anime History",
        animeHistoryDescription1: "this page is for managing your anime list save (the one that can be use when building the checklist)",
        animeHistoryDescription2: "warning : the cross doesn't delete the file but delete the anime name in your history",
        createlist: "Create the list",
        noListError: "you need to enable the list in the settings or create it with the command 'create-anime-list'",
        addCharacterTitle: "Add character to anime",
        characterCreated: "Created character note: ",
        characterExists: "Character note already exists: ",
        importCharactersTitle: "Import Anime Characters",
        charactersImported: "Characters imported: ",
        noAnimeFound: "No anime found with name: "

    },
    fr: {
        addPageTitle: "Ajouter une page pour un anime",
        submitButton: "Soumettre",
        animeHistory: "Historique des animes",
        animeHistoryDescription1: "cette page est pour gérer votre historique de liste d'anime (celui qui peut être utilisé lors de la construction de la liste)",
        animeHistoryDescription2: "attention : la croix ne supprime pas le fichier mais supprime le nom de l'anime dans votre historique",
        createlist: "Créer la liste",
        noListError: "vous devez activer la liste dans les paramètres ou la créer avec la commande 'create-anime-list'",
        addCharacterTitle: "Ajouter un personnage à un anime",
        characterCreated: "Note de personnage créée : ",
        characterExists: "La note de personnage existe déjà : ",
        importCharactersTitle: "Importer les personnages de l'anime",
        charactersImported: "Personnages importés : ",
        noAnimeFound: "Aucun anime trouvé avec ce nom : "

    }
};

let currentlang = moment.locale();
if (currentlang !== 'en' && currentlang !== 'fr') {
    currentlang = 'en';
}
// translation function
function t(key: string) {
    // @ts-ignore - dynamic access based on current language
    const translation = (translations as any)[currentlang][key] || (translations as any)['en'][key];
    return translation || key;
}


// Créer une classe pour la modal
class TextPromptModal extends Modal {
    text: string = '';
    resolver: (value: string) => void;

    constructor(app) {
        super(app);
    }

    onOpen() {

        let { contentEl } = this;
        let title = contentEl.createEl('h2');
        title.textContent = t('addPageTitle');
        let textInput = contentEl.createEl('input', { type: 'text' });
        textInput.addEventListener('input', () => { this.text = textInput.value; });

        // Créer un bouton
        let submitButton = contentEl.createEl('button', { cls: 'mod-cta' });
        submitButton.textContent = t('submitButton');

        // Ajouter un gestionnaire d'événements click au bouton
        submitButton.addEventListener('click', () => {
            // Fermer la modal et résoudre la promesse avec la valeur de la zone de texte
            this.close();
            if (this.resolver) {
                this.resolver(this.text);
            }
        });
    }

    onClose() {
        let { contentEl } = this;
        contentEl.empty();
    }

    // Ajouter une méthode pour obtenir la valeur de la zone de texte
    getValue(): Promise<string> {
        return new Promise(resolve => {
            this.resolver = resolve;
        });
    }
};

class animeText {
    constructor() {

    }

    createText(animeData: any, animeName: string, aditionaltags: string, imageURL: string, template: string) {
        let text = template;
        let tags = this.createTags(animeData, animeName, aditionaltags, imageURL);

        text = text.replace('{{tags}}', tags);
        text = text.replace('{{title}}', animeName);
        text = text.replace('{{synopsis}}', animeData.synopsis);
        text = text.replace('{{image}}', imageURL);
        text = text.replace('{{url}}', animeData.url);

        return text;
    }

    createTags(data: any, animeName: string, aditionaltags: string, imageURL: string) {
        let fulltags = `image: ${imageURL}\n`
        let tags = "tags:\n";
        tags += `  - ${spaceremover(animeName)}\n`;
        if (aditionaltags) {
            aditionaltags.split(',').forEach(element => {
                // voir si il y a un espace dans le tag et le remplacer par un underscore
                element = spaceremover(element.trim());
                if (element) tags += `  - ${element}\n`;
            });
        }
        data.genres.forEach(element => {
            tags += `  - ${element.name}\n`;
        });
        data.themes.forEach(element => {
            tags += `  - ${element.name}\n`;
        });
        data.demographics.forEach(element => {
            tags += `  - ${element.name}\n`;
        });

        fulltags += tags
        //prendre les données de l'api et les mettre dans les tags du genre des thèmes et de la démographie
        return fulltags;
    }


};

class AnimeHistoryMoldal extends Modal {
    plugin: Plugin;
    constructor(app: App, plugin: Plugin) {
        super(app);
        this.modalEl.addClass('anime-history-modal');
        this.plugin = plugin;
    }

    onOpen() {
        let { contentEl } = this;

        let title = contentEl.createEl('h2');
        title.textContent = t('animeHistory');

        let description = contentEl.createEl('p', { cls: 'description' });
        description.textContent = t('animeHistoryDescription1');

        description = contentEl.createEl('p', { cls: 'avertissement' });
        description.textContent = t('animeHistoryDescription2');

        let list = contentEl.createEl('ul');
        let history = (this.plugin.settings as animeToObsidianSettings).animes_history || [];

        history.forEach(item => {
            let listItem = list.createEl('li', { cls: 'history-item' });
            listItem.textContent = item + " ";
            // Ajouter un bouton de suppression pour chaque élément de l'historique
            let deleteButton = listItem.createEl('button', { cls: 'delete-button' });
            deleteButton.textContent = 'X';
            deleteButton.addEventListener('click', () => {
                // Supprimer l'élément de l'historique
                const index = history.indexOf(item);
                if (index > -1) {
                    history.splice(index, 1);
                }
                // Enregistrer les paramètres mis à jour
                this.plugin.saveSettings();
                // Mettre à jour l'affichage de la modal
                contentEl.empty();
                this.onOpen();
            });
        });
    }

    onClose() {
        let { contentEl } = this;
        contentEl.empty();
    }
}

export default class animeToObsidian extends Plugin {
    settings: animeToObsidianSettings;

    async onload() {
        await this.loadSettings();

        this.addCommand({
            id: 'open-anime-history',
            name: t('animeHistory'),
            callback: async () => {
                let modal = new AnimeHistoryMoldal(this.app, this);
                modal.open();
            },
        });

        this.addCommand({
            id: 'create-anime-list',
            name: t('createlist'),
            callback: async () => {
                if (!(this.settings as animeToObsidianSettings).list) {
                    new Notice("you need to enable the list in the settings");
                    return;
                }

                let filePath = (this.settings as animeToObsidianSettings).listPath + "/" + (this.settings as animeToObsidianSettings).listname + ".md";

                // Vérifier si le fichier existe déjà
                if (await this.app.vault.adapter.exists(filePath)) {
                    new Notice("File already exists. Deleting the existing file.");
                    // Supprimer le fichier existant
                    await this.app.vault.adapter.remove(filePath);
                }

                let history = (this.settings as animeToObsidianSettings).animes_history || [];
                let text = "";
                history.forEach(element => {
                    text += `- [ ] [[${element}]]\n`;
                });
                let file = await this.app.vault.create((this.settings as animeToObsidianSettings).listPath + "/" + (this.settings as animeToObsidianSettings).listname + ".md", text);
                let leaf = this.app.workspace.getLeaf();
                await leaf.openFile(file);
            },
        });

        this.addCommand({
            id: 'submit-anime',
            name: t('addPageTitle'),
            callback: async () => {
                // Afficher une boîte de dialogue pour entrer le titre
                let modal = new TextPromptModal(this.app);
                modal.open();

                // Attendre que l'utilisateur ferme la modal et obtenir la valeur de la zone de texte
                let value = await modal.getValue();


                if (value != "") {
                    const history = (this.settings as animeToObsidianSettings).animes_history || [];
                    history.push(value);
                    (this.settings as animeToObsidianSettings).animes_history = history;

                    // Enregistrer les paramètres mis à jour
                    await this.saveSettings();

                    if ((this.settings as animeToObsidianSettings).list && await this.app.vault.adapter.exists((this.settings as animeToObsidianSettings).listPath + "/" + (this.settings as animeToObsidianSettings).listname + ".md")) {
                        let file = await this.app.vault.getAbstractFileByPath((this.settings as animeToObsidianSettings).listPath + "/" + (this.settings as animeToObsidianSettings).listname + ".md");
                        let content = await this.app.vault.read(file);
                        content += `- [ ] [[${value}]]\n`;
                        await this.app.vault.modify(file, content);
                    } else {
                        new Notice(t('noListError'));
                    }
                    // Créer un nouveau fichier Markdown avec le titre comme nom de fichier
                    let filePath = (this.settings as animeToObsidianSettings).basePath + "/" + value + '.md';
                    let file = await this.app.vault.create(filePath, '');

                    // Créer un nouvel onglet et ouvrir le fichier dans cet onglet
                    let leaf = this.app.workspace.getLeaf();
                    await leaf.openFile(file);

                    // Obtenir l'éditeur du fichier actuellement ouvert
                    if (leaf.view instanceof MarkdownView) {
                        let editor = leaf.view.editor;
                        // Remplacer le texte de l'éditeur
                        let text = new animeText();
                        let data = await getAnimeData(value)
                        editor.setValue(text.createText(data, value, (this.settings as animeToObsidianSettings).additionalTags, data.images.jpg.image_url, (this.settings as animeToObsidianSettings).template));
                    }


                } else {
                    new Notice("did you type nothing ? (error : variable is empty)");
                }

            },
        });

        this.addCommand({
            id: 'add-character',
            name: t('addCharacterTitle'),
            callback: async () => {
                let modal = new TextPromptModal(this.app);
                modal.open();
                let animeName = await modal.getValue();

                if (animeName) {
                    const animeData = await getAnimeData(animeName);
                    if (animeData) {
                        const characters = await getAnimeCharacters(animeData.mal_id);
                        new CharacterSuggestModal(this.app, characters, async (char) => {
                            const basePath = (this.settings as animeToObsidianSettings).basePath;
                            const animeFolder = `${basePath}/${animeName}`;

                            if (!(await this.app.vault.adapter.exists(animeFolder))) {
                                await this.app.vault.createFolder(animeFolder);
                            }

                            const charName = spaceremover(char.character.name);
                            const charFile = `${animeFolder}/${charName}.md`;

                            let content = (this.settings as animeToObsidianSettings).characterTemplate;
                            content = content.replace('{{name}}', char.character.name);
                            content = content.replace('{{image}}', char.character.images.jpg.image_url);
                            content = content.replace('{{anime}}', animeName);
                            content = content.replace('{{animeTag}}', spaceremover(animeName));
                            content = content.replace('{{url}}', char.character.url);

                            if (!(await this.app.vault.adapter.exists(charFile))) {
                                await this.app.vault.create(charFile, content);
                                new Notice(`${t('characterCreated')}${charName}`);
                            } else {
                                new Notice(`${t('characterExists')}${charName}`);
                            }
                        }).open();
                    }
                }
            }
        });

        this.addCommand({
            id: 'import-characters',
            name: t('importCharactersTitle'),
            callback: async () => {
                const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
                if (!activeView || !activeView.file) {
                    new Notice("Please open an Anime note first.");
                    return;
                }

                const animeName = activeView.file.basename;
                const animeData = await getAnimeData(animeName);

                if (!animeData) {
                    new Notice(`${t('noAnimeFound')}${animeName}`);
                    return;
                }

                const characters = await getAnimeCharacters(animeData.mal_id);
                const roleFilter = (this.settings as animeToObsidianSettings).characterRoleFilter;

                const filteredCharacters = characters.filter((char: any) => {
                    if (roleFilter === 'all') return true;
                    return char.role === roleFilter;
                });

                const charactersPath = (this.settings as animeToObsidianSettings).charactersPath;
                const animeFolder = `${charactersPath}/${animeName}`;

                if (!(await this.app.vault.adapter.exists(animeFolder))) {
                    await this.app.vault.createFolder(animeFolder);
                }

                let appendedLinks = "\n\n## Characters\n";

                for (const char of filteredCharacters) {
                    const charName = spaceremover(char.character.name);
                    const charFile = `${animeFolder}/${charName}.md`;

                    // Get Japanese Voice Actor
                    const japaneseVA = char.voice_actors.find((va: any) => va.language === "Japanese");
                    const voiceActorName = japaneseVA ? japaneseVA.person.name : "Unknown";

                    let content = (this.settings as animeToObsidianSettings).characterTemplate;
                    content = content.replace('{{name}}', char.character.name);
                    content = content.replace('{{image}}', char.character.images.jpg.image_url);
                    content = content.replace('{{anime}}', animeName);
                    content = content.replace('{{animeTag}}', spaceremover(animeName));
                    content = content.replace('{{url}}', char.character.url);
                    content = content.replace('{{role}}', char.role);
                    content = content.replace('{{voice_actor}}', voiceActorName);

                    if (!(await this.app.vault.adapter.exists(charFile))) {
                        await this.app.vault.create(charFile, content);
                    }

                    appendedLinks += `- [[${charName}|${char.character.name}]]\n`;
                }

                // Create .bases file
                const basesFile = `${animeFolder}/${animeName}.bases`;
                const basesContent = `views:
  - type: cards
    name: Table
    filters:
      and:
        - file.folder == "${animeFolder}"
    image: note.image
    imageFit: contain
    imageAspectRatio: 1.35
`;

                if (!(await this.app.vault.adapter.exists(basesFile))) {
                    await this.app.vault.create(basesFile, basesContent);
                }

                const editor = activeView.editor;
                editor.replaceRange(appendedLinks, { line: editor.lineCount(), ch: 0 });

                new Notice(`${t('charactersImported')}${filteredCharacters.length}`);
            }
        });

        this.addSettingTab(new animeToObsidianSettingsTab(this.app, this));
    }

    async onunload() {
        // Code à exécuter lorsque l'extension est déchargée
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}




function spaceremover(text: string) {
    let newtext = "";
    for (let i = 0; i < text.length; i++) {
        if (text[i] == " ") {
            newtext += "_";
        } else {
            newtext += text[i];
        }
    }
    return newtext;
}

async function getAnimeData(animeName: string) {
    const request: RequestUrlParam = {
        url: `https://api.jikan.moe/v4/anime?q=${animeName}&limit=1`,
        method: 'GET',
    };

    try {
        const response = await requestUrl(request);

        if (response.status !== 200) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }


        return response.json.data[0];
    } catch (error) {
        console.error(`Failed to fetch anime data: ${error.message}`);
    }

}

async function getAnimeCharacters(animeId: number) {
    const request: RequestUrlParam = {
        url: `https://api.jikan.moe/v4/anime/${animeId}/characters`,
        method: 'GET',
    };

    try {
        const response = await requestUrl(request);

        if (response.status !== 200) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json.data;
    } catch (error) {
        console.error(`Failed to fetch anime characters: ${error.message}`);
    }
}

class CharacterSuggestModal extends FuzzySuggestModal<any> {
    characters: any[];
    onChoose: (character: any) => void;

    constructor(app: App, characters: any[], onChoose: (character: any) => void) {
        super(app);
        this.characters = characters;
        this.onChoose = onChoose;
    }

    getItems(): any[] {
        return this.characters;
    }

    getItemText(item: any): string {
        return item.character.name;
    }

    onChooseItem(item: any, evt: MouseEvent | KeyboardEvent) {
        this.onChoose(item);
    }
}