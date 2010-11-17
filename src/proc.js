const debugmode = true;
var temp_result = 0; //For calculation
//Lets define our flags
const flag_zero = 0x80; //set when last op had result of 0
const flag_operation = 0x40; //set if last op was subtraction
const flag_halfcarry = 0x20; //set if the lower half of the byte overflowed past 15 in last op
const flag_carry = 0x10; //set if last operation was >255 or <0

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
var mem = []

function load_rom(fname)
{
	var fin = new BinFileReader(fname);
	return fin.readString(fin.getFileSize(),0);
}
function reset()
{
	PC = 0x0100;
	SP = 0xFFFE;
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
	for(var i = 0; i < 0xFFFF; i++)
	{
		mem[i] = 0;
	}
	mem = load_rom("tetris.gb"); //This is kind of hacked together, could probably be better...
	if(debugmode) document.writeln("Z80 Initialized!");
}

//This is the assumed syntax for MMU

function wb(addr, val) { mem[addr] = val&0xFF; } //Write byte
function ww(addr, val) { mem[addr] = (val>>8)&0xFF; mem[addr+1] = val&0xFF; } //Write word
function rb(addr) { return mem[addr]; } //Read byte
function rw(addr) { return mem[addr]<<8 + mem[addr+1]; } //Read word
function rw_lsb(addr) { return mem[addr+1]<<8 + mem[addr]; } //Read word with least sig byte first

//Time to start our instructions!

