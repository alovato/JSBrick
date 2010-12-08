//Time to start our instructions!
//8F C0

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

//////////////////////////////////////////////////////
//
//	LOAD / STORES
//
//////////////////////////////////////////////////////

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
	//debug_out("A: " + A);
	A = rb(rw(PC)); 
	//debug_out("A: " + A + "  ("+rw(PC)+")");
	PC+=2; 
	lastClock = 16; 
	//debug_out("A: " + A);
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
instructionNames[0xF2] = "LDA A (0xFF00 + C)";
opcodes[0xF2] = function LDA_AT_C() /*0xF2*/ 
{ 
	A = rb(0xFF00+C); 
	lastClock = 8; 
}
//LD (C), A
instructionNames[0xE2] = "LD (0xFF00 + C) A";
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
	H = (temp_result>>8) & 0xFF; 
	L = temp_result & 0xFF;
	lastClock = 8;
}
//LD (HLD), A
instructionNames[0x32] = "LD (HL) DEC, A"
opcodes[0x32] = function LD_AT_HLD_A() /*0x32*/ 
{ 
	wb((H<<8)+L, A); 
	temp_result = ((H<<8)+L - 1); 
	H = (temp_result>>8)&0xFF; 
	L = temp_result&0xFF;
	lastClock = 8;
}
//LD A, (HLI)
instructionNames[0x2A] = "LDA (HL) INC";
opcodes[0x2A] = function LDA_AT_HLI() /*0x2A*/ 
{ 
	A = rb((H<<8)+L); 
	temp_result = ((H<<8)+L + 1); 
	H = (temp_result>>8)&0xFF; 
	L = temp_result&0xFF;
	lastClock = 8;
}
//LD (HLI), A
instructionNames[0x22] = "LDA (HL) INC, A";
opcodes[0x22] = function LD_AT_HLI_A() /*0x22*/ 
{ 
	wb((H<<8)+L, A); 
	temp_result = ((H<<8)+L + 1); 
	H = (temp_result>>8)&0xFF; 
	L = temp_result&0xFF;
	lastClock = 8;
}
//LD (n), A
instructionNames[0xE0] = "LD (0xFF00+n), A";
opcodes[0xE0] = function LD_n_A() /*0xE0*/
{ 
	wb(0xFF00+rb(PC), A); 
	PC++; 
	lastClock = 12;
}
//LD A, (n)
instructionNames[0xF0] = "LD A, (0xFF00+n)";
opcodes[0xF0] = function LD_A_n() /*0xF0*/
{
	A = rb(0xFF00+rb(PC));
	PC++;
	lastClock = 12;
}
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
	temp_result += SP;
	H = (temp_result>>8) & 0xFF;
	L = temp_result & 0xFF;
	clear_flags();
	set_flag_halfcarry(((SP&0x0F)+(rb(PC)&0x0F))>0x0F);
	set_flag_carry(((SP&0xFF)+(rb(PC++)&0xFF))>0xFF);
	lastClock = 12;
}
instructionNames[0x08] = "LD nn SP";
opcodes[0x08] = function LD_nn_SP() /*0x08*/
{ 
	temp_result = rw(PC);
	PC += 2;
	ww(temp_result, SP);
	lastClock = 20; 
}

///////////////////////////////////////////////////
//
//		PUSH / POP
//
///////////////////////////////////////////////////

//PUSH
instructionNames[0xF5] = "PUSH AF";
opcodes[0xF5] = function PUSHAF() /*F5*/
{ 
	wb(--SP, A); 
	wb(--SP, F); 
	lastClock = 16; 
}
instructionNames[0xC5] = "PUSH BC";
opcodes[0xC5] = function PUSHBC() /*C5*/ 
{ 
	wb(--SP, B); 
	wb(--SP, C); 
	lastClock = 16; 
}
instructionNames[0xD5] = "PUSH DE";
opcodes[0xD5] = function PUSHDE() /*D5*/ 
{ 
	wb(--SP, D); 
	wb(--SP, E); 
	lastClock = 16; 
}
instructionNames[0xE5] = "PUSH HL";
opcodes[0xE5] = function PUSHHL() /*E5*/
{ 
	wb(--SP, H); 
	wb(--SP, L); 
	lastClock = 16; 
}
//POP
instructionNames[0xF1] = "POP AF";
opcodes[0xF1] = function POPAF() /*F1*/ 
{ 
	F = rb(SP++); 
	A = rb(SP++); 
	lastClock = 12; 
}
instructionNames[0xC1] = "POP BC";
opcodes[0xC1] = function POPBC() /*C1*/
{ 
	C = rb(SP++); 
	B = rb(SP++); 
	lastClock = 12; 
}
instructionNames[0xD1] = "POP DE";
opcodes[0xD1] = function POPDE() /*D1*/ 
{ 
	E = rb(SP++); 
	D = rb(SP++); 
	lastClock = 12; 
}
instructionNames[0xE1] = "POP HL";	
opcodes[0xE1] = function POPHL() /*E1*/
{ 
	L = rb(SP++); 
	H = rb(SP++); 
	lastClock = 12; 
}

//////////////////////////////////////////////
//
//		ADD / ADC / SUB / SUBC
//
//////////////////////////////////////////////


