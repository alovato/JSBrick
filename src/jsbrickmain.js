// This file is to contain the main JSBrick Javascript code. 

var imageData;

// The run function should handle primary initialization tasks. This will
// include running the dispatcher and running the draw() function at an
// appropriate interval.
function run() {
    //init();
    //draw(); 
    // Test
    drawRandom();
}

// Step the CPU and update the register table with the current register values
function stepCPU() {
    // Step the CPU

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
    rows[9].cells[1].innerHTML = "0x" + PC.toString(16);
    rows[10].cells[1].innerHTML = "0x" + SP.toString(16);
}

// Dumb function to draw random dots in the canvas so we can see where it is
function drawRandom() {
    var canvas = document.getElementById("canvas");

    init();

    width = parseInt(canvas.getAttribute("width"));
    height = parseInt(canvas.getAttribute("height"));


    // draw random dots
    for (i = 0; i < 10000; i++) {
        x = parseInt(Math.random() * width);
        y = parseInt(Math.random() * height);
        r = parseInt(Math.random() * 256);
        g = parseInt(Math.random() * 256);
        b = parseInt(Math.random() * 256);
        setPixel(imageData, x, y, r, g, b, 0xff); // 0xff opaque
    }

    // Need to update the screen
    draw();
}

// This function initializes the imageData array
function init() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    width = parseInt(canvas.getAttribute("width"));
    height = parseInt(canvas.getAttribute("height"));

    imageData = ctx.createImageData(width, height);
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



