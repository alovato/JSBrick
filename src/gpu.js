const gpu_mode_hblank = 0; //Horizontal Blank, takes 204 clocks, done 144 times per vblank
const gpu_mode_vblank = 1; //Vertical Blank, takes 4560 clocks
const gpu_mode_scan_OAM = 2; //Object attribute memory access, takes 80 clocks
const gpu_mode_scan_VRAM = 3; //Video memory, takes 172 clocks. End of this mode is the end of a scanline

const c_white = 0xFE; //Color values for video output. These can be played with to make whatever :D
const c_lite = 0xC6;
const c_dark = 0x7C;
const c_black = 0x00;

var canvas;
var gpu_mode = gpu_mode_scan_OAM; //This mode needs to be written to 0xFF41
var gpu_timer = 0;
var gpu_scanline = 0;
var gpu_blankscreen = false;
var gpu_ready_to_draw = false;
var output_vram; //This is copied directly into an HTML5 canvas object
var vram;

function init_gpu()
{
	output_vram = canvas.getImageData(0, 0, 160, 144);
	vram = output_vram.data;
}

function execute_gpu_step(ticks)
{
	gpu_timer += ticks;
	if(gpu_mode == gpu_mode_hblank) //Happens every time one complete scanline is drawn
	{
		if(gpu_timer >= 204) //Amount of time per scanline
		{
			gpu_timer = 0;
			gpu_scanline++;
			if(gpu_scanline == 144) //The screen is 144 lines tall, we've now completed 0-143
			{
				gpu_mode = gpu_mode_vblank;
				
				gpu_ready_to_draw = true;
				if( !(rb(0xFF40) & 0x80) ) gpu_blankscreen = true; //MAKE THIS AFFECT DRAWING
				else gpu_blankscreen = false;
			}
			else
			{
				gpu_mode = gpu_mode_scan_OAM;
			}
		}
	}
	else if(gpu_mode == gpu_mode_vblank) //Happens every time the full screen is drawn
	{
		if(gpu_timer >= 456)
		{
			gpu_timer = 0; //This is done because the GB keeps counting scanlines after it finishes the screen. Some games check the scanline value to tell it's in vblank > 143
			gpu_scanline++;
			if(gpu_scanline > 153)
			{
				output_vram = canvas.getImageData(0, 0, 160, 144);
				vram = output_vram.data;
				gpu_mode = gpu_mode_scan_OAM;
				gpu_scanline = 0;
				
				var raised_interrupts = rb(0xFF0F);
				raised_interrupts |= interrupt_vblank;
				wb(0xFF0F, raised_interrupts);
			}
		}
	}
	else if(gpu_mode == gpu_mode_scan_OAM) //These two are split into 2 parts because the status can be checked via a register
	{
		if(gpu_timer >= 80)
		{
			gpu_timer = 0;
			gpu_mode = gpu_mode_scan_VRAM;
		}
	}
	else if(gpu_mode == gpu_mode_scan_VRAM)
	{
		if(gpu_timer >= 172)
		{
			gpu_timer = 0;
			gpu_mode = gpu_mode_hblank;
			do_scanline();
		}
	}
	
	//Now lets update our memory registers
	//TODO:
	//0xFF40 - LCD and GPU misc stuff
	
	mem[0xFF44] = gpu_scanline & 0xFF; //Writing here normally resets it, so we set it directly
	var lyc = rb(0xFF45);
	var stat = (gpu_scanline == lyc?0x04:0) | gpu_mode;
	wb(0xFF41, stat & 0xFF);
}

