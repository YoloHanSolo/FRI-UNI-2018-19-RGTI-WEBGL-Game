var currentlyPressedKeys = {};

function handleKeyDown(event) {
  currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
  currentlyPressedKeys[event.keyCode] = false;
}

function handleKeys() {
	if (currentlyPressedKeys[87]) { // KEY PRESS (W)
		speedZ = movingSpeed;
	}else if(currentlyPressedKeys[83]) { // KEY PRESS (S)
		speedZ = -movingSpeed;
	}else
		speedZ = 0;
	
	if (currentlyPressedKeys[65]) {	// KEY PRESS (A)
		speedX = movingSpeed;
	}else if(currentlyPressedKeys[68]) { // KEY PRESS (D)
		speedX = -movingSpeed;
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