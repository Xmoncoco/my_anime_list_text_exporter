import { TAbstractFile, TFolder, TFile } from "obsidian";

export function ls(asked: string, folder: TFolder = app.vault.getRoot()): string[] {
    console.log ("listing directory")
    let listOfFiles: string[] = [];
  
    folder.children.forEach((file: TAbstractFile) => {
      if (file instanceof TFolder) {
        if (asked == "folder" || asked == "all" || asked == undefined) {
          listOfFiles.push(file.path);
        }
        // Recherche récursive dans les sous-dossiers
        listOfFiles = listOfFiles.concat(ls(asked, file));
      } else if (file instanceof TFile) {
        if (asked == "file" || asked == "all" || asked == undefined) {
          listOfFiles.push(file.path);
        }
      }
    });
  
    return listOfFiles;
  }