function do_scanline()
{
	var scrollX = rb(0xFF43);
	var scrollY = rb(0xFF42);
	var tilemap_offset = 0x1800; //These next lines calculate the line of tiles we're on in memory. This is finding the index of the tile, not the tile data itself
	if(rb(0xFF40) & 0x08) tilemap_offset += 0x0500;
	tilemap_offset += (((gpu_scanline + scrollY)&0xFF) >> 3) * 32; //Divide by 8 because each tile is 8x8 px and we want to get which tile we're on
	var x_tile_offset = (scrollX >> 3);
	

	var current_tile = rb(0x8000 + tilemap_offset + x_tile_offset); //DONT TOUCH THIS! Tetris shows a screen!
	//Get tile index
	if(rb(0xFF40) & 0x10 != 0x10)
	{
		//if(current_tile < 0x80)	//WHY DOES THIS BREAK NINTY LOGO!?!?
		//	current_tile += 0xFF;
	}

	//I'm pretty sure everything below this works, wtih maybe the exception of the other current tile thing
	var x_px_offset = scrollX & 0x07;
	var y_px_offset = (scrollY+gpu_scanline) & 0x07;	
	var output_addr = gpu_scanline * 160 * 4;
	var start_x_off = x_px_offset;
	for(var i = 0; i < 160; i++)
	{
		var tempaddr = 0x8000 + current_tile*16 + y_px_offset*2;
		var hi = rb(tempaddr+1);
		var lo = rb(tempaddr);
		var mask = 1 << (7-((i-start_x_off)&0x07));
		var col = 0;
		if(hi & mask) col = 2;
		if(lo & mask) col += 1;
		var outcol = 100;
		var error = true;		
		
		var pal = rb(0xFF47);

		//debug_out(pal + ", " + col);
		if(col == 0x03)
		{
			error = false;
			var temp = (rb(0xFF47) >> 6) & 0x03;
			if(temp == 3) outcol = c_black;
			else if(temp == 2) outcol = c_dark;
			else if(temp == 1) outcol = c_lite;
			else if(temp == 0) outcol = c_white;
			else error = true;
		}
		else if(col == 0x02)
		{
			error = false;
			var temp = (rb(0xFF47) >> 4) & 0x03;
			if(temp == 3) outcol = c_black;
			else if(temp == 2) outcol = c_dark;
			else if(temp == 1) outcol = c_lite;
			else if(temp == 0) outcol = c_white;
			else error = true;
		}
		else if(col == 0x01)
		{
			error = false;
			var temp = (rb(0xFF47) >> 2) & 0x03;
			if(temp == 3) outcol = c_black;
			else if(temp == 2) outcol = c_dark;
			else if(temp == 1) outcol = c_lite;
			else if(temp == 0) outcol = c_white;
			else error = true;
		}
		else if(col == 0x00)
		{
			error = false;
			var temp = rb(0xFF47) & 0x03;
			if(temp == 3) outcol = c_black;
			else if(temp == 2) outcol = c_dark;
			else if(temp == 1) outcol = c_lite;
			else if(temp == 0) outcol = c_white;
			else error = true;
		}
		
		if(!error)
		{
			if(!gpu_blankscreen)
			{
				vram[output_addr++] = outcol;
				vram[output_addr++] = outcol;
				vram[output_addr++] = outcol;
				vram[output_addr++] = 0xFF; //We don't want to change the alpha channel
			}
			else
			{
				vram[output_addr++] = 0xFF;
				vram[output_addr++] = 0xFF;
				vram[output_addr++] = 0xFF;
				vram[output_addr++] = 0xFF;
			}
		}
		else
		{
			//Output lime green as an error pixel
			vram[output_addr++] = 0;
			vram[output_addr++] = 0xFF;
			vram[output_addr++] = 0;
			vram[output_addr++] = 0xFF;
		}
		
		x_px_offset++;
		if(x_px_offset >= 8)
		{
			x_px_offset = 0;
			x_tile_offset++;
			x_tile_offset &= 0x1F;
			current_tile = rb(0x8000 + tilemap_offset + x_tile_offset);
			if(rb(0xFF40) & 0x10 != 0x10)
			{
				//if(current_tile < 0x80)	//WHY DOES THIS BREAK NINTY LOGO!?!?
				//	current_tile += 0xFF;
			}
		}
	}
}
