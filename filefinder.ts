import { App, TAbstractFile, TFolder, TFile } from "obsidian";

export function ls(app: App, asked: string, ): string[] {
    let folder : TFolder = app.vault.getAbstractFileByPath("/") as TFolder;
    let listOfFiles: string[] = [];

    folder.children.forEach((file: TAbstractFile) => {
        if (file instanceof TFolder) {
            if (asked == "folder" || asked == "all" || asked == undefined) {
                listOfFiles.push(file.path);
            }
            // Recherche récursive dans les sous-dossiers
            listOfFiles = listOfFiles.concat(ls(app, asked, file));
        } else if (file instanceof TFile) {
            if (asked == "file" || asked == "all" || asked == undefined) {
                listOfFiles.push(file.path);
            }
        }
    });

    return listOfFiles;
}