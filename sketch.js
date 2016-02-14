var univ = [];
var mySolarSystem = null;
var stars;
var planetBaseSpeed = null;

////////////////////////////////////////////////////////////////////////////////////////////////
//
// Socket.io
//

var SOCKET_URL = 'wss://fierce-plains-17880.herokuapp.com/';
var TEAM_NAME  = 'gastropub';
var socket;


var network = {

  setup: function () {
    // socket.io setup
    socket = io(SOCKET_URL + TEAM_NAME); // Open a socket connection to the server.

    this.onKeypress();
    this.onCurrentUniverse();
    this.sendJoined();
    this.onJoined();
  },
  onKeypress: function(){
    socket.on("keypress", function(systemID, key){
      for (var i=0; i< univ.length; i++){
        if (univ[i].id == systemID){
          system = univ[i];
        }
      }
      handleKeyPress(system, key)
    });
  },
  sendKeypress: function (key) {
    socket.emit("keypress", mySolarSystem.id, key);
  },
  sendJoined: function () {
    socket.emit("joined");
  },
  onJoined: function() {
    socket.on("joined", function(){
      network.sendCurrentUniverse();
    });
  },
  onCurrentUniverse: function () {
    socket.on("currentUniverse", function(currentUniverse){
      socket.off("currentUniverse");
      _.assign(univ, currentUniverse);
      for(var i=0; i< univ.length; i++){
        if (univ.id >= mySolarSystem.id){
          mySolarSystem.id = univ.id+1;
        }
      }

      // send mySolarSystem after getting currentUniverse
      socket.emit("newSolarSystem", mySolarSystem);
      //setup();
    });
  },
  sendCurrentUniverse: function() {
    //serialize
    _.assign(currentUniverse, univ);
    currentUniverse.push(mySolarSystem);
    socket.emit("currentUniverse", currentUniverse);
  }
}

//
// Socket.io
//
////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////
//
// Setup
//


// Preload sounds for planets
function preload() {
  drumKick2 = loadSound('assets/sounds/drums/drums_00.mp3');
  drumKick = loadSound('assets/sounds/drums/drums_01.mp3');
  drumSnare = loadSound('assets/sounds/drums/drums_02.mp3');
  drumHat = loadSound('assets/sounds/drums/drums_03.mp3');
  drumSnap = loadSound('assets/sounds/drums/drums_04.mp3');
  drumConga = loadSound('assets/sounds/drums/drums_05.mp3');
}

function rotationDelta(bars, bpm, fps){
  var beats, spb, revTime, frames;

  beats = bars * 4;
  spb = 60 / bpm;
  revTime = spb * beats;
  frames = revTime * fps;

  return (2 * PI / frames);
}

function setup() {
  planetBaseSpeed = rotationDelta(16, 120, 60);
  frameRate(60);

  createCanvas(windowWidth, windowHeight); // Use the full browser window
  mySolarSystem = createSolarSystem(
    {
      x: windowWidth / 2,
      y: windowHeight/2
    },
    {
      distanceFactor: 1,
      sizeFactor: 0.7
    },

    [{play: function(){}}, {play: function(){}}, {play: function(){}}, {play: function(){}}, {play: function(){}}]
  );

  network.setup();
  stars = generateStars(500, 1000, 4);
}

//
// Setup Helpers -------------------------------------------------------------------------------
//

