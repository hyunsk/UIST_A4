var SOCKET_URL = 'wss://fierce-plains-17880.herokuapp.com/';
var TEAM_NAME  = 'gastropub';
var socket;

var local_id = 0;


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
      console.log(msg);
    })
  }
}

function setup(){
  network.setup();
}

function draw() {

}

function deviceOrientationIsAtPlane(plane){
  // takes a plane and returns true or false if the device orientation matches roughly
  var isAtPlane = false;

  switch(plane){
    case "x":
      break;
    case "y":
      break;
    case "z":
      break;
  }

  return isAtPlane;
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


