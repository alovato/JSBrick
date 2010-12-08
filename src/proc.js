const debug_mode = true;
var proc_break = false;
var temp_result = 0; //For calculation
//Lets define our flags
const flag_zero = 0x80; //set when last op had result of 0
const flag_operation = 0x40; //set if last op was subtraction
const flag_halfcarry = 0x20; //set if the lower half of the byte overflowed past 15 in last op
const flag_carry = 0x10; //set if last operation was >255 or <0
const interrupt_vblank = 0x01;
const interrupt_stat = 0x02;
const interrupt_tima = 0x04;
const interrupt_input = 0x10;
var op = 0; //Used to write opcode to screen
var debug_output = [];
var call_trace = [];
var pc_trace = [];
var running_bios = true;
var interrupts_enabled = false;
var halt = false;
var stop = false;
//Let's make some registers (8 bit)
var A = 0, B = 0, C = 0, D = 0, E = 0, H = 0, L = 0, F = 0;
//And the 16 bits
var PC = 0, SP = 0; //Program counter, stack pointer
//To keep track of timing
var lastClock = 0;
var totalClock = 0;
//Now we'll make our array to map opcodes
var opcodes = [];
//And a temporary implementation of memory for testing
var mem = [];
var rom = [];
var ram_bank = [];
var instructionNames = [];
var tA, tB, tC, tD, tE, tF, tH, tL;
var div_timer = 0;
var tima_timer = 0;
var bank_mode = 0;
var ram_bank_count = 0;
var current_rom_bank = 1;
var current_ram_bank = 0;
var ram_bank_enabled = true;
var rom_bank_enabled = false;

function wb(addr, val) //Write byte
{
	val &= 0xFF;
	if(addr == 0xFF47) debug_out("wrote " + val.toString(16));
	//if(addr == 0xDFF7) debug_out("wrote DFF7 val " + val.toString(16) + " at " + PC.toString(16));
	//if(addr == 0xDFF6) debug_out("wrote DFF6 val " + val.toString(16) + " at " + PC.toString(16));
	//if(addr == 0xC000) debug_out("wrote val " + val.toString(16) + " at " + PC.toString(16));
	//if(addr == 0xD810) { debug_out("Wrote " + val + " to D810 at " + PC.toString(16)); }
	//if(addr == 0xD807) { debug_out("Wrote " + val + " to D807 at " + PC.toString(16)); }
	//if(addr == 0xD058) { debug_out("Wrote " + val + " to D058 at " + PC.toString(16)); }
	if(addr == 0xFF4A)
	{
		//debug_out("Window Y is now " + val + " pc " + PC.toString(16));
		//proc_break = true;
	}
	//if(running_bios) { mem[addr] = val; return; }
	if(addr < 0x8000)
	{
		if(addr < 0x2000 && bank_mode != 0)
		{
			if( !(bank_mode == 2 && addr & 0x10) )
			{
				if(val & 0x0F == 0xA) ram_bank_enabled = true;
				else ram_bank_enabled = false;
				//debug_out("ram bank enabled = " + ram_bank_enabled);
			}
		}
		else if(addr < 0x4000)
		{
			var oldval = val;
			if(bank_mode != 0)
			{
				if(bank_mode == 2)
				{
					current_rom_bank = val & 0xF;
				}
				else
				{
					current_rom_bank &= 0x60;
					val &= 0x1F;
					if(!val) val = 1;
					current_rom_bank |= val;
				}
				if(current_rom_bank == 0) current_rom_bank = 1;
				//debug_out("4000 new rom bank ( " + oldval + " ) = "  + current_rom_bank + " pc " + PC.toString(16));
			}
		}
		else if(addr < 0x6000)
		{
			if(bank_mode == 1)
			{
				if(rom_bank_enabled)
				{
					current_rom_bank &= 0x1F;
					current_rom_bank |= (val & 0x1F);
					if(current_rom_bank == 0) current_rom_bank = 1;
					//debug_out("6000 new rom bank = " +  current_rom_bank);
				}
				else
				{
					current_ram_bank = val & 0x3;
					//debug_out("new ram bank = " +  current_ram_bank);
				}
			}
		}
		else if(addr < 0x8000)
		{
			if(bank_mode == 1)
			{
				rom_bank_enabled = (val & 0x1 == 0);
				if(rom_bank_enabled) current_ram_bank = 0;
				//debug_out("rom bank enabled = " +  rom_bank_enabled);
				//debug_out("new ram bank = " +  current_ram_bank);
			}
		}
	}
	else if(addr >= 0xA000 && addr < 0xC000) //Maybe need to check if banking is enabled?
	{
		if(ram_bank_enabled)
		{
			addr -= 0xA000;
			ram_bank[addr + current_ram_bank*0x2000] = val;
		}
	}
	else if(addr == 0xFF44)
	{
		mem[0xFF44] = 0;
		gpu_scanline = 0;
	}
	else if(addr == 0xFF46) //OAM DMA Transfer
	{
		val = val<<8;
		var ad = 0xFE00;
		while(ad < 0xFEA0)
		{
			mem[ad] = rb(val);
			buildobj(ad++, rb(val++));
		}
	}
	else if(addr == 0xFF00)
	{
		input_last_write = val & 0x30;
	}
	else
	{	
		if(addr >= 0xE000 && addr <= 0xFE00) addr -= 0x2000; //Mirrored memory	
		mem[addr] = val;
	}
}
function rb(addr) //Read byte
{	
	//if(running_bios) { return mem[addr]; }
	if(addr >= 0x4000 && addr < 0x8000) //Read from the correct ROM bank
	{
		addr -= 0x4000;
		return rom[current_rom_bank * 0x4000 + addr];
	}
	if(addr >= 0xA000 && addr < 0xC000) //Read from the correct ROM bank
	{
		addr -= 0xA000;
		return ram_bank[current_ram_bank * 0x2000 + addr];
	}
	if(addr == 0xFF00)
	{
		switch (input_last_write)
		{
			case 0x00:	return dPad & buttons;
			case 0x10: 	return buttons;
			case 0x20:	return dPad;
			default: return 0x00;
		}
	}
	if(addr >= 0xE000 && addr <= 0xFE00) addr -= 0x2000; //Mirrored memory
	return mem[addr];
} 

