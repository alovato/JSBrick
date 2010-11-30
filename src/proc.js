const debugmode = true;
var temp_result = 0; //For calculation
//Lets define our flags
const flag_zero = 0x80; //set when last op had result of 0
const flag_operation = 0x40; //set if last op was subtraction
const flag_halfcarry = 0x20; //set if the lower half of the byte overflowed past 15 in last op
const flag_carry = 0x10; //set if last operation was >255 or <0
var op = 0; //Used to write opcode to screen
var debug_output = [];
var call_trace = [];
var pc_trace = [];
var running_bios = true;

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

function print_stack()
{
	var s = "STACK: ";
	for(i = SP; i < 0xFFFF; i+=1)
	{
		s += "0x" + rb(i).toString(16) + " ";
	}
	debug_out(s);
}

var interrupts_enabled = true;
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
var instructionNames = []

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
	SP = 0x0000;
	F = 0;
	A = 0;
	B = 0;
	C = 0;
	D = 0;
	E = 0;
	H = 0;
	L = 0;
	totalClock = 0;
	lastClock = 0;
	for(i = 0; i < 0xFFFF; i+=1)
	{
		mem[i] = 0x00;
	}
	debug_out("Z80 Initialized");
}

//TODO: Move the MMU and maybe opcodes to another file

function wb(addr, val) //Write byte
{
	if(addr >= 0xE000 && addr <= 0xFE00) addr -= 0x2000; //Mirrored memory
	mem[addr] = val;
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
} //Read word with least sig byte first

 //Time to start our instructions!

 //This will let us see invalid calls
var none = function NOT_IMPLEMENTED()
{
	debug_out("Invalid instruction when PC is " + (PC-1).toString(16) + ", possibly opcode " + rb(PC-1).toString(16));
}



for(i = 0; i < 256; i+=1)
{
	opcodes[i] = none;
	instructionNames[i] = "N/A - ERROR: OPCODE 0x" + i.toString(16);
}

