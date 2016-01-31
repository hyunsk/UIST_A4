var rot = 0;

function setup() {
  createCanvas(windowWidth, windowHeight); // Use the full browser window
  //background(0);
}

function draw() {
  var x, y, r, pt, diff;

  stroke("#D3F3C8");
  noFill();

  x = windowWidth / 2;
  y = windowHeight / 2;

  r = 200;

  // big circle
  drawCircle(x, y, r);

  pt = {};

  pt = getOrbitPos(x, y, r, rot);


  stroke("#FA7A55");


  drawCircle(pt.x, pt.y, 5);

  rot += PI / 80;
}

function drawCircle(x, y, r) {
  var diam = r * 2;
  ellipse(x, y, diam, diam);
}

function getOrbitPos(x, y, r, rad){
  var pt = {};

  rad -= PI/2;

  pt.x = cos(rad) * r + x;
  pt.y = sin(rad) * r + y;

  return pt;
}

function drawOrbit(x, y, r, rad){

}