function ww(addr, val) //Write word
{
	wb(addr, val&0x00FF);
	wb(addr+1, (val&0xFF00)/0x0100);
}
function rw(addr)
{
	return rb(addr) + (rb(addr+1)*0x0100);
} //read word with least sig byte first


function debug_out(string)
{
	if(!debug_mode) return;
	debug_output.push(string);
	if(debug_output.length > 500)
	{
		debug_output = debug_output.slice(debug_output.length-500);
	}
}
function call_out(string)
{
	if(!debug_mode) return;
	call_trace.push(string);
	pc_trace.push(PC.toString(16));
	if(call_trace.length > 500)
	{
		call_trace = call_trace.slice(call_trace.length-500);
		pc_trace = pc_trace.slice(pc_trace.length-500);
	}
}

function clear_flags()
{
	F = 0;
}
function set_flag_zero(tf)
{
	if(tf) F |= flag_zero;
	else F &= ~flag_zero;
}
function set_flag_carry(tf)
{
	if(tf) F |= flag_carry;
	else F &= ~flag_carry;
}
function set_flag_halfcarry(tf)
{
	if(tf) F |= flag_halfcarry;
	else F &= ~flag_halfcarry;
}
function set_flag_operation(tf)
{
	if(tf) F |= flag_operation;
	else F &= ~flag_operation;
}


function store_register_states()
{
	tA = A;
	tB = B;
	tC = C;
	tD = D;
	tE = E;
	tF = F;
	tH = H;
	tL = L;
}
function load_register_states()
{
	A = tA;
	B = tB;
	C = tC;
	D = tD;
	E = tE;
	F = tF;
	H = tH;
	L = tL;
}

function get_rom_info()
{
	switch(rom[0x0147])
	{
		case 0x00: 
			bank_mode = 0;
			break;
		case 0x01:
		case 0x02:
		case 0x03:
			bank_mode = 1;
			break;
		case 0x04:
		case 0x05:
		case 0x06:
			bank_mode = 2;
			break;
		default: debug_out("Invalid banking mode");
	}
	ram_bank_count = rom[0x0149]; //If we're using bank_mode 2, this should be 0
	current_rom_bank = 1;
	current_ram_bank = 0;
	var name = "";
	for(var i = 0x0134; i < 0x0143; i++)
	{
		name += String.fromCharCode(rom[i]);
	}
	debug_out("ROM INFO: " + name);
	debug_out("BANK MODE: " + bank_mode);
	debug_out("RAM BANK COUNT: " + ram_bank_count);
	debug_out("SIZE: " + ((rom[0x0148]+1) * 32) + "KB");
	
	
}

