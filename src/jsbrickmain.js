var execs = 0;
var repeat;
var running = false;
var just_drawn = false;

function step_cpu()
{
	just_drawn = false;
	execute_gpu_step(execute_step());
	if(gpu_ready_to_draw)
	{		
		paint();
		gpu_ready_to_draw = false;
		just_drawn = true;
	}
	execs += 1;
}

function run_frame(update)
{
	do
	{
		step_cpu();
	}while(!just_drawn && !proc_break);
	just_drawn = false;
	if(proc_break) debug_out("break;");
	if(update == 1) update_tables();
	
	proc_break = false;
}
function run_for()
{
	var num = parseInt(prompt("Run how many instructions?", "1"));
	for(var i = 0; i < num-1; i += 1)
	{
		step_cpu();
	}
	update_tables();
}
function run_to()
{
	var num = parseInt(prompt("Run until PC equals (Enter in base 10)?", "256"));
	while(PC != num & 0xFFFF && !proc_break)
	{
		step_cpu();
	}
	if(proc_break) debug_out("break: " + PC.toString(16));
	proc_break = false;
	update_tables();
}

function run_go()
{
	if(running)
	{
		//step_frame();
		run_frame(0);
	}
	repeat = setInterval(run_go, 16);
}
function run_stop()
{
	clearInterval(repeat);
	update_tables();
	running = false;
}

function single_step()
{
	step_cpu();
	update_tables();
}

function update_tables()
{
    // Update table
    var rows = document.getElementById("regTable").rows;
    rows[1].cells[1].innerHTML = "0x" + A.toString(16);
    rows[2].cells[1].innerHTML = "0x" + B.toString(16);
    rows[3].cells[1].innerHTML = "0x" + C.toString(16);
    rows[4].cells[1].innerHTML = "0x" + D.toString(16);
    rows[5].cells[1].innerHTML = "0x" + E.toString(16);
    rows[6].cells[1].innerHTML = "0x" + H.toString(16);
    rows[7].cells[1].innerHTML = "0x" + L.toString(16);
    rows[8].cells[1].innerHTML = "0x" + F.toString(16);
    rows[9].cells[1].innerHTML = "0x" + SP.toString(16);
	rows[10].cells[1].innerHTML = "0x" + PC.toString(16);
	rows[11].cells[1].innerHTML = "0x" + op.toString(16);
	rows[12].cells[1].innerHTML = execs;
	rows[13].cells[1].innerHTML = lastClock;
	rows[14].cells[1].innerHTML = gpu_mode;
	rows[15].cells[1].innerHTML = gpu_timer;
	rows[16].cells[1].innerHTML = gpu_scanline;
	rows[17].cells[1].innerHTML = interrupts_enabled;
    
	
	rows = document.getElementById("debugOut").rows;
	rows[1].cells[0].innerHTML = "";
	if(debug_output.length < 50)
	{
		for(i = debug_output.length-1; i >= 0; i--)
		{
			rows[1].cells[0].innerHTML += debug_output[i] + "<br>";
		}
	}
	else
	{
		for(i = debug_output.length-1; i >= debug_output.length-50; i--)
		{
			rows[1].cells[0].innerHTML += debug_output[i] + "<br>";
		}
	}
	rows[1].cells[1].innerHTML = "";
	rows[1].cells[2].innerHTML = "";
	if(call_trace.length < 50)
	{
		for(i = call_trace.length-1; i >= 0; i--)
		{
			rows[1].cells[1].innerHTML += call_trace[i] + "<br>";
			rows[1].cells[2].innerHTML += "0x" + pc_trace[i] + "<br>";
		}
	}
	else
	{
		for(i = call_trace.length-1; i >= call_trace.length-50; i--)
		{
			rows[1].cells[1].innerHTML += call_trace[i] + "<br>";
			rows[1].cells[2].innerHTML += "0x" + pc_trace[i] + "<br>";
		}
	}
}

function dump_ram()
{
	var w = window.open("about:blank","mywindow","status=1"); 
	w.document.write("<font size=\"2\" face=\"Courier New\">");
	for(var i = 0; i <= 0x10000; i++)
	{
		if(i%16 == 0)
		{
			w.document.write("[0x");
			if(i <= 0x000F) w.document.write("0");
			if(i <= 0x00FF) w.document.write("0");
			if(i <= 0x0FFF) w.document.write("0");
			w.document.write(i.toString(16) + "] ");
		}
		if(rb(i) <= 0xF) w.document.write("0");
		w.document.write(rb(i).toString(16) + " ");
		if((i+1)%16 == 0) w.document.write("<br>");
	}
	w.document.write("</font>");
}

function dump_debug()
{
	var w3 = window.open("about:blank","mywindow1","status=1"); 
	w3.document.write("<font size=\"2\" face=\"Courier New\">");
	for(i = debug_output.length-1; i >= 0; i--)
	{
			w3.document.write(debug_output[i] + "<br>");
	}
	w3.document.write("</font>");
}

function dump_calls()
{
	var w2 = window.open("about:blank","mywindow1","status=1"); 
	w2.document.write("<font size=\"2\" face=\"Courier New\">");
	for(i = call_trace.length-1; i >= 0; i--)
	{
		w2.document.write(call_trace[i] + " --- " + "0x" + pc_trace[i] + "<br>");
	}
	w2.document.write("</font>");
}

function init()
{	
	document.onkeydown = KeyDown;
	document.onkeyup = KeyUp;
	reset(); //Reset our CPU, load our memory map, and go!
	var temp = document.getElementById("canvas")
	canvas = temp.getContext("2d");	
	init_gpu();
	load_image("tetris.gb");
	//This overwrites the first 255 bytes of the previosly loaded rom.
	//Both need to be in memory to bypass a piracy check. Once the bios
	//is done running it will overwrite that addressable space with tetris again.
	load_image("bios.gb"); 

	single_step();
}

// The draw function will handle updating the screen to reflect the current
// state of the game.
function paint() {
	output_vram.data = vram;
    canvas.putImageData(output_vram, 0, 0);
}  

