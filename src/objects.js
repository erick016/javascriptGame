//--- The sprite object

var spriteObject =
{
  img: null,
  sourceX: 0,
  sourceY: 0,
  sourceWidth: 32,
  sourceHeight: 32,
  width: 32,
  height: 32,
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  visible: true,

  
  //Physics properties
  accelerationX: 0, 
  accelerationY: 0,
  speed: 0, 
  speedLimit: 2,
  friction: 0.96,
  bounce: -0.7,
  gravity: 0.3,
  rotation: 0,
  angle:0,
  
  earthAngle:0,
  earthDistance:0,
  earthXComponent:0,
  earthYComponent:0,
  vxEg: 0,
  vyEg:0,
  
  marsAngle:0,
  marsDistance:0,
  marsXComponent:0,
  marsYComponent:0,
  vxMg: 0,
  vyMg:0,
  
  vxTh: 0,
  vyTh:0,
  
  //Getters
  centerX: function()
  {
    return this.x + (this.width / 2);
  },
  centerY: function()
  {
    return this.y + (this.height / 2);
  },
  halfWidth: function()
  {
    return this.width / 2;
  },
  halfHeight: function()
  {
    return this.height / 2;
  }
};

var gameWorld = 
{
  x: 0,
  y: 0,
  width: 2560,
  height: 1920
};

var camera = 
{
  x: 0,
  y: 0,
  width: 640,
  height: 480
};

var messageObject =
{
  x: 0,
  y: 0,
  visible: true,
  text: "",
  font: "normal bold 20px Helvetica",
  fillStyle: "red",
  textBaseline: "top"
};

