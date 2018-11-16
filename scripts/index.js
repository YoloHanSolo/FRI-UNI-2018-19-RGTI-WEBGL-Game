// Global variable definitionvar canvas;
var gl;
var shaderProgram;

var mvMatrix = mat4.create();
var pMatrix = mat4.create();

var objects = [];

var cameraPosition = [0.0, 0.0, 0.0];
var cameraRotation = [0, 0, 0];

function degToRad(degrees) {
  return degrees * Math.PI / 180;
}

function initGL(canvas) {
  var gl = null;
  try {
    // Try to grab the standard context. If it fails, fallback to experimental.
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
  } catch(e) {}

  // If we don't have a GL context, give up now
  if (!gl) {
    alert("Unable to initialize WebGL. Your browser may not support it.");
  }
  return gl;
}

function getShader(gl, id) {
  var shaderScript = document.getElementById(id);

  // Didn't find an element with the specified ID; abort.
  if (!shaderScript) {
    return null;
  }

  // Walk through the source element's children, building the
  // shader source string.
  var shaderSource = "";
  var currentChild = shaderScript.firstChild;
  while (currentChild) {
    if (currentChild.nodeType == 3) {
        shaderSource += currentChild.textContent;
    }
    currentChild = currentChild.nextSibling;
  }
  
  // Now figure out what type of shader script we have,
  // based on its MIME type.
  var shader;
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;  // Unknown shader type
  }

  // Send the source to the shader object
  gl.shaderSource(shader, shaderSource);

  // Compile the shader program
  gl.compileShader(shader);

  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}

function initShaders() {
  var fragmentShader = getShader(gl, "shader-fs");
  var vertexShader = getShader(gl, "shader-vs");
  
  // Create the shader program
  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  
  // If creating the shader program failed, alert
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Unable to initialize the shader program.");
  }
  
  // start using shading program for rendering
  gl.useProgram(shaderProgram);
  
  // store location of aVertexPosition variable defined in shader
  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");

  // turn on vertex position attribute at specified position
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  // store location of aVertexColor variable defined in shader
  /*shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");

  // turn on vertex color attribute at specified position
  gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);*/

  // store location of uPMatrix variable defined in shader - projection matrix 
  shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");

  // store location of uMVMatrix variable defined in shader - model-view matrix 
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}

function setMatrixUniforms() {
  gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
  gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

function initBuffers(){
	objects[0] = new Base();
	
	loadObject("./assets/lestev.obj", function(data){
		objects[0].VertexPositionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, objects[0].VertexPositionBuffer);
		
		objects[0].vertices = data.v;
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objects[0].vertices), gl.STATIC_DRAW);
		objects[0].VertexPositionBuffer.itemSize = 3;
		objects[0].VertexPositionBuffer.numItems = data.vCount;
		
		objects[0].VertexColorBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, objects[0].VertexColorBuffer);
		
		objects[0].VertexIndexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, objects[0].VertexIndexBuffer);
		
		objects[0].vertexIndices = data.f;
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(objects[0].vertexIndices), gl.STATIC_DRAW);
		objects[0].VertexIndexBuffer.itemSize = 1;
		objects[0].VertexIndexBuffer.numItems = data.fCount;
	});
  
  console.log(objects[0])
}

function drawScene() {
  // set the rendering environment to full canvas size
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  // Clear the canvas before we start drawing on it.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  // Establish the perspective with which we want to view the
  // scene. Our field of view is 45 degrees, with a width/height
  // ratio and we only want to see objects between 0.1 units
  // and 100 units away from the camera.
  mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  mat4.identity(mvMatrix);
  
  //Camera translation
  mat4.rotate(mvMatrix, degToRad(degToRad(-cameraRotation[0])), [1, 0, 0]);
  mat4.rotate(mvMatrix, degToRad(degToRad(-cameraRotation[1])), [0, 1, 0]);
  mat4.rotate(mvMatrix, degToRad(degToRad(-cameraRotation[2])), [0, 0, 1]);
  mat4.translate(mvMatrix, [-cameraPosition[0], -cameraPosition[1], -cameraPosition[2]]);

  // Now move the drawing position a bit to where we want to start
  // drawing the cube.
  mat4.translate(mvMatrix, [0.0, 0.0, -7.0]);
  mat4.rotate(mvMatrix, degToRad(degToRad(180)), [1, 0, 0]);
  mat4.rotate(mvMatrix, degToRad(degToRad(0)), [0, 1, 0]);
  mat4.rotate(mvMatrix, degToRad(degToRad(0)), [0, 0, 1]);

  // Draw the cube by binding the array buffer to the cube's vertices
  // array, setting attributes, and pushing it to GL.
  gl.bindBuffer(gl.ARRAY_BUFFER, objects[0].VertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, objects[0].VertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
  
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, objects[0].VertexIndexBuffer);

  // Draw the cube.
  setMatrixUniforms();
  gl.drawElements(gl.TRIANGLES, objects[0].VertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function start() {
  canvas = document.getElementById("glcanvas");

  gl = initGL(canvas);      // Initialize the GL context

  // Only continue if WebGL is available and working
  if (gl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);                      // Set clear color to black, fully opaque
    gl.clearDepth(1.0);                                     // Clear everything
    gl.enable(gl.DEPTH_TEST);                               // Enable depth testing
    gl.depthFunc(gl.LEQUAL);                                // Near things obscure far things

    // Initialize the shaders; this is where all the lighting for the
    // vertices and so forth is established.
    initShaders();
    
    // Here's where we call the routine that builds all the objects
    // we'll be drawing.
    initBuffers();
	
	// Bind keyboard handling functions to document handlers
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
    
    // Set up to draw the scene periodically.
    setInterval(function() {
      //requestAnimationFrame(animate);
	  handleKeys();
      drawScene();
    }, 15);
  }
}
