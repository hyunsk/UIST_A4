var planetBaseSpeed = 0;
var orbitPathColors = [];
var univ = [];
var orbitScaleFactor = 0.6;
var orbiterSizeScaleFactor = 0.65;


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
  // first ring
  kick = createOrbiter(0, planetBaseSpeed, 8, 30, "#106EE8", 1, 20, 10);
  // create planet kick's moons
  kick.orbiters.push(
    createOrbiter(0, planetBaseSpeed * 2.2, 2, 20, "#0FC1A1", 1)
  );
  kick.orbiters.push(
    createOrbiter(0, planetBaseSpeed * 1.8, 3, 25, "#90E0AB", 1)
  );

  kick.orbiters.push(
    createOrbiter(0, planetBaseSpeed * 1, 1, 32, "#CBFFCE", 1)
  );
  // set planet kick orbit color
  orbitPathColors.push("#E5FCC2");
  // add planet kick to univ
  univ.push(kick);


  // create planet hat
  // second ring
  hat = createOrbiter(PI/2, planetBaseSpeed, 12, 90, "#D3F3C8", 1, 20, 10);
  // create planet kick's moons
  hat.orbiters.push(
    createOrbiter(0, planetBaseSpeed * 3, 3, 30, "#5A17ED", 1)
  );
  hat.orbiters.push(
    createOrbiter(0, planetBaseSpeed * 2, 5, 45, "#FACADE", 1)
  );
  // set planet kick orbit color
  orbitPathColors.push("#9DE0AD");
  // add planet kick to univ
  univ.push(hat);


  // create planet snare
  // third ring
  snare = createOrbiter(PI, planetBaseSpeed * 1.4, 16, 210, "#59A27A", 10, 20, 10);
  // create planet snare's moons
  snare.orbiters.push(
    createOrbiter(0, planetBaseSpeed * 5, 4, 40, "#FACADE", 1)
  );

  // set planet snare's orbit color
  orbitPathColors.push("#45ADA8");
  // add planet snare to univ
  univ.push(snare);


  // create planet synth
  // fourth ring
  synth = createOrbiter(3*PI/2, planetBaseSpeed * .5, 30, 420, "#A56CC1", 1, 20, 30);
  // create planet synth's moons
  tempOrbiter = createOrbiter(3*PI/2, planetBaseSpeed * 2, 6, 50, "#A6ACEC", 3);
  tempOrbiter.orbiters.push(createOrbiter(3*PI/2, planetBaseSpeed * 4, 8, 100, "#ACE7EF", 2));

  synth.orbiters.push(
    tempOrbiter
  );
  synth.orbiters.push(
    createOrbiter(0, planetBaseSpeed * 2.5, 12, 120, "#ACE7EF", 5)
  );
  // set planet synth orbit color
  orbitPathColors.push("#547980");
  // add planet synth to univ
  univ.push(synth);

  // create planet bass
  // fifth ring
  bass = createOrbiter(3*PI/2, planetBaseSpeed * 0.2, 50, 700, "#E14242", 1, 20, 10);
  // create planet bass' moons
  tempOrbiter = createOrbiter(3*PI/2, planetBaseSpeed * 1.2, 10, 150, "#EACD65", 3);
  tempOrbiter.orbiters.push(createOrbiter(3*PI/2, planetBaseSpeed * 4, 6, 40, "#8D3434", 2));

  bass.orbiters.push(
    tempOrbiter
  );
  bass.orbiters.push(
    createOrbiter(0, planetBaseSpeed, 10, 80, "#EBEBCD", 5)
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
  var i, planet, doFlare;


  clear();
  background(0);

  x = windowWidth / 2;
  y = windowHeight / 2;

  for(i=0; i<univ.length; i++){
    planet = univ[i];

    // draw orbit path
    noFill();
    stroke(orbitPathColors[i]);
    strokeWeight(1);
    drawCircle(x, y, planet.rotationRadius);


    // trigger flare
    doFlare = isAtOrbitRotation(PI/2, planet);

    // draw planet
    drawOrbiter(x, y, planet, doFlare);
    updateOrbiterRotation(planet);

    // draw planet's orbiters
    drawOrbiters(planet.x, planet.y, planet.orbiters);
  }
}

//
// Draw Helpers -------------------------------------------------------------------------------
//

function createOrbiter(initRotation, delta, radius, rotationRadius, strokeColor, strokeWeight, flareDecay, flareMaxLength){
  // initRotation - where to begin
  // rotation - current rotation around parent
  // delta - how fast to orbit
  // radius - radius of orbiter
  // rotationRadius - distance to center of rotation
  // strokeColor(string) - stroke color of orbiter
  // strokeWeight - stroke weight of orbiter


  // scale orbiter's size and rotation radius by global scale factors
  radius *= orbiterSizeScaleFactor;
  rotationRadius *= orbitScaleFactor;

  var orbiter = {orbiters: []};
  orbiter.initRotation = initRotation;
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

  // flare animation properties
  orbiter.doFlare = false;
  orbiter.flareDecay = 0;
  orbiter.flareMaxLength = 0;
  orbiter.flareLength = 0;
  orbiter.flareAge = 0;

  if(typeof flareDecay !== "undefined"){
    orbiter.flareDecay = flareDecay;
  }

  if(typeof flareMaxLength !== "undefined"){
    orbiter.flareMaxLength = flareMaxLength;
  }

  orbiter.particles = new ParticleSystem(createVector(orbiter.x, orbiter.y));

  return orbiter;
}

