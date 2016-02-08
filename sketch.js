var orbitPathColors = [];
var univ = [];
var stars = [];
var starMaxRadius = null;
var orbitScaleFactor = 1;
var orbiterSizeScaleFactor = 1;
var planetBaseSpeed = null;

////////////////////////////////////////////////////////////////////////////////////////////////
//
// Setup
//

function rotationDelta(bpm, fps){
  var beats, spb, revTime, frames;

  beats = 16 * 4;
  spb = 60 / bpm;
  revTime = spb * beats;
  frames = revTime * fps;

  return (2 * PI / frames);
}

function setup() {
  planetBaseSpeed = rotationDelta(110, 60);
  frameRate(60);

  createCanvas(windowWidth, windowHeight); // Use the full browser window
  createUniverse();
}

//
// Setup Helpers -------------------------------------------------------------------------------
//

function createUniverse(){
  var kick, snare, hat, synth, bass;
  var tempOrbiter;
  var x = windowWidth / 2;
  var y = windowHeight / 2;

  // create planet kick
  // first ring
  kick = createPlanet(
    {
      initRotation: 0,
      delta: 1,
      radius: 8,
      rotationRadius: 150,
      color: "#106EE8",
      flareDecay: 10
    },
    {
      initRotation: PI,
      delta: 16,
      radius: 3,
      rotationRadius: 40,
      color: "#0FC1A1",
      flareDecay: 0
    },
    {
      initRotation: 0,
      delta: 1.8,
      radius: 2,
      rotationRadius: 25,
      color: "#90E0AB",
      flareDecay: 0
    },
    createKick
  );

  // set planet kick orbit color
  orbitPathColors.push("#E5FCC2");
  // add planet kick to univ
  univ.push(kick);


  // create planet hat
  // second ring
  hat = createPlanet(
    {
      initRotation: PI/2,
      delta: 4,
      radius: 12,
      rotationRadius: 270,
      color: "#37B7B5",
      flareDecay: 10
    },
    {
      initRotation: PI,
      delta: 16,
      radius: 3,
      rotationRadius: 50,
      color: "#A0E4E0",
      flareDecay: 0
    },
    {
      initRotation: 0,
      delta: 2,
      radius: 1,
      rotationRadius: 15,
      color: "#C7F6F5",
      flareDecay: 0
    },
    createHat
  );

  // set planet kick orbit color
  orbitPathColors.push("#9DE0AD");
  // add planet kick to univ
  univ.push(hat);


  // create planet snare
  // third ring
  snare = createPlanet(
    {
      initRotation: PI,
      delta: 4,
      radius: 16,
      rotationRadius: 380,
      color: "#59A27A",
      flareDecay: 10
    },
    {
      initRotation: PI,
      delta:2,
      radius: 4,
      rotationRadius: 40,
      color: "#FACADE",
      flareDecay: 0
    },
    {
      initRotation: 0,
      delta: 5,
      radius: 4,
      rotationRadius: 20,
      color: "#FACADE",
      flareDecay: 0
    },
    createHat
  );

  // set planet snare's orbit color
  orbitPathColors.push("#45ADA8");
  // add planet snare to univ
  univ.push(snare);


  // create planet synth
  // fourth ring
  synth = createPlanet(
    {
      initRotation: 3*PI/2,
      delta: 2,
      radius: 30,
      rotationRadius: 560,
      color: "#A56CC1",
      flareDecay: 35
    },
    {
      initRotation: PI,
      delta: 1,
      radius: 6,
      rotationRadius: 50,
      color: "#A6ACEC",
      flareDecay: 0
    },
    {
      initRotation: 3*PI/2,
      delta: 4,
      radius: 8,
      rotationRadius: 100,
      color: "#ACE7EF",
      flareDecay: 0
    },
    createKick
  );

  // set planet synth orbit color
  orbitPathColors.push("#547980");
  // add planet synth to univ
  univ.push(synth);

  // create planet bass
  // fifth ring
  bass = createPlanet({
      initRotation: 3*PI/2,
      delta: 2,
      radius: 40,
      rotationRadius: 760,
      color: "#E14242",
      flareDecay: 40
    },
    {
      initRotation: PI,
      delta: 1,
      radius: 10,
      rotationRadius: 150,
      color: "#EACD65",
      flareDecay: 0
    },
    {
      initRotation: 3*PI/2,
      delta: 4,
      radius: 6,
      rotationRadius: 40,
      color: "#8D3434",
      flareDecay: 0
    },
    createKick
  );

  // set planet bass' orbit color
  orbitPathColors.push("#2D727F");
  // add planet bass to univ
  univ.push(bass);

  generateStars(500, 1000, 4);

  // Create black background
  fill(0, 0, 0, 255);
  rect(0,0,windowWidth,windowHeight);
}


