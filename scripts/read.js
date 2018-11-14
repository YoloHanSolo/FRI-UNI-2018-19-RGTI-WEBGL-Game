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
				data.v.push(parseFloat(v[1]), parseFloat(v[2]), parseFloat(v[3]));
				data.vCount++;
			}
			if(lines[line][0]=='f' && lines[line][1]==' '){
				var f = lines[line].split(' ');
				data.f.push(parseInt(f[1]), parseInt(f[2]), parseInt(f[3]));
				data.fCount+=3;
			}
	}
	return data;
}