var dPad    = 0x0F; //up down left right
var buttons = 0x0F; //start select a b
var input_last_write = 0;
function KeyDown(e){
	switch (e.keyCode){
		//Left      - Left arrow
		case 37: dPad    &= 0xFD; wb(0xFF0F, rb(0xFF0F)|interrupt_input); e.preventDefault(); break;
		//Up        - Up arrow
		case 38: dPad    &= 0xFB; wb(0xFF0F, rb(0xFF0F)|interrupt_input); e.preventDefault(); break;
		//Right     - Right arrow
		case 39: dPad    &= 0xFE; wb(0xFF0F, rb(0xFF0F)|interrupt_input); e.preventDefault(); break;
		//Down      - Down arrow
		case 40: dPad    &= 0xF7; wb(0xFF0F, rb(0xFF0F)|interrupt_input); e.preventDefault(); break;
		//Start     - Enter
		case 13: buttons &= 0xF7; wb(0xFF0F, rb(0xFF0F)|interrupt_input); e.preventDefault(); break;
		//Select    - Space
		case 32: buttons &= 0xFB; wb(0xFF0F, rb(0xFF0F)|interrupt_input); e.preventDefault(); break;
		//B button  - B
		case 88: buttons &= 0xFD; wb(0xFF0F, rb(0xFF0F)|interrupt_input); e.preventDefault(); break;
		//A button  - Z
		case 90: buttons &= 0xFE; wb(0xFF0F, rb(0xFF0F)|interrupt_input); e.preventDefault(); break;
	}
	//debug_out("key event!" + rb(0xFF80).toString(16));
}
function KeyUp(e){
	switch (e.keyCode){
		//Left      - Left arrow
		case 37: dPad    |= 0x02; wb(0xFF0F, rb(0xFF0F)|interrupt_input); e.preventDefault(); break;
		//Up        - Up arrow
		case 38: dPad    |= 0x04; wb(0xFF0F, rb(0xFF0F)|interrupt_input); e.preventDefault(); break;
		//Right     - Right arrow
		case 39: dPad    |= 0x01; wb(0xFF0F, rb(0xFF0F)|interrupt_input); e.preventDefault(); break;
		//Down      - Down arrow
		case 40: dPad    |= 0x08; wb(0xFF0F, rb(0xFF0F)|interrupt_input); e.preventDefault(); break;
		//Start     - Enter
		case 13: buttons |= 0x08; wb(0xFF0F, rb(0xFF0F)|interrupt_input); e.preventDefault(); break;
		//Select    - Space
		case 32: buttons |= 0x04; wb(0xFF0F, rb(0xFF0F)|interrupt_input); e.preventDefault(); break;
		//B button  - B
		case 88: buttons |= 0x02; wb(0xFF0F, rb(0xFF0F)|interrupt_input); e.preventDefault(); break;
		//A button  - Z
		case 90: buttons |= 0x01; wb(0xFF0F, rb(0xFF0F)|interrupt_input); e.preventDefault(); break;
	}
}