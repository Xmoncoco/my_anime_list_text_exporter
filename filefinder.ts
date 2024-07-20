import { App, TAbstractFile, TFolder, TFile } from "obsidian";

const maxDepth = 100;

export function ls(app: App, asked: string, currentFolder: TFolder = app.vault.getRoot() as TFolder, currentDepth: number = 0): string[] {
    let listOfFiles: string[] = [];

    // Vérifier si la profondeur maximale a été atteinte
    if (currentDepth > maxDepth) {
        return listOfFiles;
    }

    currentFolder.children.forEach((file: TAbstractFile) => {
        if (file instanceof TFolder) {
            if (asked === "folder" || asked === "all" || asked === undefined) {
                listOfFiles.push(file.path);
            }
            // Recherche récursive dans les sous-dossiers avec une profondeur incrémentée
            listOfFiles = listOfFiles.concat(ls(app, asked, file, currentDepth + 1));
        } else if (file instanceof TFile) {
            if (asked === "file" || asked === "all" || asked === undefined) {
                listOfFiles.push(file.path);
            }
        }
    });

    return listOfFiles;
}