//LD register, n
opcodes[0x06] = function LDB_n() /*0x06*/ { B = rb(PC); PC++; lastClock = 8; }
opcodes[0x0E] = function LDC_n() /*0x0E*/ {	C = rb(PC); PC++; lastClock = 8; }
opcodes[0x16] = function LDD_n() /*0x16*/ {	D = rb(PC); PC++; lastClock = 8; }
opcodes[0x1E] = function LDE_n() /*0x1E*/ { E = rb(PC); PC++; lastClock = 8; }
opcodes[0x26] = function LDH_n() /*0x26*/ {	H = rb(PC); PC++; lastClock = 8; }
opcodes[0x2E] = function LDL_n() /*0x2E*/ {	L = rb(PC); PC++; lastClock = 8; }
//LD r1, r2
opcodes[0x7F] = function LDA_A() /*0x7F*/ { A = A; lastClock = 4; }
opcodes[0x78] = function LDA_B() /*0x78*/ { A = B; lastClock = 4; }
opcodes[0x79] = function LDA_C() /*0x79*/ {	A = C; lastClock = 4; }
opcodes[0x7A] = function LDA_D() /*0x7A*/ {	A = D; lastClock = 4; }
opcodes[0x7B] = function LDA_E() /*0x7B*/ { A = E; lastClock = 4; }
opcodes[0x7C] = function LDA_H() /*0x7C*/ { A = H; lastClock = 4; }
opcodes[0x7D] = function LDA_L() /*0x7D*/ { A = L; lastClock = 4; }
opcodes[0x7E] = function LDA_AT_HL() /*0x7E*/ { A = rb((H<<8)+L); lastClock = 8; }
opcodes[0x40] = function LDB_B() /*0x40*/ { B = B; lastClock = 4; }
opcodes[0x41] = function LDB_C() /*0x41*/ { B = C; lastClock = 4; }
opcodes[0x42] = function LDB_D() /*0x42*/ { B = D; lastClock = 4; }
opcodes[0x43] = function LDB_E() /*0x43*/ { B = E; lastClock = 4; }
opcodes[0x44] = function LDB_H() /*0x44*/ { B = H; lastClock = 4; }
opcodes[0x45] = function LDB_L() /*0x45*/ { B = L; lastClock = 4; }
opcodes[0x46] = function LDB_AT_HL() /*0x46*/ { B = rb((H<<8)+L); lastClock = 8; }
opcodes[0x48] = function LDC_B() /*0x48*/ { C = B; lastClock = 4; }
opcodes[0x49] = function LDC_C() /*0x49*/ { C = C; lastClock = 4; }
opcodes[0x4A] = function LDC_D() /*0x4A*/ { C = D; lastClock = 4; }
opcodes[0x4B] = function LDC_E() /*0x4B*/ { C = E; lastClock = 4; }
opcodes[0x4C] = function LDC_H() /*0x4C*/ { C = H; lastClock = 4; }
opcodes[0x4D] = function LDC_L() /*0x4D*/ { C = L; lastClock = 4; }
opcodes[0x4E] = function LDC_AT_HL() /*0x4E*/ { C = rb((H<<8)+L); lastClock = 8; }
opcodes[0x50] = function LDD_B() /*0x50*/ { D = B; lastClock = 4; }
opcodes[0x51] = function LDD_C() /*0x51*/ { D = C; lastClock = 4; }
opcodes[0x52] = function LDD_D() /*0x52*/ { D = D; lastClock = 4; }
opcodes[0x53] = function LDD_E() /*0x53*/ { D = E; lastClock = 4; }
opcodes[0x54] = function LDD_H() /*0x54*/ { D = H; lastClock = 4; }
opcodes[0x55] = function LDD_L() /*0x55*/ { D = L; lastClock = 4; }
opcodes[0x56] = function LDD_AT_HL() /*0x56*/ { D = rb((H<<8)+L); lastClock = 8; }
opcodes[0x58] = function LDE_B() /*0x58*/ { E = B; lastClock = 4; }
opcodes[0x59] = function LDE_C() /*0x59*/ { E = C; lastClock = 4; }
opcodes[0x5A] = function LDE_D() /*0x5A*/ { E = D; lastClock = 4; }
opcodes[0x5B] = function LDE_E() /*0x5B*/ { E = E; lastClock = 4; }
opcodes[0x5C] = function LDE_H() /*0x5C*/ { E = H; lastClock = 4; }
opcodes[0x5D] = function LDE_L() /*0x5D*/ { E = L; lastClock = 4; }
opcodes[0x5E] = function LDE_AT_HL() /*0x5E*/ { E = rb((H<<8)+L); lastClock = 8; }
opcodes[0x60] = function LDH_B() /*0x60*/ { H = B; lastClock = 4; }
opcodes[0x61] = function LDH_C() /*0x61*/ { H = C; lastClock = 4; }
opcodes[0x62] = function LDH_D() /*0x62*/ { H = D; lastClock = 4; }
opcodes[0x63] = function LDH_E() /*0x63*/ { H = E; lastClock = 4; }
opcodes[0x64] = function LDH_H() /*0x64*/ { H = H; lastClock = 4; }
opcodes[0x65] = function LDH_L() /*0x65*/ { H = L; lastClock = 4; }
opcodes[0x66] = function LDH_AT_HL() /*0x66*/ { H = rb((H<<8)+L); lastClock = 8; }
opcodes[0x68] = function LDL_B() /*0x68*/ { L = B; lastClock = 4; }
opcodes[0x69] = function LDL_C() /*0x69*/ { L = C; lastClock = 4; }
opcodes[0x6A] = function LDL_D() /*0x6A*/ { L = D; lastClock = 4; }
opcodes[0x6B] = function LDL_E() /*0x6B*/ { L = E; lastClock = 4; }
opcodes[0x6C] = function LDL_H() /*0x6C*/ { L = H; lastClock = 4; }
opcodes[0x6D] = function LDL_L() /*0x6D*/ { L = L; lastClock = 4; }
opcodes[0x6E] = function LDL_AT_HL() /*0x6E*/ { L = rb((H<<8)+L); lastClock = 8; }
opcodes[0x70] = function LD_AT_HL_B() /*0x70*/ { wb((H<<8)+L, B); lastClock = 8;}
opcodes[0x71] = function LD_AT_HL_C() /*0x71*/ { wb((H<<8)+L, C); lastClock = 8;}
opcodes[0x72] = function LD_AT_HL_D() /*0x72*/ { wb((H<<8)+L, D); lastClock = 8;}
opcodes[0x73] = function LD_AT_HL_E() /*0x73*/ { wb((H<<8)+L, E); lastClock = 8;}
opcodes[0x74] = function LD_AT_HL_H() /*0x74*/ { wb((H<<8)+L, H); lastClock = 8;}
opcodes[0x75] = function LD_AT_HL_L() /*0x75*/ { wb((H<<8)+L, L); lastClock = 8;}
opcodes[0x36] = function LD_AT_HL_n() /*0x36*/ { wb((H<<8)+L, rb(PC)); PC++; lastClock = 12;}
//LD A, n
opcodes[0x0A] = function LDA_AT_BC() /*0x0A*/ { A = rb((B<<8)+C); lastClock = 8; }
opcodes[0x1A] = function LDA_AT_DE() /*0x1A*/ { A = rb((D<<8)+E); lastClock = 8; }
opcodes[0xFA] = function LDA_AT_nn() /*0xFA*/ { A = rb(rw_lsb(PC)); PC+=2; lastClock = 12; }
opcodes[0x3E] = function LDA_n() /*0x3E*/ { A = rb(PC); PC++; lastClock = 8; }
//LD n, A
opcodes[0x47] = function LDB_A() /*0x47*/ { B = A; lastClock = 4; }
opcodes[0x4F] = function LDC_A() /*0x4F*/ { C = A; lastClock = 4; }
opcodes[0x57] = function LDD_A() /*0x57*/ { D = A; lastClock = 4; }
opcodes[0x5f] = function LDE_A() /*0x5F*/ { E = A; lastClock = 4; }
opcodes[0x67] = function LDH_A() /*0x67*/ { H = A; lastClock = 4; }
opcodes[0x6F] = function LDL_A() /*0x6F*/ { L = A; lastClock = 4; }
opcodes[0x02] = function LD_AT_BC_A() /*0x02*/ { wb((B<<8)+C, A); lastClock = 8; }
opcodes[0x12] = function LD_AT_DE_A() /*0x12*/ { wb((D<<8)+E, A); lastClock = 8; }
opcodes[0x77] = function LD_AT_HL_A() /*0x77*/ { wb((H<<8)+L, A); lastClock = 8; }
opcodes[0xEA] = function LD_AT_nn_A() /*0xEA*/ { wb(rw(PC), A); PC+=2; lastClock = 16; }
//LD A, (C)
opcodes[0xF2] = function LDA_AT_C() /*0xF2*/ { A = rb(0xFF00+C); lastClock = 8; }
//LD (C), A
opcodes[0xE2] = function LD_AT_C_A() /*0xE2*/ { wb(0xFF00+C, A); lastClock = 8; }
//LD A, (HLD)
opcodes[0x3A] = function LDA_AT_HLD() /*0x3A*/ { A = rb((H<<8)+L); temp_result = ((H<<8)+L - 1); H = (temp_result>>8)&0xFF; L = temp_result&0xFF;}
//LD (HLD), A
opcodes[0x32] = function LD_AT_HLD_A() /*0x32*/ { wb((H<<8)+L, A); temp_result = ((H<<8)+L - 1, A); H = (temp_result>>8)&0xFF; L = temp_result&0xFF;}
//LD A, (HLI)
opcodes[0x2A] = function LDA_AT_HLI() /*0x2A*/ { A = rb((H<<8)+L); temp_result = ((H<<8)+L + 1); H = (temp_result>>8)&0xFF; L = temp_result&0xFF;}
//LD (HLI), A
opcodes[0x22] = function LD_AT_HLI_A() /*0x22*/ { wb((H<<8)+L, A); temp_result = ((H<<8)+L + 1, A); H = (temp_result>>8)&0xFF; L = temp_result&0xFF;}
//LD (n), A
opcodes[0xE0] = function LD_n_A() /*0xE0*/ { wb(0xFF00+rb(PC), A); PC++; lastClock = 12; }
//LD A, (n)
opcodes[0xF0] = function LD_A_n() /*0xF0*/ { A = rb(0xFF00+rb(PC)); PC++; lastClock = 12; }
//LD n, nn
opcodes[0x01] = function LDBC_nn() /*0x01*/ { B = rb(PC); PC++; C = rb(PC); PC++; lastClock = 12; }
opcodes[0x11] = function LDDE_nn() /*0x11*/ { D = rb(PC); PC++; E = rb(PC); PC++; lastClock = 12; }
opcodes[0x21] = function LDHL_nn() /*0x21*/ { H = rb(PC); PC++; L = rb(PC); PC++; lastClock = 12; }
opcodes[0x31] = function LDSP_nn() /*0x31*/ { SP = rw(PC); PC+=2; lastClock = 12; }
//LD SP, HL
opcodes[0xF9] = function LDSP_HL() /*0xF9*/ { SP = (H<<8)+L; lastClock = 8; }
//LD HL, SP+n
opcodes[0xF8] = function LDHL_SP_n() /*0xF8*/ {
	temp_result = rb(PC);
	if(temp_result > 127) temp_result = -((~temp_result+1)&0xFF);
	PC++; temp_result += SP;
	H = (temp_result>>8) & 0xFF;
	L = temp_result & 0xFF;
	lastClock = 12;
}
opcodes[0x08] = function LD_nn_SP() /*0x08*/ { /*printf("Not implemented, may be unneccessary\n");*/ lastClock = 20; }
//PUSH
opcodes[0xF5] = function PUSHAF() /*F5*/ { SP--; wb(SP, A); SP--; wb(SP, F); lastClock = 16; }
opcodes[0xC5] = function PUSHBC() /*C5*/ { SP--; wb(SP, B); SP--; wb(SP, C); lastClock = 16; }
opcodes[0xD5] = function PUSHDE() /*D5*/ { SP--; wb(SP, D); SP--; wb(SP, E); lastClock = 16; }
opcodes[0xE5] = function PUSHHL() /*E5*/ { SP--; wb(SP, H); SP--; wb(SP, L); lastClock = 16; }
//POP
opcodes[0xF1] = function POPAF() /*F1*/ { F = rb(SP); SP++; A = rb(SP); SP++; lastClock = 12; }
opcodes[0xC1] = function POPBC() /*C1*/ { C = rb(SP); SP++; B = rb(SP); SP++; lastClock = 12; }
opcodes[0xD1] = function POPDE() /*D1*/ { E = rb(SP); SP++; D = rb(SP); SP++; lastClock = 12; }
opcodes[0xE1] = function POPHL() /*E1*/ { L = rb(SP); SP++; H = rb(SP); SP++; lastClock = 12; }
//ADD A, n  - IGNORES HALF CARRY, MAY NEED TO BE CHANGED
opcodes[0x87] = function ADD_A_A() /*0x87*/ {
	temp_result = A + A; //Addition
	F = 0; //Clear flags
	if(!(A & 0xFF)) F |= flag_zero;
	if(temp_result > 0xFF) F |= flag_carry;
	A = temp_result & 0xFF;
	lastClock = 4;
}
opcodes[0x80] = function ADD_A_B() /*0x80*/ {
	temp_result = A + B; //Addition
	F = 0; //Clear flags
	if(!(A & 0xFF)) F |= flag_zero;
	if(temp_result > 0xFF) F |= flag_carry;
	A = temp_result & 0xFF;
	lastClock = 4;
}
opcodes[0x81] = function ADD_A_C() /*0x81*/ {
	temp_result = A + C; //Addition
	F = 0; //Clear flags
	if(!(A & 0xFF)) F |= flag_zero;
	if(temp_result > 0xFF) F |= flag_carry;
	A = temp_result & 0xFF;
	lastClock = 4;
}
opcodes[0x82] = function ADD_A_D() /*0x82*/ {
	temp_result = A + D; //Addition
	F = 0; //Clear flags
	if(!(A & 0xFF)) F |= flag_zero;
	if(temp_result > 0xFF) F |= flag_carry;
	A = temp_result & 0xFF;
	lastClock = 4;
}
opcodes[0x83] = function ADD_A_E() /*0x83*/ {
	temp_result = A + E; //Addition
	F = 0; //Clear flags
	if(!(A & 0xFF)) F |= flag_zero;
	if(temp_result > 0xFF) F |= flag_carry;
	A = temp_result & 0xFF;
	lastClock = 4;
}
opcodes[0x84] = function ADD_A_H() /*0x84*/ {
	temp_result = A + H; //Addition
	F = 0; //Clear flags
	if(!(A & 0xFF)) F |= flag_zero;
	if(temp_result > 0xFF) F |= flag_carry;
	A = temp_result & 0xFF;
	lastClock = 4;
}
opcodes[0x85] = function ADD_A_L() /*0x85*/ {
	temp_result = A + E; //Addition
	F = 0; //Clear flags
	if(!(A & 0xFF)) F |= flag_zero;
	if(temp_result > 0xFF) F |= flag_carry;
	A = temp_result & 0xFF;
	lastClock = 4;
}
opcodes[0x86] = function ADD_A_AT_HL() /*0x86*/ {
	temp_result = A + rb((H<<8)+L); //Addition
	F = 0; //Clear flags
	if(!(A & 0xFF)) F |= flag_zero;
	if(temp_result > 0xFF) F |= flag_carry;
	A = temp_result & 0xFF;
	lastClock = 8;
}
opcodes[0xC6] = function ADD_A_n() /*0xC6*/ {
	temp_result = A + rb(PC); //Addition
	PC++;
	F = 0; //Clear flags
	if(!(A & 0xFF)) F |= flag_zero;
	if(temp_result > 0xFF) F |= flag_carry;
	A = temp_result & 0xFF;
	lastClock = 8;
}
opcodes[0x8F] = function ADC_A_A() /*0x8F*/ {
	temp_result = A + A;
	temp_result += (F&flag_carry)?1:0;
	if(!(A & 0xFF)) F |= flag_zero;
	if(temp_result > 0xFF) F |= flag_carry;
	A = temp_result & 0xFF;
	lastClock = 4;	
}
opcodes[0x88] = function ADC_A_B() /*0x88*/ {
	temp_result = A + B;
	temp_result += (F&flag_carry)?1:0;
	if(!(A & 0xFF)) F |= flag_zero;
	if(temp_result > 0xFF) F |= flag_carry;
	A = temp_result & 0xFF;
	lastClock = 4;	
}
opcodes[0x89] = function ADC_A_C() /*0x89*/ {
	temp_result = A + C;
	temp_result += (F&flag_carry)?1:0;
	if(!(A & 0xFF)) F |= flag_zero;
	if(temp_result > 0xFF) F |= flag_carry;
	A = temp_result & 0xFF;
	lastClock = 4;	
}
opcodes[0x8A] = function ADC_A_D() /*0x8A*/ {
	temp_result = A + D;
	temp_result += (F&flag_carry)?1:0;
	if(!(A & 0xFF)) F |= flag_zero;
	if(temp_result > 0xFF) F |= flag_carry;
	A = temp_result & 0xFF;
	lastClock = 4;	
}
opcodes[0x8B] = function ADC_A_E() /*0x8B*/ {
	temp_result = A + E;
	temp_result += (F&flag_carry)?1:0;
	if(!(A & 0xFF)) F |= flag_zero;
	if(temp_result > 0xFF) F |= flag_carry;
	A = temp_result & 0xFF;
	lastClock = 4;	
}
opcodes[0x8C] = function ADC_A_H() /*0x8C*/ {
	temp_result = A + H;
	temp_result += (F&flag_carry)?1:0;
	if(!(A & 0xFF)) F |= flag_zero;
	if(temp_result > 0xFF) F |= flag_carry;
	A = temp_result & 0xFF;
	lastClock = 4;	
}
opcodes[0x8D] = function ADC_A_L() /*0x8D*/ {
	temp_result = A + L;
	temp_result += (F&flag_carry)?1:0;
	if(!(A & 0xFF)) F |= flag_zero;
	if(temp_result > 0xFF) F |= flag_carry;
	A = temp_result & 0xFF;
	lastClock = 4;	
}
opcodes[0x8E] = function ADC_A_AT_HL() /*0x8E*/ {
	temp_result = A + rb((H<<8)+L);
	temp_result += (F&flag_carry)?1:0;
	if(!(A & 0xFF)) F |= flag_zero;
	if(temp_result > 0xFF) F |= flag_carry;
	A = temp_result & 0xFF;
	lastClock = 8;	
}
opcodes[0xCE] = function ADC_A_n() /*0xCE*/ {
	temp_result = A + rb(PC);
	PC++;
	temp_result += (F&flag_carry)?1:0;
	if(!(A & 0xFF)) F |= flag_zero;
	if(temp_result > 0xFF) F |= flag_carry;
	A = temp_result & 0xFF;
	lastClock = 8;	
}
opcodes[0x97] = function SUB_A_A() {
	temp_result = A - A; //Subtraction
	F = 0; //Clear flags
	if(!(A & 0xFF)) F |= flag_zero;
	if(temp_result < 0) F |= flag_carry;
	F |= flag_operation;
	A = temp_result & 0xFF;
	lastClock = 4;
}
opcodes[0x90] = function SUB_A_B() {
	temp_result = A - B; //Subtraction
	F = 0; //Clear flags
	if(!(A & 0xFF)) F |= flag_zero;
	if(temp_result < 0) F |= flag_carry;
	F |= flag_operation;
	A = temp_result & 0xFF;
	lastClock = 4;
}
opcodes[0x91] = function SUB_A_C() {
	temp_result = A - C; //Subtraction
	F = 0; //Clear flags
	if(!(A & 0xFF)) F |= flag_zero;
	if(temp_result < 0) F |= flag_carry;
	F |= flag_operation;
	A = temp_result & 0xFF;
	lastClock = 4;
}
opcodes[0x92] = function SUB_A_D() {
	temp_result = A - D; //Subtraction
	F = 0; //Clear flags
	if(!(A & 0xFF)) F |= flag_zero;
	if(temp_result < 0) F |= flag_carry;
	F |= flag_operation;
	A = temp_result & 0xFF;
	lastClock = 4;
}
opcodes[0x93] = function SUB_A_E() {
	temp_result = A - E; //Subtraction
	F = 0; //Clear flags
	if(!(A & 0xFF)) F |= flag_zero;
	if(temp_result < 0) F |= flag_carry;
	F |= flag_operation;
	A = temp_result & 0xFF;
	lastClock = 4;
}
opcodes[0x94] = function SUB_A_H() {
	temp_result = A - H; //Subtraction
	F = 0; //Clear flags
	if(!(A & 0xFF)) F |= flag_zero;
	if(temp_result < 0) F |= flag_carry;
	F |= flag_operation;
	A = temp_result & 0xFF;
	lastClock = 4;
}
opcodes[0x95] = function SUB_A_L() {
	temp_result = A - L; //Subtraction
	F = 0; //Clear flags
	if(!(A & 0xFF)) F |= flag_zero;
	if(temp_result < 0) F |= flag_carry;
	F |= flag_operation;
	A = temp_result & 0xFF;
	lastClock = 4;
}
opcodes[0x96] = function SUB_A_AT_HL() {
	temp_result = A - rb((H<<8)+L); //Subtraction
	F = 0; //Clear flags
	if(!(A & 0xFF)) F |= flag_zero;
	if(temp_result < 0) F |= flag_carry;
	F |= flag_operation;
	A = temp_result & 0xFF;
	lastClock = 8;
}
opcodes[0x96] = function SUB_A_n() {
	temp_result = A - rb(PC); //Subtraction
	PC++;
	F = 0; //Clear flags
	if(!(A & 0xFF)) F |= flag_zero;
	if(temp_result < 0) F |= flag_carry;
	F |= flag_operation;
	A = temp_result & 0xFF;
	lastClock = 8;
}
opcodes[0x9F] = function SBC_A_A() {
	temp_result = A - (A + (F&flag_carry)?1:0); //Subtraction
	F = 0; //Clear flags
	if(!(A & 0xFF)) F |= flag_zero;
	if(temp_result < 0) F |= flag_carry;
	F |= flag_operation;
	A = temp_result & 0xFF;
	lastClock = 4;
}
opcodes[0x98] = function SBC_A_B() {
	temp_result = A - (B + (F&flag_carry)?1:0); //Subtraction
	F = 0; //Clear flags
	if(!(A & 0xFF)) F |= flag_zero;
	if(temp_result < 0) F |= flag_carry;
	F |= flag_operation;
	A = temp_result & 0xFF;
	lastClock = 4;
}
opcodes[0x99] = function SBC_A_C() {
	temp_result = A - (C + (F&flag_carry)?1:0); //Subtraction
	F = 0; //Clear flags
	if(!(A & 0xFF)) F |= flag_zero;
	if(temp_result < 0) F |= flag_carry;
	F |= flag_operation;
	A = temp_result & 0xFF;
	lastClock = 4;
}
opcodes[0x9A] = function SBC_A_D() {
	temp_result = A - (D + (F&flag_carry)?1:0); //Subtraction
	F = 0; //Clear flags
	if(!(A & 0xFF)) F |= flag_zero;
	if(temp_result < 0) F |= flag_carry;
	F |= flag_operation;
	A = temp_result & 0xFF;
	lastClock = 4;
}
opcodes[0x9B] = function SBC_A_E() {
	temp_result = A - (E + (F&flag_carry)?1:0); //Subtraction
	F = 0; //Clear flags
	if(!(A & 0xFF)) F |= flag_zero;
	if(temp_result < 0) F |= flag_carry;
	F |= flag_operation;
	A = temp_result & 0xFF;
	lastClock = 4;
}
opcodes[0x9C] = function SBC_A_H() {
	temp_result = A - (H + (F&flag_carry)?1:0); //Subtraction
	F = 0; //Clear flags
	if(!(A & 0xFF)) F |= flag_zero;
	if(temp_result < 0) F |= flag_carry;
	F |= flag_operation;
	A = temp_result & 0xFF;
	lastClock = 4;
}
opcodes[0x9D] = function SBC_A_L() {
	temp_result = A - (L + (F&flag_carry)?1:0); //Subtraction
	F = 0; //Clear flags
	if(!(A & 0xFF)) F |= flag_zero;
	if(temp_result < 0) F |= flag_carry;
	F |= flag_operation;
	A = temp_result & 0xFF;
	lastClock = 4;
}
opcodes[0x9E] = function SBC_A_AT_HL() {
	temp_result = A - (rb((H<<8)+L) + (F&flag_carry)?1:0); //Subtraction
	F = 0; //Clear flags
	if(!(A & 0xFF)) F |= flag_zero;
	if(temp_result < 0) F |= flag_carry;
	F |= flag_operation;
	A = temp_result & 0xFF;
	lastClock = 4;
}
opcodes[0xBF] = function CP_A() {
    // Kind of a do-nothing operation
    F |= flag_zero;
    F |= flag_operation; 
    lastclock = 4;
}
opcodes[0xB8] = function CP_B() {
    if (B == A) {
            F |= flag_zero;
    }
    else {    
        F &= !flag_zero;
    }
    if (A < B) {
        F |= flag_operation; 
    }
 lastclock = 4;
}
opcodes[0xB9] = function CP_C() {
    if (C == A) {
            F |= flag_zero;
    }
    else {    
        F &= !flag_zero;
    }
    if (A < C) {
        F |= flag_operation; 
    }
  lastclock = 4;
}
opcodes[0xBA] = function CP_D() {
    if (D == A) {
            F |= flag_zero;
    }
    else {    
        F &= !flag_zero;
    }
    if (A < D) {
        F |= flag_operation; 
    }
   lastclock = 4;
}
opcodes[0xBB] = function CP_E() {
    if (E == A) {
            F |= flag_zero;
    }
    else {    
        F &= !flag_zero;
    }
    if (A < E) {
        F |= flag_operation; 
    }
    lastclock = 4;
}
opcodes[0xBC] = function CP_H() {
    if (H == A) {
            F |= flag_zero;
    }
    else {    
        F &= !flag_zero;
    }
    if (A < H) {
        F |= flag_operation; 
    }
    lastclock = 4;
}
opcodes[0xBD] = function CP_L() {
    if (L == A) {
            F |= flag_zero;
    }
    else {    
        F &= !flag_zero;
    }
    if (A < L) {
        F |= flag_operation; 
    }
    lastclock = 4;
}
opcodes[0xBE] = function CP_AT_HL() {
    temp_result = rb((H<<8)+L);
    if (temp_result == A) {
            F |= flag_zero;
    }
    else {    
        F &= !flag_zero;
    }
    if (A < temp_result) {
        F |= flag_operation; 
    }
    lastclock = 8;
}
opcodes[0xFE] = function CP_A_n() {
    temp_result = rb(PC);
    PC++;
    if (temp_result == A) {
            F |= flag_zero;
    }
    else {    
        F &= !flag_zero;
    }
    if (A < temp_result) {
        F |= flag_operation; 
    }
    lastclock = 8;
}
opcodes[0x3C] = function INC_A() {
    A++;
    if (A == 0) {
       F |= flag_zero; 
    }
    F &= !flag_operation;
    lastclock = 4;
}
opcodes[0x04] = function INC_B() {
    B++;
    if (B == 0) {
       F |= flag_zero; 
    }
    F &= !flag_operation;
    lastclock = 4;
}
opcodes[0x0C] = function INC_C() {
    C++;
    if (C == 0) {
       F |= flag_zero; 
    }
    F &= !flag_operation;
    lastclock = 4;
}
opcodes[0x14] = function INC_D() {
    D++;
    if (D == 0) {
       F |= flag_zero; 
    }
    F &= !flag_operation;
    lastclock = 4;
}
opcodes[0x1C] = function INC_E() {
    E++;
    if (E == 0) {
       F |= flag_zero; 
    }
    F &= !flag_operation;
    lastclock = 4;
}
opcodes[0x24] = function INC_H() {
    H++;
    if (H == 0) {
       F |= flag_zero; 
    }
    F &= !flag_operation;
    lastclock = 4;
}
opcodes[0x2C] = function INC_L() {
    L++;
    if (L == 0) {
       F |= flag_zero; 
    }
    F &= !flag_operation;
    lastclock = 4;
}
opcodes[0x34] = function INC_AT_HL() {
    temp_result = rb((H<<8)+L);
    temp_result++;
    wb((H<<8)+L, temp_result);
    // Write back result

    if (temp_result == 0) {
       F |= flag_zero; 
    }
    F &= !flag_operation;
    lastclock = 12;
}
opcodes[0x3D] = function DEC_A() {
    A--;
    if (A == 0) {
       F |= flag_zero; 
    }
    F &= !flag_operation;
    lastclock = 4;
}
opcodes[0x05] = function DEC_B() {
    B--;
    if (B == 0) {
       F |= flag_zero; 
    }
    F &= !flag_operation;
    lastclock = 4;
}
opcodes[0x0D] = function DEC_C() {
    C--;
    if (C == 0) {
       F |= flag_zero; 
    }
    F &= !flag_operation;
    lastclock = 4;
}
opcodes[0x15] = function DEC_D() {
    D--;
    if (D == 0) {
       F |= flag_zero; 
    }
    F &= !flag_operation;
    lastclock = 4;
}
opcodes[0x1D] = function DEC_E() {
    E--;
    if (E == 0) {
       F |= flag_zero; 
    }
    F &= !flag_operation;
    lastclock = 4;
}
opcodes[0x25] = function DEC_H() {
    H--;
    if (H == 0) {
       F |= flag_zero; 
    }
    F &= !flag_operation;
    lastclock = 4;
}
opcodes[0x2D] = function DEC_L() {
    L--;
    if (L == 0) {
       F |= flag_zero; 
    }
    F &= !flag_operation;
    lastclock = 4;
}
opcodes[0x35] = function DEC_AT_HL() {
    temp_result = rb((H<<8)+L);
    temp_result--;
    wb((H<<8)+L, temp_result);
    // Write back result

    if (temp_result == 0) {
       F |= flag_zero; 
    }
    F &= !flag_operation;
    lastclock = 12;
}
opcodes[0xA7] = function AND_A() { A = A & A; F = 0; F |= flag_halfcarry; if (A == 0) F |= flag_zero; lastClock = 4; }
opcodes[0xA0] = function AND_B() { A = A & B; F = 0; F |= flag_halfcarry; if (A == 0) F |= flag_zero; lastClock = 4; }
opcodes[0xA1] = function AND_C() { A = A & C; F = 0; F |= flag_halfcarry; if (A == 0) F |= flag_zero; lastClock = 4; }
opcodes[0xA2] = function AND_D() { A = A & D; F = 0; F |= flag_halfcarry; if (A == 0) F |= flag_zero; lastClock = 4; }
opcodes[0xA3] = function AND_E() { A = A & E; F = 0; F |= flag_halfcarry; if (A == 0) F |= flag_zero; lastClock = 4; }
opcodes[0xA4] = function AND_H() { A = A & H; F = 0; F |= flag_halfcarry; if (A == 0) F |= flag_zero; lastClock = 4; }
opcodes[0xA5] = function AND_L() { A = A & L; F = 0; F |= flag_halfcarry; if (A == 0) F |= flag_zero; lastClock = 4; }
opcodes[0xA6] = function AND_AT_HL() { A = A & rb((H<<8)+L); F = 0; F |= flag_halfcarry; if (A == 0) F |= flag_zero; lastClock = 8; }
opcodes[0xE6] = function AND_n() { A = A & rb(PC); PC++; F = 0; F |= flag_halfcarry; if (A == 0) F |= flag_zero; lastClock = 8; }
opcodes[0xB7] = function OR_A() { A = A | A; F = 0; F |= flag_halfcarry; if (A == 0) F |= flag_zero; lastClock = 4; }
opcodes[0xB0] = function OR_B() { A = A | B; F = 0; F |= flag_halfcarry; if (A == 0) F |= flag_zero; lastClock = 4; }
opcodes[0xB1] = function OR_C() { A = A | C; F = 0; F |= flag_halfcarry; if (A == 0) F |= flag_zero; lastClock = 4; }
opcodes[0xB2] = function OR_D() { A = A | D; F = 0; F |= flag_halfcarry; if (A == 0) F |= flag_zero; lastClock = 4; }
opcodes[0xB3] = function OR_E() { A = A | E; F = 0; F |= flag_halfcarry; if (A == 0) F |= flag_zero; lastClock = 4; }
opcodes[0xB4] = function OR_H() { A = A | H; F = 0; F |= flag_halfcarry; if (A == 0) F |= flag_zero; lastClock = 4; }
opcodes[0xB5] = function OR_L() { A = A | L; F = 0; F |= flag_halfcarry; if (A == 0) F |= flag_zero; lastClock = 4; }
opcodes[0xB6] = function OR_AT_HL() { A = A | rb((H<<8)+L); F = 0; F |= flag_halfcarry; if (A == 0) F |= flag_zero; lastClock = 8; }
opcodes[0xF6] = function OR_n() { A = A | rb(PC); PC++; F = 0; F |= flag_halfcarry; if (A == 0) F |= flag_zero; lastClock = 8; }
opcodes[0xAF] = function XOR_A() { A = A ^ A; F=0; if(!(A & 0xFF)) F|=flag_zero; lastClock = 4; }
opcodes[0xA8] = function XOR_B() { A = A ^ B; F=0; if(!(A & 0xFF)) F|=flag_zero; lastClock = 4; }
opcodes[0xA9] = function XOR_C() { A = A ^ C; F=0; if(!(A & 0xFF)) F|=flag_zero; lastClock = 4; }
opcodes[0xAA] = function XOR_D() { A = A ^ D; F=0; if(!(A & 0xFF)) F|=flag_zero; lastClock = 4; }
opcodes[0xAB] = function XOR_E() { A = A ^ E; F=0; if(!(A & 0xFF)) F|=flag_zero; lastClock = 4; }
opcodes[0xAC] = function XOR_H() { A = A ^ H; F=0; if(!(A & 0xFF)) F|=flag_zero; lastClock = 4; }
opcodes[0xAD] = function XOR_L() { A = A ^ L; F=0; if(!(A & 0xFF)) F|=flag_zero; lastClock = 4; }
opcodes[0xAE] = function XOR_AT_HL() { A = A ^ rb((H<<8)+L); F=0; if(!(A & 0xFF)) F|=flag_zero; lastClock = 8; }
opcodes[0xEE] = function XOR_n() { A = A ^ rb(PC); PC++; F=0; if(!(A & 0xFF)) F|=flag_zero; lastClock = 8; }
//JP cc,nn
opcodes[0xC3] = function JP_nn() { PC = rw_lsb(PC); lastClock = 12; }
opcodes[0xC2] = function JP_NZ_nn(){ if(!(F & flag_zero)) { PC = rw_lsb(PC); } lastClock = 12; }
opcodes[0xCA] = function JP_Z_nn(){ if(F & flag_zero) { PC = rw_lsb(PC); } lastClock = 12; }
opcodes[0xD2] = function JP_NC_nn(){ if(!(F & flag_carry)) { PC = rw_lsb(PC); } lastClock = 12; }
//JP (HL)
opcodes[0xE9] = function JP_AT_HL() { PC = (H<<8 + L); lastClock = 4; }
//JR n
opcodes[0x18] = function JR_n() {
	temp_result = rb(PC);
	if(temp_result>0x80) temp_result = -((~temp_result+1)&255);
	PC++;
	PC += temp_result;
	lastClock = 8;
}
//JR cc,n
opcodes[0x20] = function JR_NZ_n() {
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
opcodes[0x28] = function JR_Z_n() {
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
opcodes[0x30] = function JR_NC_n() {
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
opcodes[0x38] = function JR_C_n() {
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
opcodes[0xCD] = function CALL_nn() { //This may or may not be correct...
 	SP--;
	wb(SP, rb(PC+2));	
	PC = rw(PC);
	lastClock = 12;
}
opcodes[0xC4] = function CALL_NZ_nn() {
	if(!(F | zero_flag))
	{
		SP--;
		wb(SP, rb(PC+2));
		PC = rw(PC);
	}
	else PC += 2;
	lastClock = 12; //Does this still take 12 cycles if it didn't branch?
}
opcodes[0xCC] = function CALL_Z_nn() {
	if((F | zero_flag))
	{
		SP--;
		wb(SP, rb(PC+2));		
		PC = rw(PC);
	}
	else PC += 2;
	lastClock = 12;
}
opcodes[0xD4] = function CALL_NC_nn() {
	if(!(F | carry_flag))
	{
		SP--;
		wb(SP, rb(PC+2));
		PC = rw(PC);
	}
	else PC += 2;
	lastClock = 12;
}
opcodes[0xDC] = function CALL_C_nn() {
	if((F | carry_flag))
	{
		SP--;
		wb(SP, rb(PC+2));
		PC = rw(PC);
	}
	else PC += 2;
	lastClock = 12;
}
//Restarts
opcodes[0xC7] = function RST_00H() {SP -= 2; ww(SP, PC); PC = 0x00; lastClock = 32; }
opcodes[0xCF] = function RST_08H() {SP -= 2; ww(SP, PC); PC = 0x08; lastClock = 32; }
opcodes[0xD7] = function RST_10H() {SP -= 2; ww(SP, PC); PC = 0x10; lastClock = 32; }
opcodes[0xDF] = function RST_18H() {SP -= 2; ww(SP, PC); PC = 0x18; lastClock = 32; }
opcodes[0xE7] = function RST_20H() {SP -= 2; ww(SP, PC); PC = 0x20; lastClock = 32; }
opcodes[0xEF] = function RST_28H() {SP -= 2; ww(SP, PC); PC = 0x28; lastClock = 32; }
opcodes[0xF7] = function RST_30H() {SP -= 2; ww(SP, PC); PC = 0x30; lastClock = 32; }
opcodes[0xFF] = function RST_38H() {SP -= 2; ww(SP, PC); PC = 0x38; lastClock = 32; }
//Returns
opcodes[0xC9] = function RET() { PC = rw(SP); SP+=2; lastClock = 8; }
opcodes[0xC0] = function RET_NZ() { if(!(F | flag_zero)) { PC = rw(SP); SP+=2; lastClock = 8; } }
opcodes[0xC8] = function RET_Z() { if((F | flag_zero)) { PC = rw(SP); SP+=2; lastClock = 8; } }
opcodes[0xD0] = function RET_NC() { if(!(F | flag_carry)) { PC = rw(SP); SP+=2; lastClock = 8; } }
opcodes[0xD8] = function RET_C() { if((F | flag_carry)) { PC = rw(SP); SP+=2; lastClock = 8; } }
opcodes[0xD9] = function RETI() { interrupts_enabled = true; PC = rw(SP); SP+=2; lastClock = 8; }
opcodes[0x2F] = function CPL() { 
   PC++;
   A = ~A; 
   lastClock = 4 
}
opcodes[0x3F] = function CCF() {
   PC++;
   if (F | flag_carry)
      F &= !flag_carry;
   else
      F |= flag_carry;
   lastClock = 4;
}
opcodes[0x37] = function SCF() { 
   PC++;
   F |= flag_carry;
   lastClock = 4;
}
opcodes[0x76] = function HALT() { halt = true; }
//opcodes[0x10] = function STOP() { } needs some rethinking
opcodes[0xCB] = function CB() { //Yay for subcommands!
   PC++;
   var next = rb(PC);
   switch(next)
   {
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
   }
}
opcodes[0x00] = function NOP() { lastClock = 4; }                 

reset();

function execute_step()
{
	PC++;
	document.write("Opcode is " + PC + ", " + rb(PC));
	opcodes[rb(PC)]();
	totalClock += lastClock;
	return "[" + PC.toString(16) + "] - <b>A</b> :" + A.toString(16)
				+ " <b>B</b> :" + B.toString(16) 
				+ " <b>C</b> :" + C.toString(16)
				+ " <b>D</b> :" + D.toString(16)
				+ " <b>E</b> :" + E.toString(16)
				+ " <b>H</b> :" + H.toString(16)
				+ " <b>L</b> :" + L.toString(16)
				+ " [<b>SP</b> :" + SP.toString(16)
				+ "] <b>F</b> :" + F.toString(16) + "<br>";
}

//This was me testing some instructions, so far so good!
//mem[0] = 0x06;
//mem[1] = 0x42;
//mem[2] = 0xFF;
//mem[3] = 0xFC;
//PC = 0;

document.write("<br>Let's go!</br>");
for(i = 0; i < 255; i+=1)
{
	document.write("Executing step " + i + " : ");
	document.write(execute_step());
}