function generateStars(minimum, maximum, maxRadius){
  var i, star;

  starMaxRadius = maxRadius;

  i = random(minimum, maximum)

  for(i; i > 0; i--){
    star = {
      x: random(windowWidth),
      y: random(windowHeight),
      r: random(0.1, starMaxRadius),
      alpha: random(1, 255)
    }

    //console.log(star.r, star.y, star.r, star.alpha)
    stars.push(star);
  }
}

//
// Setup
//
////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////
//
// Input
//

function keyPressed() {
  switch(key){
    case "Q":
      if (!univ[0].mute){
        univ[0].createMoonAndSatellite();
      }
      break;
    case "W":
      if (!univ[1].mute) {
        univ[1].createMoonAndSatellite();
      }
      break;
    case "E":
      if (!univ[2].mute) {
        univ[2].createMoonAndSatellite();
      }
      break;
    case "R":
      if (!univ[3].mute) {
        univ[3].createMoonAndSatellite();
      }
      break;
    case "T":
      if (!univ[4].mute) {
        univ[4].createMoonAndSatellite()
      }
      break;
    case "A":
      univ[0].mute = !univ[0].mute;
      break;
    case "S":
      univ[1].mute = !univ[1].mute;
      break;
    case "D":
      univ[2].mute = !univ[2].mute;
      break;
    case "F":
      univ[3].mute = !univ[3].mute;
      break;
    case "G":
      univ[4].mute = !univ[4].mute;
      break;
    case "Z":
      univ[0].clearMoonsAndSatellites();
      break;
    case "X":
      univ[1].clearMoonsAndSatellites();
      break;
    case "C":
      univ[2].clearMoonsAndSatellites();
      break;
    case "V":
      univ[3].clearMoonsAndSatellites();
      break;
    case "B":
      univ[4].clearMoonsAndSatellites();
      break;
  }
}

//
// Input
//
////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////
//
// Draw
//

function draw() {
  var i, planet, doFlare;


  //clear();

  //draw refresher
  fill(0, 0, 0, 20)
  rect(0,0,windowWidth,windowHeight)

  //draw sun
  fill('#FF9757');
  ellipse((windowWidth/2), (windowHeight/2), 100, 100);


  for (i=0; i < stars.length; i++){
    drawStar(stars[i]);
  }

  x = windowWidth / 2;
  y = windowHeight / 2;

  for(i=0; i<univ.length; i++){
    planet = univ[i];

    // draw orbit path
    // noFill();
    // stroke(orbitPathColors[i]);
    // strokeWeight(1);
    // drawCircle(x, y, planet.rotationRadius);


    // draw planet
    planet.draw(x, y, false, planet.mute, false);
    planet.updateRotation();

    planet.checkPlaySound();

    // draw planet's orbiters
    planet.drawOrbiters(planet.x, planet.y, false, planet.mute, planet.doFlare);
  }

}

//
// Draw Helpers -------------------------------------------------------------------------------
//


function drawStar(star){
  var multiplier;

  fill(255, 255, 255, star.r);
  noStroke();
  drawCircle(star.x, star.y, star.r);


  multiplier = 1 + random(-0.1, 0.1);
  star.r *= multiplier;

  multiplier = 1 + random(-0.1, 0.1);
  star.a *= multiplier;

  star.r = constrain(star.r, 0.3, starMaxRadius);
  star.a = constrain(star.a, 50, 255);

}

