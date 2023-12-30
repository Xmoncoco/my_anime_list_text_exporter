async function getAnimeData(animeName){
	let animeData = await fetch('https://api.jikan.moe/v4/anime?q=' + animeName + '&limit=1').then(response => response.json());
	console.log(animeData.data[0]);
	return animeData.data[0];
}

getAnimeData('blue exorcist');