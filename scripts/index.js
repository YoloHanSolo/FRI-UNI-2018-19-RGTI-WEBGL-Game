// Global variable definitionvar canvas;
var gl;
var shaderProgram;

var mvMatrixStack = [];
var mvMatrix = mat4.create();
var pMatrix = mat4.create();

var objects = [];

var cameraPosition = [0.0, 0.0, 0.0];
var cameraRotation = [0, 0, 0];

var objectsName = ["cev", "el_omarica", "kljuc", "lestev", "luc", "resetke", "sod", "ventil", "vrata", "zelezna_vrata"];

function mvPushMatrix() {
  var copy = mat4.create();
  mat4.set(mvMatrix, copy);
  mvMatrixStack.push(copy);
}

function mvPopMatrix() {
  if (mvMatrixStack.length == 0) {
    throw "Invalid popMatrix!";
  }
  mvMatrix = mvMatrixStack.pop();
}

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

  // store location of aVertexNormal variable defined in shader
  shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");

  // turn on vertex normal attribute at specified position
  gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
  
  // store location of uPMatrix variable defined in shader - projection matrix 
  shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");

  // store location of uMVMatrix variable defined in shader - model-view matrix 
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  
  // store location of uNMatrix variable defined in shader - normal matrix 
  shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
}

function setMatrixUniforms() {
  gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
  gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
  
  var normalMatrix = mat3.create();
  mat4.toInverseMat3(mvMatrix, normalMatrix);
  mat3.transpose(normalMatrix);
  gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
}

function initBuffers(){
	for(var i = 0; i < objectsName.length; i++){
		loadObject("./assets/" + objectsName[i] + ".obj", objectsName[i], function(data, name){
			var object = new Base();
			object.name = name;
			object.VertexPositionBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, object.VertexPositionBuffer);
			
			object.vertices = data.v;
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.vertices), gl.STATIC_DRAW);
			object.VertexPositionBuffer.itemSize = 3;
			object.VertexPositionBuffer.numItems = data.vCount;
			
			/*objects[0].VertexColorBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, objects[0].VertexColorBuffer);*/
			
			object.VertexNormalBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, object.VertexNormalBuffer);
			
			object.normals = data.vn;
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.normals), gl.STATIC_DRAW);
			object.VertexNormalBuffer.itemSize = 3;
			object.VertexNormalBuffer.numItems = data.vnCount;
			
			object.VertexIndexBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.VertexIndexBuffer);
			
			object.vertexIndices = data.f;
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(object.vertexIndices), gl.STATIC_DRAW);
			object.VertexIndexBuffer.itemSize = 1;
			object.VertexIndexBuffer.numItems = data.fCount;
			
			objects.push(object);
		});
	}
	console.log(objects)
}

function drawScene() {
	var i = 0;
	
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
  
  objects[i].draw([0.0, 0.0, -7.0], [1.0, 1.0, 1.0], [0, 0, 0]);

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
