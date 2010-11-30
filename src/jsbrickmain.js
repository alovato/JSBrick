// This file is to contain the main JSBrick Javascript code. 
var canvas;
var imageData;
var execs = 0;

// The run function should handle primary initialization tasks. This will
// include running the dispatcher and running the draw() function at an
// appropriate interval.
function run() {
    // Test
    clearCanvas();
}
function run_for() {
	var num = parseInt(prompt("Run how many instructions?", "1"));
	for(i = 0; i < num-1; i += 1)
	{
		execute_gpu_step(execute_step());
		execs++;
	}
	stepCPU();
}

// Step the CPU and update the register table with the current register values
function stepCPU()
{
    // Step the CPU
	execute_gpu_step(execute_step());
	if(gpu_ready_to_draw)
	{
		
		for(var j = 0; j < 144; j++)
		{
			for(var i = 0; i < 160; i++)
			{
				setPixel(imageData, 
					i, j,
					output_vram[(i+j*160)*4],
					output_vram[(i+j*160)*4+1],
					output_vram[(i+j*160)*4+2],
					0xFF);
			}
		}
		draw();
		gpu_ready_to_draw = false;
		debug_out("Draw frame");
	}
	execs += 1;
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
	rows[13].cells[1].innerHTML = totalClock;
	rows[14].cells[1].innerHTML = gpu_mode;
	rows[15].cells[1].innerHTML = gpu_timer;
	rows[16].cells[1].innerHTML = gpu_scanline;
    
	
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

// Dumb function to draw random dots in the canvas so we can see where it is
function clearCanvas() {
    var canvas = document.getElementById("canvas");

    init();
	
    width = parseInt(canvas.getAttribute("width"));
    height = parseInt(canvas.getAttribute("height"));


    for (i = 0; i < width; i++) 
	{
		for(j = 0; j < height; j++)
		{
			setPixel(imageData, i, j, c_white, c_white, c_white, 0xFF); // 0xff opaque
		}
	}

    // Need to update the screen
    draw();
}

// This function initializes the imageData array
function init() {
    canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    width = parseInt(canvas.getAttribute("width"));
    height = parseInt(canvas.getAttribute("height"));

    imageData = ctx.createImageData(width, height);
	
	reset(); //Reset our CPU, load our memory map, and go!
	init_gpu();
	
	load_image("tetris.gb");
	//This overwrites the first 255 bytes of the previosly loaded rom.
	//Both need to be in memory to bypass a piracy check. Once the bios
	//is done running it will overwrite that addressable space with tetris again.
	load_image("bios.gb"); 
	stepCPU();

}

// Set a pixel at (x, y) with the values of (r, g, b, a)
function setPixel(imageData, x, y, r, g, b, a) {
    index = (x + y * imageData.width) * 4;
    imageData.data[index+0] = r;
    imageData.data[index+1] = g;
    imageData.data[index+2] = b;
    imageData.data[index+3] = a;
}

// The draw function will handle updating the screen to reflect the current
// state of the game.
function draw() {
    // Get the canvas and a 2-dimensional context for drawing
    var canvas = document.getElementById("canvas");  
    var ctx = canvas.getContext("2d");  

    // Update the canvas with the imageData
    ctx.putImageData(imageData, 0, 0);
}  

// Handle keyboard input.
function handleInput(e) {
    // Get the key that was pressed.
    var key = e.keyCode;
    var value = 0;

    // Decide here how to actually handle the individual keys.
    if (key == 65) {
        // Start
    }
    else if (key == 90) {
        // A
        
    }
    else if (key == 88) {
        // B
    }
    else if (key == 83) {
        // Select
    }
    else if (key == 37) {
        // Left
    }
    else if (key == 38) {
        // Up
    }
    else if (key == 39) {
        // Right
    }
    else if (key == 40) {
        // Down
    }

}


