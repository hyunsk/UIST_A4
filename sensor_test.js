var SOCKET_URL = 'wss://fierce-plains-17880.herokuapp.com/';
var TEAM_NAME  = 'gastropub';
var socket;

var baseRotZ = null;
var setBaseRot = false;
var previousAngle = -1;
var angleLimits = [];  // stores Z rotation angle limits in this array
var angleRangeInvert = []; // stores booleans of whether the range contains 359-1 break

var local_id = 15;




var network = {
  setup: function(){
    socket = io(SOCKET_URL + TEAM_NAME); // Open a socket connection to the server.
    this.onSense();
    this.onDebug();
  },
  sendSense: function(event){
    socket.emit("sense", local_id, event);
  },
  onSense: function(){
    socket.on("sense", function(local, event){
      if (local == local_id){
        console.log(event);
      }
    })
  },
  onDebug: function(){
    socket.on("debug", function(id, msg){
      if (local_id == id){
        console.log(msg);
      }

    })
  },
  sendDebug: function(msg){
    socket.emit("debug", local_id, msg);
  }
}

function setup(){
  network.setup();
  createCanvas(windowWidth, windowHeight); // Use the full browser window
}

function draw() {
    var currentAngle = null;
    // checks if rotation is initialized, then sets base Z rotation once
    if (rotationZ != 0 && setBaseRot == false)
    {
      baseRotZ = rotationZ;
      network.sendDebug("baseRotZ = " + baseRotZ)
      setupAngles();
      setBaseRot = true;
    }

    // sets each new note only once
    currentAngle = mapDeviceAngle();
    if (!_.isUndefined(currentAngle) && deviceOrientationIsFlat()) {
      previousAngle = currentAngle;
      fillWindow(previousAngle, false);
      network.sendDebug("current Angle " + previousAngle);
    }
}
  

function deviceShaken(){
  var key;

  var keyBoard = ['Q', 'W', 'E', 'R'];

  key = keyBoard[previousAngle];
  fillWindow(null, true);

  socket.emit("keypress", local_id, key);
}

function fillWindow(i, isHit) {
  if(_.isUndefined(i)){
    return;
  }

  var colors = [
    "#106EE8",
    "#37B7B5",
    "#59A27A",
    "#A56CC1",
    "#E14242"];

  if (isHit){
    fill("#FFFFFF");
  }else{
    fill(colors[i]);
  }

  rect(0, 0, windowWidth, windowHeight);
}

function deviceOrientationIsFlat(){
  // takes a plane and returns true or false if the device orientation matches roughly
  if (rotationY < -10 || rotationY > 10) {
    return false;
  } else {
    return true;
  }
}

function setupDeviceShaken(){
  // setup device shake threshold

}

function setupAngles() {
  var intervalAmount = 40; // set size of interval angle range
  var intervalMultiplier = 2.5; // used to calculate the interval values

  // set up interval values and stores in array
  for (var i = 0; i < 6; i++)
  {
      angleLimits[i] = (baseRotZ - 2.5*intervalAmount) + i * intervalAmount;
      if (angleLimits[i] < 0) {
        angleLimits[i] = angleLimits[i] + 360;
      }
      if (angleLimits[i] > 360) {
        angleLimits[i] = angleLimits[i] - 360;
      }
  }

  // tests to see if any ranges contain the 359-1 break, true if it does
  for (var i = 0; i < 5; i++)
  {
    if (angleLimits[i] > angleLimits[i+1])
    {
      angleRangeInvert[i] = true;
    }
    else
    {
      angleRangeInvert[i] = false;
    }
  }

  // console logs
  for (var i = 0; i < 6; i++)
  {
    network.sendDebug(angleLimits[i]);
  }
  for (var i = 0; i < 5; i++)
  {
    network.sendDebug(angleRangeInvert[i]);
  }
}

function mapDeviceAngle(){
// reads angle ranges and compares current rotation to the range limits
// outputs a note

  if (!angleRangeInvert[0])
  {
    if  (rotationZ > angleLimits[0] && rotationZ < angleLimits[1])
    {
      return 4;
    }
  }
  else if (angleRangeInvert[0])
  {
    if (rotationZ > angleLimits[0] || rotationZ < angleLimits[1])
    {
      return 4;
    }
  }

  if (!angleRangeInvert[1])
  {
    if  (rotationZ > angleLimits[1] && rotationZ < angleLimits[2])
    {
      return 3;
    }
  }
  else if (angleRangeInvert[1])
  {
    if (rotationZ > angleLimits[1] || rotationZ < angleLimits[2])
    {
      return 3;
    }
  }

  if (!angleRangeInvert[2])
  {
    if  (rotationZ > angleLimits[2] && rotationZ < angleLimits[3])
    {
      return 2;
    }
  }
  else if (angleRangeInvert[2])
  {
    if (rotationZ > angleLimits[2] || rotationZ < angleLimits[3])
    {
      return 2;
    }
  }

  if (!angleRangeInvert[3])
  {
    if  (rotationZ > angleLimits[3] && rotationZ < angleLimits[4])
    {
      return 1;
    }
  }
  else if (angleRangeInvert[3])
  {
    if (rotationZ > angleLimits[3] || rotationZ < angleLimits[4])
    {
      return 1;
    }
  }

  if (!angleRangeInvert[4])
  {
    if  (rotationZ > angleLimits[4] && rotationZ < angleLimits[5])
    {
      return 0;
    }
  }
  else if (angleRangeInvert[4])
  {
    if (rotationZ > angleLimits[4] || rotationZ < angleLimits[5])
    {
      return 0;
    }
  }
}

function mapDeviceAcceleration(axis){
  // takes a axis and maps it to 0-1

}


