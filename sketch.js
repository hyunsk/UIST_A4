var univ = [];
var mySolarSystem = null;
var stars;
var planetBaseSpeed = null;
var sounds = [];
var masterSound = null;
var sunSound = null;
var keyboardDisabled = false;
var fps = 60;
var bpm = 120;
var spb = 1 / (bpm / 60);
var fpb = framesPerBeat();

var univId = 0;

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
    //this.onCurrentUniverse();
    //this.sendJoined();
    //this.onJoined();
    //this.onNewSolarSystem();
  },
  onKeypress: function(){
    socket.on("keypress", function(systemID, key){
      var system;
      //for (var i=0; i< univ.length; i++){
      //  if (univ[i].id == systemID){
      //    system = univ[i];
      //  }
      //}
      if (systemID == univId){
        system = mySolarSystem;
        handleKeyPress(system, key);
      }
    });
  },
  sendKeypress: function (key) {
    socket.emit("keypress", mySolarSystem.id, key);
  },
  sendJoined: function () {
    console.log("I joined")
    socket.emit("joined");
  },
  onJoined: function() {
    socket.on("joined", function(){
      console.log("someone joined")
      network.sendCurrentUniverse();
    });
  },
  sendNewSolarSystem: function() {
    socket.emit("newSolarSystem", mySolarSystem.exportState());
  },
  onNewSolarSystem: function(){
    socket.on("newSolarSystem", function(system){
      createFriendsSystem(system);
    });
  },
  onCurrentUniverse: function () {
    socket.on("currentUniverse", function(currentState){
      socket.off("currentUniverse");
      var mySystemId = 0;

      _(currentState).forEach(function(system){
        if (system.id >= mySystemId){
          mySystemId = system.id+1;
        }
      });

      setupUniverse(mySystemId, currentState);

      // send mySolarSystem after getting currentUniverse
      network.sendNewSolarSystem();
    });
  },
  sendCurrentUniverse: function() {
    //serialize
    var currentUniverse = [];
    _(univ).forEach(function(system){
      currentUniverse.push(system.exportState());
    });
    currentUniverse.push(mySolarSystem.exportState());
    console.log("sent current univ state");
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

function preload() {
  createMasterSound();
  loadSounds();
}

function rotationDelta(bars){
  var beats, spb, revTime, frames;

  beats = bars * 4;
  spb = 60 / bpm;
  revTime = spb * beats;
  frames = revTime * fps;

  return (2 * PI / frames);
}

function setup() {
  planetBaseSpeed = rotationDelta(16);
  frameRate(fps);

  createCanvas(windowWidth, windowHeight); // Use the full browser window

  mySolarSystem = createSolarSystem(
    0,
    {
      x: windowWidth / 2,
      y: windowHeight/2
    },
    {
      distanceFactor: 0.7,
      sizeFactor: 0.7
    },
    0,
    generatePlanetsSettings(0)
  );


  network.setup();
  stars = generateStars(500, 1000, 4);
}



//
// Configuration -------------------------------------------------------------------------------
//

function createMasterSound(){
  filter = new p5.BandPass();
  masterSound = {
    set: function(freq, res){
      filter.freq(freq);
      filter.res(res);
    },
    sound: filter
  };
}

function loadSounds() {
  var soundNames = ["drums", "bass", "melody", "lead", "pad"];

  sunSound = createSound(null, null, {
    soundObj: loadSound("assets/sounds/drums/drums_00.mp3"),
    volume: 0.05
  });

  for (var i=0; i< soundNames.length; i++){
    for (var j=1; j<=5; j++){
      if (!_.isArray(sounds[i])){
        sounds[i] = [];
      }
      sounds[i][j-1] = loadSound("assets/sounds/" + soundNames[i] + "/" + soundNames[i] + "_0" + j + ".mp3");
    }
  }
}

function generatePlanetsSettings(colorSet){

  console.log("generate planet settings", colorSet);
  var planetsSettings = [];

  var colors = [[ "#106EE8", "#0FC1A1", "#90E0AB",
                  "#37B7B5", "#A0E4E0", "#C7F6F5",
                  "#59A27A", "#FACADE", "#FACADE",
                  "#A56CC1", "#A6ACEC", "#ACE7EF",
                  "#E14242", "#EACD65", "#8D3434"],

                [ "#D3D4D8", "#D3D4D8", "#D3D4D8",
                  "#F5F5F5", "#F5F5F5", "#F5F5F5",
                  "#4D606E", "#4D606E", "#4D606E",
                  "#D3D4D8", "#4D606E", "#F5F5F5",
                  "#083D56", "#F5F5F5", "#D3D4D8"],

                [ "#ABD4C1", "#E5F6C6", "#D3D4D8",
                  "#7E858B", "#ABD4C1", "#F5F5F5",
                  "#4D606E", "#4D606E", "#5D414D",
                  "#E5F6C6", "#4D606E", "#F5F5F5",
                  "#5D414D", "#F5F5F5", "#ABD4C1"],

                [ "#C98B70", "#F8E796", "#F8E796",
                  "#F8E796", "#F5F5F5", "#F8E796",
                  "#635270", "#F8E796", "#4D606E",
                  "#0E5F76", "#0E5F76", "#F5F5F5",
                  "#363863", "#635270", "#0E5F76"],

                [ "#82656D", "#D3D4D8", "#D3D4D8",
                  "#92A7E0", "#F5F5F5", "#F5F5F5",
                  "#5A525E", "#4D606E", "#4D606E",
                  "#343156", "#4D606E", "#F5F5F5",
                  "#283D4C", "#F5F5F5", "#D3D4D8"],

                [ "#D6EEFF", "#D3D4D8", "#D3D4D8",
                  "#343156", "#F5F5F5", "#F5F5F5",
                  "#6A7062", "#4D606E", "#4D606E",
                  "#AAADC4", "#4D606E", "#F5F5F5",
                  "#8D909B", "#F5F5F5", "#D3D4D8"]];

  var i = 0;



  planetsSettings.push({
    planet: {
      rotation: 0,
      delta: 1,
      radius: 8,
      rotationRadius: 150,
      color: colors[colorSet][i++],
      flareDecay: 10
    },
    moon: {
      rotation: PI,
      delta: 8,
      radius: 3,
      rotationRadius: 40,
      color: colors[colorSet][i++],
      flareDecay: 0
    },
    satellite: {
      rotation: 0,
      delta: 1.8,
      radius: 2,
      rotationRadius: 25,
      color: colors[colorSet][i++],
      flareDecay: 0
    }
  });

  planetsSettings.push({
    planet: {
      rotation: PI/2,
      delta: 4,
      radius: 12,
      rotationRadius: 270,
      color: colors[colorSet][i++],
      flareDecay: 10
    },
    moon: {
      rotation: PI,
      delta: 8,
      radius: 3,
      rotationRadius: 50,
      color: colors[colorSet][i++],
      flareDecay: 0
    },
    satellite: {
      rotation: 0,
      delta: 2,
      radius: 1,
      rotationRadius: 15,
      color: colors[colorSet][i++],
      flareDecay: 0
    }
  });

  planetsSettings.push({
    planet: {
      rotation: PI,
      delta: 4,
      radius: 16,
      rotationRadius: 380,
      color: colors[colorSet][i++],
      flareDecay: 10
    },
    moon: {
      rotation: PI,
      delta:8,
      radius: 4,
      rotationRadius: 40,
      color: colors[colorSet][i++],
      flareDecay: 0
    },
    satellite: {
      rotation: 0,
      delta: 5,
      radius: 4,
      rotationRadius: 20,
      color: colors[colorSet][i++],
      flareDecay: 0
    }
  });

  planetsSettings.push({
    planet: {
      rotation: 3*PI/2,
      delta: 2,
      radius: 30,
      rotationRadius: 560,
      color: colors[colorSet][i++],
      flareDecay: 35
    },
    moon: {
      rotation: PI,
      delta: 8,
      radius: 6,
      rotationRadius: 50,
      color: colors[colorSet][i++],
      flareDecay: 0
    },
    satellite: {
      rotation: 3*PI/2,
      delta: 4,
      radius: 8,
      rotationRadius: 100,
      color: colors[colorSet][i++],
      flareDecay: 0
    }
  });


  planetsSettings.push({
    planet: {
      rotation: 3*PI/2,
      delta: 1.7,
      radius: 26,
      rotationRadius: 760,
      color: colors[colorSet][i++],
      flareDecay: 40
    },
    moon: {
      rotation: PI,
      delta: 8,
      radius: 10,
      rotationRadius: 150,
      color: colors[colorSet][i++],
      flareDecay: 0
    },
    satellite: {
      rotation: 3*PI/2,
      delta: 4,
      radius: 6,
      rotationRadius: 40,
      color: colors[colorSet][i++],
      flareDecay: 0
    }
  });

  return planetsSettings;
}


//
// Setup Helpers -------------------------------------------------------------------------------
//

function setupUniverse(mySystemId, currentState){

  mySolarSystem.id = mySystemId;
  mySolarSystem.updateSounds(mySystemId % sounds.length);

  _(currentState).forEach(function(system){
    createFriendsSystem(system);
  })
}

function createFriendsSystem(system){
  var x = randomGaussian(windowWidth/4, windowWidth/12);
  var y = randomGaussian(windowHeight/4, windowHeight/12);
  if (random()>0.5){
    x += windowWidth/2;
  }

  if (random()>0.5){
    y += windowHeight/2;
  }

  var sizeFactor = randomGaussian(1, 0.2);

  var obj = createSolarSystem(
    system.id,
    {
      x: x,
      y: y
    },
    {
      distanceFactor: 0.1 * sizeFactor,
      zoomTarget: 0.15 * sizeFactor,
      sizeFactor: 0.06 * sizeFactor
    },
    system.id % sounds.length,
    generatePlanetsSettings(system.id % sounds.length + 1),
    system,
    false
  );

  univ.push(obj);
}

function createSound(soundIndex, noteIndex, options){
  var sound, filter, delay;

  filter = new p5.BandPass();
  delay = new p5.Delay();

  if (_.isUndefined(options.soundObj)){
    sound = sounds[soundIndex][noteIndex];
  }else{
    sound = options.soundObj;
  }

  sound.setVolume(options.volume);
  sound.playMode('sustain');

  sound.disconnect();

  switch(soundIndex){
    case 0:
      if (noteIndex == 2){
        sound.connect(masterSound.sound);
      }else{
        sound.connect(delay);
        sound.setVolume(1);
        delay.connect(masterSound.sound);
        delay.delayTime(spb);
        delay.amp(1);
      }
      break;
    case 1:
      sound.connect(masterSound.sound);
      break;
    case 2:
      sound.connect(masterSound.sound);
      break;
    case 3:
      sound.connect(masterSound.sound);
      break;
    case 4:
      sound.connect(masterSound.sound);
      break;
    default:
      sound.connect(masterSound.sound);
  }

  function updateEffects(pA, pB){
    switch(soundIndex){
      case 0:
        var pan = map(pA, 0, 1, -0.7, 0.7);
        delay.feedback(map(pB, 0, 1, 0.1, 0.25));
        sound.pan(pan);
        break;
      default:
        var pan = map(pA, 0, 1, -0.7, 0.7);
        sound.pan(pan);
        break;
    }
  }



  return {
    play: function(pA, pB){
      if (_.isNumber(pA) && _.isNumber(pB)){
        updateEffects(pA, pB);
      }
      sound.play();
    }
  }

}


function createSolarSystem(id, center, scale, soundIndex, planetsSettings, currentState, isClientsSystem){
  var planet;
  scale.normalSizeFactor = scale.sizeFactor;
  scale.zoomSpeed = 0.01;
  scale.doZoom = false;
  scale.zoomed = false;
  if(_.isUndefined(scale.zoomTarget)){
    scale.zoomTarget = 0.4;
  }
  if(_.isUndefined(isClientsSystem)){
    isClientsSystem = true;
  }

  console.log("colorSet", (isClientsSystem && 0)||(soundIndex + 1) );

  var colorSet = 0;
  if(!isClientsSystem){
    colorSet = soundIndex+1;
  }

  var system = {
    center: center,
    scale: scale,
    planets: [],
    id: id,
    isClientsSystem: isClientsSystem,
    soundIndex: soundIndex,
    colorSet: colorSet
  }


  for(var i=0; i< planetsSettings.length; i++){
    planet = createPlanet(planetsSettings[i], createSound(soundIndex, i, {volume: 0.2}));
    system.planets.push(planet);
  }

  if (!_.isUndefined(currentState)){
    loadCurrentState(currentState);
  }

  function loadCurrentState(currentState){
    _(currentState.planets).forEach(function(planet, i){
      var systemPlanet = system.planets[i];
      systemPlanet.rotation = planet.rotation;
      systemPlanet.mute = planet.mute;
      _(planet.orbiters).forEach(function(moon, j){
        systemPlanet.createMoonAndSatellite(moon)
      });
    });
  }

  function drawSun(){

    var colors = ["#FF9757", "#3FBAC2", "#E5F6C6", "#F8E796", "#5A525E", "#6A7062"];
    var diameter = 100 * system.scale.sizeFactor;

    if (frameCount % fpb == 0){
      diameter = 115 * system.scale.sizeFactor;

      if (system.isClientsSystem){
        sunSound.play();
      }
    }

    fill(colors[system.colorSet]);
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
  };

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
  };

  system.updateSounds = function(index){
    system.soundIndex = index;
    _(system.planets).forEach(function(planet, i){
      planet.sound = createSound(index, i, {volume: 0.2});
    })
  }

  system.zoom = function() {
    var target;
    if (system.scale.doZoom == true) {

      if (system.scale.zoomed){
        target = system.scale.normalSizeFactor;
      }else{
        target = system.scale.zoomTarget;
      }

      if (system.scale.sizeFactor != target){
        var delta = system.scale.zoomSpeed;
        if (system.scale.sizeFactor > target){
          delta = -delta;
        }
        system.scale.sizeFactor += delta;
        system.scale.distanceFactor += delta * 1.5;

        if(delta < 0){
          if (system.scale.sizeFactor <= target){
            system.scale.sizeFactor = target;
            system.scale.doZoom = false;
            system.scale.zoomed = !system.scale.zoomed;
          }
        }else{
          if (system.scale.sizeFactor >= target){
            system.scale.sizeFactor = target;
            system.scale.doZoom = false;
            system.scale.zoomed = !system.scale.zoomed;
          }
        }
      }
    }
  };

  system.exportState = function(){
    var state = {
      soundIndex: system.soundIndex,
      id: system.id,
      planets: []
    }

    for(var i=0; i < system.planets.length; i++){
      var planet = system.planets[i];
      var planetData = {
        rotation: planet.rotation,
        mute: planet.mute,
        orbiters: []
      }

      for(var j= 0; j < planet.orbiters.length; j++){
        var moon = planet.orbiters[j];
        var moonData = {
          rotation: moon.rotation,
          orbiters: []
        }

        if (moon.orbiters.length){
          moonData.orbiters.push({rotation: moon.orbiters[0].rotation});
        }

        planetData.orbiters.push(moonData);
      }

      state.planets.push(planetData);
    }

    return state;
  };

  return system;
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
  if (keyboardDisabled){
    return;
  }
  if (handleKeyPress(mySolarSystem, key)){
    network.sendKeypress(key);
  }
}

