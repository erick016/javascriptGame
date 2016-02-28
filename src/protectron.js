(function(){

//The canvas
var canvas = document.querySelector("canvas");

//Create the drawing surface 
var drawingSurface = canvas.getContext("2d");

//Arrays to store the game objects and assets to load
var sprites = [];
var assetsToLoad = [];

//Load background image
var bgImg = new Image();
bgImg.addEventListener("load", loadHandler, false);
bgImg.src = "../images/backg.png";
assetsToLoad.push(bgImg);

//Load the earth image
var earthImg = new Image();
earthImg.addEventListener("load", loadHandler, false);
earthImg.src = "../images/earth.png";
assetsToLoad.push(earthImg);

//Load the mars image
var marsImg = new Image();
marsImg.addEventListener("load", loadHandler, false);
marsImg.src = "../images/mars.png";
assetsToLoad.push(marsImg);

//Load the rocket image
var rocketImg = new Image();
rocketImg.addEventListener("load", loadHandler, false);
rocketImg.src = "../images/rocket.png";
assetsToLoad.push(rocketImg);

//Create the earthObj
var earthObj = Object.create(spriteObject);
earthObj.img = earthImg;
earthObj.x = 100;
earthObj.y = 100;
earthObj.sourceWidth = 339;
earthObj.sourceHeight = 342;
earthObj.width = 341;
earthObj.height = 341;
sprites.push(earthObj);

//Create the marsObj
var marsObj = Object.create(spriteObject);
marsObj.img = marsImg;
marsObj.x = 2000;
marsObj.y = 1500;
marsObj.sourceWidth = 181;
marsObj.sourceHeight = 181;
marsObj.width = 181;
marsObj.height = 181;
sprites.push(marsObj);

//Create the rocketObj
var rocketObj = Object.create(spriteObject);
rocketObj.img = rocketImg;
rocketObj.x = 1000;
rocketObj.y = 1000;
rocketObj.sourceWidth = 64;
rocketObj.sourceHeight = 64;
rocketObj.width = 64;
rocketObj.height = 64;
rocketObj.rotation = 0;
sprites.push(rocketObj);

//Move "camera" to rocket object
drawingSurface.translate(-(rocketObj.x - (canvas.width/2) + (rocketObj.width/2)),-(rocketObj.y - (canvas.height/2) +(rocketObj.height/2)));


//Game states
var LOADING = 0
var PLAYING = 1;
var OVER = 2;
var gameState = LOADING;

var UP = 38;
var RIGHT = 39;
var LEFT = 37;

var rotLeft = false;
var rotRight = false;
var thrusters = false;


//Variable to count the number of assets the game needs to load
var assetsLoaded = 0;

//Start the game animation loop
update();

window.addEventListener("keydown", function(event)
{
  switch(event.keyCode)
  {
	  case LEFT:
	    rotLeft = true;
		break;  
	    
	  case RIGHT:
	    rotRight = true;
		break;
	 
	  case UP:
		thrusters = true;
		
   }

}, false);

window.addEventListener("keyup", function(event)
{
  switch(event.keyCode)
  {	    
	  case LEFT:
	    rotLeft = false;
	    break;  
	    
	  case RIGHT:
	    rotRight = false;
	    break; 
	
	  case UP:
	    thrusters = false;
  }
}, false);

function update()
{ 
  //The animation loop
  requestAnimationFrame(update, canvas);
  
    //Change what the game is doing based on the game state
  switch(gameState)
  {
    case LOADING:
      console.log("loading…");
      break;
    
    case PLAYING:
      playGame();
      break;
    
    case OVER:
      endGame();
      break;
  }
  
  //Render the game
  render();
}

function loadHandler()
{ 
  assetsLoaded++;
  if(assetsLoaded === assetsToLoad.length)
  {
    //Remove the load event listener
    earthImg.removeEventListener("load", loadHandler, false);
    rocketImg.removeEventListener("load",loadHandler, false);
	marsImg.removeEventListener("load",loadHandler, false);
    bgImg.removeEventListener("load",loadHandler, false);
	//Start the game 
    gameState = PLAYING;
  }
}

function playGame()
{
	if (hitTestCircle(rocketObj,earthObj))
	gameState = OVER;
	
	if (hitTestCircle(rocketObj,marsObj))
	gameState = OVER;
	
	if(thrusters)
    {
		rocketObj.speed = 0.2;
		rocketObj.friction = 1;
	}
	else
	{
		rocketObj.speed = 0;
		rocketObj.friction = 0.96;
	}
  
	if (rotLeft && !rotRight)
	{
		rocketObj.rotation -= 10;
	}

	if (rotRight && !rotLeft)
	{
		rocketObj.rotation += 10;
	}

  //Where is the Earth from here?
  rocketObj.earthXComponent = (rocketObj.x+rocketObj.width/2) - (earthObj.x+earthObj.width/2); 
  rocketObj.earthYComponent = (rocketObj.y+rocketObj.height/2) - (earthObj.y+earthObj.height/2);
  rocketObj.earthAngle = Math.atan2(rocketObj.earthYComponent,rocketObj.earthXComponent);
  rocketObj.earthDistance = Math.sqrt((rocketObj.earthXComponent*rocketObj.earthXComponent + rocketObj.earthYComponent*rocketObj.earthYComponent)); 
  
  //Velocity vector due to earth's gravity, dependent on the reciprocal of the distance
  rocketObj.vxEg = -2000*(Math.cos(rocketObj.earthAngle) * (rocketObj.gravity)/(rocketObj.earthDistance));
  rocketObj.vyEg = -2000*(Math.sin(rocketObj.earthAngle) * (rocketObj.gravity)/(rocketObj.earthDistance));
  
  //Where is Mars from here?
  rocketObj.marsXComponent = (rocketObj.x+rocketObj.width/2) - (marsObj.x+marsObj.width/2); 
  rocketObj.marsYComponent = (rocketObj.y+rocketObj.height/2) - (marsObj.y+marsObj.height/2);
  rocketObj.marsAngle = Math.atan2(rocketObj.marsYComponent,rocketObj.marsXComponent);
  rocketObj.marsDistance = Math.sqrt((rocketObj.marsXComponent*rocketObj.marsXComponent + rocketObj.marsYComponent*rocketObj.marsYComponent)); 
  
  //Mars has about .4 times the gravity of earth - NASA
  
  rocketObj.vxMg = -800*(Math.cos(rocketObj.marsAngle) * (rocketObj.gravity)/(rocketObj.marsDistance));
  rocketObj.vyMg = -800*(Math.sin(rocketObj.marsAngle) * (rocketObj.gravity)/(rocketObj.marsDistance));
  
  console.log(rocketObj.vxMg);
  
  //Rotate the rocketObj
  rocketObj.angle = rocketObj.rotation  * (Math.PI / 180);
  
  //Figure out the potential acceleration of rockets based on the angle
  rocketObj.accelerationX = Math.cos(rocketObj.angle) * rocketObj.speed; 
  rocketObj.accelerationY = Math.sin(rocketObj.angle) * rocketObj.speed;
  
  //Add the acceleration due to the thruster velocity vector
	rocketObj.vxTh += rocketObj.accelerationX; 
	rocketObj.vyTh += rocketObj.accelerationY;
  
  //Superposition of vectors
  rocketObj.vx = rocketObj.vxEg + rocketObj.vxMg + rocketObj.vxTh;
  rocketObj.vy = rocketObj.vyEg + rocketObj.vyMg + rocketObj.vyTh;
  
  //Add friction
  rocketObj.vxTh *= rocketObj.friction;
  rocketObj.vyTh *= rocketObj.friction;
				
  //Move the rocketObj
  rocketObj.x += rocketObj.vx;
  rocketObj.y += rocketObj.vy;

  //Keep the rocket in the room
  if (rocketObj.x < 0)
  rocketObj.x = 0;
  if (rocketObj.y < 0)
  rocketObj.y = 0;
  if (rocketObj.x > gameWorld.width - rocketObj.width)
  rocketObj.x = gameWorld.width - rocketObj.width;
  if (rocketObj.y > gameWorld.height - rocketObj.height)
  rocketObj.y = gameWorld.height - rocketObj.height;
  
  //Move the "camera"
	if ((rocketObj.x > canvas.width/2)&&(rocketObj.x < gameWorld.width - canvas.width/2))
	{
	drawingSurface.translate(-rocketObj.vx,0);
	drawingSurface.save();
	drawingSurface.restore();
	}
	if ((rocketObj.y > canvas.height/2)&&(rocketObj.y < gameWorld.height - canvas.height/2))
	{
	drawingSurface.translate(0,-rocketObj.vy);
    drawingSurface.save();
	drawingSurface.restore();
	}
  
 }
 
 function endGame()
 {
 }
 
function render(event)
{ 
  if (gameState === PLAYING)
  {
  //Clear the previous animation frame
  //drawingSurface.clearRect(-100, -100, gameWorld.width+200, gameWorld.height+200);
   drawingSurface.drawImage(bgImg, 0, 0);
  //drawingSurface.restore();
  //Display the sprites
  if(sprites.length !== 0)
  {
  	for(var i = 0; i < sprites.length; i++)
  	{
  	  var sprite = sprites[i];
  	  
	  
      if(sprite.visible)
  	  {
  	    //Save the current state of the drawing surface before it's rotated
  	    drawingSurface.save();

  	    //Rotate the canvas
  	    drawingSurface.translate
  	    (
  	      Math.floor(sprite.x + (sprite.width / 2)), 
  	      Math.floor(sprite.y + (sprite.width / 2))
  	    );
  	    
  	    drawingSurface.rotate(sprite.rotation * Math.PI / 180);

  		  drawingSurface.drawImage
  		  (
  		    sprite.img, 
  		    sprite.sourceX, sprite.sourceY, 
  		    sprite.sourceWidth, sprite.sourceHeight,
  		    Math.floor(-sprite.width / 2), Math.floor(-sprite.height / 2), 
  		    sprite.width, sprite.height
  		  );
		 

        //Restore the drawing surface to its state before it was rotated
        drawingSurface.restore();
      }
  	}
  }

 }
}
}());
