var SOCKET_URL = 'wss://fierce-plains-17880.herokuapp.com/';
var TEAM_NAME  = 'gastropub';
var socket;
var local_id = 1;




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
    socket.emit("debug", local_id, msg)
  }
}

function setup(){
  network.setup();
}

function draw() {

}
  

function deviceShaken(){
  network.sendDebug("hello");
}

function fillWindow(i, isHit) {

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

function mapDeviceAngle(){
  // reads device angle and outputs 0-4 for note

}

function mapDeviceAcceleration(axis){
  // takes a axis and maps it to 0-1

}


