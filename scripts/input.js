var currentlyPressedKeys = {};

function handleKeyDown(event) {
  currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
  currentlyPressedKeys[event.keyCode] = false;
}

function handleKeys() {
	if (currentlyPressedKeys[87]) { // KEY PRESS (W)
		speed = 0.1;
	}else if(currentlyPressedKeys[83]) { // KEY PRESS (S)
		speed = -0.1;
	}else
		speed = 0;
	
	if (currentlyPressedKeys[65]) {	// KEY PRESS (A)
		cameraAngle = cameraRotationSpeed;
	}else if(currentlyPressedKeys[68]) { // KEY PRESS (D)
		cameraAngle = -cameraRotationSpeed;
	}else
		cameraAngle = 0;

}