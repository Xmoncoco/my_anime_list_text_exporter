import { App, PluginSettingTab, Setting } from 'obsidian';
import animeToObsidian from './main';
import {ls} from './filefinder'

export interface animeToObsidianSettings {
    basePath: string;
}
  
export const DEFAULT_SETTINGS: animeToObsidianSettings = {
    basePath: ''
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
  

      const options = ls("folder");
  
      new Setting(containerEl)
        .setName('Base Path')
        .setDesc('The base path for your anime list')
        .addDropdown(dropdown => {
          dropdown.addOption('', 'Select a base path');
          
          options.forEach(option => {
            dropdown.addOption(option, option);
          });
  
          dropdown.setValue(this.plugin.settings.basePath);
          dropdown.onChange(async (value) => {
            this.plugin.settings.basePath = value;
            await this.plugin.saveSettings();
          });
        });
    }
  };