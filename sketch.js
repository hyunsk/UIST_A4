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

function setup() {
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

  planetBaseSpeed = PI  / 200;

  // create planet kick
  // first ring
  kick = createOrbiter({
    initRotation: 0,
    delta: 1,
    radius: 8,
    rotationRadius: 150,
    color: "#106EE8",
    flareDecay: 10
  });
  // create planet kick's moons
  kick.orbiters.push(
    createOrbiter({
      initRotation: 0,
      delta: 2.2,
      radius: 2,
      rotationRadius: 20,
      color: "#0FC1A1",
      flareDecay: 1
    })
  );
  kick.orbiters.push(
    createOrbiter({
      initRotation: 0,
      delta: 1.8,
      radius: 3,
      rotationRadius: 25,
      color: "#90E0AB",
      flareDecay: 1
    })
  );

  kick.orbiters.push(
    createOrbiter({
      initRotation: 0,
      delta: 1,
      radius: 1,
      rotationRadius: 32,
      color: "#CBFFCE",
      flareDecay: 1
    })
  );

  // set planet kick orbit color
  orbitPathColors.push("#E5FCC2");
  // add planet kick to univ
  univ.push(kick);


  // create planet hat
  // second ring
  hat = createOrbiter({
    initRotation: PI/2,
    delta: 1,
    radius: 12,
    rotationRadius: 270,
    color: "#37B7B5",
    flareDecay: 10
  });

  // create planet kick's moons
  hat.orbiters.push(
    createOrbiter({
      initRotation: 0,
      delta: 3,
      radius: 3,
      rotationRadius: 30,
      color: "#A0E4E0",
      flareDecay: 0
    })
  );
  hat.orbiters.push(
    createOrbiter({
      initRotation: 0,
      delta: 2,
      radius: 5,
      rotationRadius: 45,
      color: "#C7F6F5",
      flareDecay: 0
    })
  );
  // set planet kick orbit color
  orbitPathColors.push("#9DE0AD");
  // add planet kick to univ
  univ.push(hat);


  // create planet snare
  // third ring
  snare = createOrbiter({
    initRotation: PI,
    delta: 1.4,
    radius: 16,
    rotationRadius: 380,
    color: "#59A27A",
    flareDecay: 10
  });
  // create planet snare's moons
  snare.orbiters.push(
    createOrbiter({
      initRotation: 0,
      delta: 5,
      radius: 4,
      rotationRadius: 40,
      color: "#FACADE",
      flareDecay: 0
    })
  );

  // set planet snare's orbit color
  orbitPathColors.push("#45ADA8");
  // add planet snare to univ
  univ.push(snare);


  // create planet synth
  // fourth ring
  synth = createOrbiter({
    initRotation: 3*PI/2,
    delta: 0.5,
    radius: 30,
    rotationRadius: 560,
    color: "#A56CC1",
    flareDecay: 35
  });

  // create planet synth's moons
  tempOrbiter = createOrbiter({
    initRotation: 3*PI/2,
    delta: 2,
    radius: 6,
    rotationRadius: 50,
    color: "#A6ACEC",
    flareDecay: 0
  });

  tempOrbiter.orbiters.push(
    createOrbiter({
      initRotation: 3*PI/2,
      delta: 4,
      radius: 8,
      rotationRadius: 100,
      color: "#ACE7EF",
      flareDecay: 0
    })
  );

  synth.orbiters.push(tempOrbiter);

  synth.orbiters.push(
    createOrbiter({
      initRotation: 0,
      delta: 2.5,
      radius: 12,
      rotationRadius: 120,
      color: "#ACE7EF",
      flareDecay: 0
    })
  );
  // set planet synth orbit color
  orbitPathColors.push("#547980");
  // add planet synth to univ
  univ.push(synth);

  // create planet bass
  // fifth ring
  bass = createOrbiter({
      initRotation: 3*PI/2,
      delta: 0.2,
      radius: 40,
      rotationRadius: 760,
      color: "#E14242",
      flareDecay: 40
  });

  // create planet bass' moons
  tempOrbiter = createOrbiter({
    initRotation: 3*PI/2,
    delta: 1.2,
    radius: 10,
    rotationRadius: 150,
    color: "#EACD65",
    flareDecay: 0
  });

  tempOrbiter.orbiters.push(
    createOrbiter({
      initRotation: 3*PI/2,
      delta: 4,
      radius: 6,
      rotationRadius: 40,
      color: "#8D3434",
      flareDecay: 0
    })
  );

  bass.orbiters.push(
    tempOrbiter
  );
  bass.orbiters.push(
    createOrbiter({
      initRotation: 0,
      delta: 1,
      radius: 10,
      rotationRadius: 80,
      color: "#EBEBCD",
      flareDecay: 0
    })
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


    // trigger flare
    doFlare = isAtOrbitRotation(PI/2, planet);

    //doFlare = false;      // remove flares for now

    // draw planet
    planet.draw(x, y, doFlare);
    planet.updateRotation();

    // draw planet's orbiters
    planet.drawOrbiters(planet.x, planet.y, false);
  }





  frameRate();

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
    y: 0
  };
  override = {
    radius: options.radius * orbiterSizeScaleFactor,        // scale orbiter's size and rotation radius by global scale factors
    rotationRadius: options.rotationRadius * orbitScaleFactor,
    delta: planetBaseSpeed * options.delta,
    color: orbiterColor,
    initColor: orbiterColor
  }
  _.assign(orbiter, defaults, options, override);

  orbiter.drawOrbiters = function(x, y, doFlare){
    var i, currentOrbiter;
    for (i = 0; i< orbiter.orbiters.length; i++){
      currentOrbiter = orbiter.orbiters[i];
      currentOrbiter.draw(x, y, doFlare);
      currentOrbiter.updateRotation();

      if (currentOrbiter.orbiters.length){
        currentOrbiter.drawOrbiters(currentOrbiter.x, currentOrbiter.y, false)
      }
    }
  };

  orbiter.draw = function(x, y, doFlare){
    var pt;

    if (doFlare){
      orbiter.doFlare = true;
    }

    if (orbiter.doFlare){
      orbiter.drawFlare(x, y);
    }

    fill(orbiter.color);
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

