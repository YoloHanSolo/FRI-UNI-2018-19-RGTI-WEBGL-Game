var online_prev = false;
var oncross_prev = true;
var oncorner_prev = false;

var online = false;
var oncross = false;
var oncorner = false;

function collision(){
	online = false;
	oncross = false;
	oncorner = false;

	if( cameraPosition[2] >= 1   && cameraPosition[2] <= 3  ) oncross = true;
	if( cameraPosition[2] >= -11 && cameraPosition[2] <= -9 ) oncross = true;
	
	if( cameraPosition[0] >= 19  && cameraPosition[0] <=  21 )	oncorner = true;			
	if( cameraPosition[0] >= -33 && cameraPosition[0] <= -31 )	oncorner = true;
	
	if( cameraPosition[0] >= -19 && cameraPosition[0] <= -17 ) online = true;	
	if( cameraPosition[0] >= -7  && cameraPosition[0] <=  -5 ) online = true;
	if( cameraPosition[0] >= 5   && cameraPosition[0] <=   7 ) online = true;
	if( cameraPosition[0] >  21 ) cameraPosition[0] = Math.round(cameraPosition[0]);
	if( cameraPosition[0] < -33 ) cameraPosition[0] = Math.round(cameraPosition[0]);
		
	if( online_prev && !online ){
		if( !oncross && !oncorner){ 
			cameraPosition[0] = Math.round(cameraPosition[0]);
			online = true;
		}
	}
	if( oncross_prev && !oncross ){
		if( !online && !oncorner){ 
			cameraPosition[2] = Math.round(cameraPosition[2]);
			oncross = true;
		}
	}
	if( oncorner_prev && !oncorner ){
		if( !oncross){ 
			cameraPosition[0] = Math.round(cameraPosition[0]);
			oncorner = true;
		}	
	}
	
	if( cameraPosition[2] >  3 && !online ) 	cameraPosition[2] = Math.round(cameraPosition[2]);
	if( cameraPosition[2] < -11 && !online )   cameraPosition[2] = Math.round(cameraPosition[2]);
	
	oncorner_prev = oncorner;	
	online_prev = online;
	oncross_prev = oncross;
}

setInterval(function() {
	console.log(cameraPosition+" "+online+" "+oncross+" "+oncorner);
}, 500);