instructionNames[0x87] = "ADD A A";
opcodes[0x87] = function ADD_A_A() /*0x87*/
{
	clear_flags();
	temp_result = A;
	A += A; //Addition
	set_flag_carry(A > 0xFF);
	A &= 0xFF;
	set_flag_zero(A == 0);
	set_flag_halfcarry( (A ^ A ^ temp_result) & 0x10 );
	lastClock = 4;
}
instructionNames[0x80] = "ADD A B";
opcodes[0x80] = function ADD_A_B() /*0x80*/ 
{
	clear_flags();
	temp_result = A;
	A += B; //Addition
	set_flag_carry(A > 0xFF);
	A &= 0xFF;
	set_flag_zero(A == 0);
	set_flag_halfcarry( (A ^ B ^ temp_result) & 0x10 );
	lastClock = 4;
}
instructionNames[0x81] = "ADD A C";
opcodes[0x81] = function ADD_A_C() /*0x81*/ 
{
	clear_flags();
	temp_result = A;
	A += C; //Addition
	set_flag_carry(A > 0xFF);
	A &= 0xFF;
	set_flag_zero(A == 0);
	set_flag_halfcarry( (A ^ C ^ temp_result) & 0x10 );
	lastClock = 4;
}
instructionNames[0x82] = "ADD A D";
opcodes[0x82] = function ADD_A_D() /*0x82*/ 
{
	clear_flags();
	temp_result = A;
	A += D; //Addition
	set_flag_carry(A > 0xFF);
	A &= 0xFF;
	set_flag_zero(A == 0);
	set_flag_halfcarry( (A ^ D ^ temp_result) & 0x10 );
	lastClock = 4;
}
instructionNames[0x83] = "ADD A E";
opcodes[0x83] = function ADD_A_E() /*0x83*/ 
{
	clear_flags();
	temp_result = A;
	A += E; //Addition
	set_flag_carry(A > 0xFF);
	A &= 0xFF;
	set_flag_zero(A == 0);
	set_flag_halfcarry( (A ^ E ^ temp_result) & 0x10 );
	lastClock = 4;
}
instructionNames[0x84] = "ADD A H";
opcodes[0x84] = function ADD_A_H() /*0x84*/ 
{
	clear_flags();
	temp_result = A;
	A += H; //Addition
	set_flag_carry(A > 0xFF);
	A &= 0xFF;
	set_flag_zero(A == 0);
	set_flag_halfcarry( (A ^ H ^ temp_result) & 0x10 );
	lastClock = 4;
}
instructionNames[0x85] = "ADD A L";
opcodes[0x85] = function ADD_A_L() /*0x85*/ 
{
	clear_flags();
	temp_result = A;
	A += L; //Addition
	set_flag_carry(A > 0xFF);
	A &= 0xFF;
	set_flag_zero(A == 0);
	set_flag_halfcarry( (A ^ L ^ temp_result) & 0x10 );
	lastClock = 4;
}
instructionNames[0x86] = "ADD A (HL)";
opcodes[0x86] = function ADD_A_AT_HL() /*0x86*/ 
{
	clear_flags();
	temp_result = A;
	A += rb((H<<8)+L); //Addition
	set_flag_carry(A > 0xFF);
	A &= 0xFF;
	set_flag_zero(A == 0);
	set_flag_halfcarry(A ^ (rb((H<<8)+L) ^ temp_result) & 0x10 );
	lastClock = 8;
}
instructionNames[0xC6] = "ADD A n";
opcodes[0xC6] = function ADD_A_n() /*0xC6*/ 
{
	clear_flags();
	temp_result = A;
	A += rb(PC); //Addition
	set_flag_carry(A > 0xFF);
	A &= 0xFF;
	set_flag_zero(A == 0);
	set_flag_halfcarry( (A ^ rb(PC++) ^ temp_result) & 0x10 );
	lastClock = 8;
}
instructionNames[0x8F] = "ADC A A";
opcodes[0x8F] = function ADC_A_A() /*0x8F*/ 
{
	temp_result = A; 
	A += A; 
	A += (F & 0x10)?1:0; 
	set_flag_carry(A > 0xFF); 
	A &= 0xFF; 
	set_flag_zero(A == 0); 
	set_flag_halfcarry((A ^ A ^ temp_result)&0x10);
	lastClock = 4;	
}
instructionNames[0x88] = "ADC A B";
opcodes[0x88] = function ADC_A_B() /*0x88*/ 
{
	clear_flags();
	temp_result = A; 
	A += B; 
	A += (F & 0x10)?1:0; 
	set_flag_carry(A > 0xFF); 
	A &= 0xFF; 
	set_flag_zero(A == 0); 
	set_flag_halfcarry((A ^ B ^ temp_result)&0x10);
	lastClock = 4;	
}
instructionNames[0x89] = "ADC A C";
opcodes[0x89] = function ADC_A_C() /*0x89*/ 
{
	clear_flags();
	temp_result = A; 
	A += C; 
	A += (F & 0x10)?1:0; 
	set_flag_carry(A > 0xFF); 
	A &= 0xFF; 
	set_flag_zero(A == 0); 
	set_flag_halfcarry((A ^ C ^ temp_result)&0x10);
	lastClock = 4;	
}
instructionNames[0x8A] = "ADC A D";
opcodes[0x8A] = function ADC_A_D() /*0x8A*/ 
{
	clear_flags();
	temp_result = A; 
	A += D; 
	A += (F & 0x10)?1:0; 
	set_flag_carry(A > 0xFF); 
	A &= 0xFF; 
	set_flag_zero(A == 0); 
	set_flag_halfcarry((A ^ D ^ temp_result)&0x10);
	lastClock = 4;	
}
instructionNames[0x8B] = "ADC A E";
opcodes[0x8B] = function ADC_A_E() /*0x8B*/ 
{
	temp_result = A; 
	A += E; 
	A += (F & 0x10)?1:0; 
	set_flag_carry(A > 0xFF); 
	A &= 0xFF; 
	set_flag_zero(A == 0); 
	set_flag_halfcarry((A ^ E ^ temp_result)&0x10);
	lastClock = 4;	
}
instructionNames[0x8C] = "ADC A H";
opcodes[0x8C] = function ADC_A_H() /*0x8C*/ 
{
	temp_result = A; 
	A += H; 
	A += (F & 0x10)?1:0; 
	set_flag_carry(A > 0xFF); 
	A &= 0xFF; 
	set_flag_zero(A == 0); 
	set_flag_halfcarry((A ^ H ^ temp_result)&0x10);
	lastClock = 4;	
}
instructionNames[0x8D] = "ADC A L";
opcodes[0x8D] = function ADC_A_L() /*0x8D*/ 
{
	temp_result = A; 
	A += L; 
	A += (F & 0x10)?1:0; 
	set_flag_carry(A > 0xFF); 
	A &= 0xFF; 
	set_flag_zero(A == 0); 
	set_flag_halfcarry((A ^ L ^ temp_result)&0x10);
	lastClock = 4;	
}
instructionNames[0x8E] = "ADC A (HL)";
opcodes[0x8E] = function ADC_A_AT_HL() /*0x8E*/ 
{
	temp_result = A; 
	A += rb((H<<8)+L); 
	A += (F & 0x10)?1:0; 
	set_flag_carry(A > 0xFF); 
	A &= 0xFF; 
	set_flag_zero(A == 0); 
	set_flag_halfcarry((A ^ rb((H<<8)+L) ^ temp_result)&0x10);
	lastClock = 8;	
}
instructionNames[0xCE] = "ADC A n";
opcodes[0xCE] = function ADC_A_n() /*0xCE*/ 
{
	temp_result = A; 
	A += rb(PC); 
	A += (F & 0x10)?1:0; 
	set_flag_carry(A > 0xFF); 
	A &= 0xFF; 
	set_flag_zero(A == 0); 
	set_flag_halfcarry((A ^ rb(PC++) ^ temp_result)&0x10);
	lastClock = 8;	
}
instructionNames[0x97] = "SUB A A";
opcodes[0x97] = function SUB_A_A() 
{
	temp_result = A;
	A -= A;
	set_flag_carry(A < 0);
	A &= 0xFF;
	set_flag_zero(A == 0);
	set_flag_halfcarry( (A ^ A ^ temp_result) & 0x10 );
	set_flag_operation(true);
	lastClock = 4;
}
instructionNames[0x90] = "SUB A B";
opcodes[0x90] = function SUB_A_B() 
{
	temp_result = A;
	A -= B;
	set_flag_carry(A < 0);
	A &= 0xFF;
	set_flag_zero(A == 0);
	set_flag_halfcarry( (A ^ B ^ temp_result) & 0x10 );
	set_flag_operation(true);
	lastClock = 4;
}
instructionNames[0x91] = "SUB A C";
opcodes[0x91] = function SUB_A_C() 
{
	temp_result = A;
	A -= C;
	set_flag_carry(A < 0);
	A &= 0xFF;
	set_flag_zero(A == 0);
	set_flag_halfcarry( (A ^ B ^ temp_result) & 0x10 );
	set_flag_operation(true);
	lastClock = 4;
}
instructionNames[0x92] = "SUB A D";
opcodes[0x92] = function SUB_A_D() 
{
	temp_result = A;
	A -= D;
	set_flag_carry(A < 0);
	A &= 0xFF;
	set_flag_zero(A == 0);
	set_flag_halfcarry( (A ^ D ^ temp_result) & 0x10 );
	set_flag_operation(true);
	lastClock = 4;
}
instructionNames[0x93] = "SUB A E";
opcodes[0x93] = function SUB_A_E() 
{
	temp_result = A;
	A -= E;
	set_flag_carry(A < 0);
	A &= 0xFF;
	set_flag_zero(A == 0);
	set_flag_halfcarry( (A ^ E ^ temp_result) & 0x10 );
	set_flag_operation(true);
	lastClock = 4;
}
instructionNames[0x94] = "SUB A H";
opcodes[0x94] = function SUB_A_H() 
{
	temp_result = A;
	A -= H;
	set_flag_carry(A < 0);
	A &= 0xFF;
	set_flag_zero(A == 0);
	set_flag_halfcarry( (A ^ H ^ temp_result) & 0x10 );
	set_flag_operation(true);
	lastClock = 4;
}
instructionNames[0x95] = "SUB A L";
opcodes[0x95] = function SUB_A_L() 
{
	temp_result = A;
	A -= L;
	set_flag_carry(A < 0);
	A &= 0xFF;
	set_flag_zero(A == 0);
	set_flag_halfcarry( (A ^ L ^ temp_result) & 0x10 );
	set_flag_operation(true);
	lastClock = 4;
}
instructionNames[0x96] = "SUB A (HL)";
opcodes[0x96] = function SUB_A_AT_HL() 
{
	temp_result = A;
	A -= rb((H<<8)+L);
	set_flag_carry(A < 0);
	A &= 0xFF;
	set_flag_zero(A == 0);
	set_flag_halfcarry( (A ^ rb((H<<8)+L) ^ temp_result) & 0x10 );
	set_flag_operation(true);
	lastClock = 8;
}
instructionNames[0xD6] = "SUB A n";
opcodes[0xD6] = function SUB_A_n() 
{
	temp_result = A;
	A -= rb(PC);
	set_flag_carry(A < 0);
	A &= 0xFF;
	set_flag_zero(A == 0);
	set_flag_halfcarry( (A ^ rb(PC++) ^ temp_result) & 0x10 );
	set_flag_operation(true);
	lastClock = 8;
}
instructionNames[0x9F] = "SBC A A";
opcodes[0x9F] = function SBC_A_A() 
{
	temp_result = A; 
	A -= A; 
	A -= (F & 0x10)?1:0;
	set_flag_carry(A < 0);
	A &= 0xFF;
	set_flag_zero(A == 0);
	set_flag_halfcarry( (A ^ A ^ temp_result) & 0x10 );
	set_flag_operation(true);
	lastClock = 4;
}
instructionNames[0x98] = "SBC A B";
opcodes[0x98] = function SBC_A_B() 
{
	temp_result = A; 
	A -= B; 
	A -= (F & 0x10)?1:0;
	set_flag_carry(A < 0);
	A &= 0xFF;
	set_flag_zero(A == 0);
	set_flag_halfcarry( (A ^ B ^ temp_result) & 0x10 );
	set_flag_operation(true);
	lastClock = 4;
}
instructionNames[0x99] = "SBC A C";
opcodes[0x99] = function SBC_A_C() 
{
	temp_result = A; 
	A -= C; 
	A -= (F & 0x10)?1:0;
	set_flag_carry(A < 0);
	A &= 0xFF;
	set_flag_zero(A == 0);
	set_flag_halfcarry( (A ^ C ^ temp_result) & 0x10 );
	set_flag_operation(true);
	lastClock = 4;
}
instructionNames[0x9A] = "SBC A D";
opcodes[0x9A] = function SBC_A_D() 
{
	temp_result = A; 
	A -= D; 
	A -= (F & 0x10)?1:0;
	set_flag_carry(A < 0);
	A &= 0xFF;
	set_flag_zero(A == 0);
	set_flag_halfcarry( (A ^ D ^ temp_result) & 0x10 );
	set_flag_operation(true);
	lastClock = 4;
}
instructionNames[0x9B] = "SBC A E";
opcodes[0x9B] = function SBC_A_E() 
{
	temp_result = A; 
	A -= E; 
	A -= (F & 0x10)?1:0;
	set_flag_carry(A < 0);
	A &= 0xFF;
	set_flag_zero(A == 0);
	set_flag_halfcarry( (A ^ E ^ temp_result) & 0x10 );
	set_flag_operation(true);
	lastClock = 4;
}
instructionNames[0x9C] = "SBC A H";
opcodes[0x9C] = function SBC_A_H() 
{
	temp_result = A; 
	A -= H; 
	A -= (F & 0x10)?1:0;
	set_flag_carry(A < 0);
	A &= 0xFF;
	set_flag_zero(A == 0);
	set_flag_halfcarry( (A ^ H ^ temp_result) & 0x10 );
	set_flag_operation(true);
	lastClock = 4;
}
instructionNames[0x9D] = "SBC A L";
opcodes[0x9D] = function SBC_A_L() 
{
	temp_result = A; 
	A -= L; 
	A -= (F & 0x10)?1:0;
	set_flag_carry(A < 0);
	A &= 0xFF;
	set_flag_zero(A == 0);
	set_flag_halfcarry( (A ^ L ^ temp_result) & 0x10 );
	set_flag_operation(true);
	lastClock = 4;
}
instructionNames[0x9E] = "SBC A (HL)";
opcodes[0x9E] = function SBC_A_AT_HL() 
{
	temp_result = A; 
	A -= rb((H<<8)+L); 
	A -= (F & 0x10)?1:0;
	set_flag_carry(A < 0);
	A &= 0xFF;
	set_flag_zero(A == 0);
	set_flag_halfcarry( (A ^ rb((H<<8)+L) ^ temp_result) & 0x10 );
	set_flag_operation(true);
	lastClock = 8;
}
instructionNames[0xDE] = "SBC A n";
opcodes[0xDE] = function SBC_A_n() 
{
	temp_result = A; 
	A -= rb(PC); 
	A -= (F & 0x10)?1:0;
	set_flag_carry(A < 0);
	A &= 0xFF;
	set_flag_zero(A == 0);
	set_flag_halfcarry( (A ^ rb(PC++) ^ temp_result) & 0x10 );
	set_flag_operation(true);
	lastClock = 8;
}

////////////////////////////////////////////////////
//
//		COMPARE
//
////////////////////////////////////////////////////


instructionNames[0xBF] = "CP A";
opcodes[0xBF] = function CP_A() 
{
	temp_result = A - A;
    set_flag_carry(temp_result < 0); 
	temp_result &= 0xFF;
	set_flag_zero(temp_result == 0);
	set_flag_operation(true);
	set_flag_halfcarry((A ^ A ^ temp_result) & 0x10);
    lastClock = 4;
}
instructionNames[0xB8] = "CP B";
opcodes[0xB8] = function CP_B() 
{
    temp_result = A - B;
    set_flag_carry(temp_result < 0); 
	temp_result &= 0xFF;
	set_flag_zero(temp_result == 0);
	set_flag_operation(true);
	set_flag_halfcarry((A ^ B ^ temp_result) & 0x10);
	lastClock = 4;
}
instructionNames[0xB9] = "CP C";
opcodes[0xB9] = function CP_C() 
{
    temp_result = A - C;
    set_flag_carry(temp_result < 0); 
	temp_result &= 0xFF;
	set_flag_zero(temp_result == 0);
	set_flag_operation(true);
	set_flag_halfcarry((A ^ C ^ temp_result) & 0x10);
	lastClock = 4;
}
instructionNames[0xBA] = "CP D";
opcodes[0xBA] = function CP_D() 
{
    temp_result = A - D;
    set_flag_carry(temp_result < 0); 
	temp_result &= 0xFF;
	set_flag_zero(temp_result == 0);
	set_flag_operation(true);
	set_flag_halfcarry((A ^ D ^ temp_result) & 0x10);
	lastClock = 4;
}
instructionNames[0xBB] = "CP E";
opcodes[0xBB] = function CP_E() 
{
    temp_result = A - E;
    set_flag_carry(temp_result < 0); 
	temp_result &= 0xFF;
	set_flag_zero(temp_result == 0);
	set_flag_operation(true);
	set_flag_halfcarry((A ^ E ^ temp_result) & 0x10);
	lastClock = 4;
}
instructionNames[0xBC] = "CP H";
opcodes[0xBC] = function CP_H() 
{
	temp_result = A - H;
    set_flag_carry(temp_result < 0); 
	temp_result &= 0xFF;
	set_flag_zero(temp_result == 0);
	set_flag_operation(true);
	set_flag_halfcarry((A ^ H ^ temp_result) & 0x10);
    lastClock = 4;
}
instructionNames[0xBD] = "CP L";
opcodes[0xBD] = function CP_L() 
{
	temp_result = A - L;
    set_flag_carry(temp_result < 0); 
	temp_result &= 0xFF;
	set_flag_zero(temp_result == 0);
	set_flag_operation(true);
	set_flag_halfcarry((A ^ L ^ temp_result) & 0x10);
    lastClock = 4;
}
instructionNames[0xBE] = "CP (HL)";
opcodes[0xBE] = function CP_AT_HL() 
{
    temp_result = A - rb((H<<8)+L);
    set_flag_carry(temp_result < 0); 
	temp_result &= 0xFF;
	set_flag_zero(temp_result == 0);
	set_flag_operation(true);
	set_flag_halfcarry((A ^ rb((H<<8)+L) ^ temp_result) & 0x10);
    lastClock = 8;
}
instructionNames[0xFE] = "CP A n";
opcodes[0xFE] = function CP_A_n() 
{
    temp_result = A - rb(PC);
    set_flag_carry(temp_result < 0); 
	temp_result &= 0xFF;
	set_flag_zero(temp_result == 0);
	set_flag_operation(true);
	set_flag_halfcarry((A ^ rb(PC++) ^ temp_result) & 0x10);
    lastClock = 8;
}

