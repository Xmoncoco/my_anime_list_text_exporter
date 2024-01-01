// for people who want to know how the plugin works is here
// and you can take all of this code and use it for your own project

// get jikan api data

/*
async function getAnimeData(animeName){
	let animeData = await fetch('https://api.jikan.moe/v4/anime?q=' + animeName + '&limit=1').then(response => response.json());
	console.log(animeData.data[0]);
	return animeData.data[0];
}

getAnimeData('blue exorcist');

*/

// test to create an dir finder

const fs = require('fs');



async function ls(asked){

	let listOfFiles = [];

	const files = fs.readdirSync('../../..');

	console.log(files);

	if(asked == "folder"){
		
		files.forEach(file => {
			
			if(file.includes(".")){
				
			}else{
				listOfFiles.push(file);
			}
			
		});
		
	} else if(asked == "file") {
		files.forEach(file => {
			console.log(`File: ${file} is have a point ${file.includes(".")}`);
			if(file.includes(".")){
				listOfFiles.push(file);
			}
			
	});

	} else if(asked == "all" || asked == undefined) {
		files.forEach(file => {
			listOfFiles.push(file);
			
		});
	}
	return listOfFiles;
};

console.log[ls()];
