var online_prev = false;
var oncross_prev = true;
var oncorner_prev = false;
var inroom_prev = false;

var online = false;
var oncross = false;
var oncorner = false;
var inroom = false;

function collision(){
	online = false;
	oncross = false;
	oncorner = false;
	inroom = false;
	
	if( cameraPosition[0] <= -5 && cameraPosition[0] >= -9 ){
		if( cameraPosition[2] <= -13 && cameraPosition[2] >= -17 ) inroom = true;	
		if( cameraPosition[2] <=  25 && cameraPosition[2] >=  21 ) inroom = true;	
	}else if( cameraPosition[0] <= 19 && cameraPosition[0] >= 15 ){
		if( cameraPosition[2] <= -13 && cameraPosition[2] >= -17 ) inroom = true;
		if( cameraPosition[2] <=  25 && cameraPosition[2] >=  21 ) inroom = true;			
	}

	if( cameraPosition[2] >= -3   && cameraPosition[2] <= -1  ) oncross = true;
	if( cameraPosition[2] <= 11 && cameraPosition[2] >= 9 ) oncross = true;
	
	if( cameraPosition[0] >= -21  && cameraPosition[0] <= -19 )	oncorner = true;			
	if( cameraPosition[0] >= 31 && cameraPosition[0] <= 33 )	oncorner = true;
	
	if( cameraPosition[0] >= 17 && cameraPosition[0] <= 19 ) online = true;	
	if( cameraPosition[0] >= 5  && cameraPosition[0] <=  7 ) online = true;
	if( cameraPosition[0] >= -7 && cameraPosition[0] <= -5 ) online = true;
		
	if( online_prev && !online ){
		if( inroom ){
			
			
		}
		else if( !oncross && !oncorner ){ 
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
		if( !oncross && !online){ 
			cameraPosition[0] = Math.round(cameraPosition[0]);
			oncorner = true;
		}	
	}
	if( inroom_prev && !inroom ){
		if( !online ){ 
			cameraPosition[0] = Math.round(cameraPosition[0]);
			//cameraPosition[2] = Math.round(cameraPosition[2]);
			inroom = true;
		}
		if( !online && !online_prev){
			cameraPosition[0] = Math.round(cameraPosition[0]);
			cameraPosition[2] = Math.round(cameraPosition[2]);
			inroom = true;			
		}
	}
	
	if( oncorner_prev && ( cameraPosition[0] < -21 || cameraPosition[0] >  33) ){
		cameraPosition[0] = Math.round(cameraPosition[0]);
		oncorner = true;
	}
	if( oncorner_prev && ( cameraPosition[2] <  -3 || cameraPosition[2] >  11) ){
		cameraPosition[2] = Math.round(cameraPosition[2]);
		oncorner = true;
	}
	if( cameraPosition[2] < -17 || cameraPosition[2] > 25 ){
		cameraPosition[2] = Math.round(cameraPosition[2]);
		online = true;
	}
	
	inroom_prev = inroom;	
	oncorner_prev = oncorner;	
	online_prev = online;
	oncross_prev = oncross;
}
/*
setInterval(function() {
	console.log(cameraPosition+" "+online+" "+oncross+" "+oncorner+" "+inroom);
}, 500);
*/