////////////////////////////////////////////////
//
//		INCREMENT / DECREMENT
//
////////////////////////////////////////////////
instructionNames[0x3C] = "INC A";
opcodes[0x3C] = function INC_A() 
{
    A++;
	A &= 0xFF;
	clear_flags();
    set_flag_zero(A == 0);
    lastClock = 4;
}
instructionNames[0x04] = "INC B";
opcodes[0x04] = function INC_B() 
{
    B++;
	B &= 0xFF;
	clear_flags();
    set_flag_zero(B == 0);
    lastClock = 4;
}
instructionNames[0x0C] = "INC C";
opcodes[0x0C] = function INC_C() 
{
    C++;
	C &= 0xFF;
	clear_flags();
    set_flag_zero(C == 0);
    lastClock = 4;
}
instructionNames[0x14] = "INC D";
opcodes[0x14] = function INC_D() 
{
    D++;
	D &= 0xFF;
	clear_flags();
    set_flag_zero(D == 0);
    lastClock = 4;
}
instructionNames[0x1C] = "INC E";
opcodes[0x1C] = function INC_E() 
{
    E++;
	E &= 0xFF;
	clear_flags();
    set_flag_zero(E == 0);
    lastClock = 4;
}
instructionNames[0x24] = "INC H";
opcodes[0x24] = function INC_H() 
{
    H++;
	H &= 0xFF;
	clear_flags();
    set_flag_zero(H == 0);
    lastClock = 4;
}
instructionNames[0x2C] = "INC L";
opcodes[0x2C] = function INC_L() 
{
    L++;
	L &= 0xFF;
	clear_flags();
    set_flag_zero(L == 0);
    lastClock = 4;
}
instructionNames[0x34] = "INC (HL)";
opcodes[0x34] = function INC_AT_HL() 
{
    temp_result = rb((H<<8)+L);
    temp_result++;
	temp_result &= 0xFF;
    wb((H<<8)+L, temp_result);
	clear_flags();
    set_flag_zero(temp_result == 0);
    lastClock = 12;
}
instructionNames[0x3D] = "DEC A";
opcodes[0x3D] = function DEC_A() 
{
    A--;
	A &= 0xFF;
	clear_flags();
    set_flag_zero(A == 0);
    lastClock = 4;
}
instructionNames[0x05] = "DEC B";
opcodes[0x05] = function DEC_B() 
{
    B--;
	B &= 0xFF;
	clear_flags();
    set_flag_zero(B == 0);
    lastClock = 4;
}
instructionNames[0x0D] = "DEC C";
opcodes[0x0D] = function DEC_C() 
{
    C--;
	C &= 0xFF;
	clear_flags();
    set_flag_zero(C == 0);
    lastClock = 4;
}
instructionNames[0x15] = "DEC D";
opcodes[0x15] = function DEC_D() 
{
    D--;
	D &= 0xFF;
	clear_flags();
    set_flag_zero(D == 0);
    lastClock = 4;
}
instructionNames[0x1D] = "DEC E";
opcodes[0x1D] = function DEC_E() 
{
    E--;
	E &= 0xFF;
	clear_flags();
    set_flag_zero(E == 0);
    lastClock = 4;
}
instructionNames[0x25] = "DEC H";
opcodes[0x25] = function DEC_H() 
{
    H--;
	H &= 0xFF;
	clear_flags();
    set_flag_zero(H == 0);
    lastClock = 4;
}
instructionNames[0x2D] = "DEC L";
opcodes[0x2D] = function DEC_L() 
{
    L--;
	L &= 0xFF;
	clear_flags();
    set_flag_zero(L == 0);
    lastClock = 4;
}
instructionNames[0x35] = "DEC (HL)";
opcodes[0x35] = function DEC_AT_HL() 
{
    temp_result = rb((H<<8)+L);
    temp_result--;
	temp_result &= 0xFF;
    wb((H<<8)+L, temp_result);
	clear_flags();
    set_flag_zero(temp_result == 0);
    lastClock = 12;
}

////////////////////////////////////////
//
//		AND / OR / XOR
//
////////////////////////////////////////

instructionNames[0xA7] = "AND A";
opcodes[0xA7] = function AND_A()
{ 
	A &= A; 
	A &= 0xFF;
	F = 0;
	clear_flags();
	set_flag_halfcarry(true);
	set_flag_operation(false);
	set_flag_zero(A == 0); 
	lastClock = 4; 
}
instructionNames[0xA0] = "AND B";
opcodes[0xA0] = function AND_B()
{ 
	A &= B; 
	A &= 0xFF;
	clear_flags();
	set_flag_halfcarry(true);
	set_flag_operation(false);
	set_flag_zero(A == 0); 
	lastClock = 4; 
}
instructionNames[0xA1] = "AND C";
opcodes[0xA1] = function AND_C() 
{ 
	A &= C; 
	A &= 0xFF;
	clear_flags();
	set_flag_halfcarry(true);
	set_flag_operation(false);
	set_flag_zero(A == 0); 
	lastClock = 4; 
}
instructionNames[0xA2] = "AND D";
opcodes[0xA2] = function AND_D()
{ 
	A &= D; 
	A &= 0xFF;
	clear_flags();
	set_flag_halfcarry(true);
	set_flag_operation(false);
	set_flag_zero(A == 0); 
	lastClock = 4; 
}
instructionNames[0xA3] = "AND E";
opcodes[0xA3] = function AND_E() 
{ 
	A &= E; 
	A &= 0xFF;
	clear_flags();
	set_flag_halfcarry(true);
	set_flag_operation(false);
	set_flag_zero(A == 0); 
	lastClock = 4; 
}
instructionNames[0xA4] = "AND H";
opcodes[0xA4] = function AND_H() 
{ 
	A &= H; 
	A &= 0xFF;
	clear_flags();
	set_flag_halfcarry(true);
	set_flag_operation(false);
	set_flag_zero(A == 0); 
	lastClock = 4; 
}
instructionNames[0xA5] = "AND L";
opcodes[0xA5] = function AND_L()
{ 
	A &= L; 
	A &= 0xFF;
	clear_flags();
	set_flag_halfcarry(true);
	set_flag_operation(false);
	set_flag_zero(A == 0); 
	lastClock = 4; 
}
instructionNames[0xA6] = "AND (HL)";
opcodes[0xA6] = function AND_AT_HL() 
{ 
	A &= rb((H<<8)+L); 
	A &= 0xFF;
	clear_flags();
	set_flag_halfcarry(true);
	set_flag_operation(false);
	set_flag_zero(A == 0); 
	lastClock = 8; 
}
instructionNames[0xE6] = "AND n";
opcodes[0xE6] = function AND_n()
{ 
	A &= rb(PC++); 
	A &= 0xFF;
	clear_flags();
	set_flag_halfcarry(true);
	set_flag_operation(false);
	set_flag_zero(A == 0); 
	lastClock = 8; 
}
instructionNames[0xB7] = "OR A";
opcodes[0xB7] = function OR_A()
{ 
	A |= A; 
	A &= 0xFF;
	clear_flags();
	set_flag_zero(A == 0);  
	lastClock = 4; 
}
instructionNames[0xB0] = "OR B";
opcodes[0xB0] = function OR_B() 
{ 
	A |= B; 
	A &= 0xFF;
	clear_flags();
	set_flag_zero(A == 0); 
	lastClock = 4; 
}
instructionNames[0xB1] = "OR C";
opcodes[0xB1] = function OR_C() 
{ 
	A |= C; 
	A &= 0xFF;
	clear_flags();
	set_flag_zero(A == 0); 
	lastClock = 4; 
}
instructionNames[0xB2] = "OR D";
opcodes[0xB2] = function OR_D() 
{ 
	A |= D; 
	A &= 0xFF;
	clear_flags();
	set_flag_zero(A == 0); 
	lastClock = 4; 
}	
instructionNames[0xB3] = "OR E";
opcodes[0xB3] = function OR_E() 
{ 
	A |= E; 
	A &= 0xFF;
	clear_flags();
	set_flag_zero(A == 0); 
	lastClock = 4; 
}
instructionNames[0xB4] = "OR H";
opcodes[0xB4] = function OR_H() 
{ 
	A |= H; 
	A &= 0xFF;
	clear_flags();
	set_flag_zero(A == 0); 
	lastClock = 4; 
}
instructionNames[0xB5] = "OR L";
opcodes[0xB5] = function OR_L() 
{ 
	A |= L; 
	A &= 0xFF;
	clear_flags();
	set_flag_zero(A == 0); 
	lastClock = 4; 
}
instructionNames[0xB6] = "OR (HL)";
opcodes[0xB6] = function OR_AT_HL()
{ 
	A |= rb((H<<8)+L);  
	A &= 0xFF;
	clear_flags();
	set_flag_zero(A == 0); 
	lastClock = 8; 
}
instructionNames[0xF6] = "OR n";
opcodes[0xF6] = function OR_n()
{ 
	A |= rb(PC); 
	PC++; 
	clear_flags();
	set_flag_zero(A == 0); 
	lastClock = 8; 
}
instructionNames[0xAF] = "XOR A";
opcodes[0xAF] = function XOR_A() 
{ 
	A ^= A;  
	A &= 0xFF;
	clear_flags();
	set_flag_zero(A==0); 
	lastClock = 4; 
}
instructionNames[0xA8] = "XOR B";
opcodes[0xA8] = function XOR_B() 
{ 
	A ^= B; 
	A &= 0xFF;
	clear_flags();
	set_flag_zero(A == 0); 
	lastClock = 4; 
}
instructionNames[0xA9] = "XOR C";
opcodes[0xA9] = function XOR_C() 
{ 
	A ^= C; 
	A &= 0xFF;
	clear_flags();
	set_flag_zero(A == 0); 
	lastClock = 4; 
}
instructionNames[0xAA] = "XOR D";	
opcodes[0xAA] = function XOR_D() 
{ 
	A ^= D; 
	A &= 0xFF;
	clear_flags();
	set_flag_zero(A == 0); 
	lastClock = 4; 
}
instructionNames[0xAB] = "XOR E";
opcodes[0xAB] = function XOR_E() 
{ 
	A ^= E; 
	A &= 0xFF;
	clear_flags();
	set_flag_zero(A == 0); 
	lastClock = 4;
}
instructionNames[0xAC] = "XOR H";
opcodes[0xAC] = function XOR_H() 
{ 
	A ^= H; 
	A &= 0xFF;
	clear_flags();
	set_flag_zero(A == 0); 
	lastClock = 4; 
}
instructionNames[0xAD] = "XOR L";
opcodes[0xAD] = function XOR_L() 
{ 
	A ^= L; 
	A &= 0xFF;
	clear_flags();
	set_flag_zero(A == 0); 
	lastClock = 4; 
}
instructionNames[0xAE] = "XOR (HL)";
opcodes[0xAE] = function XOR_AT_HL()
{ 
	A ^= rb((H<<8)+L); 
	A &= 0xFF;
	clear_flags();
	set_flag_zero(A == 0); 
	lastClock = 8; 
}
instructionNames[0xEE] = "XOR n";
opcodes[0xEE] = function XOR_n() 
{ 
	A ^= rb(PC); 
	PC++; 
	A &= 0xFF;
	clear_flags();	
	set_flag_zero(A == 0); 
	lastClock = 8; 
}