//LD register, n
instructionNames[0x06] = "LDB n";
opcodes[0x06] = function LDB_n() /*0x06*/ 
{
	B = rb(PC);
	PC++;
	lastClock = 8;
}
instructionNames[0x0E] = "LDC n";
opcodes[0x0E] = function LDC_n() /*0x0E*/
{
	C = rb(PC);
	PC++;
	lastClock = 8;
}
instructionNames[0x16] = "LDD n";
opcodes[0x16] = function LDD_n() /*0x16*/ 
{
	D = rb(PC);
	PC++;
	lastClock = 8;
}
instructionNames[0x1E] = "LDE n";
opcodes[0x1E] = function LDE_n() /*0x1E*/ 
{
	E = rb(PC);
	PC++;
	lastClock = 8;
}
instructionNames[0x26] = "LDH n";
opcodes[0x26] = function LDH_n() /*0x26*/ 
{
	H = rb(PC);
	PC++;
	lastClock = 8;
}
instructionNames[0x2E] = "LDL n";
opcodes[0x2E] = function LDL_n() /*0x2E*/ 
{
	L = rb(PC);
	PC++;
	lastClock = 8; 
}
//LD r1, r2
instructionNames[0x7F] = "LDA A";
opcodes[0x7F] = function LDA_A() /*0x7F*/ 
{
	A = A; 
	lastClock = 4; 
}
instructionNames[0x78] = "LDA B";
opcodes[0x78] = function LDA_B() /*0x78*/ 
{ 
	A = B; 
	lastClock = 4; 
}
instructionNames[0x79] = "LDA C";
opcodes[0x79] = function LDA_C() /*0x79*/ 
{
	A = C;
	lastClock = 4; 
}
instructionNames[0x7A] = "LDA D";
opcodes[0x7A] = function LDA_D() /*0x7A*/ 
{
	A = D;
	lastClock = 4; 
}
instructionNames[0x7B] = "LDA E";
opcodes[0x7B] = function LDA_E() /*0x7B*/ 
{ 
	A = E; 
	lastClock = 4; 
}
instructionNames[0x7C] = "LDA H";
opcodes[0x7C] = function LDA_H() /*0x7C*/ 
{ 
	A = H; 
	lastClock = 4; 
}
instructionNames[0x7D] = "LDA L";
opcodes[0x7D] = function LDA_L() /*0x7D*/ 
{ 
	A = L; 
	lastClock = 4; 
}
instructionNames[0x7E] = "LDA (HL)";
opcodes[0x7E] = function LDA_AT_HL() /*0x7E*/ 
{ 
	A = rb((H<<8)+L); 
	lastClock = 8; 
}
instructionNames[0x40] = "LDB B";
opcodes[0x40] = function LDB_B() /*0x40*/ 
{ 
	B = B; 
	lastClock = 4; 
}
instructionNames[0x41] = "LDB C";
opcodes[0x41] = function LDB_C() /*0x41*/ 
{ 
	B = C; 
	lastClock = 4; 
}
instructionNames[0x42] = "LDB D";
opcodes[0x42] = function LDB_D() /*0x42*/ 
{ 
	B = D; 
	lastClock = 4; 
}
instructionNames[0x43] = "LDB E";
opcodes[0x43] = function LDB_E() /*0x43*/ 
{ 
	B = E; 
	lastClock = 4; 
}
instructionNames[0x44] = "LDB H";
opcodes[0x44] = function LDB_H() /*0x44*/
{
	B = H; 
	lastClock = 4; 
}
instructionNames[0x45] = "LDB L";
opcodes[0x45] = function LDB_L() /*0x45*/
{ 
	B = L; 
	lastClock = 4; 
}
instructionNames[0x46] = "LDB (HL)";
opcodes[0x46] = function LDB_AT_HL() /*0x46*/
{ 
	B = rb((H<<8)+L); 
	lastClock = 8; 
}
instructionNames[0x48] = "LDC B";
opcodes[0x48] = function LDC_B() /*0x48*/ 
{ 
	C = B; 
	lastClock = 4; 
}
instructionNames[0x49] = "LDC C";
opcodes[0x49] = function LDC_C() /*0x49*/ 
{ 
	C = C; 
	lastClock = 4;
}
instructionNames[0x4A] = "LDC D";
opcodes[0x4A] = function LDC_D() /*0x4A*/ 
{ 
	C = D; 
	lastClock = 4; 
}
instructionNames[0x4B] = "LDC E";
opcodes[0x4B] = function LDC_E() /*0x4B*/ 
{ 
	C = E; 
	lastClock = 4; 
}
instructionNames[0x4C] = "LDC H";
opcodes[0x4C] = function LDC_H() /*0x4C*/ 
{ 
	C = H; 
	lastClock = 4; 
}
instructionNames[0x4D] = "LDC L";
opcodes[0x4D] = function LDC_L() /*0x4D*/ 
{
	C = L; 
	lastClock = 4; 
}
instructionNames[0x4E] = "LDC (HL)";
opcodes[0x4E] = function LDC_AT_HL() /*0x4E*/ 
{ 
	C = rb((H<<8)+L); 
	lastClock = 8; 
}
instructionNames[0x50] = "LDD B";
opcodes[0x50] = function LDD_B() /*0x50*/ 
{ 
	D = B; 
	lastClock = 4; 
}
instructionNames[0x51] = "LDD C";
opcodes[0x51] = function LDD_C() /*0x51*/ 
{ 
	D = C; 
	lastClock = 4; 
}
instructionNames[0x52] = "LDD D";
opcodes[0x52] = function LDD_D() /*0x52*/ 
{
	D = D; 
	lastClock = 4; 
}
instructionNames[0x53] = "LDD E";
opcodes[0x53] = function LDD_E() /*0x53*/ 
{ 
	D = E; 
	lastClock = 4; 
}
instructionNames[0x54] = "LDD H";
opcodes[0x54] = function LDD_H() /*0x54*/
{
	D = H; 
	lastClock = 4; 
}
instructionNames[0x55] = "LDD L";
opcodes[0x55] = function LDD_L() /*0x55*/ 
{ 
	D = L; 
	lastClock = 4; 
}
instructionNames[0x56] = "LDD (HL)";
opcodes[0x56] = function LDD_AT_HL() /*0x56*/ 
{ 
	D = rb((H<<8)+L); 
	lastClock = 8; 
}
instructionNames[0x58] = "LDE B";
opcodes[0x58] = function LDE_B() /*0x58*/ 
{ 
	E = B; 
	lastClock = 4; 
}
instructionNames[0x59] = "LDE C";	
opcodes[0x59] = function LDE_C() /*0x59*/ 
{ 
	E = C; 
	lastClock = 4; 
}
instructionNames[0x5A] = "LDE D";	
opcodes[0x5A] = function LDE_D() /*0x5A*/ 
{ 
	E = D; 
	lastClock = 4; 
}
instructionNames[0x5B] = "LDE E";
opcodes[0x5B] = function LDE_E() /*0x5B*/ 
{ 
	E = E; 
	lastClock = 4; 
}
instructionNames[0x5C] = "LDE H";
opcodes[0x5C] = function LDE_H() /*0x5C*/ 
{ 
	E = H; 
	lastClock = 4; 
}
instructionNames[0x5D] = "LDE L";
opcodes[0x5D] = function LDE_L() /*0x5D*/ 
{ 
	E = L; 
	lastClock = 4; 
}
instructionNames[0x5E] = "LDE (HL)";
opcodes[0x5E] = function LDE_AT_HL() /*0x5E*/ 
{ 
	E = rb((H<<8)+L); 
	lastClock = 8; 
}
instructionNames[0x60] = "LDH B";
opcodes[0x60] = function LDH_B() /*0x60*/ 
{ 
	H = B; 
	lastClock = 4; 
}
instructionNames[0x61] = "LDH C";
opcodes[0x61] = function LDH_C() /*0x61*/ 
{ 
	H = C; 
	lastClock = 4; 
}
instructionNames[0x62] = "LDH D";
opcodes[0x62] = function LDH_D() /*0x62*/
{ 
	H = D; 
	lastClock = 4; 
}
instructionNames[0x63] = "LDH E";
opcodes[0x63] = function LDH_E() /*0x63*/
{ 
	H = E; 
	lastClock = 4; 
}
instructionNames[0x64] = "LDH H";
opcodes[0x64] = function LDH_H() /*0x64*/ 
{ 
	H = H; 
	lastClock = 4; 
}
instructionNames[0x65] = "LDH L";
opcodes[0x65] = function LDH_L() /*0x65*/ 
{ 
	H = L; 
	lastClock = 4; 
}
instructionNames[0x66] = "LDH (HL)";
opcodes[0x66] = function LDH_AT_HL() /*0x66*/ 
{ 
	H = rb((H<<8)+L); 
	lastClock = 8; 
}
instructionNames[0x68] = "LDL B";
opcodes[0x68] = function LDL_B() /*0x68*/ 
{ 
	L = B; 
	lastClock = 4;
}
instructionNames[0x69] = "LDL C";
opcodes[0x69] = function LDL_C() /*0x69*/ 
{ 
	L = C; 
	lastClock = 4; 
}
instructionNames[0x6A] = "LDL D";
opcodes[0x6A] = function LDL_D() /*0x6A*/
{
	L = D; 
	lastClock = 4; 
}
instructionNames[0x6B] = "LDL E";
opcodes[0x6B] = function LDL_E() /*0x6B*/ 
{ 
	L = E; 
	lastClock = 4; 
}
instructionNames[0x6C] = "LDL H";
opcodes[0x6C] = function LDL_H() /*0x6C*/ 
{ 
	L = H;
	lastClock = 4; 
}
instructionNames[0x6D] = "LDL L";
opcodes[0x6D] = function LDL_L() /*0x6D*/
{ 
	L = L; 
	lastClock = 4; 
}
instructionNames[0x6E] = "LDL (HL)";
opcodes[0x6E] = function LDL_AT_HL() /*0x6E*/ 
{ 
	L = rb((H<<8)+L);
	lastClock = 8; 
}
instructionNames[0x70] = "LD (HL) B";
opcodes[0x70] = function LD_AT_HL_B() /*0x70*/
{
	wb((H<<8)+L, B);
	lastClock = 8;
}
instructionNames[0x71] = "LD (HL) C";
opcodes[0x71] = function LD_AT_HL_C() /*0x71*/
{
	wb((H<<8)+L, C);
	lastClock = 8;
}
instructionNames[0x72] = "LD (HL) D";
opcodes[0x72] = function LD_AT_HL_D() /*0x72*/ 
{ 
	wb((H<<8)+L, D); 
	lastClock = 8;
}
instructionNames[0x73] = "LD (HL) E";
opcodes[0x73] = function LD_AT_HL_E() /*0x73*/ 
{ 
	wb((H<<8)+L, E); 
	lastClock = 8;
}
instructionNames[0x74] = "LD (HL) H";
opcodes[0x74] = function LD_AT_HL_H() /*0x74*/ 
{ 
	wb((H<<8)+L, H); 
	lastClock = 8;
}
instructionNames[0x75] = "LD (HL) L";
opcodes[0x75] = function LD_AT_HL_L() /*0x75*/ 
{ 
	wb((H<<8)+L, L);
	lastClock = 8;
}
instructionNames[0x36] = "LD (HL) n";
opcodes[0x36] = function LD_AT_HL_n() /*0x36*/
{ 
	wb((H<<8)+L, rb(PC)); 
	PC++; 
	lastClock = 12;
}
//LD A, n
instructionNames[0x0A] = "LDA (BC)";
opcodes[0x0A] = function LDA_AT_BC() /*0x0A*/ 
{ 
	A = rb((B<<8)+C); 
	lastClock = 8; 
}
instructionNames[0x1A] = "LDA (DE)";
opcodes[0x1A] = function LDA_AT_DE() /*0x1A*/
{
	A = rb((D<<8)+E);
	lastClock = 8; 
}
instructionNames[0xFA] = "LDA (nn)";
opcodes[0xFA] = function LDA_AT_nn() /*0xFA*/
{
	A = rb(rw(PC)); 
	PC+=2; 
	lastClock = 12; 
}
instructionNames[0x3E] = "LDA n";
opcodes[0x3E] = function LDA_n() /*0x3E*/
{ 
	A = rb(PC); 
	PC++; 
	lastClock = 8; 
}
//LD n, A
instructionNames[0x47] = "LDB A";
opcodes[0x47] = function LDB_A() /*0x47*/ 
{
	B = A;
	lastClock = 4; 
}
instructionNames[0x4F] = "LDC A";
opcodes[0x4F] = function LDC_A() /*0x4F*/
{ 
	C = A; 
	lastClock = 4; 
}
instructionNames[0x57] = "LDD A";	
opcodes[0x57] = function LDD_A() /*0x57*/ 
{ 
	D = A; 
	lastClock = 4; 
}
instructionNames[0x5F] = "LDE A";
opcodes[0x5f] = function LDE_A() /*0x5F*/ 
{
	E = A;
	lastClock = 4; 
}
instructionNames[0x67] = "LDH A";
opcodes[0x67] = function LDH_A() /*0x67*/ 
{ 
	H = A; 
	lastClock = 4; 
}
instructionNames[0x6F] = "LDL A";
opcodes[0x6F] = function LDL_A() /*0x6F*/ 
{ 
	L = A; 
	lastClock = 4; 
}
instructionNames[0x02] = "LD (BC) A";
opcodes[0x02] = function LD_AT_BC_A() /*0x02*/ 
{ 
	wb((B<<8)+C, A); 
	lastClock = 8; 
}	
instructionNames[0x12] = "LD (DE) A";	
opcodes[0x12] = function LD_AT_DE_A() /*0x12*/
{ 
	wb((D<<8)+E, A); 
	lastClock = 8; 
}
instructionNames[0x77] = "LD (HL) A";
opcodes[0x77] = function LD_AT_HL_A() /*0x77*/ 
{ 
	wb((H<<8)+L, A); 
	lastClock = 8; 
}
instructionNames[0xEA] = "LD (nn) A";
opcodes[0xEA] = function LD_AT_nn_A() /*0xEA*/ 
{ 
	wb(rw(PC), A); 
	PC+=2; 
	lastClock = 16; 
}
//LD A, (C)
instructionNames[0xF2] = "LDA (C)";
opcodes[0xF2] = function LDA_AT_C() /*0xF2*/ 
{ 
	A = rb(0xFF00+C); 
	lastClock = 8; 
}
//LD (C), A
instructionNames[0xE2] = "LD (C) A";
opcodes[0xE2] = function LD_AT_C_A() /*0xE2*/
{
	wb(0xFF00+C, A); 
	lastClock = 8; 
}
//LD A, (HLD)
instructionNames[0x3A] = "LDA (HL) DEC";
opcodes[0x3A] = function LDA_AT_HLD() /*0x3A*/ 
{ 
	A = rb((H<<8)+L); 
	temp_result = ((H<<8)+L - 1); 
	H	= (temp_result>>8)&0xFF; 
	L = temp_result&0xFF;
}
//LD (HLD), A
instructionNames[0x32] = "LD (HL) DEC, A"
opcodes[0x32] = function LD_AT_HLD_A() /*0x32*/ 
{ 
	wb((H<<8)+L, A); 
	temp_result = ((H<<8)+L - 1); 
	H = (temp_result>>8)&0xFF; 
	L = temp_result&0xFF;
}
//LD A, (HLI)
instructionNames[0x2A] = "LDA (HL) INC";
opcodes[0x2A] = function LDA_AT_HLI() /*0x2A*/ 
{ 
	A = rb((H<<8)+L); 
	temp_result = ((H<<8)+L + 1); 
	H = (temp_result>>8)&0xFF; 
	L = temp_result&0xFF;
}
//LD (HLI), A
instructionNames[0x22] = "LDA (HL) INC, A";
opcodes[0x22] = function LD_AT_HLI_A() /*0x22*/ 
{ 
	wb((H<<8)+L, A); 
	temp_result = ((H<<8)+L + 1); 
	H = (temp_result>>8)&0xFF; 
	L = temp_result&0xFF;
}
//LD (n), A
instructionNames[0xE0] = "LD n, A";
opcodes[0xE0] = function LD_n_A() /*0xE0*/
{ 
	wb(0xFF00+rb(PC), A); 
	PC++; 
	lastClock = 12;
}
//LD A, (n)
instructionNames[0xF0] = "LD A, n";
opcodes[0xF0] = function LD_A_n() /*0xF0*/ { A = rb(0xFF00+rb(PC)); PC++; lastClock = 12; }
//LD n, nn
instructionNames[0x01] = "LDBC nn";
opcodes[0x01] = function LDBC_nn() /*0x01*/ 
{
	C = rb(PC);
	PC++;
	B = rb(PC);
	PC++;
	lastClock = 12; 
}
instructionNames[0x11] = "LDDE nn";
opcodes[0x11] = function LDDE_nn() /*0x11*/
{ 
	E = rb(PC); 
	PC++; 
	D = rb(PC); 
	PC++; 
	lastClock = 12; 
}
instructionNames[0x21] = "LDHL nn";
opcodes[0x21] = function LDHL_nn() /*0x21*/ 
{ 
	L = rb(PC); 
	PC++; 
	H = rb(PC); 
	PC++; 
	lastClock = 12; 
}
instructionNames[0x31] = "LDSP nn";
opcodes[0x31] = function LDSP_nn() /*0x31*/
{
	SP = rw(PC);
	PC+=2; 
	lastClock = 12; 
}
//LD SP, HL
instructionNames[0xF9] = "LDSP HL";
opcodes[0xF9] = function LDSP_HL() /*0xF9*/
{ 
	SP = (H<<8)+L; 
	lastClock = 8; 
}
//LD HL, SP+n
instructionNames[0xF8] = "LDHL SP n";
opcodes[0xF8] = function LDHL_SP_n() /*0xF8*/ {
	temp_result = rb(PC);
	if(temp_result > 127) temp_result = -((~temp_result+1)&0xFF);
	PC++; temp_result += SP;
	H = (temp_result>>8) & 0xFF;
	L = temp_result & 0xFF;
	lastClock = 12;
}
instructionNames[0x08] = "LD nn SP";
opcodes[0x08] = function LD_nn_SP() /*0x08*/
{ 
	debug_out("Not implemented, may be unneccessary"); 
	lastClock = 20; 
}
//PUSH
instructionNames[0xF5] = "PUSH AF";
opcodes[0xF5] = function PUSHAF() /*F5*/
{ 
	wb(SP--, A); 
	wb(SP--, F); 
	lastClock = 16; 
}
instructionNames[0xC5] = "PUSH BC";
opcodes[0xC5] = function PUSHBC() /*C5*/ 
{ 
	wb(SP--, B); 
	wb(SP--, C); 
	lastClock = 16; 
}
instructionNames[0xD5] = "PUSH DE";
opcodes[0xD5] = function PUSHDE() /*D5*/ 
{ 
	wb(SP--, D); 
	wb(SP--, E); 
	lastClock = 16; 
}
instructionNames[0xE5] = "PUSH HL";
opcodes[0xE5] = function PUSHHL() /*E5*/
{ 
	wb(SP--, H); 
	wb(SP--, L); 
	lastClock = 16; 
}
//POP
instructionNames[0xF1] = "POP AF";
opcodes[0xF1] = function POPAF() /*F1*/ 
{ 
	F = rb(++SP); 
	A = rb(++SP); 
	lastClock = 12; 
}
instructionNames[0xC1] = "POP BC";
opcodes[0xC1] = function POPBC() /*C1*/
{ 
	C = rb(++SP); 
	B = rb(++SP); 
	lastClock = 12; 
}
instructionNames[0xD1] = "POP DE";
opcodes[0xD1] = function POPDE() /*D1*/ 
{ 
	E = rb(++SP); 
	D = rb(++SP); 
	lastClock = 12; 
}
instructionNames[0xE1] = "POP HL";	
opcodes[0xE1] = function POPHL() /*E1*/
{ 
	L = rb(++SP); 
	H = rb(++SP); 
	lastClock = 12; 
}
//ADD A, n  - IGNORES HALF CARRY, MAY NEED TO BE CHANGED
instructionNames[0x87] = "ADD A A";
opcodes[0x87] = function ADD_A_A() /*0x87*/
{
	temp_result = A + A; //Addition
	F = 0; //Clear flags
	A = temp_result & 0xFF;
	set_flag_zero(A==0);
	if(temp_result > 0xFF) F |= flag_carry;
	lastClock = 4;
}
instructionNames[0x80] = "ADD A B";
opcodes[0x80] = function ADD_A_B() /*0x80*/ 
{
	temp_result = A + B; //Addition
	F = 0; //Clear flags
	A = temp_result & 0xFF;
	set_flag_zero(A==0);
	if(temp_result > 0xFF) F |= flag_carry;
	lastClock = 4;
}
instructionNames[0x81] = "ADD A C";
opcodes[0x81] = function ADD_A_C() /*0x81*/ 
{
	temp_result = A + C; //Addition
	F = 0; //Clear flags
	A = temp_result & 0xFF;
	set_flag_zero(A==0);
	if(temp_result > 0xFF) F |= flag_carry;
	lastClock = 4;
}
instructionNames[0x82] = "ADD A D";
opcodes[0x82] = function ADD_A_D() /*0x82*/ 
{
	temp_result = A + D; //Addition
	F = 0; //Clear flags
	A = temp_result & 0xFF;
	set_flag_zero(A==0);
	if(temp_result > 0xFF) F |= flag_carry;
	lastClock = 4;
}
instructionNames[0x83] = "ADD A E";
opcodes[0x83] = function ADD_A_E() /*0x83*/ 
{
	temp_result = A + E; //Addition
	F = 0; //Clear flags
	A = temp_result & 0xFF;
	set_flag_zero(A==0);
	if(temp_result > 0xFF) F |= flag_carry;
	lastClock = 4;
}
instructionNames[0x84] = "ADD A H";
opcodes[0x84] = function ADD_A_H() /*0x84*/ 
{
	temp_result = A + H; //Addition
	F = 0; //Clear flags
	A = temp_result & 0xFF;
	set_flag_zero(A==0);
	if(temp_result > 0xFF) F |= flag_carry;
	lastClock = 4;
}
instructionNames[0x85] = "ADD A L";
opcodes[0x85] = function ADD_A_L() /*0x85*/ 
{
	temp_result = A + E; //Addition
	F = 0; //Clear flags
	A = temp_result & 0xFF;
	set_flag_zero(A==0);
	if(temp_result > 0xFF) F |= flag_carry;
	
	lastClock = 4;
}
instructionNames[0x86] = "ADD A (HL)";
opcodes[0x86] = function ADD_A_AT_HL() /*0x86*/ 
{
	temp_result = A + rb((H<<8)+L); //Addition
	F = 0; //Clear flags
	A = temp_result & 0xFF;
	set_flag_zero(A == 0);
	if(temp_result > 0xFF) F |= flag_carry;
	lastClock = 8;
}
instructionNames[0xC6] = "ADD A n";
opcodes[0xC6] = function ADD_A_n() /*0xC6*/ 
{
	temp_result = A + rb(PC); //Addition
	PC++;
	F = 0; //Clear flags
	set_flag_zero(!(A & 0xFF));
	if(temp_result > 0xFF) F |= flag_carry;
	A = temp_result & 0xFF;
	lastClock = 8;
}
instructionNames[0x8F] = "ADC A A";
opcodes[0x8F] = function ADC_A_A() /*0x8F*/ 
{
	temp_result = A + A;
	temp_result += (F&flag_carry)?1:0;
	set_flag_zero(!(A & 0xFF));
	if(temp_result > 0xFF) F |= flag_carry;
	A = temp_result & 0xFF;
	lastClock = 4;	
}
instructionNames[0x88] = "ADC A B";
opcodes[0x88] = function ADC_A_B() /*0x88*/ 
{
	temp_result = A + B;
	temp_result += (F&flag_carry)?1:0;
	set_flag_zero(!(A & 0xFF));
	if(temp_result > 0xFF) F |= flag_carry;
	A = temp_result & 0xFF;
	lastClock = 4;	
}
instructionNames[0x89] = "ADC A C";
opcodes[0x89] = function ADC_A_C() /*0x89*/ 
{
	temp_result = A + C;
	temp_result += (F&flag_carry)?1:0;
	set_flag_zero(!(A & 0xFF));
	if(temp_result > 0xFF) F |= flag_carry;
	A = temp_result & 0xFF;
	lastClock = 4;	
}
instructionNames[0x8A] = "ADC A D";
opcodes[0x8A] = function ADC_A_D() /*0x8A*/ 
{
	temp_result = A + D;
	temp_result += (F&flag_carry)?1:0;
	set_flag_zero(!(A & 0xFF));
	if(temp_result > 0xFF) F |= flag_carry;
	A = temp_result & 0xFF;
	lastClock = 4;	
}
instructionNames[0x8B] = "ADC A E";
opcodes[0x8B] = function ADC_A_E() /*0x8B*/ 
{
	temp_result = A + E;
	temp_result += (F&flag_carry)?1:0;
	set_flag_zero(!(A & 0xFF));
	if(temp_result > 0xFF) F |= flag_carry;
	A = temp_result & 0xFF;
	lastClock = 4;	
}
instructionNames[0x8C] = "ADC A H";
opcodes[0x8C] = function ADC_A_H() /*0x8C*/ 
{
	temp_result = A + H;
	temp_result += (F&flag_carry)?1:0;
	set_flag_zero(!(A & 0xFF));
	if(temp_result > 0xFF) F |= flag_carry;
	A = temp_result & 0xFF;
	lastClock = 4;	
}
instructionNames[0x8D] = "ADC A L";
opcodes[0x8D] = function ADC_A_L() /*0x8D*/ 
{
	temp_result = A + L;
	temp_result += (F&flag_carry)?1:0;
	set_flag_zero(!(A & 0xFF));
	if(temp_result > 0xFF) F |= flag_carry;
	A = temp_result & 0xFF;
	lastClock = 4;	
}
instructionNames[0x8E] = "ADC A (HL)";
opcodes[0x8E] = function ADC_A_AT_HL() /*0x8E*/ 
{
	temp_result = A + rb((H<<8)+L);
	temp_result += (F&flag_carry)?1:0;
	set_flag_zero(!(A & 0xFF));
	if(temp_result > 0xFF) F |= flag_carry;
	A = temp_result & 0xFF;
	lastClock = 8;	
}
instructionNames[0xCE] = "ADC A n";
opcodes[0xCE] = function ADC_A_n() /*0xCE*/ 
{
	temp_result = A + rb(PC);
	PC++;
	temp_result += (F&flag_carry)?1:0;
	set_flag_zero(!(A & 0xFF));
	if(temp_result > 0xFF) F |= flag_carry;
	A = temp_result & 0xFF;
	lastClock = 8;	
}
instructionNames[0x97] = "SUB A A";
opcodes[0x97] = function SUB_A_A() 
{
	temp_result = A - A; //Subtraction
	F = 0; //Clear flags
	set_flag_zero(!(A & 0xFF));
	if(temp_result < 0) F |= flag_carry;
	F |= flag_operation;
	A = temp_result & 0xFF;
	lastClock = 4;
}
instructionNames[0x90] = "SUB A B";
opcodes[0x90] = function SUB_A_B() 
{
	temp_result = A - B; //Subtraction
	F = 0; //Clear flags
	set_flag_zero(!(A & 0xFF));
	if(temp_result < 0) F |= flag_carry;
	F |= flag_operation;
	A = temp_result & 0xFF;
	lastClock = 4;
}
instructionNames[0x91] = "SUB A C";
opcodes[0x91] = function SUB_A_C() 
{
	temp_result = A - C; //Subtraction
	F = 0; //Clear flags
	set_flag_zero(!(A & 0xFF));
	if(temp_result < 0) F |= flag_carry;
	F |= flag_operation;
	A = temp_result & 0xFF;
	lastClock = 4;
}
instructionNames[0x92] = "SUB A D";
opcodes[0x92] = function SUB_A_D() 
{
	temp_result = A - D; //Subtraction
	F = 0; //Clear flags
	set_flag_zero(!(A & 0xFF));
	if(temp_result < 0) F |= flag_carry;
	F |= flag_operation;
	A = temp_result & 0xFF;
	lastClock = 4;
}
instructionNames[0x93] = "SUB A E";
opcodes[0x93] = function SUB_A_E() 
{
	temp_result = A - E; //Subtraction
	F = 0; //Clear flags
	set_flag_zero(!(A & 0xFF));
	if(temp_result < 0) F |= flag_carry;
	F |= flag_operation;
	A = temp_result & 0xFF;
	lastClock = 4;
}
instructionNames[0x94] = "SUB A H";
opcodes[0x94] = function SUB_A_H() 
{
	temp_result = A - H; //Subtraction
	F = 0; //Clear flags
	set_flag_zero(!(A & 0xFF));
	if(temp_result < 0) F |= flag_carry;
	F |= flag_operation;
	A = temp_result & 0xFF;
	lastClock = 4;
}
instructionNames[0x95] = "SUB A L";
opcodes[0x95] = function SUB_A_L() 
{
	temp_result = A - L; //Subtraction
	F = 0; //Clear flags
	set_flag_zero(!(A & 0xFF));
	if(temp_result < 0) F |= flag_carry;
	F |= flag_operation;
	A = temp_result & 0xFF;
	lastClock = 4;
}
instructionNames[0x96] = "SUB A (HL)";
opcodes[0x96] = function SUB_A_AT_HL() 
{
	temp_result = A - rb((H<<8)+L); //Subtraction
	F = 0; //Clear flags
	set_flag_zero(!(A & 0xFF));
	if(temp_result < 0) F |= flag_carry;
	F |= flag_operation;
	A = temp_result & 0xFF;
	lastClock = 8;
}
instructionNames[0x96] = "SUB A n";
opcodes[0x96] = function SUB_A_n() 
{
	temp_result = A - rb(PC); //Subtraction
	PC++;
	F = 0; //Clear flags
	set_flag_zero(!(A & 0xFF));
	if(temp_result < 0) F |= flag_carry;
	F |= flag_operation;
	A = temp_result & 0xFF;
	lastClock = 8;
}
instructionNames[0x9F] = "SBC A A";
opcodes[0x9F] = function SBC_A_A() 
{
	temp_result = A - (A + (F&flag_carry)?1:0); //Subtraction
	F = 0; //Clear flags
	set_flag_zero(!(A & 0xFF));
	if(temp_result < 0) F |= flag_carry;
	F |= flag_operation;
	A = temp_result & 0xFF;
	lastClock = 4;
}
instructionNames[0x98] = "SBC A B";
opcodes[0x98] = function SBC_A_B() 
{
	temp_result = A - (B + (F&flag_carry)?1:0); //Subtraction
	F = 0; //Clear flags
	set_flag_zero(!(A & 0xFF));
	if(temp_result < 0) F |= flag_carry;
	F |= flag_operation;
	A = temp_result & 0xFF;
	lastClock = 4;
}
instructionNames[0x99] = "SBC A C";
opcodes[0x99] = function SBC_A_C() 
{
	temp_result = A - (C + (F&flag_carry)?1:0); //Subtraction
	F = 0; //Clear flags
	set_flag_zero(!(A & 0xFF));
	if(temp_result < 0) F |= flag_carry;
	F |= flag_operation;
	A = temp_result & 0xFF;
	lastClock = 4;
}
instructionNames[0x9A] = "SBC A D";
opcodes[0x9A] = function SBC_A_D() 
{
	temp_result = A - (D + (F&flag_carry)?1:0); //Subtraction
	F = 0; //Clear flags
	set_flag_zero(!(A & 0xFF));
	if(temp_result < 0) F |= flag_carry;
	F |= flag_operation;
	A = temp_result & 0xFF;
	lastClock = 4;
}
instructionNames[0x9B] = "SBC A E";
opcodes[0x9B] = function SBC_A_E() 
{
	temp_result = A - (E + (F&flag_carry)?1:0); //Subtraction
	F = 0; //Clear flags
	set_flag_zero(!(A & 0xFF));
	if(temp_result < 0) F |= flag_carry;
	F |= flag_operation;
	A = temp_result & 0xFF;
	lastClock = 4;
}
instructionNames[0x9C] = "SBC A H";
opcodes[0x9C] = function SBC_A_H() 
{
	temp_result = A - (H + (F&flag_carry)?1:0); //Subtraction
	F = 0; //Clear flags
	set_flag_zero(!(A & 0xFF));
	if(temp_result < 0) F |= flag_carry;
	F |= flag_operation;
	A = temp_result & 0xFF;
	lastClock = 4;
}
instructionNames[0x9D] = "SBC A L";
opcodes[0x9D] = function SBC_A_L() 
{
	temp_result = A - (L + (F&flag_carry)?1:0); //Subtraction
	F = 0; //Clear flags
	set_flag_zero(!(A & 0xFF));
	if(temp_result < 0) F |= flag_carry;
	F |= flag_operation;
	A = temp_result & 0xFF;
	lastClock = 4;
}
instructionNames[0x9E] = "SBC A (HL)";
opcodes[0x9E] = function SBC_A_AT_HL() 
{
	temp_result = A - (rb((H<<8)+L) + (F&flag_carry)?1:0); //Subtraction
	F = 0; //Clear flags
	set_flag_zero(!(A & 0xFF));
	if(temp_result < 0) F |= flag_carry;
	F |= flag_operation;
	A = temp_result & 0xFF;
	lastClock = 4;
}
instructionNames[0xBF] = "CP A";
opcodes[0xBF] = function CP_A() 
{
    // Kind of a do-nothing operation
    set_flag_zero(true);
    set_flag_carry(false); 
    lastclock = 4;
}
instructionNames[0xB8] = "CP B";
opcodes[0xB8] = function CP_B() 
{
    set_flag_zero(B == A);
	set_flag_carry(A < B);
    if (A < B) {
        F |= flag_operation; 
    }
 lastclock = 4;
}
instructionNames[0xB9] = "CP C";
opcodes[0xB9] = function CP_C() 
{
    set_flag_zero(C == A);
	set_flag_carry(A < C);
    if (A < C) {
        F |= flag_operation; 
    }
  lastclock = 4;
}
instructionNames[0xBA] = "CP D";
opcodes[0xBA] = function CP_D() 
{
    set_flag_zero(D == A);
	set_flag_carry(A < D);
    if (A < D) {
        F |= flag_operation; 
    }
   lastclock = 4;
}
instructionNames[0xBB] = "CP E";
opcodes[0xBB] = function CP_E() 
{
    set_flag_zero(E == A);
	set_flag_carry(A < E);
    if (A < E) {
        F |= flag_operation; 
    }
    lastclock = 4;
}
instructionNames[0xBC] = "CP H";
opcodes[0xBC] = function CP_H() 
{
	set_flag_zero(H == A);
    set_flag_carry(A < H);
    lastclock = 4;
}
instructionNames[0xBD] = "CP L";
opcodes[0xBD] = function CP_L() 
{
	set_flag_zero(L == A);
    set_flag_carry(A < L);
    lastclock = 4;
}
instructionNames[0xBE] = "CP (HL)";
opcodes[0xBE] = function CP_AT_HL() 
{
    temp_result = rb((H<<8)+L);
    set_flag_zero(temp_result == A);
	set_flag_carry(A < temp_result);
    lastclock = 8;
}
instructionNames[0xFE] = "CP A n";
opcodes[0xFE] = function CP_A_n() 
{
    temp_result = rb(PC);
    PC++;
    set_flag_zero(temp_result == A);
    if (A < temp_result) {
        F |= flag_operation; 
    }
    lastclock = 8;
}
instructionNames[0x3C] = "INC A";
opcodes[0x3C] = function INC_A() 
{
    A++;
    set_flag_zero(!(A&0xFF));
    F &= ~flag_operation;
    lastclock = 4;
}
instructionNames[0x04] = "INC B";
opcodes[0x04] = function INC_B() 
{
    B++;
    set_flag_zero(!(B&0xFF));
    F &= ~flag_operation;
    lastclock = 4;
}
instructionNames[0x0C] = "INC C";
opcodes[0x0C] = function INC_C() 
{
    C++;
    set_flag_zero(!(B&0xFF));
    F &= ~flag_operation;
    lastclock = 4;
}
instructionNames[0x14] = "INC D";
opcodes[0x14] = function INC_D() 
{
    D++;
    set_flag_zero(!(D&0xFF));
    F &= ~flag_operation;
    lastclock = 4;
}
instructionNames[0x1C] = "INC E";
opcodes[0x1C] = function INC_E() 
{
    E++;
    set_flag_zero(!(E&0xFF));
    F &= ~flag_operation;
    lastclock = 4;
}
instructionNames[0x24] = "INC H";
opcodes[0x24] = function INC_H() 
{
    H++;
    set_flag_zero(!(H&0xFF));
    F &= ~flag_operation;
    lastclock = 4;
}
instructionNames[0x2C] = "INC L";
opcodes[0x2C] = function INC_L() 
{
    L++;
    set_flag_zero(!(L&0xFF));
    F &= ~flag_operation;
    lastclock = 4;
}
instructionNames[0x34] = "INC (HL)";
opcodes[0x34] = function INC_AT_HL() 
{
    temp_result = rb((H<<8)+L);
    temp_result++;
    wb((H<<8)+L, temp_result);
    // Write back result

    set_flag_zero(!(temp_result&0xFF));
    F &= ~flag_operation;
    lastclock = 12;
}
instructionNames[0x3D] = "DEC A";
opcodes[0x3D] = function DEC_A() 
{
    A--;
	A &= 0xFF;
    set_flag_zero(!(A&0xFF));
    F &= ~flag_operation;
    lastclock = 4;
}
instructionNames[0x05] = "DEC B";
opcodes[0x05] = function DEC_B() 
{
    B--;
	B &= 0xFF;
    set_flag_zero(!(B&0xFF));
    F &= ~flag_operation;
    lastclock = 4;
}
instructionNames[0x0D] = "DEC C";
opcodes[0x0D] = function DEC_C() 
{
    C--;
	C &= 0xFF;
    set_flag_zero(!(C&0xFF));
    F &= ~flag_operation;
    lastclock = 4;
}
instructionNames[0x15] = "DEC D";
opcodes[0x15] = function DEC_D() 
{
    D--;
	D &= 0xFF;
    set_flag_zero(!(D&0xFF));
    F &= ~flag_operation;
    lastclock = 4;
}
instructionNames[0x1D] = "DEC E";
opcodes[0x1D] = function DEC_E() 
{
    E--;
	E &= 0xFF;
    set_flag_zero(!(E&0xFF));
    F &= ~flag_operation;
    lastclock = 4;
}
instructionNames[0x25] = "DEC H";
opcodes[0x25] = function DEC_H() 
{
    H--;
	H &= 0xFF;
    set_flag_zero(!(H&0xFF));
    F &= ~flag_operation;
    lastclock = 4;
}
instructionNames[0x2D] = "DEC L";
opcodes[0x2D] = function DEC_L() 
{
    L--;
	L &= 0xFF;
    set_flag_zero(!(L&0xFF));
    F &= ~flag_operation;
    lastclock = 4;
}
instructionNames[0x35] = "DEC (HL)";
opcodes[0x35] = function DEC_AT_HL() 
{
    temp_result = rb((H<<8)+L);
    temp_result--;
	temp_result &= 0xFF;
    wb((H<<8)+L, temp_result);
    // Write back result
    set_flag_zero(!(temp_result&0xFF));
    F &= ~flag_operation;
    lastclock = 12;
}
instructionNames[0xA7] = "AND A";
opcodes[0xA7] = function AND_A()
{ 
	A = A & A; 
	F = 0; 
	F |= flag_halfcarry; 
	set_flag_zero(!(A&0xFF)); 
	lastClock = 4; 
}
instructionNames[0xA0] = "AND B";
opcodes[0xA0] = function AND_B()
{ 
	A = A & B; 
	F = 0; 
	F |= flag_halfcarry; 
	set_flag_zero(!(A&0xFF)); 
	lastClock = 4; 
}
instructionNames[0xA1] = "AND C";
opcodes[0xA1] = function AND_C() 
{ 
	A = A & C; 
	F = 0; 
	F |= flag_halfcarry; 
	set_flag_zero(!(A&0xFF)); 
	lastClock = 4; 
}
instructionNames[0xA2] = "AND D";
opcodes[0xA2] = function AND_D()
{ 
	A = A & D; 
	F = 0; 
	F |= flag_halfcarry; 
	set_flag_zero(!(A&0xFF)); 
	lastClock = 4; 
}
instructionNames[0xA3] = "AND E";
opcodes[0xA3] = function AND_E() 
{ 
	A = A & E; 
	F = 0; 
	F |= flag_halfcarry;
	set_flag_zero(!(A&0xFF)); 
	lastClock = 4; 
}
instructionNames[0xA4] = "AND H";
opcodes[0xA4] = function AND_H() 
{ 
	A = A & H; 
	F = 0; 
	F |= flag_halfcarry; 
	set_flag_zero(!(A&0xFF)); 
	lastClock = 4; 
}
instructionNames[0xA5] = "AND L";
opcodes[0xA5] = function AND_L()
{ 
	A = A & L; 
	F = 0; 
	F |= flag_halfcarry; 
	set_flag_zero(!(A&0xFF)); 
	lastClock = 4; 
}
instructionNames[0xA6] = "AND (HL)";
opcodes[0xA6] = function AND_AT_HL() 
{ 
	A = A & rb((H<<8)+L); 
	F = 0; 
	F |= flag_halfcarry; 
	set_flag_zero(!(A&0xFF)); 
	lastClock = 8; 
}
instructionNames[0xE6] = "AND n";
opcodes[0xE6] = function AND_n()
{ 
	A = A & rb(PC); 
	PC++; 
	F = 0; 
	F |= flag_halfcarry; 
	set_flag_zero(!(A&0xFF)); 
	lastClock = 8; 
}
instructionNames[0xB7] = "OR A";
opcodes[0xB7] = function OR_A()
{ 
	A = A | A; 
	F = 0; 
	F |= flag_halfcarry; 
	set_flag_zero(!(A&0xFF)); 
	lastClock = 4; 
}
instructionNames[0xB0] = "OR B";
opcodes[0xB0] = function OR_B() 
{ 
	A = A | B; 
	F = 0; 
	F |= flag_halfcarry; 
	set_flag_zero(!(A&0xFF)); 
	lastClock = 4; 
}
instructionNames[0xB1] = "OR C";
opcodes[0xB1] = function OR_C() 
{ 
	A = A | C; 
	F = 0; 
	F |= flag_halfcarry; 
	set_flag_zero(!(A&0xFF)); 
	lastClock = 4; 
}
instructionNames[0xB2] = "OR D";
opcodes[0xB2] = function OR_D() 
{ 
	A = A | D; 
	F = 0; 
	F |= flag_halfcarry; 
	set_flag_zero(!(A&0xFF)); 
	lastClock = 4; 
}	
instructionNames[0xB3] = "OR E";
opcodes[0xB3] = function OR_E() 
{ 
	A = A | E; 
	F = 0; 
	F |= flag_halfcarry; 
	set_flag_zero(!(A&0xFF)); 
	lastClock = 4; 
}
instructionNames[0xB4] = "OR H";
opcodes[0xB4] = function OR_H() 
{ 
	A = A | H; 
	F = 0; 
	F |= flag_halfcarry; 
	set_flag_zero(!(A&0xFF)); 
	lastClock = 4; 
}
instructionNames[0xB5] = "OR L";
opcodes[0xB5] = function OR_L() 
{ 
	A = A | L; 
	F = 0; 
	F |= flag_halfcarry; 
	set_flag_zero(!(A&0xFF)); 
	lastClock = 4; 
}
instructionNames[0xB6] = "OR (HL)";
opcodes[0xB6] = function OR_AT_HL()
{ 
	A = A | rb((H<<8)+L); 
	F = 0; 
	F |= flag_halfcarry; 
	set_flag_zero(!(A&0xFF)); 
	lastClock = 8; 
}
instructionNames[0xF6] = "OR n";
opcodes[0xF6] = function OR_n()
{ 
	A = A | rb(PC); 
	PC++; 
	F = 0; 
	F |= flag_halfcarry; 
	set_flag_zero(!(A&0xFF)); 
	lastClock = 8; 
}
instructionNames[0xAF] = "XOR A";
opcodes[0xAF] = function XOR_A() 
{ 
	A = A ^ A; 
	F=0; 
	set_flag_zero(!(A&0xFF)); 
	lastClock = 4; 
}
instructionNames[0xA8] = "XOR B";
opcodes[0xA8] = function XOR_B() 
{ 
	A = A ^ B; 
	F=0; 
	set_flag_zero(!(A&0xFF)); 
	lastClock = 4; 
}
instructionNames[0xA9] = "XOR C";
opcodes[0xA9] = function XOR_C() 
{ 
	A = A ^ C; 
	F=0; 
	set_flag_zero(!(A&0xFF)); 
	lastClock = 4; 
}
instructionNames[0xAA] = "XOR D";	
opcodes[0xAA] = function XOR_D() 
{ 
	A = A ^ D; 
	F=0; 
	set_flag_zero(!(A&0xFF)); 
	lastClock = 4; 
}
instructionNames[0xAB] = "XOR E";
opcodes[0xAB] = function XOR_E() 
{ 
	A = A ^ E; 
	F=0; 
	set_flag_zero(!(A&0xFF)); 
	lastClock = 4;
}
instructionNames[0xAC] = "XOR H";
opcodes[0xAC] = function XOR_H() 
{ 
	A = A ^ H; 
	F=0; 
	set_flag_zero(!(A&0xFF)); 
	lastClock = 4; 
}
instructionNames[0xAD] = "XOR L";
opcodes[0xAD] = function XOR_L() 
{ 
	A = A ^ L; 
	F=0; 
	set_flag_zero(!(A&0xFF)); 
	lastClock = 4; 
}
instructionNames[0xAE] = "XOR (HL)";
opcodes[0xAE] = function XOR_AT_HL()
{ 
	A = A ^ rb((H<<8)+L); 
	F=0; 
	set_flag_zero(!(A&0xFF)); 
	lastClock = 8; 
}
instructionNames[0xEE] = "XOR n";
opcodes[0xEE] = function XOR_n() 
{ 
	A = A ^ rb(PC); 
	PC++; 
	F=0; 
	set_flag_zero(!(A&0xFF)); 
	lastClock = 8; 
}
//JP cc,nn
instructionNames[0xC3] = "JP";
opcodes[0xC3] = function JP_nn()
{
	PC = rw(PC);
	lastClock = 12;
}
instructionNames[0xC2] = "JP NZ nn";
opcodes[0xC2] = function JP_NZ_nn()
{ 
	if(!(F & flag_zero))
	{
		PC = rw(PC);
	}
	lastClock = 12; 
}
instructionNames[0xCA] = "JP Z nn";
opcodes[0xCA] = function JP_Z_nn()
{ 
	if(F & flag_zero) 
	{ 
		PC = rw(PC); 
	} 
	lastClock = 12; 
}
instructionNames[0xD2] = "JP NC nn";
opcodes[0xD2] = function JP_NC_nn()
{ 
	if(!(F & flag_carry)) 
	{ 
		PC = rw(PC); 
	} 
	lastClock = 12; 
}
//JP (HL)
instructionNames[0xE9] = "JP (HL)";
opcodes[0xE9] = function JP_AT_HL()
{ 
	PC = ((H<<8) + L); 
	lastClock = 4; 
}
//JR n
instructionNames[0x18] = "JR n";
opcodes[0x18] = function JR_n() 
{
	temp_result = rb(PC);
	if(temp_result>0x80) temp_result = -((~temp_result+1)&255);
	PC++;
	PC += temp_result;
	lastClock = 8;
}
//JR cc,n
instructionNames[0x20] = "JR NZ n";
opcodes[0x20] = function JR_NZ_n() 
{
	temp_result = rb(PC);
	if(temp_result>0x80) temp_result = -((~temp_result+1)&255);
	PC++;
	lastClock = 8;
	if(!(F&flag_zero))
	{
		PC += temp_result;
		lastClock = 12;
	}
}
instructionNames[0x28] = "JR Z n";
opcodes[0x28] = function JR_Z_n()
{
	temp_result = rb(PC);
	if(temp_result>0x80) temp_result = -((~temp_result+1)&255);
	PC++;
	lastClock = 8;
	if(F&flag_zero)
	{
		PC += temp_result;
		lastClock = 12;
	}
}
instructionNames[0x30] = "JR NC n";
opcodes[0x30] = function JR_NC_n() 
{
	temp_result = rb(PC);
	if(temp_result>0x80) temp_result = -((~temp_result+1)&255);
	PC++;
	lastClock = 8;
	if(!(F&flag_carry))
	{
		PC += temp_result;
		lastClock = 12;
	}
}
instructionNames[0x38] = "JR C n";
opcodes[0x38] = function JR_C_n() 
{
	temp_result = rb(PC);
	if(temp_result>0x80) temp_result = -((~temp_result+1)&255);
	PC++;
	lastClock = 8;
	if(F&flag_carry)
	{
		PC += temp_result;
		lastClock = 12;
	}
}
instructionNames[0xCD] = "CALL nn";
opcodes[0xCD] = function CALL_nn() 
{
	SP--;
	ww(SP--, PC+2);
	PC = rw(PC);
	lastClock = 12;
}
instructionNames[0xC4] = "CALL NZ nn";
opcodes[0xC4] = function CALL_NZ_nn() 
{
	if(!(F | zero_flag))
	{
		SP--;
		ww(SP--, PC+2);
		PC = rw(PC);
		lastClock = 12;
	}
	else PC += 2;
	lastClock = 12; //Does this still take 12 cycles if it didn't branch?
}
instructionNames[0xCC] = "CALL Z nn";
opcodes[0xCC] = function CALL_Z_nn() 
{
	if((F | zero_flag))
	{
		SP--;
		ww(SP--, PC+2);
		PC = rw(PC);
		lastClock = 12;
	}
	else PC += 2;
	lastClock = 12;
}
instructionNames[0xD4] = "CALL NC nn";
opcodes[0xD4] = function CALL_NC_nn() 
{
	if(!(F | carry_flag))
	{
		SP--;
		ww(SP--, PC+2);
		PC = rw(PC);
		lastClock = 12;
	}
	else PC += 2;
	lastClock = 12;
}
instructionNames[0xDC] = "CALL C nn";
opcodes[0xDC] = function CALL_C_nn() 
{
	if((F | carry_flag))
	{
		SP--;
		ww(SP--, PC+2);
		PC = rw(PC);
		lastClock = 12;
	}
	else PC += 2;
	lastClock = 12;
}
//Restarts
instructionNames[0xC7] = "RST 00H";
opcodes[0xC7] = function RST_00H()
{
	SP--; 
	ww(SP--, PC); 
	PC = 0x00; 
	lastClock = 32; 
}
instructionNames[0xCF] = "RST 08H";
opcodes[0xCF] = function RST_08H()
{
	SP -= 2;
	ww(SP, PC);
	PC = 0x08;
	lastClock = 32; 
}
instructionNames[0xD7] = "RST 10H";
opcodes[0xD7] = function RST_10H()
{
	SP -= 2; 
	ww(SP, PC); 
	PC = 0x10; 
	lastClock = 32; 
}
instructionNames[0xDF] = "RST 18H";
opcodes[0xDF] = function RST_18H() 
{
	SP -= 2; 
	ww(SP, PC); 
	PC = 0x18; 
	lastClock = 32; 
}
instructionNames[0xE7] = "RST 20H";
opcodes[0xE7] = function RST_20H() 
{
	SP -= 2; 
	ww(SP, PC); 
	PC = 0x20; 
	lastClock = 32; 
}
instructionNames[0xEF] = "RST 28H";
opcodes[0xEF] = function RST_28H() 
{
	SP -= 2; 
	ww(SP, PC); 
	PC = 0x28; 
	lastClock = 32; 
}
instructionNames[0xF7] = "RST 30H";
opcodes[0xF7] = function RST_30H() 
{
	SP -= 2; 
	ww(SP, PC); 
	PC = 0x30; 
	lastClock = 32; 
}
instructionNames[0xFF] = "RST 38H";
opcodes[0xFF] = function RST_38H()
{
	SP -= 2; 
	ww(SP, PC); 
	PC = 0x38; 
	lastClock = 32; 
}
//Returns
instructionNames[0xC9] = "RET";
opcodes[0xC9] = function RET()
{
	SP+= 1; 
	PC = rw(SP); 
	SP++; 
	lastClock = 8;
}
instructionNames[0xC0] = "RET NZ";
opcodes[0xC0] = function RET_NZ() //Clock might be wrong on these...
{ 
	if(!(F | flag_zero)) RET(); 
	lastClock = 8;
}
instructionNames[0xC8] = "RET Z";
opcodes[0xC8] = function RET_Z() 
{ 
	if((F | flag_zero)) RET(); 
	lastClock = 8;
}
instructionNames[0xD0] = "RET NC";
opcodes[0xD0] = function RET_NC() 
{ 
	if(!(F | flag_carry)) RET(); 
	lastClock = 8;
}
instructionNames[0xD8] = "RET C";
opcodes[0xD8] = function RET_C() 
{ 
	if((F | flag_carry)) RET(); 
	lastClock = 8;
}
instructionNames[0xD9] = "RETI";
opcodes[0xD9] = function RETI()
{ 
	interrupts_enabled = true; 
	RET(); 
}
instructionNames[0x2F] = "CPL";
opcodes[0x2F] = function CPL() 
{ 
   PC++;
   A = ~A; 
   lastClock = 4 
}
instructionNames[0x3F] = "CCF";
opcodes[0x3F] = function CCF() 
{
   PC++;
   if (F | flag_carry)
      F &= ~flag_carry;
   else
      F |= flag_carry;
   lastClock = 4;
}
instructionNames[0x37] = "SCF";
opcodes[0x37] = function SCF() 
{ 
   PC++;
   F |= flag_carry;
   lastClock = 4;
}
instructionNames[0x76] = "HALT";
opcodes[0x76] = function HALT()
{
	halt = true;
}
instructionNames[0x10] = "STOP";
//opcodes[0x10] = function STOP() { } needs some rethinking
instructionNames[0x09] = "ADD16 HL BC";
opcodes[0x09] = function ADD16_HL_BC() /*0x09*/ 
{
   temp_result = ((H<<8)+L)+((B<<8)+C);
   F = 0;
   if (temp_result > 0xFFFF) F |= flag_carry;
   H = ((temp_result>>8)&0xFF);
   L = (temp_result&0xFF);
   lastClock = 8;
}
instructionNames[0x19] = "ADD16 HL DE";
opcodes[0x19] = function ADD16_HL_DE() /*0x19*/ 
{
   temp_result = ((H<<8)+L)+((D<<8)+E);
   F = 0;
   if (temp_result > 0xFFFF) F |= flag_carry;
   H = ((temp_result>>8)&0xFF);
   L = (temp_result&0xFF);
   lastClock = 8;
}
instructionNames[0x29] = "ADD16 HL HL";
opcodes[0x29] = function ADD16_HL_HL() /*0x29*/ 
{
   temp_result = ((H<<8)+L)+((H<<8)+L);
   F = 0;
   if (temp_result > 0xFFFF) F |= flag_carry;
   H = ((temp_result>>8)&0xFF);
   L = (temp_result&0xFF);
   lastClock = 8;
}
instructionNames[0x39] = "ADD16 HL SP";
opcodes[0x39] = function ADD16_HL_SP() /*0x39*/ 
{
   temp_result = ((H<<8)+L)+SP;
   F = 0;
   if (temp_result > 0xFFFF) F |= flag_carry;
   H = (temp_result>>8&0xFF);
   L = (temp_result&0xFF);
   lastClock = 8;
}
instructionNames[0xE8] = "ADD16 SP n";
opcodes[0xE8] = function ADD16_SP_n() /*0xE8*/ 
{
   SP += rb(PC);
   PC++;
   if (SP > 0xFFFF) F |= flag_carry;
   lastClock = 16;
}
instructionNames[0x03] = "INC16 BC";
opcodes[0x03] = function INC16_BC() /*0x03*/ 
{
   temp_result = ((B<<8)+C);
   temp_result++;
   B = (temp_result>>8)&0xFF;
   C = temp_result&0xFF;
   lastClock = 8;
}
instructionNames[0x13] = "INC16 DE";
opcodes[0x13] = function INC16_DE() /*0x13*/ 
{
    temp_result = ((D<<8)+E);
   temp_result++;
   D = (temp_result>>8)&0xFF;
   E = temp_result&0xFF;
   lastClock = 8;
}  
instructionNames[0x23] = "INC16 HL";
opcodes[0x23] = function INC16_HL() /*0x23*/ 
{
   temp_result = ((H<<8)+L);
   temp_result++;
   H = (temp_result>>8)&0xFF;
   L = temp_result&0xFF;
   lastClock = 8;
}
instructionNames[0x33] = "INC16 SP";
opcodes[0x33] = function INC16_SP() /*0x33*/ 
{
   SP++;
   lastClock = 8;
}
instructionNames[0x0B] = "DEC16 BC";
opcodes[0x0B] = function DEC16_BC() /*0x0B*/ 
{
   temp_result = ((B<<8)+C);
   temp_result--;
   B = (temp_result>>8)&0xFF;
   C = temp_result&0xFF;
   lastClock = 8;
}
instructionNames[0x1B] = "DEC16 DE";
opcodes[0x1B] = function DEC16_DE() /*0x1B*/ 
{
    temp_result = ((D<<8)+E);
   temp_result--;
   D = (temp_result>>8)&0xFF;
   E = temp_result&0xFF;
   lastClock = 8;
}  
instructionNames[0x2B] = "DEC16 HL";
opcodes[0x2B] = function DEC16_HL() /*0x2B*/ 
{
   temp_result = ((H<<8)+L);
   temp_result--;
   H = (temp_result>>8)&0xFF;
   L = temp_result&0xFF;
   lastClock = 8;
}
instructionNames[0x3B] = "DEC16 SP";
opcodes[0x3B] = function DEC16_SP() /*0x3B*/ 
{
   SP--;
   SP &= 0xFFFF;
   lastClock = 8;
}
instructionNames[0xCB] = "[[CB]] ";
opcodes[0xCB] = function CB() { //Yay for subcommands!
   var next = rb(PC++);
   switch(next)
   {
		//Hacked in to get BIOS to work, we need the rest here
		//RLr_C
		case 0x11:
			if(F&flag_carry) temp_value = 1;
			else temp_value = 0;
			
			if(C&0x80) F != flag_carry;
			else F &= ~flag_carry;
			
			C = (C<<1) + temp_value;
			C &= 0xFF;
			
			if(C == 0) F |= flag_zero;
			else F &= ~flag_zero;
		break;
			
   
      case 0x37:
         lastClock = 8;
         A =  ((A<<4)|(A>>4))&0xFF;
         break;
      case 0x30:
         lastClock = 8;
         B = ((B<<4)|(B>>4))&0xFF;
         break;
      case 0x31:
         lastClock = 8;
         C = ((C<<4)|(C>>4))&0xFF;
         break;
      case 0x32:
         lastClock = 8;
         D = ((D<<4)|(D>>4))&0xFF;
         break;
      case 0x33:
         lastClock = 8;
         E = ((E<<4)|(E>>4))&0xFF;
         break;
      case 0x34:
         lastClock = 8;
         H = ((H<<4)|(H>>4))&0xFF;
         break;
      case 0x35:
         lastClock = 8;
         L = ((L<<4)|(L>>4))&0xFF;
         break;
      case 0x36:
         lastClock = 16;
         wb(((H<<8)+L),((rb((H<<8)+L)<<4)|(rb((H<<8)+L)>>4))&0xFF);
         break;
	
	//TODO: We need bit manipulaton here, the PDF didnt' tell us about it
	
	//Test bit b of x, where x is a register
	case 0x7C: //BIT_7_H
		if( !((H & 0x80)&0xFF) ) F |= flag_zero;
		else F &= ~flag_zero;
		lastClock = 8;
		break;
			
	
	default:
		debug_out("Missing instruction with opcode CB " + next.toString(16) + " - ");
		NOT_IMPLEMENTED();
   }
}
//Also hacked in for bios
instructionNames[0x17] = "RLA";
opcodes[0x17] = function RLA() 
{
		if(F&flag_carry) temp_value = 1;
		else temp_value = 0;
		A = A<<1;
		A += temp_value;
		A &= 0xFF;
		if(C == 0) F |= flag_zero;
		else F &= ~flag_zero;
}
instructionNames[0x00] = "NOP";
opcodes[0x00] = function NOP() { lastClock = 4; }                 

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
		debug_out("BIOS Execution completed");
		load_image("tetris.gb");
	}
	return lastClock;
}