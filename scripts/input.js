var currentlyPressedKeys = {};

function handleKeyDown(event) {
  currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
  currentlyPressedKeys[event.keyCode] = false;
}

function handleKeys() {
	if (currentlyPressedKeys[87]) { // KEY PRESS (W)
		speedZ = -movingSpeed;
	}else if(currentlyPressedKeys[83]) { // KEY PRESS (S)
		speedZ = movingSpeed;
	}else
		speedZ = 0;
	
	if (currentlyPressedKeys[65]) {	// KEY PRESS (A)
		speedX = -movingSpeed;
	}else if(currentlyPressedKeys[68]) { // KEY PRESS (D)
		speedX = movingSpeed;
	}else
		speedX = 0;
	
	if (currentlyPressedKeys[37]) {	// KEY PRESS (LEFT ARROW)
		angleX = -angleSpeed;
	}else if(currentlyPressedKeys[39]) { // KEY PRESS (RIGHT ARROW)
		angleX = angleSpeed;
	}else
		angleX = 0;
	
	if (currentlyPressedKeys[38]) {	// KEY PRESS (UP ARROW )
		angleY = -angleSpeed;
	}else if(currentlyPressedKeys[40]) { // KEY PRESS (DOWN ARROW)
		angleY = angleSpeed;
	}else
		angleY = 0;
	
	if (currentlyPressedKeys[32] && !jump) // SPACE (JUMP)
		jump = true;
		
}

function playerControl(){

  cameraRotation[0] -= angleX;
  cameraRotation[2] -= angleY;
  
  if( cameraRotation[2] >= 180 ) cameraRotation[2] = 180;
  if( cameraRotation[2] <=-180 ) cameraRotation[2] = -180;
  
  if (speedZ != 0) {	
    cameraPosition[0] -= Math.sin(degToRad(cameraRotation[0])) * speedZ; // positionX
	cameraPosition[2] -= Math.cos(degToRad(cameraRotation[0])) * speedZ; // positionZ
  }
  if (speedX != 0) {  
    cameraPosition[0] -= Math.cos(degToRad(-cameraRotation[0])) * speedX; // positionX
	cameraPosition[2] -= Math.sin(degToRad(-cameraRotation[0])) * speedX; // positionZ
  }
  if( jump ){
	jump_position = Math.sin(degToRad(jump_duration));
	jump_duration += jump_speed;
	if( jump_duration >= 180 ){
		jump_position = 0;
		jump_duration = 0;
		jump = false;
	} 
  }
}