function drawOrbiters(x, y, univ, doFlare){
  var i, orbiter;
  for (i = 0; i< univ.length; i++){
    orbiter = univ[i];
    drawOrbiter(x, y, orbiter, doFlare);
    updateOrbiterRotation(orbiter);

    if (orbiter.orbiters.length){
      drawOrbiters(orbiter.x, orbiter.y, orbiter.orbiters)
    }
  }
}

function drawOrbiter(x, y, orbiter, doFlare){
  var pt;

  if (doFlare){
    orbiter.doFlare = true;
  }

  if (orbiter.doFlare){
    drawOrbiterFlare(x, y, orbiter);
  }

  fill(orbiter.strokeColor);
  noStroke();

  pt = getOrbitPos(x, y, orbiter.rotationRadius, orbiter.rotation);

  orbiter.x = pt.x;
  orbiter.y = pt.y;

  drawCircle(orbiter.x, orbiter.y, orbiter.radius);

}

function updateOrbiterRotation(orbiter){
  orbiter.rotation += orbiter.delta;
}

function drawOrbiterFlare(x, y, orbiter){
  var i, j, alphaDelta, currentAlpha, lifeRatio, radiusMultiplier, flareParticles, pt;

  orbiter.initRotation = orbiter.rotation;
  orbiter.initStrokeColor = orbiter.strokeColor;

  if (orbiter.flareAge >= orbiter.flareDecay){
    orbiter.doFlare = false;
    orbiter.flareAge = 0;
    orbiter.flareLength = 0;
    orbiter.radius = orbiter.initRadius;
    return;
  }

  lifeRatio = orbiter.flareAge / orbiter.flareDecay;

  alphaDelta = -1 / orbiter.flareLength;


  orbiter.particles.origin.x = orbiter.x;
  orbiter.particles.origin.y = orbiter.y;
  orbiter.particles.addParticle();

  orbiter.particles.run();


  //for (i=0; i< orbiter.flareLength; i++){
  //  orbiter.doFlare = false;
  //
  //  orbiter.rotation += (orbiter.delta +2);
  //  currentAlpha = getAlphaFraction(orbiter.strokeColor) + alphaDelta;
  //
  //  orbiter.strokeColor = adjustColorAlpha(orbiter.strokeColor, currentAlpha);
  //
  //  //radiusMultiplier = (1-pow(lifeRatio - 1, 4) - 3*(lifeRatio - 1)/2);
  //
  //  //orbiter.radius = orbiter.initRadius * radiusMultiplier;
  //
  //  //drawOrbiter(x, y, orbiter);
  //
  //  pt = getOrbitPos(x, y, orbiter.rotationRadius, orbiter.rotation);
  //
  //  orbiter.x = pt.x;
  //  orbiter.y = pt.y;
  //
  //
  //  orbiter.particles.origin.x = pt.x;
  //  orbiter.particles.origin.y = pt.y;
  //
  //}


  orbiter.rotation = orbiter.initRotation;
  orbiter.strokeColor = orbiter.initStrokeColor;
  orbiter.doFlare = true;

  orbiter.flareAge++;
  if (orbiter.flareLength < orbiter.flareMaxLength){
    orbiter.flareLength++;
  }
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

// Particle System from example -------------------------------------------------------------------------------

// A simple Particle class
var Particle = function(position) {
  this.acceleration = createVector(0, -0.10);
  this.velocity = createVector(random(-1, 1), random(-1, 0));
  this.position = position.copy();
  this.lifespan = 100.0;
};

Particle.prototype.run = function() {
  this.update();
  this.display();
};

// Method to update position
Particle.prototype.update = function(){
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.lifespan -= 2;
};

// Method to display
Particle.prototype.display = function() {
  stroke(200, this.lifespan);
  strokeWeight(2);
  noStroke();
  fill(255, this.lifespan);
  ellipse(this.position.x, this.position.y, 12, 12);
};

// Is the particle still useful?
Particle.prototype.isDead = function(){
  if (this.lifespan < 0) {
    return true;
  } else {
    return false;
  }
};

var ParticleSystem = function(position) {
  this.origin = position.copy();
  this.particles = [];
};

ParticleSystem.prototype.addParticle = function() {
  this.particles.push(new Particle(this.origin));
};

ParticleSystem.prototype.run = function() {
  for (var i = this.particles.length-1; i >= 0; i--) {
    var p = this.particles[i];
    p.run();
    if (p.isDead()) {
      this.particles.splice(i, 1);
    }
  }
};


//
// Draw
//
////////////////////////////////////////////////////////////////////////////////////////////////

