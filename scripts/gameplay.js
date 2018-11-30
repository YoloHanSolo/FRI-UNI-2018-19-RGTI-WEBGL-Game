//UI
var audio;

function startGame(){
	gameStart = true;
	document.getElementById("mainMenu").style.display = 'none';
	document.getElementById("glcanvas").style.display = 'inline';
	
	audio = new Audio("./assets_other/game.mp3");
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

function showControls(){
	document.getElementById("main").style.display = 'none';
	document.getElementById("controls").style.display = 'inline';
	document.getElementById("controls").style.width = '1280px';
	document.getElementById("controls").style.height = '720px';
}

function goBack(){
	document.getElementById("credits").style.display = 'none';
	document.getElementById("main").style.display = 'inline';
}

function goBack2(){
	document.getElementById("controls").style.display = 'none';
	document.getElementById("main").style.display = 'inline';
}

function endGame(){
	if(switchOn){
		if(cameraPosition[0] > -8 && cameraPosition[0] < -4 && cameraPosition[2] < -21.0){
			audio.pause();
			gameOver = true;
			document.getElementById("glcanvas").style.display = 'none';
			document.getElementById("endScreen").style.display = 'block';
		}
	}
}

//GAMEPLAY FLAGS
var hasKey = false;
var switchOn = false;
var gateOpen = false;

function getInteractedItem(){
	var interectedObject = null;
	for(var i = 0; i < objects.length; i++){
		interectedObject = raycast(cameraPosition, cameraRotation, objects[i].translate, objects[i]);
		if(interectedObject != null)
			interact(interectedObject, i);
	}
}

var lock = false;

function interact(obj, i){
	if(obj.name == "key"){
		hasKey = true;
		objects[i] = objects[objects.length-1];
		objects.pop();
		//objects.splice(i, 1);
	}
	if(obj.name == "gate_b"){
		if(hasKey){
			if(!gateOpen){
				var door = new Audio("./assets_other/doorOpen.mp3");
				door.volume = 0.5;
				door.currentTime = 1;
				door.play();
			}
			gateOpen = true;
		}
		else{
			if(!lock){
				lock = true;
				var door = new Audio("./assets_other/doorLocked.mp3");
				door.volume = 0.5;
				door.addEventListener('ended', function() {
					lock = false;
				}, false);
				door.play();
			}
		}
	}
	if(obj.name == "switch"){
		if(gateOpen){
			if(!switchOn){
				var click = new Audio("./assets_other/click.mp3");
				click.volume = 0.5;
				click.currentTime = 0.5;
				click.play();
			}
			switchOn = true;
		}
	}
}

function raycast(cPosition, cRotation, oPosition, object){
	var omega = [0.0, 0.0, -1.0]; //direction of raycast
	var x = [];

	//calculate x (vector betwen object and camera)
	for(var i = 0; i < 3; i++){
		x[i] = cPosition[i] - oPosition[i];
	}
	
	//rotate raycast vector
	omega = rotateVector(omega, cRotation);
	
	//koeficienti za deskriminanto
	var a = vectorXvector(omega, omega);
	var b = 2 * (vectorXvector(x, omega));
	var c = vectorXvector(x, x) - Math.pow(2.5, 2);
	
	var D = Math.pow(b, 2) - 4 * a * c;
	
	if(D > 0){
		var l1 = (-2* b - Math.sqrt(D)) / (2 * a);
		var l2 = (-2* b + Math.sqrt(D)) / (2 * a);
		if(l2 < 5.0)
			return object;
	}
	else
		return null;
}
 function vectorXvector(v1, v2){
	var result = 0;
	for(var i = 0; i < 3; i++){
		result += v1[i] * v2[i];
	}
	return result;
}
 function rotateVector(v, R){
	v.push(1);
	v = rotateX(R[0], v);
	v = rotateX(R[1], v);
	v = rotateX(R[2], v);
	return [v[0], v[1], v[2]];
}
 //funkcije za računanje transformacijo vektorja, se ne računa na kartici!!
function identity(){
	return [[1, 0, 0, 0],
			[0, 1, 0, 0],
			[0, 0, 1, 0],
			[0, 0, 0, 1]];
}
 function rotateX(r, v){
	var rotationMatrix = identity();
	rotationMatrix[1][1] = Math.cos(r * Math.PI/180);
	rotationMatrix[1][2] = -Math.sin(r * Math.PI/180);
	rotationMatrix[2][1] = Math.sin(r * Math.PI/180);
	rotationMatrix[2][2] = Math.cos(r * Math.PI/180);
	return MatrixXVector(rotationMatrix, v);
}
 function rotateY(r, v){
	var rotationMatrix = identity();
	rotationMatrix[0][0] = Math.cos(r * Math.PI/180);
	rotationMatrix[2][0] = -Math.sin(r * Math.PI/180);
	rotationMatrix[0][2] = Math.sin(r * Math.PI/180);
	rotationMatrix[2][2] = Math.cos(r * Math.PI/180);
	return MatrixXVector(rotationMatrix, v);
}
 function rotateZ(r, v){
	var rotationMatrix = identity();
	rotationMatrix[0][0] = Math.cos(r * Math.PI/180);
	rotationMatrix[0][1] = -Math.sin(r * Math.PI/180);
	rotationMatrix[1][0] = Math.sin(r * Math.PI/180);
	rotationMatrix[1][1] = Math.cos(r * Math.PI/180);
	return MatrixXVector(rotationMatrix, v);
}
 function MatrixXVector(m, v){
	var newVector = [0, 0, 0, 0];
	for(var i = 0; i < 4; i++){
		var result = 0;
		for(var j = 0; j < 4; j++){
			result += m[i][j] * v[j];
		}
		newVector[i] = result;
	}
	return newVector;
 }