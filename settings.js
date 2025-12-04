import { __awaiter } from "tslib";
import * as moment from 'moment';
import { PluginSettingTab, Setting } from 'obsidian';
import { ls } from './filefinder';
const translations = {
    en: {
        basePath: 'Base Path',
        basePathDesc: 'The base path for your anime list',
        checklist: 'Checklist',
        checklistDesc: 'Do you want to list your anime?',
        checklistPath: 'Checklist Path',
        checklistPathDesc: 'The path where you want to checklist your anime',
        selectBasePath: 'Select a base path',
        selectListPath: 'Select a list path',
        listname: 'anime list',
        additionalTags: 'Additional Tags',
        additionalTagsDesc: 'Tags to add to each anime page (comma separated)',
        template: 'Template',
        templateDesc: 'Template for the anime note. Available placeholders: {{title}}, {{synopsis}}, {{image}}, {{tags}}, {{url}}',
    },
    fr: {
        basePath: 'Chemin de base',
        basePathDesc: 'Le chemin de base pour votre liste d\'anime',
        checklist: 'Liste des animes',
        checklistDesc: 'Voulez-vous lister vos animes dans un fichier ?',
        checklistPath: 'Chemin de la liste',
        checklistPathDesc: 'Le chemin où vous voulez lister vos animes',
        selectBasePath: 'Sélectionnez un chemin de base',
        selectListPath: 'Sélectionnez un chemin de liste',
        listname: 'liste d\'anime',
        additionalTags: 'Tags supplémentaires',
        additionalTagsDesc: 'Tags à ajouter à chaque page d\'anime (séparés par des virgules)',
        template: 'Modèle',
        templateDesc: 'Modèle pour la note d\'anime. Espaces réservés disponibles : {{title}}, {{synopsis}}, {{image}}, {{tags}}, {{url}}',
    }
};
let currentlang = moment.locale();
if (currentlang !== 'en' && currentlang !== 'fr') {
    currentlang = 'en';
}
// translation function
function t(key) {
    // @ts-ignore - dynamic key indexing
    const translation = translations[currentlang][key] || translations['en'][key];
    return translation || key;
}
export const DEFAULT_SETTINGS = {
    basePath: '',
    list: false,
    listPath: '',
    animes_history: [],
    listname: t('listname'),
    additionalTags: 'anime, culture',
    template: `---
{{tags}}---
# description: 
{{synopsis}}

[MyAnimeList Page]({{url}})
`
};
export class animeToObsidianSettingsTab extends PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        let { containerEl } = this;
        containerEl.empty();
        const options = ls(this.app, "folder");
        new Setting(containerEl)
            .setName(t('basePath'))
            .setDesc(t('basePathDesc'))
            .addDropdown(dropdown => {
            dropdown.addOption('', t('selectBasePath'));
            options.forEach(option => {
                dropdown.addOption(option, option);
            });
            dropdown.setValue(this.plugin.settings.basePath);
            dropdown.onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.basePath = value;
                yield this.plugin.saveSettings();
            }));
        });
        new Setting(containerEl)
            .setName(t('checklist'))
            .setDesc(t('checklistDesc'))
            .addToggle(toggle => {
            toggle.setValue(this.plugin.settings.list);
            toggle.onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.list = value;
                yield this.plugin.saveSettings();
            }));
        });
        new Setting(containerEl)
            .setName(t('checklistPath'))
            .setDesc(t('checklistPathDesc'))
            .addDropdown(dropdown => {
            dropdown.addOption('', t('selectListPath'));
            options.forEach(option => {
                dropdown.addOption(option, option);
            });
            dropdown.setValue(this.plugin.settings.listPath);
            dropdown.onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.listPath = value;
                yield this.plugin.saveSettings();
            }));
        });
        new Setting(containerEl)
            .setName(t('listname'))
            .setDesc(t('listname'))
            .addText(text => {
            text.setPlaceholder(t('listname'))
                .setValue(this.plugin.settings.listname)
                .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.listname = value;
                yield this.plugin.saveSettings();
            }));
        });
        new Setting(containerEl)
            .setName(t('additionalTags'))
            .setDesc(t('additionalTagsDesc'))
            .addText(text => {
            text.setPlaceholder('anime, culture')
                .setValue(this.plugin.settings.additionalTags)
                .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.additionalTags = value;
                yield this.plugin.saveSettings();
            }));
        });
        new Setting(containerEl)
            .setName(t('template'))
            .setDesc(t('templateDesc'))
            .addTextArea(text => {
            text.setPlaceholder('...')
                .setValue(this.plugin.settings.template)
                .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.template = value;
                yield this.plugin.saveSettings();
            }));
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZXR0aW5ncy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxLQUFLLE1BQU0sTUFBTSxRQUFRLENBQUM7QUFFakMsT0FBTyxFQUFPLGdCQUFnQixFQUFFLE9BQU8sRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUMxRCxPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sY0FBYyxDQUFBO0FBR2pDLE1BQU0sWUFBWSxHQUFHO0lBQ25CLEVBQUUsRUFBRTtRQUNGLFFBQVEsRUFBRSxXQUFXO1FBQ3JCLFlBQVksRUFBRSxtQ0FBbUM7UUFDakQsU0FBUyxFQUFFLFdBQVc7UUFDdEIsYUFBYSxFQUFFLGlDQUFpQztRQUNoRCxhQUFhLEVBQUUsZ0JBQWdCO1FBQy9CLGlCQUFpQixFQUFFLGlEQUFpRDtRQUNwRSxjQUFjLEVBQUUsb0JBQW9CO1FBQ3BDLGNBQWMsRUFBRSxvQkFBb0I7UUFDcEMsUUFBUSxFQUFFLFlBQVk7UUFDdEIsY0FBYyxFQUFFLGlCQUFpQjtRQUNqQyxrQkFBa0IsRUFBRSxrREFBa0Q7UUFDdEUsUUFBUSxFQUFFLFVBQVU7UUFDcEIsWUFBWSxFQUFFLDRHQUE0RztLQUMzSDtJQUNELEVBQUUsRUFBRTtRQUNGLFFBQVEsRUFBRSxnQkFBZ0I7UUFDMUIsWUFBWSxFQUFFLDZDQUE2QztRQUMzRCxTQUFTLEVBQUUsa0JBQWtCO1FBQzdCLGFBQWEsRUFBRSxpREFBaUQ7UUFDaEUsYUFBYSxFQUFFLG9CQUFvQjtRQUNuQyxpQkFBaUIsRUFBRSw0Q0FBNEM7UUFDL0QsY0FBYyxFQUFFLGdDQUFnQztRQUNoRCxjQUFjLEVBQUUsaUNBQWlDO1FBQ2pELFFBQVEsRUFBRSxnQkFBZ0I7UUFDMUIsY0FBYyxFQUFFLHNCQUFzQjtRQUN0QyxrQkFBa0IsRUFBRSxrRUFBa0U7UUFDdEYsUUFBUSxFQUFFLFFBQVE7UUFDbEIsWUFBWSxFQUFFLG9IQUFvSDtLQUNuSTtDQUNGLENBQUM7QUFF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