////////////////////////////////////////////////////
//
//		JUMP / RETURN
//
////////////////////////////////////////////////////

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
	lastClock = 12; 
	if(!(F & flag_zero))
	{
		PC = rw(PC);
		lastClock += 4;
	}
	else PC+=2;	
}
instructionNames[0xCA] = "JP Z nn";
opcodes[0xCA] = function JP_Z_nn()
{ 	
	lastClock = 12; 
	if(F & flag_zero) 
	{ 
		lastClock += 4; 
		PC = rw(PC); 
	}
	else PC+=2;	
}
instructionNames[0xD2] = "JP NC nn";
opcodes[0xD2] = function JP_NC_nn()
{ 
	lastClock = 12; 
	if(!(F & flag_carry)) 
	{ 
		PC = rw(PC); 
		lastClock += 4;
	} 
	else PC+=2;
}
instructionNames[0xDA] = "JP C nn";
opcodes[0xDA] = function JP_C_nn()
{ 
	lastClock = 12; 
	if((F & flag_carry)) 
	{ 
		PC = rw(PC); 
		lastClock += 4;
	} 
	else PC+=2;
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
	if(temp_result>=0x80) temp_result = -((~temp_result+1)&0xFF);
	PC++;
	PC += temp_result;
	lastClock = 12;
}
//JR cc,n
instructionNames[0x20] = "JR NZ n";
opcodes[0x20] = function JR_NZ_n() 
{
	temp_result = rb(PC);
	if(temp_result>=0x80) temp_result = -((~temp_result+1)&0xFF);
	PC++;
	lastClock = 8;
	if((F & flag_zero) == 0)
	{
		PC += temp_result;
		lastClock = 12;
	}
}
instructionNames[0x28] = "JR Z n";
opcodes[0x28] = function JR_Z_n()
{
	temp_result = rb(PC);
	if(temp_result>=0x80) temp_result = -((~temp_result+1)&0xFF);
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
	if(temp_result>=0x80) temp_result = -((~temp_result+1)&0xFF);
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
	if(temp_result>=0x80) temp_result = -((~temp_result+1)&0xFF);
	PC++;
	lastClock = 8;
	if(F&flag_carry)
	{
		PC += temp_result;
		lastClock = 12;
	}
}
instructionNames[0xCD] = "CALL nn";
function CALL()
{
	SP -= 2; 
	ww(SP, PC+2);
	//debug_out("CALL: PC from " + (PC-1).toString(16) + " to " + rw(PC).toString(16));
	PC = rw(PC);
	lastClock = 20;
}
opcodes[0xCD] = function CALL_nn() 
{
	CALL();
}
instructionNames[0xC4] = "CALL NZ nn";
opcodes[0xC4] = function CALL_NZ_nn() 
{
	lastClock = 12;
	if(!(F & flag_zero))
	{
		CALL();
	}
	else PC += 2;
	
}
instructionNames[0xCC] = "CALL Z nn";
opcodes[0xCC] = function CALL_Z_nn() 
{
	lastClock = 12;
	if((F & flag_zero))
	{
		CALL();
	}
	else PC += 2;
}
instructionNames[0xD4] = "CALL NC nn";
opcodes[0xD4] = function CALL_NC_nn() 
{
	lastClock = 12;
	if(!(F & carry_flag))
	{
		CALL();
	}
	else PC += 2;
}
instructionNames[0xDC] = "CALL C nn";
opcodes[0xDC] = function CALL_C_nn() 
{
	lastClock = 12;
	if((F & carry_flag))
	{
		CALL();
	}
	else PC += 2;
}
//Restarts
instructionNames[0xC7] = "RST 00H";
opcodes[0xC7] = function RST_00H()
{
	SP -= 2; 
	ww(SP, PC); 
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
function RETURN()
{
	PC = rw(SP); 
	SP+=2; 
	lastClock = 12;
}
opcodes[0xC9] = function RET()
{
	RETURN();
}
instructionNames[0xC0] = "RET NZ";
opcodes[0xC0] = function RET_NZ() //Clock might be wrong on these...
{
	lastClock = 4;
	if(!(F & flag_zero)) RETURN(); 
}
instructionNames[0xC8] = "RET Z";
opcodes[0xC8] = function RET_Z() 
{ 
	lastClock = 4;
	if((F & flag_zero)) RETURN(); 
}
instructionNames[0xD0] = "RET NC";
opcodes[0xD0] = function RET_NC() 
{ 
	lastClock = 4;
	if(!(F & flag_carry)) RETURN(); 
}
instructionNames[0xD8] = "RET C";
opcodes[0xD8] = function RET_C() 
{ 
	lastClock = 4;
	if((F & flag_carry)) RETURN(); 
}
instructionNames[0xD9] = "RETI";
opcodes[0xD9] = function RETI()
{ 
	interrupts_enabled = true; 
	RETURN(); 
}
instructionNames[0x2F] = "CPL";
opcodes[0x2F] = function CPL() 
{ 
   A ^= 0xFF; 
   set_flag_zero(A == 0);
   set_flag_halfcarry(false);
   set_flag_operation(false);
   lastClock = 4 
}
instructionNames[0x3F] = "CCF";
opcodes[0x3F] = function CCF() 
{
   set_flag_carry(!(F & flag_carry));
   set_flag_halfcarry(false);
   set_flag_operation(false);
   lastClock = 4;
}
instructionNames[0x37] = "SCF";
opcodes[0x37] = function SCF() 
{ 
	set_flag_halfcarry(false);
	set_flag_operation(false);
   set_flag_carry(true);
   lastClock = 4;
}
instructionNames[0x76] = "HALT";
opcodes[0x76] = function HALT()
{
	halt = true;
	lastClock = 4;
}
instructionNames[0x10] = "STOP";
opcodes[0x10] = function STOP()
{
	lastClock = 4;
	temp_value = rb(PC);
	if(temp_value > 127) temp_value = -((~temp_value+1)&255);
	PC++;
	B--;
	if(B) {
		PC += temp_value;
		lastClock = 8;
	}
	//stop = true; //This isn't really how stop works...
}

instructionNames[0x09] = "ADD16 HL BC";
opcodes[0x09] = function ADD16_HL_BC() /*0x09*/ 
{
   temp_result = ((H<<8)+L)+((B<<8)+C);
   clear_flags();
   set_flag_halfcarry( (((H<<8)+L)&0xFFF)+(((B<<8)+C)&0xFFF) > 0xFFF);
   set_flag_carry(temp_result > 0xFFFF);
   H = ((temp_result>>8)&0xFF);
   L = (temp_result&0xFF);
   lastClock = 12;
}
instructionNames[0x19] = "ADD16 HL DE";
opcodes[0x19] = function ADD16_HL_DE() /*0x19*/ 
{
   temp_result = ((H<<8)+L)+((D<<8)+E);
   clear_flags();
   set_flag_halfcarry( (((H<<8)+L)&0xFFF)+(((D<<8)+E)&0xFFF) > 0xFFF);
   set_flag_carry(temp_result > 0xFFFF);
   H = ((temp_result>>8)&0xFF);
   L = (temp_result&0xFF);
   lastClock = 12;
}
instructionNames[0x29] = "ADD16 HL HL";
opcodes[0x29] = function ADD16_HL_HL() /*0x29*/ 
{
   temp_result = ((H<<8)+L)+((H<<8)+L);
   clear_flags();
   set_flag_carry(temp_result > 0xFFFF);
   set_flag_halfcarry( (((H<<8)+L)&0xFFF)+(((H<<8)+L)&0xFFF) > 0xFFF);
   H = ((temp_result>>8)&0xFF);
   L = (temp_result&0xFF);
   lastClock = 12;
}
instructionNames[0x39] = "ADD16 HL SP";
opcodes[0x39] = function ADD16_HL_SP() /*0x39*/ 
{
   temp_result = ((H<<8)+L)+SP;
   clear_flags();
    set_flag_halfcarry( (((H<<8)+L)&0xFFF)+(SP&0xFFF) > 0xFFF);
   set_flag_carry(temp_result > 0xFFFF);
   H = (temp_result>>8&0xFF);
   L = (temp_result&0xFF);
   lastClock = 12;
}
instructionNames[0xE8] = "ADD16 SP n";
opcodes[0xE8] = function ADD16_SP_n() /*0xE8*/ 
{
	temp_result = rb(PC++);
	if(temp_result > 127) temp_result = -((~temp_result+1)&0xFF);
	SP += temp_result;
	lastClock = 12;
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
   SP &= 0xFFFF;
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
		//RLCr_D
		case 0x02:
			set_flag_carry(D & 0x80);
			D = (D << 1) + (F & flag_carry? 1:0); 
			D &= 0xFF;
			set_flag_zero(D == 0);
			set_flag_operation(false);
			set_flag_halfcarry(false);
			lastClock = 8;
			break;
			
		//RLCr_E
		case 0x03:
			set_flag_carry(E & 0x80);
			E = (E << 1) + (F & flag_carry? 1:0); 
			E &= 0xFF;
			set_flag_zero(E == 0);
			set_flag_operation(false);
			set_flag_halfcarry(false);
			lastClock = 8;
			break;
		//RLCr_A
		case 0x07:
			set_flag_carry(A & 0x80);
			A = (A << 1) + (F & flag_carry? 1:0); 
			A &= 0xFF;
			set_flag_zero(A == 0);
			set_flag_operation(false);
			set_flag_halfcarry(false);
			lastClock = 8;
			break;
		
		//RLr_B
		case 0x10:
			temp_value = (F & flag_carry? 1:0);
			set_flag_carry(B & 0x80);
			B = ((B<<1)&0xFF) + temp_value;
			B &= 0xFF;
			set_flag_operation(false);
			set_flag_halfcarry(false);
			set_flag_zero(B==0);
			lastClock = 8;
		break;
		
		//RLr_C
		case 0x11:
			temp_value = (F & flag_carry? 1:0);
			set_flag_carry(C & 0x80);
			C = ((C<<1)&0xFF) + temp_value;
			C &= 0xFF;
			set_flag_operation(false);
			set_flag_halfcarry(false);
			set_flag_zero(C==0);
			lastClock = 8;
		break;
		
		//RLr_D
		case 0x12:
			temp_value = (F & flag_carry? 1:0);
			set_flag_carry(D & 0x80);
			D = ((D<<1)&0xFF) + temp_value;
			D &= 0xFF;
			set_flag_operation(false);
			set_flag_halfcarry(false);
			set_flag_zero(D==0);
			lastClock = 8;
		break;
		
		//RRr_C
		case 0x19:
			temp_value = (F & flag_carry? 1:0);
			set_flag_carry(C & 0x01);
			C = ((C>>1)&0xFF) + (temp_value<<7);
			C &= 0xFF;
			set_flag_operation(false);
			set_flag_halfcarry(false);
			set_flag_zero(C==0);
			lastClock = 8;
		break;	
		
		//SLA_C
		case 0x21:
			temp_value = (C & 0x80 ? 1:0); 
			C = (C << 1) & 0xFF; 
			set_flag_zero(!C); 
			set_flag_carry(temp_value);
			lastClock = 8;
		break;

		
		//RRr_D    I think this is  right
		case 0x1A:
			temp_value = (F & flag_carry? 1:0)
			set_flag_carry(D & 0x01);
			D = ((D>>1)&0xFF) + (temp_value<<7);
			D &= 0xFF;
			set_flag_operation(false);
			set_flag_halfcarry(false);
			set_flag_zero(D == 0);
			lastClock = 8;
		break;		
		
		//RRr_H
		case 0x1C:
			temp_value = (F & flag_carry? 1:0)
			set_flag_carry(H & 0x01);
			H = ((H>>1)&0xFF) + (temp_value<<7);
			H &= 0xFF;
			set_flag_operation(false);
			set_flag_halfcarry(false);
			set_flag_zero(H == 0);
			lastClock = 8;
		break;		
		
		//RRr_L
		case 0x1D:
			temp_value = (F & flag_carry? 1:0)
			set_flag_carry(L & 0x01);
			L = ((L>>1)&0xFF) + (temp_value<<7);
			L &= 0xFF;
			set_flag_operation(false);
			set_flag_halfcarry(false);
			set_flag_zero(L == 0);
			lastClock = 8;
		break;		
		
		//SLAr_E
		case 0x23:
			set_flag_carry(E & 0x80);
			E = (E<<1)&0xFF;
			set_flag_operation(false);
			set_flag_halfcarry(false);
			set_flag_zero(E == 0);
			lastClock = 8;
		break;

		//SLAr_A
		case 0x27:
			set_flag_carry(A & 0x80);
			A = (A<<1)&0xFF;
			set_flag_operation(false);
			set_flag_halfcarry(false);
			set_flag_zero(A == 0);
			lastClock = 8;
		break;

		//SRLr_B
		case 0x38:
			set_flag_carry(B & 0x01);
			B = B >> 1;
			set_flag_halfcarry(false);
			set_flag_operation(false);
			set_flag_zero(B == 0);
			lastClock = 8;
			break;	
			
		case 0x39:
			temp_value = B & 0x80 ? 1:0; 
			B = (B >> 1) & 0xFF; 
			set_flag_zero(!B); 
			set_flag_carry(temp_value);
			lastClock = 8;
		break;

		//SRLr_H
		case 0x3C:
			set_flag_carry(H & 0x01);
			H = H >> 1;
			set_flag_halfcarry(false);
			set_flag_operation(false);
			set_flag_zero(H == 0);
			lastClock = 8;
			break;	
			
		//SRLr_L
		case 0x3D:
			set_flag_carry(L & 0x01);
			L = L >> 1;
			set_flag_halfcarry(false);
			set_flag_operation(false);
			set_flag_zero(L == 0);
			lastClock = 8;
			break;	
			
		//SRLr_A
		case 0x3F:
			set_flag_carry(A & 0x01);
			A = A >> 1;
			set_flag_halfcarry(false);
			set_flag_operation(false);
			set_flag_zero(A == 0);
			lastClock = 8;
			break;
	
   
      case 0x37:
         lastClock = 8;
         A =  (((A&0x0F)<<4)|((A&0xF0)>>4));
		 clear_flags();
		 set_flag_zero(A == 0);
         break;
      case 0x30:
         lastClock = 8;
         B =  (((B&0x0F)<<4)|((B&0xF0)>>4));
		 clear_flags();
		 set_flag_zero(B == 0);
         break;
      case 0x31:
         lastClock = 8;
         C =  (((C&0x0F)<<4)|((C&0xF0)>>4));
		 clear_flags();
		 set_flag_zero(C == 0);
         break;
      case 0x32:
         lastClock = 8;
         D =  (((D&0x0F)<<4)|((D&0xF0)>>4));
		 clear_flags();
		 set_flag_zero(D == 0);
         break;
      case 0x33:
         lastClock = 8;
         E = (((E&0x0F)<<4)|((E&0xF0)>>4));
		 clear_flags();
		 set_flag_zero(E == 0);
         break;
      case 0x34:
         lastClock = 8;
         H =  (((H&0x0F)<<4)|((H&0xF0)>>4));
		 clear_flags();
		 set_flag_zero(H == 0);
         break;
      case 0x35:
         lastClock = 8;
         L =  (((L&0x0F)<<4)|((L&0xF0)>>4));
		 clear_flags();
		 set_flag_zero(L == 0);
         break;
      case 0x36:
         lastClock = 16;
		 temp_value = rb((H<<8)+L);
         A =  (((temp_value&0x0F)<<4)|((temp_value&0xF0)>>4));
		 clear_flags();
		 set_flag_zero(rb((H<<8)+L) == 0);
		 wb((H<<8)+L, temp_value);
         break;
      case 0x3A:
         lastClock = 8;
         temp_value = (C & 0x80 ? 1 : 0);
         C = (C >> 1) & 0xFF;
         set_flag_zero(!C);
         set_flag_carry(temp_value);
         break;
	
	//TODO: We need bit manipulaton here, the PDF didnt' tell us about it
	
	//More bios hacking!
	//Test bit b of x, where x is a register
	case 0x40: //BIT_0_B
		set_flag_operation(false);
		set_flag_halfcarry(true);
		set_flag_zero(!(B & 0x01));
		lastClock = 8;
		break;
	case 0x41: //BIT_0_C
		set_flag_operation(false);
		set_flag_halfcarry(true);
		set_flag_zero(!(C & 0x01));
		lastClock = 8;
		break;
	case 0x42: //BIT_0_D
		set_flag_operation(false);
		set_flag_halfcarry(true);
		set_flag_zero(!(D & 0x01));
		lastClock = 8;
		break;
	case 0x46: //BIT_0_M
		set_flag_operation(false);
		set_flag_halfcarry(true);
		set_flag_zero(!(rb((H<<8) + L) & 0x01));
		lastClock = 16;
		break;
	case 0x47: //BIT_0_A
		set_flag_operation(false);
		set_flag_halfcarry(true);
		set_flag_zero(!(A & 0x01));
		lastClock = 8;
		break;
	case 0x48: //BIT_1_B
		set_flag_operation(false);
		set_flag_halfcarry(true);
		set_flag_zero(!(B & 0x02));
		lastClock = 8;
		break;
	case 0x49: //BIT_1_C
		set_flag_operation(false);
		set_flag_halfcarry(true);
		set_flag_zero(!(C & 0x02));
		lastClock = 8;
		break;
	case 0x4E: //BIT_1_M
		set_flag_operation(false);
		set_flag_halfcarry(true);
		set_flag_zero(!(rb((H<<8) + L) & 0x02));
		lastClock = 16;
		break;
	case 0x4F: //BIT_1_A
		set_flag_operation(false);
		set_flag_halfcarry(true);
		set_flag_zero(!(A & 0x02));
		lastClock = 8;
		break;
	case 0x50: //BIT_2_B
		set_flag_operation(false);
		set_flag_halfcarry(true);
		set_flag_zero(!(B & 0x04));
		lastClock = 8;
		break;
	case 0x52: //BIT_2_D
		set_flag_operation(false);
		set_flag_halfcarry(true);
		set_flag_zero(!(D & 0x04));
		lastClock = 8;
		break;
	case 0x53: //BIT_2_E
		set_flag_operation(false);
		set_flag_halfcarry(true);
		set_flag_zero(!(E & 0x04));
		lastClock = 8;
		break;
	case 0x56: //BIT_2_M
		set_flag_operation(false);
		set_flag_halfcarry(true);
		set_flag_zero(!(rb((H<<8) + L) & 0x04));
		lastClock = 16;
		break;
	case 0x57: //BIT_2_A
		set_flag_operation(false);
		set_flag_halfcarry(true);
		set_flag_zero(!(A & 0x04));
		lastClock = 8;
		break;
	case 0x58: //BIT_3_B
		set_flag_operation(false);
		set_flag_halfcarry(true);
		set_flag_zero(!(B & 0x08));
		lastClock = 8;
		break;
	case 0x59: //BIT_3_C
		set_flag_operation(false);
		set_flag_halfcarry(true);
		set_flag_zero(!(C & 0x08));
		lastClock = 8;
		break;
	case 0x5E: //BIT_3_M
		set_flag_operation(false);
		set_flag_halfcarry(true);
		set_flag_zero(!(rb((H<<8) + L) & 0x08));
		lastClock = 16;
		break;
	case 0x5F: //BIT_3_A
		set_flag_operation(false);
		set_flag_halfcarry(true);
		set_flag_zero(!(A & 0x08));
		lastClock = 8;
		break;
	case 0x60: //BIT_4_B
		set_flag_operation(false);
		set_flag_halfcarry(true);
		set_flag_zero(!(B & 0x10));
		lastClock = 8;
		break;
	case 0x61: //BIT_4_C
		set_flag_operation(false);
		set_flag_halfcarry(true);
		set_flag_zero(!(C & 0x10));
		lastClock = 8;
		break;
	case 0x67: //BIT_4_A
		set_flag_operation(false);
		set_flag_halfcarry(true);
		set_flag_zero(!(A & 0x10));
		lastClock = 8;
		break;
	case 0x68: //BIT_5_B
		set_flag_operation(false);
		set_flag_halfcarry(true);
		set_flag_zero(!(B & 0x20));
		lastClock = 8;
		break;
	case 0x69: //BIT_5_C
		set_flag_operation(false);
		set_flag_halfcarry(true);
		set_flag_zero(!(C & 0x20));
		lastClock = 8;
		break;
	case 0x6E: //BIT_5_M
		set_flag_operation(false);
		set_flag_halfcarry(true);
		set_flag_zero(!(rb((H<<8)+L) & 0x20));
		lastClock = 16;
		break;
	case 0x6F: //BIT_5_A
		set_flag_operation(false);
		set_flag_halfcarry(true);
		set_flag_zero(!(A & 0x20));
		lastClock = 8;
		break;
	case 0x70: //BIT_6_B
		set_flag_operation(false);
		set_flag_halfcarry(true);
		set_flag_zero(!(B & 0x40));
		lastClock = 8;
		break;
	case 0x71: //BIT_6_C
		set_flag_operation(false);
		set_flag_halfcarry(true);
		set_flag_zero(!(C & 0x40));
		lastClock = 8;
		break;
	case 0x76: //BIT_6_M
		set_flag_operation(false);
		set_flag_halfcarry(true);
		set_flag_zero(!(rb((H<<8)+L) & 0x40));
		lastClock = 16;
		break;
	case 0x77: //BIT_6_A
		set_flag_operation(false);
		set_flag_halfcarry(true);
		set_flag_zero(!(A & 0x40));
		lastClock = 8;
		break;
	case 0x78: //BIT_7_B
		set_flag_operation(false);
		set_flag_halfcarry(true);
		set_flag_zero(!(B & 0x80));
		lastClock = 8;
		break;
	case 0x79: //BIT_7_C
		set_flag_operation(false);
		set_flag_halfcarry(true);
		set_flag_zero(!(C & 0x80));
		lastClock = 8;
		break;
	case 0x7F: //BIT_7_A
		set_flag_operation(false);
		set_flag_halfcarry(true);
		set_flag_zero(!(A & 0x80));
		lastClock = 8;
		break;
	case 0x7C: //BIT_7_H
		set_flag_operation(false);
		set_flag_halfcarry(true);
		set_flag_zero(!(H & 0x80));
		lastClock = 8;
		break;
	
	case 0x7E: //BIT_7_(HL)
		set_flag_operation(false);
		set_flag_halfcarry(true);
		set_flag_zero( ! (rb((H<<8)+L) & 0x80));
		lastClock = 16;
		break;
	
	case 0x86: //RES_0_M
		temp_value = rb((H<<8)+L);
		temp_value &= ~0x01;
		wb((H<<8)+L, temp_value);
		lastClock = 16;
		break;
	
	case 0x87: //RES_0_A
		A &= ~0x01;
		lastClock = 8;
		break;
		
	case 0x8F: //RES_1_A
		A &= ~0x02;
		lastClock = 8;
		break;
	
	case 0x96: //RES_3_C
		C &= ~0x04;
		lastClock = 8;
		break;
	
	case 0x9E: //RES_3_M
		temp_value = rb((H<<8)+L);
		temp_value &= ~0x04;
		wb((H<<8)+L, temp_value);
		lastClock = 16;
		break;
	case 0x9F:
  		A &= 0xF7;
		lastClock = 8;
		break;
	
	case 0xA6: //RES_4_M
		temp_value = rb((H<<8)+L);
		temp_value &= ~0x10;
		wb((H<<8)+L, temp_value);
		lastClock = 16;
		break;	

	case 0xA7: //RES_4_A
		A &= ~0x10;
		lastClock = 8;
		break;
		
	case 0xAE: //RES_5_M
		temp_value = rb((H<<8)+L);
		temp_value &= ~0x20;
		wb((H<<8)+L, temp_value);
		lastClock = 16;
		break;
	
	case 0xAF: //RES_5_A
		A &= ~0x20;
		lastClock = 8;
		break;
	
	case 0xB7: //RES_6_A
		A &= ~0x40;
		lastClock = 8;
		break;
	
	case 0xBE: //RES_7_M
		temp_value = rb((H<<8)+L);
		temp_value &= ~0x80;
		wb((H<<8)+L, temp_value);
		lastClock = 16;
		break;
	
	case 0xBF: //RES_7_A
		A &= ~0x80;
		lastClock = 8;
		break;

   case 0xC0: //SET_0_B
      B |= 0x01;
      lastClock = 8;
      break;
	
	case 0xC6: //SET_0_M
		temp_value = rb((H<<8)+L);
		temp_value |= 0x01;
		wb((H<<8)+L, temp_value);
		lastClock = 16;
		break;
	
	case 0xC7: //SET_0_A
		A |= 0x01;
		lastClock = 8;
		break;
	
	case 0xD6: //SET_2_M
		temp_value = rb((H<<8)+L);
		temp_value |= 0x04;
		wb((H<<8)+L, temp_value);
		lastClock = 16;
		break;

	case 0xDE: //SET_3_M
		temp_value = rb((H<<8)+L);
		temp_value |= 0x08;
		wb((H<<8)+L, temp_value);
		lastClock = 16;
		break;
		
	case 0xE7: //SET_4_A
		A |= 0x10;
		lastClock = 8;
		break;
		
	case 0xEE: //SET_5_M
		temp_value = rb((H<<8)+L);
		temp_value |= 0x20;
		wb((H<<8)+L, temp_value);
		lastClock = 16;
		break;
	case 0xEF:
		A |= 0x20;
		lastClock = 8;
		break;
	
	case 0xF6: //SET_6_M
		temp_value = rb((H<<8)+L);
		temp_value |= 0x40;
		wb((H<<8)+L, temp_value);
		lastClock = 16;
		break;
	
	case 0xF7: //SET_6_A
		A |= 0x40;
		lastClock = 8;
		break;
	
	case 0xFE: //SET_7_M
		temp_value = rb((H<<8)+L);
		temp_value |= 0x80;
		wb((H<<8)+L, temp_value);
		lastClock = 16;
		break;
	
	case 0xFF: //SET_7_A
		A |= 0x80;
		lastClock = 8;
		break;
	
	default:
		debug_out("Missing instruction with opcode CB " + next.toString(16) + " - PC: 0x" + PC.toString(16));
   }
}
instructionNames[0x27] = "DAA";
opcodes[0x27] = function DAA()
{	
	temp_value = A;
	if(F & flag_carry) temp_value |= 0x100;
	if(F & flag_halfcarry) temp_value |= 0x200;
	if(F & flag_operation) temp_value |= 0x400;
	temp_value = daa_table[temp_value];
	A = temp_value >> 8;
	set_flag_zero(temp_value & flag_zero);
	set_flag_operation(temp_value & flag_operation);
	set_flag_halfcarry(temp_value & flag_halfcarry);
	set_flag_carry(temp_value & flag_carry);
	lastClock = 4;
}