function createPlanet(options, moonOptions, satelliteOptions, sound){
  var planet, triggerRotation, mapParams;

  triggerRotation = PI;

  planet = createOrbiter(options);
  planet.moons = planet.orbiters;
  _.assign(moonOptions, {rotation: triggerRotation});


  planet.mute = false;
  planet.sound = sound();

  mapParams = function(satellite, moon){
    var dx, dy;
    var max = satellite.rotationRadius;

    dx = (moon.x - satellite.x);
    dy = (moon.y - satellite.y);

    dx = map(dx, -max, max, 0, 1);
    dy = map(dy, -max, max, 0, 1);
    return({a: dx, b: dy});
  }


  planet.checkPlaySound = function(){
    var satellite, i, p;
    for(i= 0; i<planet.moons.length; i++){
      if (planet.mute){
        continue;
      }
      if (isAtOrbitRotation(triggerRotation, planet.moons[i])){
        satellite = planet.moons[i].orbiters[0];

        p = mapParams(satellite, planet.moons[i]);
        planet.sound.play(p.a, p.b);
        planet.doFlare = true;
        planet.moons[i].doFlash = true;
        planet.moons[i].orbiters[0].doFlash = true;
      }
    }
  };

  planet.createMoonAndSatellite = function(rotation){
    var options;
    var satellite;
    var moon;

    options = {}
    _.assign(options, satelliteOptions, {rotation: random(0, 2*PI)});
    satellite = createOrbiter(options);

    _.assign(options, moonOptions, {rotationRadius: moonOptions.rotationRadius * random(1, 2)});


    moon = createOrbiter(options);
    moon.satellites = moon.orbiters;
    moon.orbiters.push(satellite);
    planet.orbiters.push(moon);
  };

  planet.clearMoonsAndSatellites = function(){
    var moon;
    while(planet.moons.length > 0){
      moon = planet.moons.pop();
      while(moon.satellites.length > 0){
        delete moon.satellites.pop();
      }
      delete moon;
    }
  }

  return planet;
}

