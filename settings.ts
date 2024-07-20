import { App, PluginSettingTab, Setting } from 'obsidian';
import animeToObsidian from './main';
import {ls} from './filefinder'


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

export interface animeToObsidianSettings {
  basePath: string;
  list : boolean;
  listPath: string;

}

export const DEFAULT_SETTINGS: animeToObsidianSettings = {
  basePath: '',
  list: false,
  listPath: '',

}


export class animeToObsidianSettingsTab extends PluginSettingTab {
    plugin: animeToObsidian;
  
    constructor(app: App, plugin: animeToObsidian) {
      super(app, plugin);
      this.plugin = plugin;
    }
  
    display(): void {
      let {containerEl} = this;
  
      containerEl.empty();
  

      const options = ls(this.app,"folder");
  
      new Setting(containerEl)
        .setName(t('basePath'))
        .setDesc(t('basePathDesc'))
        .addDropdown(dropdown => {
          dropdown.addOption('', t('selectBasePath'));
          options.forEach(option => {
            dropdown.addOption(option, option);
          });
          dropdown.setValue(this.plugin.settings.basePath);
          dropdown.onChange(async (value) => {
            this.plugin.settings.basePath = value;
            await this.plugin.saveSettings();
          });
        });
      /*
        new Setting(containerEl)
          .setName(t('checklist'))
          .setDesc(t('checklistDesc'))
          .addToggle(toggle => {
            toggle.setValue(this.plugin.settings.list);
            toggle.onChange(async (value) => {
              this.plugin.settings.list = value;
              await this.plugin.saveSettings();
            });
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
            dropdown.onChange(async (value) => {
              this.plugin.settings.listPath = value;
              await this.plugin.saveSettings();
            });
          });
      */
    }
  }