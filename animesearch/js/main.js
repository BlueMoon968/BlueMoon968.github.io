//=============================================================================
// AnimeSearch - main.js
// Author: Luca Mastroianni - Search Engine for SUB ITA/ENG Anime
//=============================================================================

function randomInt(max) {
	return Math.floor(max * Math.random());
}

function _createCard(anime) {
	// PARSING DATA
	let id = String(anime.mal_id);
	let imgSrc = anime.image_url;
	let title = anime.title;
	let is_airing = anime.airing;
	let score = anime.score;
	let infoUrl = anime.url;
	// METHODS
	function _animeSaturn() {
		window.open("https://www.animesaturn.it/animelist?search=" + encodeURIComponent(anime.title), "_blank");
	}
	function _socialAnime() {
		window.open("https://socialanime.it/search?q=" + encodeURIComponent(anime.title), "_blank");
	}
	function _animeHDITA() {
		window.open("https://www.animehdita.org/?s=" + encodeURIComponent(anime.title), "_blank");
	}
	function _yamatoVideo() {
		window.open("https://www.youtube.com/results?search_query=yamato+" + anime.title.replace(/\s/g,"+"), "_blank");
	}
	function _animeUnity() {
		window.open("https://www.animeunity.it/archivio?title=" + encodeURIComponent(anime.title), "_blank");
	}
	//=====================================
	let card = document.createElement("div");
	card.className = "card";
	card.id = id;
	card.innerHTML = `
	<div class="card_image"> <img src="${imgSrc}" /> </div>
	<i class="fa fa-play-circle fa-lg" style="color:${!!is_airing ? "red" : "grey"}" title="${!!is_airing ? "In Onda" : "Concluso"}"></i>
	<a href="${infoUrl}" target="_blank"><i class="fa fa-info-circle fa-lg info-icon" title="Scheda MyAnimeList"></i></a>
	<div class="card_title">
		<p class="anime-title">${title}</p>
		<p class="anime-title"><i class="fa fa-star card_star"></i> ${score}</p>
	</div>
	<p style="text-align:center; color:white; font-weight:bold; line-height:0px; margin-top:8px;">STREAMINGS</p>
	<div class="streaming-list">
		<i id=_animeSaturn${id} title="AnimeSaturn" class="fa fa-globe-europe streaming-icon" style="color:white;"></i>
		<i id=_animeUnity${id} title="AnimeUnity" class="fa fa-infinity streaming-icon" style="color:white;"></i>
		<i id=_socialAnime${id} title="SocialAnime" class="fab fa-stripe-s streaming-icon" style="color:white;"></i>
		<i id=_animeHDITA${id} title="Anime HD ITA"  class="fa fa-tv streaming-icon" style="color:white;"></i>
		<i id=_yamatoVideo${id} title="Yamato Video"  class="fab fa-youtube streaming-icon" style="color:white;"></i>
	</div>`
	let collector = document.getElementById("cardList");
	collector.appendChild(card);
	
	// Assign Handlers
	let animeSaturnIcon = document.getElementById("_animeSaturn" + id);
	animeSaturnIcon.onclick = _animeSaturn;
	let socialAnimeIcon = document.getElementById("_socialAnime" + id);
	socialAnimeIcon.onclick = _socialAnime;
	let animeHDITAIcon = document.getElementById("_animeHDITA" + id);
	animeHDITAIcon.onclick = _animeHDITA;
	let yamatoVideoIcon = document.getElementById("_yamatoVideo" + id);
	yamatoVideoIcon.onclick = _yamatoVideo;
	let animeUnityIcon = document.getElementById("_animeUnity" + id);
	animeUnityIcon.onclick = _animeUnity;
}

function _createNullifyHeader() {
	const header = document.createElement("h1");
	header.innerText = "NO RESULTS FOUND";
	let collector = document.getElementById("cardList");
	collector.appendChild(header);
}

function _removeCard(id) {
	let card = document.getElementById(id);
	let collector = document.getElementById("cardList");
	collector.removeChild(card);	
}

function _startSearch() {
	let collector = document.getElementById("cardList");
	collector.innerHTML = ``;
	let value = document.getElementById("searchBarInput").value;
	let getOptions = {
		method: "get",
		headers: {
			"x-rapidapi-key": atob('YWNiMDY4NWFhZG1zaDMyYjZiNjMwMzNhMjg1OHAxMDc4OGFqc240NWM4YjA1MTAxMDM='),
			"x-rapidapi-host": "jikan1.p.rapidapi.com"
		}
	}
	fetch(`https://jikan1.p.rapidapi.com/search/anime?q=${encodeURIComponent(value)}`, getOptions).then(response => response.json().then(data => {
		if(!data.results) {
			return _createNullifyHeader();
		}
		for(let anime of data.results) {
			_createCard(anime);
		}
	}))
}
