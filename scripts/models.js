var objectsName = [
	"map_canals","map_concrete",
	"sky",

	"map_pipes",
	"map_valves_0",
	"map_valves_1",
	"map_valves_2",
	"map_valves_3",
	
	"switch",
	"switch",
	
	"gate_a",
	"gate_b",
	"gate_open",
	
	"water_gate",
	"water_gate_open",
	
	"bars","bars",
	
	"small_pipe","small_pipe","small_pipe","small_pipe","small_pipe","small_pipe","small_pipe","small_pipe","small_pipe","small_pipe",
	"small_pipe","small_pipe","small_pipe","small_pipe","small_pipe","small_pipe","small_pipe","small_pipe","small_pipe","small_pipe",
	"small_pipe","small_pipe","small_pipe","small_pipe","small_pipe","small_pipe",

	// INTERACT

	"key"
	];
	
var keyPosition = [0.0, 1.0, -2.0];
var gatePosition = [18.0, 0.0, -12.0];
var switchPosition = [18.0, 0.0, -17.75];

var objectPosition = [
	[ 0.0, 0.0, 0.0], 	// MAP_CANALS
	[ 0.0, 0.0, 0.0], 	// MAP_CONCRETE
	[ 0.0, 0.0, 0.0],	// SKY
	
	[ 0.0, 0.0, 0.0],	// MAP_PIPES
	[ 0.0, 0.0, 0.0],	// MAP_VALVES_0
	[ 0.0, 0.0, 0.0],	// MAP_VALVES_1
	[ 0.0, 0.0, 0.0],	// MAP_VALVES_0
	[ 0.0, 0.0, 0.0],	// MAP_VALVES_1
	
	[ 17.5, 0.0, -17.75], // SWITCH
	[ 18.5, 0.0, -17.75], // SWITCH
	
	[ 18.0, 0.0, -12.0], // GATE_A
	[ 18.0, 0.0, -12.0], // GATE_B
	[ 18.0, 0.0, -12.0], // GATE_OPEN	
	
	[-6.0, 0.2, -17.2], 	// WATER_GATE
	[-6.0, 0.2, -17.2], 	// WATER_GATE_OPEN
	
	// BARS
	[ 12.1, 0.0, 8.0],
	[-19.9, 0.0, 8.0],
	
	// SMALL_PIPE x26
	[ 3.1, -21.5, 6.0],
	[ 3.1, -21.5, 6.4],
	[ 3.1, -17.5, 6.0],
	[ 3.1, -17.5, 6.4],
	[ 3.1, -13.5, 6.0],
	[ 3.1, -13.5, 6.4],
	[ 3.1, -9.5, 6.0],
	[ 3.1, -9.5, 6.4],	
	[ 3.1, -5.5, 6.0],
	[ 3.1, -5.5, 6.4],
	
	[ 3.1, -1.5, 6.0],
	[ 3.1, -1.5, 6.4],	
	[ 3.1,  2.5, 6.0],
	[ 3.1,  2.5, 6.4],	
	[ 3.1,  6.5, 6.0],
	[ 3.1,  6.5, 6.4],
	[ 3.1, 10.5, 6.0],
	[ 3.1, 10.5, 6.4],
	[ 3.1, 14.5, 6.0],
	[ 3.1, 14.5, 6.4],
	
	[ 3.1, 18.5, 6.0],
	[ 3.1, 18.5, 6.4],
	[ 3.1, 22.5, 6.0],
	[ 3.1, 22.5, 6.4],
	[ 3.1, 26.5, 6.0],
	[ 3.1, 26.5, 6.4],
	
	[0.0, 1.0, -2.0] // KEY
	//[-6.0, 1.3, 24.5] // KLJUC y/x/za
	];

var objectRotation = [
	[ 0.0, 0.0, 0.0], // MAP_CANALS
	[ 0.0, 0.0, 0.0], // MAP_CONCRETE
	[ 0.0, 0.0, 0.0], // SKY
	
	[ 0.0, 0.0, 0.0], // MAP_PIPES
	[ 0.0, 0.0, 0.0], // MAP_VALVES_0
	[ 0.0, 0.0, 0.0], // MAP_VALVES_1
	[ 0.0, 0.0, 0.0], // MAP_VALVES_2
	[ 0.0, 0.0, 0.0], // MAP_VALVES_3
	
	[ 0.0, 0.0, 0.0], // SWITCH
	[ 0.0, 0.0, 0.0], // SWITCH
	
	[ 0.0, 0.0, 0.0], // GATE_A
	[ 0.0, 0.0, 0.0], // GATE_B
	[ 0.0, 0.0, 0.0], // GATE_OPEN
	
	[ 0.0, 0.0, 0.0], // WATER_GATE
	[ 0.0, 0.0, 0.0], // WATER_GATE_OPEN
	// BARS
	[ 0.0, 90.0, 0.0],
	[ 0.0, 90.0, 0.0],
	
	// SMALL_PIPE x26
	[90.0,90.0, 0.0],
	[90.0,90.0, 0.0],
	[90.0,90.0, 0.0],
	[90.0,90.0, 0.0],
	[90.0,90.0, 0.0],
	[90.0,90.0, 0.0],
	[90.0,90.0, 0.0],
	[90.0,90.0, 0.0],
	[90.0,90.0, 0.0],
	[90.0,90.0, 0.0],
	
	[90.0,90.0, 0.0],
	[90.0,90.0, 0.0],
	[90.0,90.0, 0.0],
	[90.0,90.0, 0.0],
	[90.0,90.0, 0.0],
	[90.0,90.0, 0.0],
	[90.0,90.0, 0.0],
	[90.0,90.0, 0.0],
	[90.0,90.0, 0.0],
	[90.0,90.0, 0.0],
	
	[90.0,90.0, 0.0],
	[90.0,90.0, 0.0],
	[90.0,90.0, 0.0],
	[90.0,90.0, 0.0],
	[90.0,90.0, 0.0],
	[90.0,90.0, 0.0],
	
	[0.0, 0.0, 0.0] // KEY
	];	
		
		
		
		
