var rot = 0;
var rotMoon = 0;
var planetBaseSpeed = 0;
var orbitPathColors = [];
var univ = [];


function setup() {
  var kick, snare, hat, synth, bass;

  createCanvas(windowWidth, windowHeight); // Use the full browser window
  planetBaseSpeed = PI / 100;


  // create planet kick
  kick = createOrbiter(0, planetBaseSpeed, 20, 300, "#D3F3C8", 1);
  // create planet kick's moons
  kick.orbiters.push(
    createOrbiter(0, planetBaseSpeed * 5, 5, 60, "#5A17ED", 1)
  );
  kick.orbiters.push(
    createOrbiter(0, planetBaseSpeed * 3, 10, 120, "#FACADE", 1)
  );
  // set planet kick orbit color
  orbitPathColors.push("#FA7A55");
  // add planet kick to univ
  univ.push(kick);




  // create planet snare
  snare = createOrbiter(PI, planetBaseSpeed * 2, 30, 500, "#59A27A", 10);
  // create planet snare's moons
  snare.orbiters.push(
    createOrbiter(0, planetBaseSpeed * 3, 10, 120, "#FACADE", 1)
  );
  // set planet snare's orbit color
  orbitPathColors.push("#DEDEDE");
  // add planet snare to univ
  univ.push(snare);
}


function draw() {
  var i, orbiter, orbitColor;


  clear();
  background(0);

  stroke("#FA7A55");
  noFill();

  x = windowWidth / 2;
  y = windowHeight / 2;

  for(i=0; i<univ.length; i++){
    orbiter = univ[i];

    // draw orbit path
    stroke(orbitPathColors[i]);
    strokeWeight(1);
    drawCircle(x, y, orbiter.rotationRadius);

    // draw planet
    drawOrbiter(x, y, orbiter);
    // draw planet's orbiters
    drawOrbiters(orbiter.x, orbiter.y, orbiter.orbiters);
  }
}

function createOrbiter(initRotation, delta, radius, rotationRadius, stroke, strokeWeight){
  // initRotation - where to begin
  // delta - how fast to orbit
  // radius - radius of orbiter
  // rotationRadius - distance to center of rotation
  // stroke - stroke color of orbiter
  // strokeWeight - stroke weight of orbiter

  var orbiter = {orbiters: []};
  orbiter.rotation = initRotation;
  orbiter.delta = delta;
  orbiter.radius = radius;
  orbiter.initRadius = radius;
  orbiter.rotationRadius = rotationRadius;
  orbiter.stroke = stroke;
  orbiter.initStroke = stroke;
  orbiter.strokeWeight = strokeWeight;

  // initial values for x, y
  orbiter.x = 0;
  orbiter.y = 0;

  return orbiter;
}

function drawOrbiters(x, y, univ){
  var i, orbiter;
  for (i = 0; i< univ.length; i++){
    orbiter = univ[i];
    drawOrbiter(x, y, orbiter);

    if (orbiter.orbiters.length){
      drawOrbiters(orbiter.x, orbiter.y, orbiters.orbiters)
    }
  }
}

function drawOrbiter(x, y, orbiter){
  var pt;

  stroke(orbiter.stroke);
  strokeWeight(orbiter.strokeWeight);

  pt = getOrbitPos(x, y, orbiter.rotationRadius, orbiter.rotation);

  orbiter.x = pt.x;
  orbiter.y = pt.y;

  drawCircle(orbiter.x, orbiter.y, orbiter.radius)

  orbiter.rotation += orbiter.delta;
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

