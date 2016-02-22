var SOCKET_URL = 'wss://fierce-plains-17880.herokuapp.com/';
var TEAM_NAME = 'gastropub';
var socket;

var baseRotZ = null;
var setBaseRot = false;
var previousAngle = null;
var angleLimits = [];  // stores Z rotation angle limits in this array
var angleRangeInvert = []; // stores booleans of whether the range contains 359-1 break
var triggeredSound = false;
var triggeredFrameCount;

var univId = 3;


var network = {
  setup: function () {
    socket = io(SOCKET_URL + TEAM_NAME); // Open a socket connection to the server.
    this.onDebug();
  },
  onDebug: function () {
    socket.on("debug", function (id, msg) {
      if (univId == id) {
        console.log(msg);
      }

    })
  },
  sendDebug: function (msg) {
    socket.emit("debug", univId, msg);
  }
}

function setup() {
  network.setup();
  createCanvas(windowWidth, windowHeight); // Use the full browser window
  setShakeThreshold(10);
}

function draw() {
  var currentAngle = null;
  clear();

  // checks if rotation is initialized, then sets base Z rotation once
  if (rotationZ != 0 && setBaseRot == false) {
    baseRotZ = rotationZ;
    network.sendDebug("baseRotZ = " + baseRotZ)
    setupAngles();
    setBaseRot = true;
  }

  // sets each new note only once
  currentAngle = _.isUndefined(mapDeviceAngle()) ? currentAngle : mapDeviceAngle();
  if (_.isNumber(currentAngle)) {
    previousAngle = currentAngle;
  }

  if (triggeredSound) {
    fillWindow(null, true);
  }else{
    if(_.isNumber(previousAngle)) {
      fillWindow(previousAngle, false);
    }
  }

  textSize(50);
  textAlign(CENTER);
  fill("#dfdfdf");
  //text(rotationZ, (windowWidth / 2), 100);

  var delayAmount = 1;

  if (frameCount > triggeredFrameCount + delayAmount) {
    triggeredSound = false;
  }

  mapRotationToFilter();
}

function mapRotationToFilter() {
  if (!touchIsDown) {
    return;
  }
  fill("#393E46");
  rect(0, 0, windowWidth, windowHeight);

  textSize(40);
  textAlign(CENTER);
  fill("#dfdfdf");
  text("filter", windowWidth / 2, 100);

  var rotY = rotationY;
  var rotX = rotationX;

  rotY = (rotY < -60) ? -60 : rotY;
  rotY = (rotY > 60) ? 60 : rotY;
  rotX = (rotX < -60) ? -60 : rotX;
  rotX = (rotX > 60) ? 60 : rotX;


  var x = map(rotY, -70, 70, 0, windowWidth);
  var y = map(rotX, -60, 60, 0, windowHeight);
  var freqNorm = map(rotationY, -70, 70, 0, 1);
  var resNorm = map(rotationX, -60, 60, 1, 0);


  fill("#dfdfdf");
  ellipse(x, y, 40, 40);

  socket.emit("filter", univId, freqNorm, resNorm);
}


function deviceShaken() {
  var key;

  var keyBoard = ['Q', 'W', 'E', 'R', 'T'];


  key = keyBoard[previousAngle];


  if (!triggeredSound) {
    if (touchIsDown) {
      return;
    }

    socket.emit("keypress", univId, key);
    triggeredSound = true;
    triggeredFrameCount = frameCount;

    textSize(100);
    textAlign(CENTER);
    fill("#dfdfdf");
    text("SHAKE", windowWidth / 2, 100);
  }
}

function fillWindow(i, isHit) {
  if (_.isUndefined(i)) {
    return;
  }

  var colors = [
    "#106EE8",
    "#37B7B5",
    "#59A27A",
    "#A56CC1",
    "#E14242"];

  if (isHit) {
    fill("#FFFFFF");
  } else {
    fill(colors[i]);
  }

  rect(0, 0, windowWidth, windowHeight);
}

function deviceOrientationIsFlat() {
  // takes a plane and returns true or false if the device orientation matches roughly
  if (rotationY < -10 || rotationY > 10) {
    return false;
  } else {
    return true;
  }
}

function setupDeviceShaken() {
  // setup device shake threshold

}

function setupAngles() {
  var intervalAmount = 40; // set size of interval angle range
  var intervalMultiplier = 2.5; // used to calculate the interval values

  // set up interval values and stores in array
  for (var i = 0; i < 6; i++) {
    angleLimits[i] = (baseRotZ - 2.5 * intervalAmount) + i * intervalAmount;
    if (angleLimits[i] < 0) {
      angleLimits[i] = angleLimits[i] + 360;
    }
    if (angleLimits[i] > 360) {
      angleLimits[i] = angleLimits[i] - 360;
    }
  }

  // tests to see if any ranges contain the 359-1 break, true if it does
  for (var i = 0; i < 5; i++) {
    if (angleLimits[i] > angleLimits[i + 1]) {
      angleRangeInvert[i] = true;
    }
    else {
      angleRangeInvert[i] = false;
    }
  }
}

function mapDeviceAngle() {
// reads angle ranges and compares current rotation to the range limits
// outputs a note

  if (!angleRangeInvert[0]) {
    if (rotationZ > angleLimits[0] && rotationZ < angleLimits[1]) {
      return 4;
    }
  }
  else if (angleRangeInvert[0]) {
    if (rotationZ > angleLimits[0] || rotationZ < angleLimits[1]) {
      return 4;
    }
  }

  if (!angleRangeInvert[1]) {
    if (rotationZ > angleLimits[1] && rotationZ < angleLimits[2]) {
      return 3;
    }
  }
  else if (angleRangeInvert[1]) {
    if (rotationZ > angleLimits[1] || rotationZ < angleLimits[2]) {
      return 3;
    }
  }

  if (!angleRangeInvert[2]) {
    if (rotationZ > angleLimits[2] && rotationZ < angleLimits[3]) {
      return 2;
    }
  }
  else if (angleRangeInvert[2]) {
    if (rotationZ > angleLimits[2] || rotationZ < angleLimits[3]) {
      return 2;
    }
  }

  if (!angleRangeInvert[3]) {
    if (rotationZ > angleLimits[3] && rotationZ < angleLimits[4]) {
      return 1;
    }
  }
  else if (angleRangeInvert[3]) {
    if (rotationZ > angleLimits[3] || rotationZ < angleLimits[4]) {
      return 1;
    }
  }

  if (!angleRangeInvert[4]) {
    if (rotationZ > angleLimits[4] && rotationZ < angleLimits[5]) {
      return 0;
    }
  }
  else if (angleRangeInvert[4]) {
    if (rotationZ > angleLimits[4] || rotationZ < angleLimits[5]) {
      return 0;
    }
  }
}

function mapDeviceAcceleration(axis) {
  // takes a axis and maps it to 0-1

}


