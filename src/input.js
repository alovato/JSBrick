var dPad    = 0xEF; //up down left right
var buttons = 0xDF; //start select a b

function KeyDown(e){
	debug_out("key event!");
	switch (e.which){
		//Left      - Left arrow
		case 37: dPad    &= 0xFD; wb(0xFF0F, rb(0xFF0F)|16); e.preventDefault(); break;
		//Up        - Up arrow
		case 38: dPad    &= 0xFB; wb(0xFF0F, rb(0xFF0F)|16); e.preventDefault(); break;
		//Right     - Right arrow
		case 39: dPad    &= 0xFE; wb(0xFF0F, rb(0xFF0F)|16); e.preventDefault(); break;
		//Down      - Down arrow
		case 40: dPad    &= 0xF7; wb(0xFF0F, rb(0xFF0F)|16); e.preventDefault(); break;
		//Start     - Enter
		case 13: buttons &= 0xF7; wb(0xFF0F, rb(0xFF0F)|16); e.preventDefault(); break;
		//Select    - Space
		case 32: buttons &= 0xFB; wb(0xFF0F, rb(0xFF0F)|16); e.preventDefault(); break;
		//B button  - B
		case 88: buttons &= 0xFD; wb(0xFF0F, rb(0xFF0F)|16); e.preventDefault(); break;
		//A button  - Z
		case 90: buttons &= 0xFE; wb(0xFF0F, rb(0xFF0F)|16); e.preventDefault(); break;
	}
}
function KeyUp(e){
	switch (e.which){
		//Left      - Left arrow
		case 37: dPad    |= 0x02; wb(0xFF0F, rb(0xFF0F)|16); e.preventDefault(); break;
		//Up        - Up arrow
		case 38: dPad    |= 0x04; wb(0xFF0F, rb(0xFF0F)|16); e.preventDefault(); break;
		//Right     - Right arrow
		case 39: dPad    |= 0x01; wb(0xFF0F, rb(0xFF0F)|16); e.preventDefault(); break;
		//Down      - Down arrow
		case 40: dPad    |= 0x08; wb(0xFF0F, rb(0xFF0F)|16); e.preventDefault(); break;
		//Start     - Enter
		case 13: buttons |= 0x08; wb(0xFF0F, rb(0xFF0F)|16); e.preventDefault(); break;
		//Select    - Space
		case 32: buttons |= 0x04; wb(0xFF0F, rb(0xFF0F)|16); e.preventDefault(); break;
		//B button  - B
		case 88: buttons |= 0x02; wb(0xFF0F, rb(0xFF0F)|16); e.preventDefault(); break;
		//A button  - Z
		case 90: buttons |= 0x01; wb(0xFF0F, rb(0xFF0F)|16); e.preventDefault(); break;
	}
}