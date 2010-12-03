const debugmode = true;
var proc_break = false;
var temp_result = 0; //For calculation
//Lets define our flags
const flag_zero = 0x80; //set when last op had result of 0
const flag_operation = 0x40; //set if last op was subtraction
const flag_halfcarry = 0x20; //set if the lower half of the byte overflowed past 15 in last op
const flag_carry = 0x10; //set if last operation was >255 or <0
const interrupt_vblank = 0x01;
var op = 0; //Used to write opcode to screen
var debug_output = [];
var call_trace = [];
var pc_trace = [];
var running_bios = true;
var interrupts_enabled = false;
var halt = false;
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
var instructionNames = [];
var tA, tB, tC, tD, tE, tF, tH, tL;


function wb(addr, val) //Write byte
{
	if(addr >= 0xE000 && addr <= 0xFE00) addr -= 0x2000; //Mirrored memory
	mem[addr] = val;
	if(addr == 0xFF80) debug_out("Wrote to addr " + addr.toString(16) + " value " + val.toString(16) + " at PC " + (PC-1).toString(16));
	//if(addr > 0xc000 && addr < 0xcff0) debug_out("Wrote to addr " + addr.toString(16) + " value " + val.toString(16) + " at PC " + (PC-1).toString(16));
	if(addr == 0xFF44)
	{
		mem[0xFF44] = 0;
		gpu_scanline = 0; //I think this is how this works...
	}
}
function rb(addr) //Read byte
{
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
	debug_output.push(string);
}
function call_out(string)
{
	call_trace.push(string);
	pc_trace.push(PC.toString(16));
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

function print_stack()
{
	var s = "STACK: ";
	for(i = SP; i < 0xFFFF; i+=1)
	{
		s += "0x" + rb(i).toString(16) + " ";
	}
	debug_out(s);
}

function load_image(fname) //Load in a rom. This will only work with a single bank game atm
{
	var temp = []
	var fin = new BinFileReader(fname);
	temp = String(fin.readString(fin.getFileSize(),0));
	for(i = 0; i < fin.getFileSize(); i+=1)
	{
		wb(i, temp.charCodeAt(i));
	}
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
	op = rb(PC);
	call_out(instructionNames[op] + " : " + "0x" + op.toString(16));
	opcodes[rb(PC++)]();
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
	
	if(PC == 0x0100 && running_bios)
	{
		running_bios = false;
		debug_out("BIOS Execution completed!");
		load_image("tetris.gb");
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
	
	//Check interrupts
	var enabled_interrupts = rb(0xFFFF); //Make sure the stack pointer never hits this
	var raised_interrupts = rb(0xFF0F);
	if(interrupts_enabled && enabled_interrupts && raised_interrupts)
	{ 
		if((enabled_interrupts & raised_interrupts) & interrupt_vblank)
		{
			interrupts_enabled = false;
			debug_out("vblank at pc " + PC.toString(16));
			raised_interrupts &= ~interrupt_vblank;
			wb(0xFF0F, raised_interrupts);
			SP-=2;
			ww(SP, PC);
			PC = 0x40;
			store_register_states();
			//proc_break = true;
			totalClock += 32;
		}
	}
	
	return lastClock;
}