import { TFolder, TFile } from "obsidian";
const maxDepth = 100;
export function ls(app, asked, currentFolder = app.vault.getRoot(), currentDepth = 0) {
    let listOfFiles = [];
    // Vérifier si la profondeur maximale a été atteinte
    if (currentDepth > maxDepth) {
        return listOfFiles;
    }
    currentFolder.children.forEach((file) => {
        if (file instanceof TFolder) {
            if (asked === "folder" || asked === "all" || asked === undefined) {
                listOfFiles.push(file.path);
            }
            // Recherche récursive dans les sous-dossiers avec une profondeur incrémentée
            listOfFiles = listOfFiles.concat(ls(app, asked, file, currentDepth + 1));
        }
        else if (file instanceof TFile) {
            if (asked === "file" || asked === "all" || asked === undefined) {
                listOfFiles.push(file.path);
            }
        }
    });
    return listOfFiles;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZWZpbmRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpbGVmaW5kZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFzQixPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBRTlELE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQztBQUVyQixNQUFNLFVBQVUsRUFBRSxDQUFDLEdBQVEsRUFBRSxLQUFhLEVBQUUsZ0JBQXlCLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFhLEVBQUUsZUFBdUIsQ0FBQztJQUN6SCxJQUFJLFdBQVcsR0FBYSxFQUFFLENBQUM7SUFFL0Isb0RBQW9EO0lBQ3BELElBQUksWUFBWSxHQUFHLFFBQVEsRUFBRTtRQUN6QixPQUFPLFdBQVcsQ0FBQztLQUN0QjtJQUVELGFBQWEsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBbUIsRUFBRSxFQUFFO1FBQ25ELElBQUksSUFBSSxZQUFZLE9BQU8sRUFBRTtZQUN6QixJQUFJLEtBQUssS0FBSyxRQUFRLElBQUksS0FBSyxLQUFLLEtBQUssSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFO2dCQUM5RCxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUMvQjtZQUNELDZFQUE2RTtZQUM3RSxXQUFXLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsWUFBWSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDNUU7YUFBTSxJQUFJLElBQUksWUFBWSxLQUFLLEVBQUU7WUFDOUIsSUFBSSxLQUFLLEtBQUssTUFBTSxJQUFJLEtBQUssS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtnQkFDNUQsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDL0I7U0FDSjtJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxXQUFXLENBQUM7QUFDdkIsQ0FBQyJ9