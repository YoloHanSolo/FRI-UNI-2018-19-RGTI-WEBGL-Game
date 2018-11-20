function loadObject(url, name, callback){
	var request = new XMLHttpRequest();
	request.open("GET", url);
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			callback(handleLoad(request.responseText), name);
		}
	}
	request.send();
}

function handleLoad(fileData){
	var data = {};
	var lines = fileData.split("\n");
	data.v = [];
	data.vn = [];
	data.vt = [];
	data.f = [];
	data.vCount = 0;
	data.vnCount = 0;
	data.vtCount = 0;
	data.fCount = 0;
	
	var vertices = [];
	var normals = [];
	var textures = [];

	var unpacked = {};
    unpacked.verts = [];
    unpacked.norms = [];
    unpacked.textures = [];
    unpacked.hashindices = {};
    unpacked.indices = [];
    unpacked.index = 0;
	
	for (line in lines){
		
		var elements = lines[line].split(' ');
		if(elements[0] == "v"){
			vertices.push(parseFloat(elements[1]), parseFloat(elements[2]), parseFloat(elements[3]));
			//data.vCount++;
		}
		if(elements[0] == "vn"){
			normals.push(parseFloat(elements[1]), parseFloat(elements[2]), parseFloat(elements[3]));
			//data.vnCount++;
		}
		if(elements[0] == "vt"){
			textures.push(parseFloat(elements[1]), parseFloat(elements[2]));
			//data.vnCount++;
		}
		if(elements[0] == "f"){
			for(var j = 1; j < elements.length; j++){
				if(elements[j] in unpacked.hashindices){
					unpacked.indices.push(unpacked.hashindices[elements[j]]);
				}
				else{
					var vertex = elements[j].split('/');
					
					// vertex position
					unpacked.verts.push(vertices[(vertex[0] - 1) * 3 + 0]);
					unpacked.verts.push(vertices[(vertex[0] - 1) * 3 + 1]);
					unpacked.verts.push(vertices[(vertex[0] - 1) * 3 + 2]);
					// vertex textures
					unpacked.textures.push(textures[(vertex[1] - 1) * 2 + 0]);
					unpacked.textures.push(textures[(vertex[1] - 1) * 2 + 1]);
					// vertex normals
					unpacked.norms.push(normals[(vertex[2] - 1) * 3 + 0]);
					unpacked.norms.push(normals[(vertex[2] - 1) * 3 + 1]);
					unpacked.norms.push(normals[(vertex[2] - 1) * 3 + 2]);
					// add the newly created vertex to the list of indices
					unpacked.hashindices[elements[j]] = unpacked.index;
					unpacked.indices.push(unpacked.index);
					// increment the counter
					unpacked.index += 1;
				}
			}
		}
	}
	
	data.v = unpacked.verts;
	data.vn = unpacked.norms;
	data.vt = unpacked.textures;
	data.f = unpacked.indices;
	data.fCount = unpacked.indices.length;
	data.vnCount = unpacked.norms.length/3;
	data.vCount = unpacked.verts.length/3;
	data.vtCount = unpacked.textures.length/2;
	
	return data;
}

function loadMaterial(url, callback){
	var request = new XMLHttpRequest();
	request.open("GET", url);
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			callback(handleMaterial(request.responseText));
		}
	}
	request.send();
}

function handleMaterial(fileData){
	var data = {};
	var lines = fileData.split("\n");
	data.ka = [];
	data.ks = [];
	data.kd = [];
	
	for (line in lines){
		
		var elements = lines[line].split(' ');
		if(elements[0] == "Ka"){
			data.ka.push(parseFloat(elements[1]), parseFloat(elements[2]), parseFloat(elements[3]));
		}
		if(elements[0] == "Ks"){
			data.ks.push(parseFloat(elements[1]), parseFloat(elements[2]), parseFloat(elements[3]));
		}
		if(elements[0] == "Kd"){
			data.kd.push(parseFloat(elements[1]), parseFloat(elements[2]), parseFloat(elements[3]));
		}
	}
	
	return data;
}