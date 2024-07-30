/*
anime to obsidian plugin by xmoncocox
is a plugin who take data from jiikan api and create a page with the data
c'est un plugin qui prend les données de l'api jikan et crée une page avec les données

hello note from xmoncocox I'm a french student and is why my english is bad and all the comment are in french. but you can't pass the code to a translator if you want.
bonjour note de xmoncocox je suis un étudiant français mais j'ai codé avec les élément de l'ui en anglais mais les commentaires sont en français. vous pouvez passer le code dans un traducteur si vous voulez (mais en vrai si vous êtes la c'est que vous savez déjà parler anglais)
*/

import { Plugin, Modal, TFile, TFolder, Notice, requestUrl, RequestUrlParam, MarkdownView } from 'obsidian';
import {animeToObsidianSettings, DEFAULT_SETTINGS, animeToObsidianSettingsTab} from './settings';


const translations = {
    en: {
      addPageTitle: "Add a page for an anime",
      submitButton: "Submit",
      animeHistory: "Anime History",
      animeHistoryDescription1:"this page is for managing your anime list save (the one that can be use when building the checklist)",
      animeHistoryDescription2: "warning : the cross doesn't delete the file but delete the anime name in your history",
      createlist: "Create the list",
      noListError: "you need to enable the list in the settings or create it with the command 'create-anime-list'"

    },
    fr: {
      addPageTitle: "Ajouter une page pour un anime",
      submitButton: "Soumettre",
      animeHistory: "Historique des animes",
      animeHistoryDescription1:"cette page est pour gérer votre historique de liste d'anime (celui qui peut être utilisé lors de la construction de la liste)",
      animeHistoryDescription2: "attention : la croix ne supprime pas le fichier mais supprime le nom de l'anime dans votre historique",
      createlist: "Créer la liste",
    noListError: "vous devez activer la liste dans les paramètres ou la créer avec la commande 'create-anime-list'"

    }
  };

  let currentlang = moment.locale();
  if (currentlang !== 'en' && currentlang !== 'fr') {
    currentlang = 'en';
  }
  // translation function 
  function t(key) {
    const translation = translations[currentlang][key] || translations['en'][key];
    return translation || key;
  }
  
//temporaire pour avoir une configuration de tag suplémentaire
let aditionaltags = {
	tags :["anime", "culture"],
};
 
// Créer une classe pour la modal
class TextPromptModal extends Modal {
    text: string = '';
    resolver: (value: string) => void;

    constructor(app) {
        super(app);
    }

    onOpen() {
        
        let {contentEl} = this;
		let title = contentEl.createEl('h2');
		title.textContent = t('addPageTitle');
        let textInput = contentEl.createEl('input', {type: 'text'});
        textInput.addEventListener('input', () => { this.text = textInput.value; });

        // Créer un bouton
        let submitButton = contentEl.createEl('button', {cls: 'mod-cta'});
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
        let {contentEl} = this;
        contentEl.empty();
    }

    // Ajouter une méthode pour obtenir la valeur de la zone de texte
    getValue(): Promise<string> {
        return new Promise(resolve => {
            this.resolver = resolve;
        });
    }
};

class animeText{
	constructor(){

	}

	createText(animeData: JSON, animeName: string, aditionaltags: JSON){
		let text = "";
		text += "---\n" + this.createTags(animeData,animeName, aditionaltags)+ "---\n";
        text += `# description: \n ${animeData.synopsis}\n`;

		return text;
	}

	createTags(data : JSON ,animeName: string, aditionaltags: JSON){
		let tags ="tags:\n";
		tags += `  - ${spaceremover(animeName)}\n`;
		aditionaltags.tags.forEach(element => {
			// voir si il y a un espace dans le tag et le remplacer par un underscore
			element = spaceremover(element);
			tags += `  - ${element}\n`;
		});
		data.genres.forEach(element => {
			tags += `  - ${element.name}\n`;
		});
		data.themes.forEach(element => {
			tags += `  - ${element.name}\n`;
		});
		data.demographics.forEach(element => {
			tags += `  - ${element.name}\n`;
		});
		

		//prendre les données de l'api et les mettre dans les tags du genre des thèmes et de la démographie
		return tags;
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
        let {contentEl} = this;

        let title = contentEl.createEl('h2');
        title.textContent = t('animeHistory');

        let description = contentEl.createEl('p', {cls: 'description'});
        description.textContent = t('animeHistoryDescription1');

        description = contentEl.createEl('p', {cls: 'avertissement'});
        description.textContent = t('animeHistoryDescription2');

        let list = contentEl.createEl('ul');
        let history = (this.plugin.settings as animeToObsidianSettings).anime_history || [];

        history.forEach(item => {
            let listItem = list.createEl('li', {cls: 'history-item'});
            listItem.textContent = item + " ";
            // Ajouter un bouton de suppression pour chaque élément de l'historique
            let deleteButton = listItem.createEl('button', {cls: 'delete-button'});
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
        let {contentEl} = this;
        contentEl.empty();
    }
}

export default class animeToObsidian extends Plugin {
    settings: animeToObsidianSettings | unknown;

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

                let history = (this.settings as animeToObsidianSettings).anime_history || [];
                let text = "";
                history.forEach(element => {
                    text += `- [ ] [[${element}]]\n`;
                });
                let file = await this.app.vault.create((this.settings as animeToObsidianSettings).listPath + "/"+ (this.settings as animeToObsidianSettings).listname + ".md", text);
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


				if(value != ""){
                    const history = (this.settings as animeToObsidianSettings).anime_history || [];
                    history.push(value);
                    (this.settings as animeToObsidianSettings).anime_history = history;

                    // Enregistrer les paramètres mis à jour
                    await this.saveSettings();
                    
                    if((this.settings as animeToObsidianSettings).list && await this.app.vault.adapter.exists((this.settings as animeToObsidianSettings).listPath + "/" + (this.settings as animeToObsidianSettings).listname + ".md")){
                        let file = await this.app.vault.getAbstractFileByPath((this.settings as animeToObsidianSettings).listPath + "/" + (this.settings as animeToObsidianSettings).listname + ".md");
                        let content = await this.app.vault.read(file);
                        content += `- [ ] [[${value}]]\n`;
                        await this.app.vault.modify(file, content);
                    }else{
                        new Notice(t('noListError'));
                    }
					// Créer un nouveau fichier Markdown avec le titre comme nom de fichier
                    let filePath = (this.settings as animeToObsidianSettings).basePath + "/" + value + '.md';
                    let file = await this.app.vault.create(filePath, '');

                    // Créer un nouvel onglet et ouvrir le fichier dans cet onglet
                    let leaf = this.app.workspace.getLeaf();
                    await leaf.openFile(file);

                    // Obtenir l'éditeur du fichier actuellement ouvert
                    if(leaf.view instanceof MarkdownView) {
                        let editor = leaf.view.editor;
                        // Remplacer le texte de l'éditeur
                        let text = new animeText();
                        editor.setValue(text.createText(await getAnimeData(value), value, aditionaltags));
                    }


				} else {
					new Notice("did you type nothing ? (error : variable is empty)");
				}

            },
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




function spaceremover(text: string){
    let newtext = "";
    for (let i = 0; i < text.length; i++) {
        if(text[i] == " "){
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