function createSolarSystem(center, scale, sounds){
  var kick, snare, hat, synth, bass;
  var system = {
    center: center,
    scale: scale,
    planets: [],
    id: 0,
    zoomedOutScale: .2,
    normalScale: .7,
    zoomSpeed: .01,
    doZoom: false,
    zoomed: true
  }

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
    sounds.shift()
  );

  // add planet kick to univ
  system.planets.push(kick);


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
    sounds.shift()
  );

  // add planet kick to univ
  system.planets.push(hat);


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
      delta:8,
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
    sounds.shift()
  );

  // add planet snare to univ
  system.planets.push(snare);


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
      delta: 4,
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
    sounds.shift()
  );

  // add planet synth to univ
  system.planets.push(synth);

  // create planet bass
  // fifth ring
  bass = createPlanet({
      initRotation: 3*PI/2,
      delta: 1.7,
      radius: 40,
      rotationRadius: 760,
      color: "#E14242",
      flareDecay: 40
    },
    {
      initRotation: PI,
      delta: 4,
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
    sounds.shift()
  );

  // add planet bass to univ
  system.planets.push(bass);


  function drawSun(){
    var diameter = 100 * system.scale.sizeFactor;

    if (frameCount % 30 == 0){
      diameter = 115 * system.scale.sizeFactor;

      playAudioFile(drumKick);

      //fill("rgb(250, 250, 250)");
    } else {

    }

    fill('#FF9757 ');
    ellipse(system.center.x, system.center.y, diameter, diameter);

  }

  system.update = function(){
    for(i=0; i<system.planets.length; i++){
      planet = system.planets[i];

      planet.updateRotation();

      planet.checkPlaySound();

      // draw planet's orbiters
      planet.updateOrbiters(planet.x, planet.y, false);
    }
  }

  system.drawAndUpdate = function(){
    drawSun();

    for(i=0; i<system.planets.length; i++){
      planet = system.planets[i];

      // draw planet
      planet.draw(system.center.x, system.center.y, planet.mute, system.scale);
      planet.updateRotation();

      planet.checkPlaySound();

      // draw planet's orbiters
      planet.drawOrbiters(planet.x, planet.y, planet.mute, system.scale);
    }
  }

  system.zoom = function() {
    if (system.doZoom == true) {
      if (system.scale.sizeFactor > system.zoomedOutScale && system.zoomed == true)
      {
        system.scale.sizeFactor -= system.zoomSpeed;
        system.scale.distanceFactor -= system.zoomSpeed * 1.5;
      }
      else if (system.scale.sizeFactor < system.normalScale && system.zoomed == false)
      {
        system.scale.sizeFactor += system.zoomSpeed;
        system.scale.distanceFactor += system.zoomSpeed * 1.5;
      }
      else {
        system.doZoom = false;
        system.zoomed = !system.zoomed;
      }
    }
  }

  return system
}