//Also hacked in for bios
instructionNames[0x17] = "RLA";
opcodes[0x17] = function RLA() 
{
		temp_value = (F &flag_carry)?1:0;
		set_flag_carry(A & 0x80);
		A = (A<<1)&0xFF + temp_value;
		set_flag_halfcarry(false);
		set_flag_operation(false);
		set_flag_zero(A==0);
		lastClock = 4;
}
instructionNames[0x07] = "RLCA";
opcodes[0x07] = function RLCA() 
{
		set_flag_carry(A & 0x80);
		A = (A<<1)&0xFF + (F & flag_carry?1:0);
		set_flag_halfcarry(false);
		set_flag_operation(false);
		set_flag_zero(A==0);
		lastClock = 8;
}
instructionNames[0x0F] = "RRCA";
opcodes[0x0F] = function RRCA()
{
		set_flag_carry(A & 0x01);
		A = (A>>1)&0xFF + (F & flag_carry?0x80:0);
		set_flag_halfcarry(false);
		set_flag_operation(false);
		set_flag_zero(A==0);
		lastClock = 8;
}
instructionNames[0x1F] = "RRA";
opcodes[0x1F] = function RRA()
{
		temp_value = (F & flag_carry)?0x80:0;
		set_flag_carry(A & 0x1);
		A = (A>>1)&0xFF + temp_value;
		set_flag_halfcarry(false);
		set_flag_operation(false);
		set_flag_zero(A==0);
		lastClock = 4;
}

