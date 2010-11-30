const gpu_mode_hblank = 0; //Horizontal Blank, takes 204 clocks, done 144 times per vblank
const gpu_mode_vblank = 1; //Vertical Blank, takes 4560 clocks
const gpu_mode_scan_OAM = 2; //Object attribute memory access, takes 80 clocks
const gpu_mode_scan_VRAM = 3; //Video memory, takes 172 clocks. End of this mode is the end of a scanline

const c_white = 0xFE; //Color values for video output. These can be played with to make whatever :D
const c_lite = 0xC6;
const c_dark = 0x7C;
const c_black = 0x00;

var gpu_mode = gpu_mode_scan_OAM; //This mode needs to be written to 0xFF41
var gpu_timer = 0;
var gpu_scanline = 0;
var gpu_ready_to_draw = false;
var output_vram = []; //This is copied directly into an HTML5 canvas object

function init_gpu()
{
	for(var i = 0; i < 160*144*4; i++)
	{
		output_vram[i] = 0;
	}
	debug_out("GPU Initialized");
}

function execute_gpu_step(ticks)
{
	gpu_timer += ticks;
	if(gpu_mode == gpu_mode_hblank) //Happens every time one complete scanline is drawn
	{
		if(gpu_timer > 203) //Amount of time per scanline
		{
			gpu_timer = 0;
			gpu_scanline++;
			if(gpu_scanline == 143) //The screen is 144 lines tall, we've now completed 0-143
			{
				gpu_mode = gpu_mode_vblank;
				gpu_ready_to_draw = true;
			}
			else
				gpu_mode = gpu_mode_scan_OAM;
		}
	}
	else if(gpu_mode == gpu_mode_vblank) //Happens every time the full screen is drawn
	{
		if(gpu_timer > 456)
		{
			gpu_timer = 0; //This is done because the GB keeps counting scanlines after it finishes the screen. Some games check the scanline value to tell it's in vblank > 143
			gpu_scanline++;
			if(gpu_scanline > 153)
			{
				gpu_mode = gpu_mode_scan_OAM;
				gpu_scanline = 0;
				debug_out("Vblank completed");
			}
		}
	}
	else if(gpu_mode == gpu_mode_scan_OAM) //These two are split into 2 parts because the status can be checked via a register
	{
		if(gpu_timer > 79)
		{
			gpu_timer = 0;
			gpu_mode = gpu_mode_scan_VRAM;
		}
	}
	else if(gpu_mode == gpu_mode_scan_VRAM)
	{
		if(gpu_timer > 171)
		{
			gpu_timer = 0;
			gpu_mode = gpu_mode_hblank;
			do_scanline();
			
		}
	}
	
	//Now lets update our memory registers
	//TODO:
	//0xFF40 - LCD and GPU misc stuff
	//0xFF42 - Scroll Y
	//0xFF43 - Scroll X
	//0xFF47 - BG Palette
	wb(0xFF44, gpu_scanline & 0xFF);
}

function do_scanline()
{
	var scrollX = rb(0xFF43);
	var scrollY = rb(0xFF42);
	var tilemap_offset = 0x1800; //These next lines calculate the line of tiles we're on in memory. This is finding the index of the tile, not the tile data itself
	if(rb(0xFF40) & 0x08 == 1) tilemap_offset += 0x0500; //this needs to be bit 3, I think I got the right one. I'm assuming the 1's place is bit 0 and the 64's place is bit 7
	tilemap_offset += ((gpu_scanline + scrollY)&0xFF) >> 3; //Divide by 8 because each tile is 8x8 px and we want to get which tile we're on
	var x_tile_offset = scrollX >> 3;
	var x_px_offset = scrollX - (Math.floor(scrollX / 8)*8); //hopefully this returns 0-7...
	var y_px_offset = (scrollY+gpu_scanline) - (Math.floor((scrollY+gpu_scanline) / 8)*8);
	
	var current_tile = tilemap_offset + x_tile_offset;
	if(rb(0xFF40) & 0x16 == 1 && current_tile < 128) current_tile += 256;
	
	var output_addr = gpu_scanline * 160 * 4;
	for(var i = 0; i < 160; i++)
	{
		var tempaddr = 0x8000 + current_tile * 16 + y_px_offset * 2;
		var hi = rb(tempaddr);
		var lo = rb(tempaddr+1);

		for(var j = x_px_offset; j < 8; j++)
		{
			var mask = 1 << (7-j);
			var col = (hi & mask) << 1 + (lo & mask);
			var outcol = c_black;
			var error = false;
			if(col == 0x00) outcol = c_white;
			else if(col == 0x01) outcol = c_lite;
			else if(col == 0x02) outcol = c_dark;
			else if(col == 0x04) outcol = c_black;
			else error = true;
			
			if(!error)
			{
				output_vram[output_addr++] = outcol;
				output_vram[output_addr++] = outcol;
				output_vram[output_addr++] = outcol;
				output_vram[output_addr++] = 0xFF; //We don't want to change the alpha channel
			}
			else
			{
				//Output lime green as an error pixel
				output_vram[output_addr++] = 0;
				output_vram[output_addr++] = 0xFF;
				output_vram[output_addr++] = 0;
				output_vram[output_addr++] = 0xFF;
			}
		}
		
		x_px_offset = 0;
		x_tile_offset++;
		x_tile_offset &= 0x1F;
		current_tile = tilemap_offset + x_tile_offset;
		if(rb(0xFF40) & 0x16 == 1 && current_tile < 128) current_tile += 256;
	}
}
