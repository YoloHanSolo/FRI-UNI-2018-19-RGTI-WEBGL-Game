var gl;
var shaderProgram;

var mvMatrixStack = [];
var mvMatrix = mat4.create();
var pMatrix = mat4.create();

var objects = [];

var objectsName = [
	"map","map_intersection",
	"bars","bars",
	"ventil","ventil","ventil",
	"small_pipe","small_pipe","small_pipe","small_pipe"
	];
	
var water_alpha = false;

var objectPosition = [
	[ 0.0, 0.0, 0.0],
	[ 0.0, 0.0, 0.0],
	[ 8.0,-1.0, 0.1],
	[-4.0,-1.0, 0.1],
	// VALVE
	[ 0.0, 1.0,-0.4],
	[ 1.0, 1.0,-0.4],
	[ 3.0, 3.0,-1.2],
	// SMALL PIPE
	[ 0.5, 1.0,-0.4],
	[ 0.0, 1.0,-0.4],
	[ 1.0, 1.0,-0.4],
	[ 3.0, 3.0, -1.5]];
	
var objectRotation = [
	[ 0.0, 0.0, 0.0],
	[ 0.0, 0.0, 0.0],
	[ 0.0,90.0, 0.0],
	[ 0.0,90.0, 0.0],
	// VALVE
	[ 0.0,-90.0, 90.0],
	[ 0.0,-90.0, 90.0],
	[ 0.0,  0.0, 90.0],
	// SMALL PIPE
	[ 0.0, 0.0, 0.0],
	[ 0.0, 0.0, 0.0],
	[ 0.0, 0.0, 0.0],
	[ 0.0,90.0, 90.0]];
	
var angleSpeed = 1.3;
var movingSpeed = 0.1;

var angleX = 0; // LEFT-RIGHT angle
var angleY = 0; // UP-DOWN angle
var speedZ = 0;
var speedX = 0;

var jump = false;
var jump_position = 0; // DONT CHANGE - VAR
var jump_height = 1;   // CONST
var jump_speed = 4; // CONST
var jump_duration = 1; // DONT CHANGE - VAR

var cameraPosition = [0.0, -2.0, 0.0]; // ZAČETNA POZICIJA KAMERE (se spreminja s časom)
var cameraRotation = [0.0, 0.0, 0.0];

var objectScaling = [1.0, 1.0, 1.0]; // POZICIJA OBJEKTA V SVETU (se ne spreminja s časom)

var gameStart = false;

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
  
  // store location of aTextureCoord variable defined in shader
  shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");

  // turn on vertex texture coordinates attribute at specified position
  gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
  
  // store location of uPMatrix variable defined in shader - projection matrix 
  shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");

  // store location of uMVMatrix variable defined in shader - model-view matrix 
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  
  // store location of uNMatrix variable defined in shader - normal matrix 
  shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
  
  // store location of uSampler variable defined in shader
  shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
  
  // store location of uLightingDirection variable defined in shader
  shaderProgram.lightPositionUniform = gl.getUniformLocation(shaderProgram, "uLightPosition");
  
  shaderProgram.Ka = gl.getUniformLocation(shaderProgram, "Ka");
  shaderProgram.Kd = gl.getUniformLocation(shaderProgram, "Kd");
  shaderProgram.Ks = gl.getUniformLocation(shaderProgram, "Ks");
}

function setMatrixUniforms() {
  gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
  gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
  
  var normalMatrix = mat3.create();
  mat4.toInverseMat3(mvMatrix, normalMatrix);
  mat3.transpose(normalMatrix);
  gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
}

function handleTextureLoaded(texture) {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D, null);
}

function initBuffers(){
	for(var i = 0; i < objectsName.length; i++){
		loadObject("./assets_models/" + objectsName[i] + "/" + objectsName[i] + ".obj", objectsName[i], function(data, name){
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
			
			object.VertexTextureCoordinateBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, object.VertexTextureCoordinateBuffer);
			
			object.textureCoordinates = data.vt;
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.textureCoordinates), gl.STATIC_DRAW);
			object.VertexTextureCoordinateBuffer.itemSize = 2;
			object.VertexTextureCoordinateBuffer.numItems = data.vtCount;
			
			//initTexture
			object.texture = gl.createTexture();
			object.texture.image = new Image();
			object.texture.image.onload = function(){
				handleTextureLoaded(object.texture);
			}
			object.texture.image.src = "./assets_models/" + name + "/" + name + ".jpg";
			
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
			
			loadMaterial("./assets_models/" + name + "/" + name + ".mtl", function(data){
				object.ka = data.ka;
				object.kd = data.kd;
				object.ks = data.ks;
			})
			
			objects.push(object);
		});
	}
	//console.log(objects)
	// PRINT OBJ // file:///C:/Users/Uporabnik/Desktop/RGTI-Seminarska-master/index.html.log(objects)
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

	mat4.identity(mvMatrix);
	
	mat4.rotate(mvMatrix, degToRad(-cameraRotation[2]), [1, 0, 0]); // GOR-DOL
	mat4.rotate(mvMatrix, degToRad(-cameraRotation[0]), [0, 1, 0]); // LEVO-DESNO

	mat4.translate(mvMatrix, [cameraPosition[0], cameraPosition[1]-jump_position, cameraPosition[2]]);
	
	for( let i = 0; i < objectsName.length; i++){ 
		objects[i].draw(objectPosition[i], [1.0, 1.0, 1.0], objectRotation[i]);
	}
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
	  if (gameStart) {
		  handleKeys();
		  playerControl();
		  drawScene();
	  }
    }, 15);
  }
}
