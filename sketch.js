// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Example 1-1: stroke and fill

function setup() {
  createCanvas(windowWidth, windowHeight);
  
}

function draw() {
	windowCenterX = windowWidth / 2;
	windowCenterY = windowHeight / 2;

	stroke(255);
	strokeWeight(1);
	drawCircle(windowCenterX, windowCenterY, 400, 'rgb(255, 255, 255)');

 	background(0);
 	stroke(0);
 	drawCircle(windowCenterX, windowCenterY, 50, 'rgb(255, 255, 60)');
}


function drawCircle(x, y, r, fillColor) {
	var diam = r * 2;
	fill(fillColor);
	ellipse(x, y, diam, diam);

}