function load_image(fname) //Load in a rom. This will only work with a single bank game atm
{
	var temp = []
	var fin = new BinFileReader(fname);
	temp = String(fin.readString(fin.getFileSize(),0));
	for(i = 0; i < fin.getFileSize(); i+=1)
	{
		if(i < 0x8000) mem[i] = temp.charCodeAt(i);
		rom[i] = temp.charCodeAt(i);
	}
	if(fname != "bios.gb" && !running_bios)
		get_rom_info();
}
function reset()
{
	PC = 0x0000;
	A = 0x01;
	B = 0x00;
	C = 0x13;
	D  = 0x00;
	E = 0xD8;
	F = 0xB0;
	SP = 0xFFFE;
	H = 0x01;
	L = 0x4D;
	totalClock = 0;
	lastClock = 0;
	for(i = 0; i <= 0xFFFF; i+=1)
	{
		rom[i] = 0x00;
		ram_bank[i] = 0x00;
		mem[i] = 0x00;
	}
	//Setup our in-memory registers
	wb(0xFF00,0xFF);
	wb(0xFF04,0xAF);
	wb(0xFF07,0xF8);
	wb(0xFF10,0x80);
	wb(0xFF11,0xBF);
	wb(0xFF12,0xF3);
	wb(0xFF14,0xBF);
	wb(0xFF16,0x3F);
	wb(0xFF19,0xBF); 
	wb(0xFF1A,0x7F);
	wb(0xFF1B,0xFF);
	wb(0xFF1C,0x9F);
	wb(0xFF1E,0xBF);
	wb(0xFF20,0xFF);
	wb(0xFF23,0xBF);
	wb(0xFF24,0x77);
	wb(0xFF25,0xF3);
	wb(0xFF26,0xF1);
	wb(0xFF40,0x91);
	wb(0xFF47,0xFC);
	wb(0xFF48,0xFF);
	wb(0xFF49,0xFF);
	
	
	debug_out("Z80 Initialized");
}

            

function execute_step()
{
	if(!halt && !stop)
	{
		op = rb(PC);
		call_out(instructionNames[op] + " : " + "0x" + op.toString(16));
		opcodes[rb(PC++)]();
		
		//if(PC == 0x4EC) proc_break = true;
		
		SP &= 0xFFFF;
		PC &= 0xFFFF;
		A &= 0xFF;
		B &= 0xFF;
		C &= 0xFF;
		D &= 0xFF;
		E &= 0xFF;
		F &= 0xFF;
		H &= 0xFF;
		L &= 0xFF;
		totalClock += lastClock;
		
		if(SP == 0xFFFF) debug_out("Stack error");
		
		if(PC == 0x0100 && running_bios)
		{
			running_bios = false;
			debug_out("BIOS Execution completed!");
			load_image(rom_to_load);
			A = 0x01;
			B = 0x00;
			C = 0x13;
			D  = 0x00;
			E = 0xD8;
			F = 0xB0;
			SP = 0xFFFE;
			H = 0x01;
			L = 0x4D;
		}
	}
	else totalClock += 4;
	
	//Check interrupts
	var enabled_interrupts = rb(0xFFFF); //Make sure the stack pointer never hits this
	var raised_interrupts = rb(0xFF0F);
	if((interrupts_enabled && enabled_interrupts && raised_interrupts) || stop)
	{ 
		target = 0x00;
		if((enabled_interrupts & raised_interrupts) & interrupt_vblank)
		{
			target = 0x40;
			wb(0xFF0F, raised_interrupts & ~interrupt_vblank);
			//debug_out("vblank at pc " + PC.toString(16));
		}
		else if((enabled_interrupts & raised_interrupts) & interrupt_stat)
		{
			target = 0x48;
			wb(0xFF0F, raised_interrupts & ~interrupt_stat);
			//debug_out("stat at pc " + PC.toString(16));
		}
		else if((enabled_interrupts & raised_interrupts) & interrupt_tima)
		{
			target = 0x50;
			wb(0xFF0F, raised_interrupts & ~interrupt_tima);
			debug_out("tima at pc " + PC.toString(16));
		}
		else if((enabled_interrupts & raised_interrupts) & interrupt_input || (stop && raised_interrupts & interrupt_input))
		{
			stop = false;
			target = 0x60;
			wb(0xFF0F, raised_interrupts & ~interrupt_input);
			debug_out("input at pc " + PC.toString(16));
		}
		if(target != 0x00)
		{
			halt = false;
			interrupts_enabled = false;
			SP-=2;
			ww(SP, PC);
			PC = target;
			totalClock += 32;
		}
	}
	
	//Update non-gpu timers
	div_timer += lastClock;
	if(div_timer > 0xFF)
	{
		div_timer &= 0xFF;
		wb(0xFF04, (rb(0xFF04) + 1) % 255);
	}
	if(rb(0xFF07) & 0x04) //TIMA timer is on
	{
		tima_timer += lastClock;
		var overflow = false;
		switch(rb(0xFF07) & 0x3)
		{
			case 0: if(tima_timer >= 1024) { overflow = true; tima_timer -= 1024; }break;
			case 1: if(tima_timer >= 16) { overflow = true; timeTimer -= 16; } break;
			case 2: if(tima_timer >= 64) { overflow = true; tima_timer -= 64; } break;
			case 3: if(tima_timer >= 256) { overflow = true; tima_timer -= 256; } break;
			default: debug_out("timer error");
		}
		if(overflow)
		{
			wb(0xFF05, (rb(0xFF05)+1)&0xFF);
			if(rb(0xFF05) == 0)
			{
				wb(rb(0xFF0F) | interrupt_tima);
				wb(0xFF05, rb(0xFF06));
			}
		}
	}
	
	return lastClock;
}