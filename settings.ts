import * as moment from 'moment';
import animeToObsidian from './main';
import { App, PluginSettingTab, Setting } from 'obsidian';
import { ls } from './filefinder'


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
    characterTemplate: 'Character Template',
    characterTemplateDesc: 'Template for the character note. Available placeholders: {{name}}, {{image}}, {{anime}}, {{animeTag}}, {{url}}, {{role}}, {{voice_actor}}',
    charactersPath: 'Characters Folder',
    charactersPathDesc: 'The folder where character notes will be created (e.g. "Characters")',
    characterRoleFilter: 'Character Role Filter',
    characterRoleFilterDesc: 'Filter which characters to import based on their role',
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
    characterTemplate: 'Modèle de personnage',
    characterTemplateDesc: 'Modèle pour la note de personnage. Espaces réservés disponibles : {{name}}, {{image}}, {{anime}}, {{animeTag}}, {{url}}, {{role}}, {{voice_actor}}',
    charactersPath: 'Dossier des personnages',
    charactersPathDesc: 'Le dossier où les notes de personnage seront créées (par exemple "Personnages")',
    characterRoleFilter: 'Filtre de rôle des personnages',
    characterRoleFilterDesc: 'Filtrer les personnages à importer en fonction de leur rôle',
  }
};

let currentlang = moment.locale();
if (currentlang !== 'en' && currentlang !== 'fr') {
  currentlang = 'en';
}
// translation function
function t(key: string) {
  // @ts-ignore - dynamic key indexing
  const translation = (translations as any)[currentlang][key] || (translations as any)['en'][key];
  return translation || key;
}

export interface animeToObsidianSettings {
  basePath: string;
  list: boolean;
  listPath: string;
  animes_history: Array<string>;
  listname: string;
  additionalTags: string;
  template: string;
  characterTemplate: string;
  charactersPath: string;
  characterRoleFilter: string;

}

export const DEFAULT_SETTINGS: animeToObsidianSettings = {
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
`,
  characterTemplate: `---
tags:
  - character
  - {{animeTag}}
role: {{role}}
voice_actor: {{voice_actor}}
image: {{image}}
---
# {{name}}

[MyAnimeList Page]({{url}})

[[{{anime}}]]
[[{{anime}}]]
`,
  charactersPath: 'Characters',
  characterRoleFilter: 'all'


}


export class animeToObsidianSettingsTab extends PluginSettingTab {
  plugin: animeToObsidian;

  constructor(app: App, plugin: animeToObsidian) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
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
        dropdown.setValue((this.plugin.settings as animeToObsidianSettings).basePath);
        dropdown.onChange(async (value: string) => {
          (this.plugin.settings as animeToObsidianSettings).basePath = value;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName(t('checklist'))
      .setDesc(t('checklistDesc'))
      .addToggle(toggle => {
        toggle.setValue((this.plugin.settings as animeToObsidianSettings).list);
        toggle.onChange(async (value: boolean) => {
          (this.plugin.settings as animeToObsidianSettings).list = value;
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
        dropdown.setValue((this.plugin.settings as animeToObsidianSettings).listPath);
        dropdown.onChange(async (value: string) => {
          (this.plugin.settings as animeToObsidianSettings).listPath = value;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName(t('listname'))
      .setDesc(t('listname'))
      .addText((text: any) => {
        text.setPlaceholder(t('listname'))
          .setValue((this.plugin.settings as animeToObsidianSettings).listname)
          .onChange(async (value: string) => {
            (this.plugin.settings as animeToObsidianSettings).listname = value;
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName(t('additionalTags'))
      .setDesc(t('additionalTagsDesc'))
      .addText((text: any) => {
        text.setPlaceholder('anime, culture')
          .setValue((this.plugin.settings as animeToObsidianSettings).additionalTags)
          .onChange(async (value: string) => {
            (this.plugin.settings as animeToObsidianSettings).additionalTags = value;
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName(t('template'))
      .setDesc(t('templateDesc'))
      .addTextArea((text: any) => {
        text.setPlaceholder('...')
          .setValue((this.plugin.settings as animeToObsidianSettings).template)
          .onChange(async (value: string) => {
            (this.plugin.settings as animeToObsidianSettings).template = value;
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName(t('characterTemplate'))
      .setDesc(t('characterTemplateDesc'))
      .addTextArea((text: any) => {
        text.setPlaceholder('...')
          .onChange(async (value: string) => {
            (this.plugin.settings as animeToObsidianSettings).characterTemplate = value;
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName(t('charactersPath'))
      .setDesc(t('charactersPathDesc'))
      .addText((text: any) => {
        text.setPlaceholder('Characters')
          .setValue((this.plugin.settings as animeToObsidianSettings).charactersPath)
          .onChange(async (value: string) => {
            (this.plugin.settings as animeToObsidianSettings).charactersPath = value;
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName(t('characterRoleFilter'))
      .setDesc(t('characterRoleFilterDesc'))
      .addDropdown((dropdown: any) => {
        dropdown.addOption('all', 'All');
        dropdown.addOption('Main', 'Main');
        dropdown.addOption('Supporting', 'Supporting');
        dropdown.setValue((this.plugin.settings as animeToObsidianSettings).characterRoleFilter);
        dropdown.onChange(async (value: string) => {
          (this.plugin.settings as animeToObsidianSettings).characterRoleFilter = value;
          await this.plugin.saveSettings();
        });
      });



  }
}