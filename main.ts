/*
anime to obsidian plugin by xmoncocox
is a plugin who take data from jiikan api and create a page with the data
c'est un plugin qui prend les données de l'api jikan et crée une page avec les données

hello note from xmoncocox I'm a french student and is why my english is bad and all the comment are in french. but you can't pass the code to a translator if you want.
bonjour note de xmoncocox je suis un étudiant français mais j'ai codé avec les élément de l'ui en anglais mais les commentaires sont en français. vous pouvez passer le code dans un traducteur si vous voulez (mais en vrai si vous êtes la c'est que vous savez déjà parler anglais)
*/

import { Plugin, Modal, TFile, TFolder, Notice, requestUrl, RequestUrlParam, MarkdownView } from 'obsidian';
import {animeToObsidianSettings, DEFAULT_SETTINGS, animeToObsidianSettingsTab} from './settings';


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
		title.textContent = "add a page for an anime";
        let textInput = contentEl.createEl('input', {type: 'text'});
        textInput.addEventListener('input', () => { this.text = textInput.value; });

        // Créer un bouton
        let submitButton = contentEl.createEl('button');
        submitButton.textContent = 'Submit';

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
export default class animeToObsidian extends Plugin {
    settings: animeToObsidianSettings | unknown;

    async onload() {
        
        await this.loadSettings();
        this.addCommand({
            id: 'submit-anime',
            name: 'Create note for anime',
            callback: async () => {
                // Afficher une boîte de dialogue pour entrer le titre
                let modal = new TextPromptModal(this.app);
                modal.open();

                // Attendre que l'utilisateur ferme la modal et obtenir la valeur de la zone de texte
                let value = await modal.getValue();

				if(value != ""){
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