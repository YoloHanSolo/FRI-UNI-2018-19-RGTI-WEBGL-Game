function loadObject(url, callback){
	var request = new XMLHttpRequest();
	request.open("GET", url);
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			callback(handleLoad(request.responseText));
		}
	}
	request.send();
}

function handleLoad(fileData){
	var data = {};
	var lines = fileData.split("\n");
	data.v = [];
	data.f = [];
	data.vCount = 0;
	data.fCount = 0;
	
	for (line in lines){
		if(lines[line][0]=='v' && lines[line][1]==' '){
				var v = lines[line].split(' ');
				data.v.push(v[1], v[2], v[3]);
				data.vCount++;
			}
			if(lines[line][0]=='f' && lines[line][1]==' '){
				var f = lines[line].split(' ');
				data.f.push(f[1], f[2], f[3]);
				data.fCount+=3;
			}
	}
	return data;
}