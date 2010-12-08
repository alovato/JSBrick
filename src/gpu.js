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
var last_scanline = 0;
var draw_frame = false;
var hit_stat_interrupt = false;
var objdata = [];


function init_gpu()
{
	output_vram = canvas.getImageData(0, 0, 160, 144);
	vram = output_vram.data;

   for (var i = 0, n = 0;i < 40; i++, n += 4)
   {
      wb(0xFE00 + n + 0, 0);
      wb(0xFE00 + n + 1, 0);
      wb(0xFE00 + n + 2, 0);
      wb(0xFE00 + n + 3, 0);
      objdata[i] = { y:-16, x:-8, tile:0, palette:0,
                     xflip:0, yflip:0, prio:0, num:i };
   }
}

function execute_gpu_step(ticks)
{
	gpu_timer += ticks;
	
	var last_mode = gpu_mode;
	
	if(gpu_timer >= 456)
	{
		gpu_timer -= 456;
		
		gpu_scanline++;
		if(rb(0xFF41) & 0x40 && gpu_scanline == rb(0xFF45))
		{
			wb(0xFF0F, rb(0xFF0F) | interrupt_stat);
		}
		
		if(gpu_scanline == 144) //The screen is 144 lines tall, we've now completed 0-143
		{
			gpu_mode = gpu_mode_vblank;
		}
		if(gpu_scanline >= 154)
		{
			output_vram = canvas.getImageData(0, 0, 160, 144);
			vram = output_vram.data;
			gpu_scanline = 0;
		}
	}

	if(gpu_scanline < 144)
	{
		
		if(gpu_timer <= 204) gpu_mode = gpu_mode_hblank;
		else if(gpu_timer <= 284) gpu_mode = gpu_mode_scan_OAM;
		else gpu_mode = gpu_mode_scan_VRAM;
		
		drew_frame = false;
	}
	
	if(gpu_mode != last_mode) //STAT interrupt, I think
	{
		var temp = ( rb(0xFF41) & (1<<(gpu_mode+3)) ); //This... might work?
		if(temp)
		{
			wb(0xFF0F, rb(0xFF0F) | interrupt_stat);
		}
	}
	if(gpu_mode == gpu_mode_hblank) //Happens every time one complete scanline is drawn
	{
		
	}
	else if(gpu_mode == gpu_mode_vblank) //Happens every time the full screen is drawn
	{
		if(!drew_frame)
		{
			wb(0xFF0F, rb(0xFF0F) | interrupt_vblank);			
			gpu_ready_to_draw = true;
		
			if( !(rb(0xFF40) & 0x80) ) gpu_blankscreen = true;
			else gpu_blankscreen = false;
			
			drew_frame = true;
		}
	}
	else if(gpu_mode == gpu_mode_scan_OAM) //These two are split into 2 parts because the status can be checked via a register
	{
	}
	else if(gpu_mode == gpu_mode_scan_VRAM)
	{
		if(last_scanline != gpu_scanline)
		{
			do_scanline();
			last_scanline = gpu_scanline;
		}
	}
	
	//Now lets update our memory registers
	//TODO:
	//0xFF40 - LCD and GPU misc stuff
	
	mem[0xFF44] = gpu_scanline & 0xFF; //Writing here normally resets it, so we set it directly
	var lyc = rb(0xFF45);
	var stat = (gpu_scanline == lyc?0x04:0) | gpu_mode&0x03;
	wb(0xFF41, (rb(0xFF41) & 0xF8) | stat); //Leave the upper 4 bits alone
}

