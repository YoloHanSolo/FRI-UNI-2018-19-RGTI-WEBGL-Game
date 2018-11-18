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
	
	if (currentlyPressedKeys[81]) {	// KEY PRESS (Q)
		angle = -angleSpeed;
	}else if(currentlyPressedKeys[69]) { // KEY PRESS (E)
		angle = angleSpeed;
	}else
		angle = 0;
}