function generateStars(minimum, maximum, maxRadius){
  var i, star;
  var stars = [];

  var starMaxRadius = maxRadius;

  i = random(minimum, maximum)

  for(i; i > 0; i--){
    star = {
      x: random(windowWidth),
      y: random(windowHeight),
      r: random(0.1, starMaxRadius),
      alpha: random(1, 255)
    }

    stars.push(star);
  }

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

  return {
    drawStars: function(){
      for (i=0; i < stars.length; i++){
        drawStar(stars[i]);
      }
    }
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
  if (handleKeyPress(mySolarSystem, key)){
    network.sendKeypress(key);
  }
}

function handleKeyPress(system, key){
  var didHandleKeypress = true;
  var planets = system.planets;

  switch(key){
    case "Q":
      if (!planets[0].mute){
        planets[0].createMoonAndSatellite();
      }
      break;
    case "W":
      if (!planets[1].mute) {
        planets[1].createMoonAndSatellite();
      }
      break;
    case "E":
      if (!planets[2].mute) {
        planets[2].createMoonAndSatellite();
      }
      break;
    case "R":
      if (!planets[3].mute) {
        planets[3].createMoonAndSatellite();
      }
      break;
    case "T":
      if (!planets[4].mute) {
        planets[4].createMoonAndSatellite()
      }
      break;
    case "A":
      planets[0].mute = !planets[0].mute;
      break;
    case "S":
      planets[1].mute = !planets[1].mute;
      break;
    case "D":
      planets[2].mute = !planets[2].mute;
      break;
    case "F":
      planets[3].mute = !planets[3].mute;
      break;
    case "G":
      planets[4].mute = !planets[4].mute;
      break;
    case "Z":
      planets[0].clearMoonsAndSatellites();
      break;
    case "X":
      planets[1].clearMoonsAndSatellites();
      break;
    case "C":
      planets[2].clearMoonsAndSatellites();
      break;
    case "V":
      planets[3].clearMoonsAndSatellites();
      break;
    case "B":
      planets[4].clearMoonsAndSatellites();
      break;
    case " ":
      mySolarSystem.doZoom = true;
      break;
    default:
      didHandleKeypress = false;
  }

  return didHandleKeypress;
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

  //draw refresher
  fill(0, 0, 0, 20)
  rect(0,0,windowWidth,windowHeight)

  stars.drawStars();

  mySolarSystem.drawAndUpdate();
  mySolarSystem.zoom();


}

//
// Draw Helpers -------------------------------------------------------------------------------
//



function createPlanet(options, moonOptions, satelliteOptions, sound){
  var planet, triggerRotation, mapParams;

  triggerRotation = PI;

  planet = createOrbiter(options);
  planet.moons = planet.orbiters;
  _.assign(moonOptions, {rotation: triggerRotation});


  planet.mute = false;
  planet.sound = sound;

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

  planet.createMoonAndSatellite = function(){
    var options;
    var satellite;
    var moon;

    options = {};
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
    particles: new ParticleSystem(createVector(orbiter.x, orbiter.y, 12)),
    orbiters: [],
    x: 0,
    y: 0,
    doFlash: false
  };
  override = {
    radius: options.radius,        // scale orbiter's size and rotation radius by global scale factors
    rotationRadius: options.rotationRadius,
    delta: planetBaseSpeed * options.delta,
    color: orbiterColor,
    initColor: orbiterColor
  }
  _.assign(orbiter, defaults, options, override);

  orbiter.updateOrbiters = function(x, y, grayscale){
    var i, currentOrbiter;
    for (i = 0; i< orbiter.orbiters.length; i++){
      currentOrbiter = orbiter.orbiters[i];

      currentOrbiter.updateRotation();

      if (currentOrbiter.orbiters.length){
        currentOrbiter.updateOrbiters(currentOrbiter.x, currentOrbiter.y, false, grayscale)
      }
    }
  }

  orbiter.drawOrbiters = function(x, y, grayscale, scale){
    var i, currentOrbiter;
    for (i = 0; i< orbiter.orbiters.length; i++){
      currentOrbiter = orbiter.orbiters[i];
      currentOrbiter.draw(x, y, grayscale, scale);
      currentOrbiter.updateRotation();

      if (currentOrbiter.orbiters.length){
        currentOrbiter.drawOrbiters(currentOrbiter.x, currentOrbiter.y, grayscale, scale)
      }
    }
  };

  orbiter.draw = function(x, y, grayscale, scale){
    var pt;

    if (orbiter.doFlare){
      orbiter.drawFlare(x, y, scale.sizeFactor * 12);
    }

    fill(orbiter.color);

    if (grayscale){
      fill("rgb(200, 200, 200)");
    }

    if (orbiter.doFlash){
      fill("rgb(250, 250, 250)");
    }

    noStroke();

    pt = getOrbitPos(x, y, orbiter.rotationRadius * scale.distanceFactor, orbiter.rotation);

    orbiter.x = pt.x;
    orbiter.y = pt.y;

    drawCircle(orbiter.x, orbiter.y, orbiter.radius  * scale.sizeFactor);
  };

  orbiter.drawFlare = function(x, y, size){
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

    orbiter.particles.addParticle(direction, orbiter.color, size);

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
var Particle = function(position, direction, particleColor, size) {
  this.size = size;
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
  ellipse(this.position.x, this.position.y, this.size, this.size);
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

ParticleSystem.prototype.addParticle = function(direction, particleColor, size) {
  this.particles.push(new Particle(this.origin, direction, particleColor, size));
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

// Test for audio file playback
function playAudioFile (sound, pA, pB) {
  sound.setVolume(0.1);
  sound.playMode('sustain');
  sound.play();
}

// Create hat
function createHat() {
playAudioFile(drumHat);
    
  
}
