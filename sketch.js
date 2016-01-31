var rot = 0;
var rotMoon = 0;
var planetBaseSpeed = 0;

function setup() {
  createCanvas(windowWidth, windowHeight); // Use the full browser window
  //background(0);

  planetBaseSpeed = PI / 100;
}

function draw() {
  var x, y, r, pt, diff;
  clear();

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

  // planet orbit
  drawCircle(pt.x, pt.y, 50);

  // planet
  stroke("#000000");
  drawCircle(pt.x, pt.y, 20);

  pt = getOrbitPos(pt.x, pt.y, 50, rotMoon);

  // moon
  drawCircle(pt.x, pt.y, 2);

  rotMoon += planetBaseSpeed * random(1, 10);
  rot += planetBaseSpeed;
}

function drawCircle(x, y, r) {
  var diam = r * 2;
  ellipse(x, y, diam, diam);
}

function isAtBottom(x, y, pt, r){

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