function handleKeyPress(system, key){
  var sendKeypress = true;
  if(_.isUndefined(system.planets)){
    return;
  }
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
      mySolarSystem.scale.doZoom = true;

      _(univ).forEach(function(system){
        system.scale.doZoom = true;
      });
      sendKeypress = false;
      break;
    default:
      sendKeypress = false;
  }

  return sendKeypress;
}

function handleMouseToMasterSound(){
  var freq = map(mouseX, 0, width, 20, 10000);

  var res = map(mouseY, height / 4, 3 * height / 4, 0, 3);

  masterSound.set(freq, res)
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

  _(univ).forEach(function(system){
    system.drawAndUpdate();
    system.zoom();
  });

  handleMouseToMasterSound();
}

//
// Draw Helpers -------------------------------------------------------------------------------
//

function framesPerBeat(){
  var bps = bpm / 60;
  return fps / bps;
}



function createPlanet(opt, sound){
  var planet, triggerRotation, mapParams;

  triggerRotation = PI;

  planet = createOrbiter(opt.planet);
  planet.moons = planet.orbiters;
  _.assign(opt.moon, {rotation: triggerRotation});


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

  planet.createMoonAndSatellite = function(currentState){
    var options;
    var satellite;
    var moon;

    options = {};
    _.assign(options, opt.satellite, {rotation: random(0, 2*PI)});

    if(_.isObject(currentState)){
      options.rotation = currentState.rotation;
    }

    satellite = createOrbiter(options);

    _.assign(options, opt.moon, {rotationRadius: opt.moon.rotationRadius * random(1, 2)});

    if(_.isObject(currentState)){
      options.rotation = currentState.orbiters[0].rotation;
    }


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
    initRotation: options.rotation,
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