function do_scanline()
{
	var using_window = false;
	var windowX = rb(0xFF4B);
	var windowY = rb(0xFF4A);
	var scrollX = rb(0xFF43);
	var scrollY = rb(0xFF42);
	var tile_base;
	if(rb(0xFF40) & 0x10) tile_base = false;
	else tile_base = true;
	
	var tilemap_offset = 0x1800; //These next lines calculate the line of tiles we're on in memory. This is finding the index of the tile, not the tile data itself
	if(rb(0xFF40) & 0x08) tilemap_offset += 0x0500;
	tilemap_offset += (((gpu_scanline + scrollY)&0xFF) >> 3) * 32; //Divide by 8 because each tile is 8x8 px and we want to get which tile we're on
	var x_tile_offset = (scrollX >> 3);
	var current_tile = rb(0x8000 + tilemap_offset + x_tile_offset); //DONT TOUCH THIS! Tetris shows a screen!
	//Get tile index

	//I'm pretty sure everything below this works, wtih maybe the exception of the other current tile thing
	var x_px_offset = scrollX & 0x07;
	var y_px_offset = (scrollY+gpu_scanline) & 0x07;
	var output_addr = gpu_scanline * 160 * 4;
	var start_x_off = x_px_offset;
	var outcol = 0;
	for(var i = 0; i < 160; i++)
	{
		if(rb(0xFF40) & 0x20 && gpu_scanline >= windowY && i >= windowX-7 && !running_bios)
		{
			using_window = true; //TODO: Actually draw the window
		}
		var tempaddr;
		if(!tile_base)
		{
			tempaddr = 0x8000 + current_tile*16 + y_px_offset*2;
		}
		else
		{
			if(current_tile > 127) current_tile -= 256;
			tempaddr = 0x9000 + current_tile*16 + y_px_offset*2;
		}
		
		var hi = rb(tempaddr+1);
		var lo = rb(tempaddr);
		var mask = 1 << ( 7 - ( (i+start_x_off) & 0x07 ) );
		var col = 0;
		if(hi & mask) col = 2;
		if(lo & mask) col += 1;
		outcol = pick_color(col, rb(0xFF47)); //This is correct if there is no window	
		if(!using_window)
		{
			if(!gpu_blankscreen)
			{
				vram[output_addr++] = outcol * 0.9;
				vram[output_addr++] = outcol;
				vram[output_addr++] = outcol * 0.6;
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
		else //Debug code to show where the "window" is onscreen
		{
			vram[output_addr++] = outcol; //Window is drawn in grayscale for debugging
			vram[output_addr++] = outcol;
			vram[output_addr++] = outcol;
			vram[output_addr++] = 0xFF;
		}
		x_px_offset++;
		if(x_px_offset >= 8)
		{
			x_px_offset = 0;
			x_tile_offset++;
			x_tile_offset &= 0x1F;
			current_tile = rb(0x8000 + tilemap_offset + x_tile_offset);
		}
	}
	for (var spr = 0; spr < 40; spr++)
	{
		if(running_bios) break;
	   var obj = objdata[spr];

	   if (obj.y <= gpu_scanline && (obj.y + 8) > gpu_scanline)
	   {
			var temptile = obj.tile;
			if(rb(0xFF40) & 0x04) temptile &= 0xFE;
			outcol = -1;
			var stempaddr;
			stempaddr = 0x8000 + temptile * 16 + ((gpu_scanline - obj.y)&0x07)*2;
			var shi = rb(stempaddr + 1);
			var slo = rb(stempaddr);
			for (var sx = 0; sx < 8; sx++)
			{
				var smask;
				if(!obj.xflip) smask = 0x80 >> sx;
				else smask = 0x01 << sx;
				var scol = 0;
				if (shi & smask) scol = 2;
				if (slo & smask) scol++;
				var color = pick_color(scol, rb(0xFF48+obj.palette));
				if ((obj.x + sx) >= 0 && (obj.x - 8) < 160 && scol) //Doesn't check priority with background. Fix later.
				{
					outcol = color;
					var output_addr;
					output_addr = (gpu_scanline * 160 + obj.x + sx) * 4;
					if(!gpu_blankscreen)
					{
						vram[output_addr++] = outcol * 0.9;
						vram[output_addr++] = outcol;
						vram[output_addr++] = outcol * 0.6;
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
			}
		}
	}
}

function buildobj(addr, val)
{
	//debug_out("Build object " + addr.toString(16) + ", " + val.toString(16));
   var obj = (addr-0xFE00) >> 2;
   if (obj < 40)
   {
		
      switch (addr & 3)
      {
         case 0:
            objdata[obj].y = val - 16; //this is correct, but we'll hack for tetris
            break;
         case 1: 
            objdata[obj].x = val - 8;
            break;
         case 2:
            objdata[obj].tile = val;
            break;
         case 3:
            objdata[obj].palette = (val & 0x10) ? 1 : 0;
            objdata[obj].xflip   = (val & 0x20) ? 1 : 0;
            objdata[obj].yflip   = (val & 0x30) ? 1 : 0;
            objdata[obj].prio    = (val & 0x40) ? 1 : 0;
            break;
      }
   }
}


function pick_color(col, pal)
{
	var outcol = 0;
	if(col == 0x03)
	{
		var temp = (pal >> 6) & 0x03;
		if(temp == 3) outcol = c_black;
		else if(temp == 2) outcol = c_dark;
		else if(temp == 1) outcol = c_lite;
		else if(temp == 0) outcol = c_white;
	}
	else if(col == 0x02)
	{
		var temp = (pal >> 4) & 0x03;
		if(temp == 3) outcol = c_black;
		else if(temp == 2) outcol = c_dark;
		else if(temp == 1) outcol = c_lite;
		else if(temp == 0) outcol = c_white;
	}
	else if(col == 0x01)
	{
		var temp = (pal >> 2) & 0x03;
		if(temp == 3) outcol = c_black;
		else if(temp == 2) outcol = c_dark;
		else if(temp == 1) outcol = c_lite;
		else if(temp == 0) outcol = c_white;
	}
	else if(col == 0x00)
	{
		var temp = pal & 0x03;
		if(temp == 3) outcol = c_black;
		else if(temp == 2) outcol = c_dark;
		else if(temp == 1) outcol = c_lite;
		else if(temp == 0) outcol = c_white;
	}
	return outcol;
}

