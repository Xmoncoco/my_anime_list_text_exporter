/*
anime to obsidian plugin by xmoncocox
is a plugin who take data from jiikan api and create a page with the data
c'est un plugin qui prend les données de l'api jikan et crée une page avec les données

hello note from xmoncocox I'm a french student and is why my english is bad and all the comment are in french. but you can't pass the code to a translator if you want.
bonjour note de xmoncocox je suis un étudiant français mais j'ai codé avec les élément de l'ui en anglais mais les commentaires sont en français. vous pouvez passer le code dans un traducteur si vous voulez (mais en vrai si vous êtes la c'est que vous savez déjà parler anglais)
*/

import axios from 'axios';
import { Plugin, Modal, TFile, Notice } from 'obsidian';

//temporaire pour avoir une configuration de tag suplémentaire
let aditionaltags = {
	tags :["anime", "culture"],
}
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
}
 
class animeText{
	constructor(){

	}

	createText(animeData: JSON, animeName: string, aditionaltags: JSON){
		let text = "";
		text += "---\n" + this.createTags(animeData,animeName, aditionaltags)+ "---\n";

		return text;
	}

	createTags(data : JSON ,animeName: string, aditionaltags: JSON){
		let tags ="tags:\n";
		tags += `  - ${animeName.replace(" ","_")}\n`;
		aditionaltags.tags.forEach(element => {
			// voir si il y a un espace dans le tag et le remplacer par un underscore
			element = element.replace(" ", "_");
			console.log(element);
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
	

}
export default class EmptyPlugin extends Plugin {
    async onload() {
        this.addCommand({
            id: 'submit-anime',
            name: 'add a page for an anime',
            callback: async () => {
                // Afficher une boîte de dialogue pour entrer le titre
                let modal = new TextPromptModal(this.app);
                modal.open();

                // Attendre que l'utilisateur ferme la modal et obtenir la valeur de la zone de texte
                let value = await modal.getValue();

                console.log(value);
				if(value != ""){
					// Créer un nouveau fichier Markdown avec le titre comme nom de fichier
					let filePath = value + '.md';
					let file = await this.app.vault.create(filePath, '');

					// Créer un nouvel onglet et ouvrir le fichier dans cet onglet
					let leaf = this.app.workspace.activeLeaf;
					await leaf.openFile(file);

					// Obtenir l'éditeur du fichier actuellement ouvert
					let editor = leaf.view.sourceMode.cmEditor;

					// Remplacer le texte de l'éditeur
					let text = new animeText();
					console.log(text.createText(await getAnimeData(value), value, aditionaltags));
					editor.setValue(text.createText(await getAnimeData(value), value, aditionaltags));
				} else {
					new Notice("did you type nothing ? (error : variable is empty)");
				}

            },
        });
    }

    async onunload() {
        // Code à exécuter lorsque l'extension est déchargée
    }
}


async function getAnimeData(animeName: string) {
    const url = `https://api.jikan.moe/v4/anime?q=${animeName}&limit=1`;

    try {
        const response = await axios.get(url);

        if (response.status !== 200) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log(response.data.data[0]);
        return response.data.data[0];
    } catch (error) {
        console.error(`Failed to fetch anime data: ${error.message}`);
    }
}