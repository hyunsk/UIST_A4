var planetBaseSpeed = 0;
var orbitPathColors = [];
var univ = [];


////////////////////////////////////////////////////////////////////////////////////////////////
//
// Setup
//

function setup() {
  createCanvas(windowWidth, windowHeight); // Use the full browser window
  createUniverse();
  frameRate(60);
}

//
// Setup Helpers -------------------------------------------------------------------------------
//

function createUniverse(){
  var kick, snare, hat, synth, bass;
  var tempOrbiter;

  planetBaseSpeed = PI / 200;


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
  orbitPathColors.push("#E5FCC2");
  // add planet kick to univ
  univ.push(kick);


  // create planet hat
  hat = createOrbiter(PI/2, planetBaseSpeed, 20, 200, "#D3F3C8", 1);
  // create planet kick's moons
  hat.orbiters.push(
    createOrbiter(0, planetBaseSpeed * 5, 5, 60, "#5A17ED", 1)
  );
  hat.orbiters.push(
    createOrbiter(0, planetBaseSpeed * 3, 10, 120, "#FACADE", 1)
  );
  // set planet kick orbit color
  orbitPathColors.push("#9DE0AD");
  // add planet kick to univ
  univ.push(hat);


  // create planet snare
  snare = createOrbiter(PI, planetBaseSpeed * 2, 30, 500, "#59A27A", 10);
  // create planet snare's moons
  snare.orbiters.push(
    createOrbiter(0, planetBaseSpeed * 3, 10, 120, "#FACADE", 1)
  );
  snare.orbiters.push(
    createOrbiter(PI, planetBaseSpeed * 5, 12, 500, "#FACADE", 2)
  );
  // set planet snare's orbit color
  orbitPathColors.push("#45ADA8");
  // add planet snare to univ
  univ.push(snare);


  // create planet synth
  synth = createOrbiter(3*PI/2, planetBaseSpeed, 90, 150, "#888", 1);
  // create planet synth's moons
  tempOrbiter = createOrbiter(3*PI/2, planetBaseSpeed * 3, 50, 190, "#0000FF", 3);
  tempOrbiter.orbiters.push(createOrbiter(3*PI/2, planetBaseSpeed * 7, 10, 170, "#FF0000", 2));

  synth.orbiters.push(
    tempOrbiter
  );
  synth.orbiters.push(
    createOrbiter(0, planetBaseSpeed * 4, 10, 120, "#333", 5)
  );
  // set planet synth orbit color
  orbitPathColors.push("#547980");
  // add planet synth to univ
  univ.push(synth);

  // create planet bass
  bass = createOrbiter(3*PI/2, planetBaseSpeed, 10, 530, "#888", 1);
  // create planet bass' moons
  tempOrbiter = createOrbiter(3*PI/2, planetBaseSpeed * 3, 50, 190, "#0000FF", 3);
  tempOrbiter.orbiters.push(createOrbiter(3*PI/2, planetBaseSpeed * 7, 10, 170, "#FF0000", 2));

  bass.orbiters.push(
    tempOrbiter
  );
  bass.orbiters.push(
    createOrbiter(0, planetBaseSpeed * 4, 10, 120, "#333", 5)
  );
  // set planet bass' orbit color
  orbitPathColors.push("#2D727F");
  // add planet bass to univ
  univ.push(bass);
}

//
// Setup
//
////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////
//
// Draw
//

function draw() {
  var i, orbiter, orbitColor;


  clear();
  background(0);

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

    if (isAtOrbitRotation(PI, orbiter)){
      console.log("bottom", i);
    }

    // draw planet's orbiters
    drawOrbiters(orbiter.x, orbiter.y, orbiter.orbiters);
  }
}

//
// Draw Helpers -------------------------------------------------------------------------------
//

function createOrbiter(initRotation, delta, radius, rotationRadius, strokeColor, strokeWeight){
  // initRotation - where to begin
  // rotation - current rotation around parent
  // delta - how fast to orbit
  // radius - radius of orbiter
  // rotationRadius - distance to center of rotation
  // strokeColor(string) - stroke color of orbiter
  // strokeWeight - stroke weight of orbiter

  var orbiter = {orbiters: []};
  orbiter.rotation = initRotation;
  orbiter.delta = delta;
  orbiter.radius = radius;
  orbiter.initRadius = radius;
  orbiter.rotationRadius = rotationRadius;
  orbiter.strokeColor = color(strokeColor);
  orbiter.initStrokeColor = orbiter.strokeColor;
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
      drawOrbiters(orbiter.x, orbiter.y, orbiter.orbiters)
    }
  }
}

function drawOrbiter(x, y, orbiter){
  var pt;

  stroke(orbiter.strokeColor);
  strokeWeight(orbiter.strokeWeight);

  pt = getOrbitPos(x, y, orbiter.rotationRadius, orbiter.rotation);

  orbiter.x = pt.x;
  orbiter.y = pt.y;

  drawCircle(orbiter.x, orbiter.y, orbiter.radius);

  orbiter.rotation += orbiter.delta;
}

function drawCircle(x, y, r) {
  var diam = r * 2;
  ellipse(x, y, diam, diam);
}

function isAtOrbitRotation(targetRotation, orbiter){
  // normalize rotation
  orbiter.rotation = orbiter.rotation % TWO_PI;

  if ((orbiter.rotation > targetRotation) || (orbiter.rotation + orbiter.delta < targetRotation)){
    return false;
  }

  return true;

}

function getOrbitPos(x, y, r, rad){
  var pt = {};

  rad -= PI/2;

  pt.x = cos(rad) * r + x;
  pt.y = sin(rad) * r + y;

  return pt;
}

function adjustColorAlpha(colorInstance, targetAlpha){
  var str;

  // color gets wonky with extremely small alphas
  if (targetAlpha < 0.001){
    targetAlpha = 0;
  }

  str = red(colorInstance) + ", " + green(colorInstance) + ", " + blue(colorInstance) + ", " + targetAlpha;
  str = "rgba(" + str + ")";

  return color(str);
}

function getAlphaFraction(colorInstance){
  return alpha(colorInstance) / 255;
}

//
// Draw
//
////////////////////////////////////////////////////////////////////////////////////////////////

