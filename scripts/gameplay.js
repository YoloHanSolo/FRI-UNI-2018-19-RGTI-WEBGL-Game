//UI
function startGame(){
	gameStart = true;
	document.getElementById("mainMenu").style.display = 'none';
	document.getElementById("glcanvas").style.display = 'inline';
	
	var audio = new Audio("./assets_other/game.mp3");
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

function getInteractedItem(){
	var interectedObject = null;
	for(var i = 4; i < objects.length; i++){
		interectedObject = raycast(cameraPosition, cameraRotation, objectPosition[i], objects[i]);
		if(interectedObject != null)
			console.log(interectedObject);
	}
}

function raycast(cPosition, cRotation, oPosition, object){
	var omega = [0.0, 0.0, -1.0]; //direction of raycast
	var x = [];
	
	//console.log("c:" + cPosition)
	//console.log("o:" + oPosition)
	//calculate x (vector betwen object and camera)
	for(var i = 0; i < 3; i++){
		x[i] = cPosition[i] - oPosition[i];
	}
	//console.log("x:" + x);
	
	//rotate raycast vector
	omega = rotateVector(omega, cRotation);
	//console.log(omega);
	
	//koeficienti za deskriminanto
	var a = vectorXvector(omega, omega);
	//console.log(a);
	var b = 2 * (vectorXvector(x, omega));
	//console.log(b);
	var c = vectorXvector(x, x) - Math.pow(0.5, 2);
	//console.log(c);
	
	var D = Math.pow(b, 2) - 4 * a * c;
	//console.log(D);
	
	if(D > 0)
		return object;
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