instructionNames[0xF3] = "DI";
opcodes[0xF3] = function DI()
{
	interrupts_enabled = false	;
	lastClock = 4;
}
instructionNames[0xFB] = "EI";
opcodes[0xFB] = function EI()
{
	interrupts_enabled = true;
	lastClock = 4;
}

instructionNames[0x00] = "NOP";
opcodes[0x00] = function NOP() { lastClock = 0; }     

//This table is how visualboyadvance calculates DAA. No need to type this up again
var daa_table = [
  0x0080,0x0100,0x0200,0x0300,0x0400,0x0500,0x0600,0x0700,
  0x0800,0x0900,0x1020,0x1120,0x1220,0x1320,0x1420,0x1520,
  0x1000,0x1100,0x1200,0x1300,0x1400,0x1500,0x1600,0x1700,
  0x1800,0x1900,0x2020,0x2120,0x2220,0x2320,0x2420,0x2520,
  0x2000,0x2100,0x2200,0x2300,0x2400,0x2500,0x2600,0x2700,
  0x2800,0x2900,0x3020,0x3120,0x3220,0x3320,0x3420,0x3520,
  0x3000,0x3100,0x3200,0x3300,0x3400,0x3500,0x3600,0x3700,
  0x3800,0x3900,0x4020,0x4120,0x4220,0x4320,0x4420,0x4520,
  0x4000,0x4100,0x4200,0x4300,0x4400,0x4500,0x4600,0x4700,
  0x4800,0x4900,0x5020,0x5120,0x5220,0x5320,0x5420,0x5520,
  0x5000,0x5100,0x5200,0x5300,0x5400,0x5500,0x5600,0x5700,
  0x5800,0x5900,0x6020,0x6120,0x6220,0x6320,0x6420,0x6520,
  0x6000,0x6100,0x6200,0x6300,0x6400,0x6500,0x6600,0x6700,
  0x6800,0x6900,0x7020,0x7120,0x7220,0x7320,0x7420,0x7520,
  0x7000,0x7100,0x7200,0x7300,0x7400,0x7500,0x7600,0x7700,
  0x7800,0x7900,0x8020,0x8120,0x8220,0x8320,0x8420,0x8520,
  0x8000,0x8100,0x8200,0x8300,0x8400,0x8500,0x8600,0x8700,
  0x8800,0x8900,0x9020,0x9120,0x9220,0x9320,0x9420,0x9520,
  0x9000,0x9100,0x9200,0x9300,0x9400,0x9500,0x9600,0x9700,
  0x9800,0x9900,0x00B0,0x0130,0x0230,0x0330,0x0430,0x0530,
  0x0090,0x0110,0x0210,0x0310,0x0410,0x0510,0x0610,0x0710,
  0x0810,0x0910,0x1030,0x1130,0x1230,0x1330,0x1430,0x1530,
  0x1010,0x1110,0x1210,0x1310,0x1410,0x1510,0x1610,0x1710,
  0x1810,0x1910,0x2030,0x2130,0x2230,0x2330,0x2430,0x2530,
  0x2010,0x2110,0x2210,0x2310,0x2410,0x2510,0x2610,0x2710,
  0x2810,0x2910,0x3030,0x3130,0x3230,0x3330,0x3430,0x3530,
  0x3010,0x3110,0x3210,0x3310,0x3410,0x3510,0x3610,0x3710,
  0x3810,0x3910,0x4030,0x4130,0x4230,0x4330,0x4430,0x4530,
  0x4010,0x4110,0x4210,0x4310,0x4410,0x4510,0x4610,0x4710,
  0x4810,0x4910,0x5030,0x5130,0x5230,0x5330,0x5430,0x5530,
  0x5010,0x5110,0x5210,0x5310,0x5410,0x5510,0x5610,0x5710,
  0x5810,0x5910,0x6030,0x6130,0x6230,0x6330,0x6430,0x6530,
  0x6010,0x6110,0x6210,0x6310,0x6410,0x6510,0x6610,0x6710,
  0x6810,0x6910,0x7030,0x7130,0x7230,0x7330,0x7430,0x7530,
  0x7010,0x7110,0x7210,0x7310,0x7410,0x7510,0x7610,0x7710,
  0x7810,0x7910,0x8030,0x8130,0x8230,0x8330,0x8430,0x8530,
  0x8010,0x8110,0x8210,0x8310,0x8410,0x8510,0x8610,0x8710,
  0x8810,0x8910,0x9030,0x9130,0x9230,0x9330,0x9430,0x9530,
  0x9010,0x9110,0x9210,0x9310,0x9410,0x9510,0x9610,0x9710,
  0x9810,0x9910,0xA030,0xA130,0xA230,0xA330,0xA430,0xA530,
  0xA010,0xA110,0xA210,0xA310,0xA410,0xA510,0xA610,0xA710,
  0xA810,0xA910,0xB030,0xB130,0xB230,0xB330,0xB430,0xB530,
  0xB010,0xB110,0xB210,0xB310,0xB410,0xB510,0xB610,0xB710,
  0xB810,0xB910,0xC030,0xC130,0xC230,0xC330,0xC430,0xC530,
  0xC010,0xC110,0xC210,0xC310,0xC410,0xC510,0xC610,0xC710,
  0xC810,0xC910,0xD030,0xD130,0xD230,0xD330,0xD430,0xD530,
  0xD010,0xD110,0xD210,0xD310,0xD410,0xD510,0xD610,0xD710,
  0xD810,0xD910,0xE030,0xE130,0xE230,0xE330,0xE430,0xE530,
  0xE010,0xE110,0xE210,0xE310,0xE410,0xE510,0xE610,0xE710,
  0xE810,0xE910,0xF030,0xF130,0xF230,0xF330,0xF430,0xF530,
  0xF010,0xF110,0xF210,0xF310,0xF410,0xF510,0xF610,0xF710,
  0xF810,0xF910,0x00B0,0x0130,0x0230,0x0330,0x0430,0x0530,
  0x0090,0x0110,0x0210,0x0310,0x0410,0x0510,0x0610,0x0710,
  0x0810,0x0910,0x1030,0x1130,0x1230,0x1330,0x1430,0x1530,
  0x1010,0x1110,0x1210,0x1310,0x1410,0x1510,0x1610,0x1710,
  0x1810,0x1910,0x2030,0x2130,0x2230,0x2330,0x2430,0x2530,
  0x2010,0x2110,0x2210,0x2310,0x2410,0x2510,0x2610,0x2710,
  0x2810,0x2910,0x3030,0x3130,0x3230,0x3330,0x3430,0x3530,
  0x3010,0x3110,0x3210,0x3310,0x3410,0x3510,0x3610,0x3710,
  0x3810,0x3910,0x4030,0x4130,0x4230,0x4330,0x4430,0x4530,
  0x4010,0x4110,0x4210,0x4310,0x4410,0x4510,0x4610,0x4710,
  0x4810,0x4910,0x5030,0x5130,0x5230,0x5330,0x5430,0x5530,
  0x5010,0x5110,0x5210,0x5310,0x5410,0x5510,0x5610,0x5710,
  0x5810,0x5910,0x6030,0x6130,0x6230,0x6330,0x6430,0x6530,
  0x0600,0x0700,0x0800,0x0900,0x0A00,0x0B00,0x0C00,0x0D00,
  0x0E00,0x0F00,0x1020,0x1120,0x1220,0x1320,0x1420,0x1520,
  0x1600,0x1700,0x1800,0x1900,0x1A00,0x1B00,0x1C00,0x1D00,
  0x1E00,0x1F00,0x2020,0x2120,0x2220,0x2320,0x2420,0x2520,
  0x2600,0x2700,0x2800,0x2900,0x2A00,0x2B00,0x2C00,0x2D00,
  0x2E00,0x2F00,0x3020,0x3120,0x3220,0x3320,0x3420,0x3520,
  0x3600,0x3700,0x3800,0x3900,0x3A00,0x3B00,0x3C00,0x3D00,
  0x3E00,0x3F00,0x4020,0x4120,0x4220,0x4320,0x4420,0x4520,
  0x4600,0x4700,0x4800,0x4900,0x4A00,0x4B00,0x4C00,0x4D00,
  0x4E00,0x4F00,0x5020,0x5120,0x5220,0x5320,0x5420,0x5520,
  0x5600,0x5700,0x5800,0x5900,0x5A00,0x5B00,0x5C00,0x5D00,
  0x5E00,0x5F00,0x6020,0x6120,0x6220,0x6320,0x6420,0x6520,
  0x6600,0x6700,0x6800,0x6900,0x6A00,0x6B00,0x6C00,0x6D00,
  0x6E00,0x6F00,0x7020,0x7120,0x7220,0x7320,0x7420,0x7520,
  0x7600,0x7700,0x7800,0x7900,0x7A00,0x7B00,0x7C00,0x7D00,
  0x7E00,0x7F00,0x8020,0x8120,0x8220,0x8320,0x8420,0x8520,
  0x8600,0x8700,0x8800,0x8900,0x8A00,0x8B00,0x8C00,0x8D00,
  0x8E00,0x8F00,0x9020,0x9120,0x9220,0x9320,0x9420,0x9520,
  0x9600,0x9700,0x9800,0x9900,0x9A00,0x9B00,0x9C00,0x9D00,
  0x9E00,0x9F00,0x00B0,0x0130,0x0230,0x0330,0x0430,0x0530,
  0x0610,0x0710,0x0810,0x0910,0x0A10,0x0B10,0x0C10,0x0D10,
  0x0E10,0x0F10,0x1030,0x1130,0x1230,0x1330,0x1430,0x1530,
  0x1610,0x1710,0x1810,0x1910,0x1A10,0x1B10,0x1C10,0x1D10,
  0x1E10,0x1F10,0x2030,0x2130,0x2230,0x2330,0x2430,0x2530,
  0x2610,0x2710,0x2810,0x2910,0x2A10,0x2B10,0x2C10,0x2D10,
  0x2E10,0x2F10,0x3030,0x3130,0x3230,0x3330,0x3430,0x3530,
  0x3610,0x3710,0x3810,0x3910,0x3A10,0x3B10,0x3C10,0x3D10,
  0x3E10,0x3F10,0x4030,0x4130,0x4230,0x4330,0x4430,0x4530,
  0x4610,0x4710,0x4810,0x4910,0x4A10,0x4B10,0x4C10,0x4D10,
  0x4E10,0x4F10,0x5030,0x5130,0x5230,0x5330,0x5430,0x5530,
  0x5610,0x5710,0x5810,0x5910,0x5A10,0x5B10,0x5C10,0x5D10,
  0x5E10,0x5F10,0x6030,0x6130,0x6230,0x6330,0x6430,0x6530,
  0x6610,0x6710,0x6810,0x6910,0x6A10,0x6B10,0x6C10,0x6D10,
  0x6E10,0x6F10,0x7030,0x7130,0x7230,0x7330,0x7430,0x7530,
  0x7610,0x7710,0x7810,0x7910,0x7A10,0x7B10,0x7C10,0x7D10,
  0x7E10,0x7F10,0x8030,0x8130,0x8230,0x8330,0x8430,0x8530,
  0x8610,0x8710,0x8810,0x8910,0x8A10,0x8B10,0x8C10,0x8D10,
  0x8E10,0x8F10,0x9030,0x9130,0x9230,0x9330,0x9430,0x9530,
  0x9610,0x9710,0x9810,0x9910,0x9A10,0x9B10,0x9C10,0x9D10,
  0x9E10,0x9F10,0xA030,0xA130,0xA230,0xA330,0xA430,0xA530,
  0xA610,0xA710,0xA810,0xA910,0xAA10,0xAB10,0xAC10,0xAD10,
  0xAE10,0xAF10,0xB030,0xB130,0xB230,0xB330,0xB430,0xB530,
  0xB610,0xB710,0xB810,0xB910,0xBA10,0xBB10,0xBC10,0xBD10,
  0xBE10,0xBF10,0xC030,0xC130,0xC230,0xC330,0xC430,0xC530,
  0xC610,0xC710,0xC810,0xC910,0xCA10,0xCB10,0xCC10,0xCD10,
  0xCE10,0xCF10,0xD030,0xD130,0xD230,0xD330,0xD430,0xD530,
  0xD610,0xD710,0xD810,0xD910,0xDA10,0xDB10,0xDC10,0xDD10,
  0xDE10,0xDF10,0xE030,0xE130,0xE230,0xE330,0xE430,0xE530,
  0xE610,0xE710,0xE810,0xE910,0xEA10,0xEB10,0xEC10,0xED10,
  0xEE10,0xEF10,0xF030,0xF130,0xF230,0xF330,0xF430,0xF530,
  0xF610,0xF710,0xF810,0xF910,0xFA10,0xFB10,0xFC10,0xFD10,
  0xFE10,0xFF10,0x00B0,0x0130,0x0230,0x0330,0x0430,0x0530,
  0x0610,0x0710,0x0810,0x0910,0x0A10,0x0B10,0x0C10,0x0D10,
  0x0E10,0x0F10,0x1030,0x1130,0x1230,0x1330,0x1430,0x1530,
  0x1610,0x1710,0x1810,0x1910,0x1A10,0x1B10,0x1C10,0x1D10,
  0x1E10,0x1F10,0x2030,0x2130,0x2230,0x2330,0x2430,0x2530,
  0x2610,0x2710,0x2810,0x2910,0x2A10,0x2B10,0x2C10,0x2D10,
  0x2E10,0x2F10,0x3030,0x3130,0x3230,0x3330,0x3430,0x3530,
  0x3610,0x3710,0x3810,0x3910,0x3A10,0x3B10,0x3C10,0x3D10,
  0x3E10,0x3F10,0x4030,0x4130,0x4230,0x4330,0x4430,0x4530,
  0x4610,0x4710,0x4810,0x4910,0x4A10,0x4B10,0x4C10,0x4D10,
  0x4E10,0x4F10,0x5030,0x5130,0x5230,0x5330,0x5430,0x5530,
  0x5610,0x5710,0x5810,0x5910,0x5A10,0x5B10,0x5C10,0x5D10,
  0x5E10,0x5F10,0x6030,0x6130,0x6230,0x6330,0x6430,0x6530,
  0x00C0,0x0140,0x0240,0x0340,0x0440,0x0540,0x0640,0x0740,
  0x0840,0x0940,0x0440,0x0540,0x0640,0x0740,0x0840,0x0940,
  0x1040,0x1140,0x1240,0x1340,0x1440,0x1540,0x1640,0x1740,
  0x1840,0x1940,0x1440,0x1540,0x1640,0x1740,0x1840,0x1940,
  0x2040,0x2140,0x2240,0x2340,0x2440,0x2540,0x2640,0x2740,
  0x2840,0x2940,0x2440,0x2540,0x2640,0x2740,0x2840,0x2940,
  0x3040,0x3140,0x3240,0x3340,0x3440,0x3540,0x3640,0x3740,
  0x3840,0x3940,0x3440,0x3540,0x3640,0x3740,0x3840,0x3940,
  0x4040,0x4140,0x4240,0x4340,0x4440,0x4540,0x4640,0x4740,
  0x4840,0x4940,0x4440,0x4540,0x4640,0x4740,0x4840,0x4940,
  0x5040,0x5140,0x5240,0x5340,0x5440,0x5540,0x5640,0x5740,
  0x5840,0x5940,0x5440,0x5540,0x5640,0x5740,0x5840,0x5940,
  0x6040,0x6140,0x6240,0x6340,0x6440,0x6540,0x6640,0x6740,
  0x6840,0x6940,0x6440,0x6540,0x6640,0x6740,0x6840,0x6940,
  0x7040,0x7140,0x7240,0x7340,0x7440,0x7540,0x7640,0x7740,
  0x7840,0x7940,0x7440,0x7540,0x7640,0x7740,0x7840,0x7940,
  0x8040,0x8140,0x8240,0x8340,0x8440,0x8540,0x8640,0x8740,
  0x8840,0x8940,0x8440,0x8540,0x8640,0x8740,0x8840,0x8940,
  0x9040,0x9140,0x9240,0x9340,0x9440,0x9540,0x9640,0x9740,
  0x9840,0x9940,0x3450,0x3550,0x3650,0x3750,0x3850,0x3950,
  0x4050,0x4150,0x4250,0x4350,0x4450,0x4550,0x4650,0x4750,
  0x4850,0x4950,0x4450,0x4550,0x4650,0x4750,0x4850,0x4950,
  0x5050,0x5150,0x5250,0x5350,0x5450,0x5550,0x5650,0x5750,
  0x5850,0x5950,0x5450,0x5550,0x5650,0x5750,0x5850,0x5950,
  0x6050,0x6150,0x6250,0x6350,0x6450,0x6550,0x6650,0x6750,
  0x6850,0x6950,0x6450,0x6550,0x6650,0x6750,0x6850,0x6950,
  0x7050,0x7150,0x7250,0x7350,0x7450,0x7550,0x7650,0x7750,
  0x7850,0x7950,0x7450,0x7550,0x7650,0x7750,0x7850,0x7950,
  0x8050,0x8150,0x8250,0x8350,0x8450,0x8550,0x8650,0x8750,
  0x8850,0x8950,0x8450,0x8550,0x8650,0x8750,0x8850,0x8950,
  0x9050,0x9150,0x9250,0x9350,0x9450,0x9550,0x9650,0x9750,
  0x9850,0x9950,0x9450,0x9550,0x9650,0x9750,0x9850,0x9950,
  0xA050,0xA150,0xA250,0xA350,0xA450,0xA550,0xA650,0xA750,
  0xA850,0xA950,0xA450,0xA550,0xA650,0xA750,0xA850,0xA950,
  0xB050,0xB150,0xB250,0xB350,0xB450,0xB550,0xB650,0xB750,
  0xB850,0xB950,0xB450,0xB550,0xB650,0xB750,0xB850,0xB950,
  0xC050,0xC150,0xC250,0xC350,0xC450,0xC550,0xC650,0xC750,
  0xC850,0xC950,0xC450,0xC550,0xC650,0xC750,0xC850,0xC950,
  0xD050,0xD150,0xD250,0xD350,0xD450,0xD550,0xD650,0xD750,
  0xD850,0xD950,0xD450,0xD550,0xD650,0xD750,0xD850,0xD950,
  0xE050,0xE150,0xE250,0xE350,0xE450,0xE550,0xE650,0xE750,
  0xE850,0xE950,0xE450,0xE550,0xE650,0xE750,0xE850,0xE950,
  0xF050,0xF150,0xF250,0xF350,0xF450,0xF550,0xF650,0xF750,
  0xF850,0xF950,0xF450,0xF550,0xF650,0xF750,0xF850,0xF950,
  0x00D0,0x0150,0x0250,0x0350,0x0450,0x0550,0x0650,0x0750,
  0x0850,0x0950,0x0450,0x0550,0x0650,0x0750,0x0850,0x0950,
  0x1050,0x1150,0x1250,0x1350,0x1450,0x1550,0x1650,0x1750,
  0x1850,0x1950,0x1450,0x1550,0x1650,0x1750,0x1850,0x1950,
  0x2050,0x2150,0x2250,0x2350,0x2450,0x2550,0x2650,0x2750,
  0x2850,0x2950,0x2450,0x2550,0x2650,0x2750,0x2850,0x2950,
  0x3050,0x3150,0x3250,0x3350,0x3450,0x3550,0x3650,0x3750,
  0x3850,0x3950,0x3450,0x3550,0x3650,0x3750,0x3850,0x3950,
  0x4050,0x4150,0x4250,0x4350,0x4450,0x4550,0x4650,0x4750,
  0x4850,0x4950,0x4450,0x4550,0x4650,0x4750,0x4850,0x4950,
  0x5050,0x5150,0x5250,0x5350,0x5450,0x5550,0x5650,0x5750,
  0x5850,0x5950,0x5450,0x5550,0x5650,0x5750,0x5850,0x5950,
  0x6050,0x6150,0x6250,0x6350,0x6450,0x6550,0x6650,0x6750,
  0x6850,0x6950,0x6450,0x6550,0x6650,0x6750,0x6850,0x6950,
  0x7050,0x7150,0x7250,0x7350,0x7450,0x7550,0x7650,0x7750,
  0x7850,0x7950,0x7450,0x7550,0x7650,0x7750,0x7850,0x7950,
  0x8050,0x8150,0x8250,0x8350,0x8450,0x8550,0x8650,0x8750,
  0x8850,0x8950,0x8450,0x8550,0x8650,0x8750,0x8850,0x8950,
  0x9050,0x9150,0x9250,0x9350,0x9450,0x9550,0x9650,0x9750,
  0x9850,0x9950,0x9450,0x9550,0x9650,0x9750,0x9850,0x9950,
  0xFA60,0xFB60,0xFC60,0xFD60,0xFE60,0xFF60,0x00C0,0x0140,
  0x0240,0x0340,0x0440,0x0540,0x0640,0x0740,0x0840,0x0940,
  0x0A60,0x0B60,0x0C60,0x0D60,0x0E60,0x0F60,0x1040,0x1140,
  0x1240,0x1340,0x1440,0x1540,0x1640,0x1740,0x1840,0x1940,
  0x1A60,0x1B60,0x1C60,0x1D60,0x1E60,0x1F60,0x2040,0x2140,
  0x2240,0x2340,0x2440,0x2540,0x2640,0x2740,0x2840,0x2940,
  0x2A60,0x2B60,0x2C60,0x2D60,0x2E60,0x2F60,0x3040,0x3140,
  0x3240,0x3340,0x3440,0x3540,0x3640,0x3740,0x3840,0x3940,
  0x3A60,0x3B60,0x3C60,0x3D60,0x3E60,0x3F60,0x4040,0x4140,
  0x4240,0x4340,0x4440,0x4540,0x4640,0x4740,0x4840,0x4940,
  0x4A60,0x4B60,0x4C60,0x4D60,0x4E60,0x4F60,0x5040,0x5140,
  0x5240,0x5340,0x5440,0x5540,0x5640,0x5740,0x5840,0x5940,
  0x5A60,0x5B60,0x5C60,0x5D60,0x5E60,0x5F60,0x6040,0x6140,
  0x6240,0x6340,0x6440,0x6540,0x6640,0x6740,0x6840,0x6940,
  0x6A60,0x6B60,0x6C60,0x6D60,0x6E60,0x6F60,0x7040,0x7140,
  0x7240,0x7340,0x7440,0x7540,0x7640,0x7740,0x7840,0x7940,
  0x7A60,0x7B60,0x7C60,0x7D60,0x7E60,0x7F60,0x8040,0x8140,
  0x8240,0x8340,0x8440,0x8540,0x8640,0x8740,0x8840,0x8940,
  0x8A60,0x8B60,0x8C60,0x8D60,0x8E60,0x8F60,0x9040,0x9140,
  0x9240,0x9340,0x3450,0x3550,0x3650,0x3750,0x3850,0x3950,
  0x3A70,0x3B70,0x3C70,0x3D70,0x3E70,0x3F70,0x4050,0x4150,
  0x4250,0x4350,0x4450,0x4550,0x4650,0x4750,0x4850,0x4950,
  0x4A70,0x4B70,0x4C70,0x4D70,0x4E70,0x4F70,0x5050,0x5150,
  0x5250,0x5350,0x5450,0x5550,0x5650,0x5750,0x5850,0x5950,
  0x5A70,0x5B70,0x5C70,0x5D70,0x5E70,0x5F70,0x6050,0x6150,
  0x6250,0x6350,0x6450,0x6550,0x6650,0x6750,0x6850,0x6950,
  0x6A70,0x6B70,0x6C70,0x6D70,0x6E70,0x6F70,0x7050,0x7150,
  0x7250,0x7350,0x7450,0x7550,0x7650,0x7750,0x7850,0x7950,
  0x7A70,0x7B70,0x7C70,0x7D70,0x7E70,0x7F70,0x8050,0x8150,
  0x8250,0x8350,0x8450,0x8550,0x8650,0x8750,0x8850,0x8950,
  0x8A70,0x8B70,0x8C70,0x8D70,0x8E70,0x8F70,0x9050,0x9150,
  0x9250,0x9350,0x9450,0x9550,0x9650,0x9750,0x9850,0x9950,
  0x9A70,0x9B70,0x9C70,0x9D70,0x9E70,0x9F70,0xA050,0xA150,
  0xA250,0xA350,0xA450,0xA550,0xA650,0xA750,0xA850,0xA950,
  0xAA70,0xAB70,0xAC70,0xAD70,0xAE70,0xAF70,0xB050,0xB150,
  0xB250,0xB350,0xB450,0xB550,0xB650,0xB750,0xB850,0xB950,
  0xBA70,0xBB70,0xBC70,0xBD70,0xBE70,0xBF70,0xC050,0xC150,
  0xC250,0xC350,0xC450,0xC550,0xC650,0xC750,0xC850,0xC950,
  0xCA70,0xCB70,0xCC70,0xCD70,0xCE70,0xCF70,0xD050,0xD150,
  0xD250,0xD350,0xD450,0xD550,0xD650,0xD750,0xD850,0xD950,
  0xDA70,0xDB70,0xDC70,0xDD70,0xDE70,0xDF70,0xE050,0xE150,
  0xE250,0xE350,0xE450,0xE550,0xE650,0xE750,0xE850,0xE950,
  0xEA70,0xEB70,0xEC70,0xED70,0xEE70,0xEF70,0xF050,0xF150,
  0xF250,0xF350,0xF450,0xF550,0xF650,0xF750,0xF850,0xF950,
  0xFA70,0xFB70,0xFC70,0xFD70,0xFE70,0xFF70,0x00D0,0x0150,
  0x0250,0x0350,0x0450,0x0550,0x0650,0x0750,0x0850,0x0950,
  0x0A70,0x0B70,0x0C70,0x0D70,0x0E70,0x0F70,0x1050,0x1150,
  0x1250,0x1350,0x1450,0x1550,0x1650,0x1750,0x1850,0x1950,
  0x1A70,0x1B70,0x1C70,0x1D70,0x1E70,0x1F70,0x2050,0x2150,
  0x2250,0x2350,0x2450,0x2550,0x2650,0x2750,0x2850,0x2950,
  0x2A70,0x2B70,0x2C70,0x2D70,0x2E70,0x2F70,0x3050,0x3150,
  0x3250,0x3350,0x3450,0x3550,0x3650,0x3750,0x3850,0x3950,
  0x3A70,0x3B70,0x3C70,0x3D70,0x3E70,0x3F70,0x4050,0x4150,
  0x4250,0x4350,0x4450,0x4550,0x4650,0x4750,0x4850,0x4950,
  0x4A70,0x4B70,0x4C70,0x4D70,0x4E70,0x4F70,0x5050,0x5150,
  0x5250,0x5350,0x5450,0x5550,0x5650,0x5750,0x5850,0x5950,
  0x5A70,0x5B70,0x5C70,0x5D70,0x5E70,0x5F70,0x6050,0x6150,
  0x6250,0x6350,0x6450,0x6550,0x6650,0x6750,0x6850,0x6950,
  0x6A70,0x6B70,0x6C70,0x6D70,0x6E70,0x6F70,0x7050,0x7150,
  0x7250,0x7350,0x7450,0x7550,0x7650,0x7750,0x7850,0x7950,
  0x7A70,0x7B70,0x7C70,0x7D70,0x7E70,0x7F70,0x8050,0x8150,
  0x8250,0x8350,0x8450,0x8550,0x8650,0x8750,0x8850,0x8950,
  0x8A70,0x8B70,0x8C70,0x8D70,0x8E70,0x8F70,0x9050,0x9150,
  0x9250,0x9350,0x9450,0x9550,0x9650,0x9750,0x9850,0x9950];