function createOrbiter(options){
  // initRotation - where to begin
  // delta - how fast to orbit
  // radius - radius of orbiter
  // rotation - current rotation around parent
  // rotationRadius - distance to center of rotation
  // strokeColor (string or color obj) - stroke color of orbiter
  // strokeWeight - stroke weight of orbiter
  // flareDecay - number of particles emitted before death
  // orbitCenter - [x, y]

  var orbiter, defaults, override, orbiterColor;

  orbiterColor = color(options.color);

  orbiter = {};
  defaults = {
    rotation: options.initRotation,
    initRadius: options.radius,
    flareAge: 0,
    flareDecay: 0,
    doFlare: false,
    particles: new ParticleSystem(createVector(orbiter.x, orbiter.y)),
    orbiters: [],
    x: 0,
    y: 0,
    doFlash: false
  };
  override = {
    radius: options.radius * orbiterSizeScaleFactor,        // scale orbiter's size and rotation radius by global scale factors
    rotationRadius: options.rotationRadius * orbitScaleFactor,
    delta: planetBaseSpeed * options.delta,
    color: orbiterColor,
    initColor: orbiterColor
  }
  _.assign(orbiter, defaults, options, override);


  orbiter.drawOrbiters = function(x, y, doFlare, grayscale){
    var i, currentOrbiter;
    for (i = 0; i< orbiter.orbiters.length; i++){
      currentOrbiter = orbiter.orbiters[i];
      currentOrbiter.draw(x, y, doFlare, grayscale);
      currentOrbiter.updateRotation();

      if (currentOrbiter.orbiters.length){
        currentOrbiter.drawOrbiters(currentOrbiter.x, currentOrbiter.y, false, grayscale)
      }
    }
  };

  orbiter.draw = function(x, y, doFlare, grayscale){
    var pt;

    if (doFlare){
      orbiter.doFlare = true;
    }

    if (orbiter.doFlare){
      orbiter.drawFlare(x, y);
    }

    fill(orbiter.color);

    if (grayscale){
      fill("rgb(200, 200, 200)");
    }

    if (orbiter.doFlash){
      fill("rgb(250, 250, 250)");
    }

    noStroke();

    pt = getOrbitPos(x, y, orbiter.rotationRadius, orbiter.rotation);

    orbiter.x = pt.x;
    orbiter.y = pt.y;

    drawCircle(orbiter.x, orbiter.y, orbiter.radius);
  };

  orbiter.drawFlare = function(x, y){
    var direction, dx, dy;

    orbiter.initRotation = orbiter.rotation;
    orbiter.initColor = orbiter.color;

    if (orbiter.flareAge >= orbiter.flareDecay){
      // reset flare

      orbiter.doFlare = false;
      orbiter.flareAge = 0;
      orbiter.radius = orbiter.initRadius;


      for(var i=0; i< orbiter.orbiters.length; i++){
        orbiter.orbiters[i].doFlash = false;
        orbiter.orbiters[i].orbiters[0].doFlash = false;
      }

      while(orbiter.particles.particles.length){
        delete orbiter.particles.particles.pop()
      }
      return;
    }

    orbiter.particles.origin.x = orbiter.x;
    orbiter.particles.origin.y = orbiter.y;

    // calculate slope from orbiter to orbit origin
    dx = x - orbiter.particles.origin.x;
    dy = y - orbiter.particles.origin.y;

    // scale slope
    if (abs(dx) > abs(dy)){     // first scale to [-1, 1]
      dy /= abs(dx);
      dx /= abs(dx);
    }else{
      dx /= abs(dy)
      dy /= abs(dy);
    }

    // scale to map function
    dx = map(dx, -1, 1, -0.1, 0.1);
    dy = map(dy, -1, 1, -0.1, 0.1);

    // negative inverse for tangent
    direction = createVector(-dy, dx);

    orbiter.particles.addParticle(direction, orbiter.color);

    orbiter.particles.run();


    orbiter.rotation = orbiter.initRotation;
    orbiter.color = orbiter.initColor;
    orbiter.doFlare = true;

    orbiter.flareAge++;
  };

  orbiter.updateRotation = function(){
    orbiter.rotation += orbiter.delta;
  };

  return orbiter;
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
var Particle = function(position, direction, particleColor) {
  this.acceleration = direction;
  this.velocity = createVector(random(-1, 1), random(-1, 0));
  this.position = position.copy();
  this.lifespan = 100.0;
  this.particleColor = particleColor;
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
  //stroke(200, this.lifespan);
  //strokeWeight(2);
  noStroke();
  fill(adjustColorAlpha(this.particleColor, (this.lifespan / 100)));
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

ParticleSystem.prototype.addParticle = function(direction, particleColor) {
  this.particles.push(new Particle(this.origin, direction, particleColor));
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


////////////////////////////////////////////////////////////////////////////////////////////////
//
// Sounds
//

// Create hat
function createHat() {

  var noise, env;

  noise = new p5.Noise(); // other types include 'brown' and 'pink'
  noise.start();

  // multiply noise volume by 0
  // (keep it quiet until we're ready to make noise!)
  noise.amp(0);

  // set attackTime, decayTime, sustainRatio, releaseTime
  env = new p5.Env();

  return {
    play: function(pA, pB){
      env.set(0.001, pA, pB * 0.25, 0.1);
      env.play(noise);
    },
    destroy: function(){
      noise.stop();
      env.stop();

      delete noise;
      delete env;
    }
  }
}

// Create kick
function createKick() {
  function sub1() {
 
    var noise, env;
    osc = new p5.Oscillator(); // other types include 'brown' and 'pink'
    osc.setType('sine');

    // multiply noise volume by 0
    // (keep it quiet until we're ready to make noise!)
    osc.amp(0);

    // set attackTime, decayTime, sustainRatio, releaseTime
    env = new p5.Env();

    // play noise

    return{
      play: function(pA, pB){
        osc.freq(100+(80*pA));
        osc.start();
        env.set(0.001, 1, pB, 0.5);
        env.play(osc);
      }
    }
  }

  function sub2() {
 
    var noise, env, freq;

    freqEnvelope = new p5.Env(0.1, 1, 1, 1)

    osc = new p5.Oscillator(); // other types include 'brown' and 'pink'
    osc.setType('sine');
    osc.freq(freqEnvelope.decayTime);
    osc.amp(0);
    osc.start();

    // multiply noise volume by 0
    // (keep it quiet until we're ready to make noise!)
    osc.amp(0);

    // set attackTime, decayTime, sustainRatio, releaseTime
    env = new p5.Env(0.001, .5, .5, 0.1);

    // play noise
    env.play(osc);
  }

  function noise1() {
    var noise, env;

    noise = new p5.Noise(); // other types include 'brown' and 'pink'
    noise.start();

    // multiply noise volume by 0
    // (keep it quiet until we're ready to make noise!)
    noise.amp(0);

    // set attackTime, decayTime, sustainRatio, releaseTime
    env = new p5.Env(0.001, .2, .001, 0.1);

    // play noise
    return {
      play: function(pA, pB){
        env.play(noise);
      }
    }
  }

  subInst = sub1();
  noiseInst = noise1();
  ////sub2();
  //noise1();

  return {
    play: function(pA, pB){
      subInst.play(pA, pB);
      noiseInst.play(pA, pB);
    },
    destroy: function(){
      noise.stop();
      env.stop();

      delete noise;
      delete env;
    }
  }
}
