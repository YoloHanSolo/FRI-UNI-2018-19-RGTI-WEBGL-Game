//UI
function startGame(){
	gameStart = true;
	document.getElementById("mainMenu").style.display = 'none';
	document.getElementById("glcanvas").style.display = 'inline';
	
	var audio = new Audio("./assets/game.mp3");
	audio.volume = 0.3;
	audio.addEventListener('ended', function() {
		this.currentTime = 0;
		this.play();
	}, false);
	audio.play();
}

function showCredits(){
	document.getElementById("main").style.display = 'none';
	document.getElementById("credits").style.display = 'inline';
	document.getElementById("credits").style.width = '1280px';
	document.getElementById("credits").style.height = '720px';
}

function goBack(){
	document.getElementById("credits").style.display = 'none';
	document.getElementById("main").style.display = 'inline';
}