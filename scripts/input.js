var currentlyPressedKeys = {};

function handleKeyDown(event) {
  // storing the pressed state for individual key
  currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
  // reseting the pressed state for individual key
  currentlyPressedKeys[event.keyCode] = false;
}

function handleKeys() {
	//w
	if (currentlyPressedKeys[87]) {
		cameraPosition[2]-=0.05;
	}
	//s
	if (currentlyPressedKeys[83]) {
		cameraPosition[2]+=0.05;
	}
	//a
	if (currentlyPressedKeys[65]) {
		cameraPosition[0]-=0.05;
	}
	//d
	if (currentlyPressedKeys[68]) {
		cameraPosition[0]+=0.05;
	}
	//q
	if (currentlyPressedKeys[81]) {
		cameraRotation[1]+=60;
	}
	//e
	if (currentlyPressedKeys[69]) {
		cameraRotation[1]-=60;
	}
}