(function(){

//The canvas
var canvas = document.querySelector("canvas");

//Create the drawing surface 
var drawingSurface = canvas.getContext("2d");

//Arrays to store the game objects and assets to load
var sprites = [];
var assetsToLoad = [];
var messages = [];

//Load explosion sound
var explosionSound = document.querySelector("#explosionSound");
explosionSound.addEventListener("canplaythrough", loadHandler, false);
explosionSound.load();
assetsToLoad.push(explosionSound);

//Load hamburger sound
var hamburgerSound = document.querySelector("#hamburgerSound");
hamburgerSound.addEventListener("canplaythrough", loadHandler, false);
hamburgerSound.load();
assetsToLoad.push(hamburgerSound);

//Load music
var music = document.querySelector("#music");
music.addEventListener("canplaythrough", loadHandler, false);
music.load();
assetsToLoad.push(music);

music.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);

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

//Load the burger image
var burgerImg = new Image();
burgerImg.addEventListener("load", loadHandler, false);
burgerImg.src = "../images/burger.png";
assetsToLoad.push(burgerImg);

//Load the explosion image
var explosionImg = new Image();
explosionImg.addEventListener("load", loadHandler, false);
explosionImg.src = "../images/Explode1.png";
assetsToLoad.push(explosionImg);

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

//Create the burgerObj
var burgerObj = Object.create(spriteObject);
burgerObj.img = burgerImg;
burgerObj.x = 900;
burgerObj.y = 900;
burgerObj.sourceWidth = 32;
burgerObj.sourceHeight = 32;
burgerObj.width = 32;
burgerObj.height = 32;
sprites.push(burgerObj);

var scoreObj = Object.create(messageObject);
scoreObj.x = rocketObj.x - 16;
scoreObj.y = rocketObj.y - 16;
messages.push(scoreObj);

//Move "camera" to rocket object
drawingSurface.translate(-(rocketObj.x - (canvas.width/2) + (rocketObj.halfWidth())),-(rocketObj.y - (canvas.height/2) +(rocketObj.halfHeight())));


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

var score = 0;
var i = 0;


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
  if (gameState !== OVER)
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
      explosionSound.currentTime = 0;
	  explosionSound.play();
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
	burgerImg.removeEventListener("load",loadHandler,false);
	explosionImg.removeEventListener("load",loadHandler,false);
	explosionSound.removeEventListener("canplaythrough",loadHandler,false);
	hamburgerSound.removeEventListener("canplaythrough",loadHandler,false);
	music.removeEventListener("canplaythrough",loadHandler,false);
	
	//Play the music
     music.play();
     music.volume = 0.3;
	 
	//Start the game 
    gameState = PLAYING;
  }
}

function playGame()
{
	var gameOff = false;
	
	scoreObj.text = score;
	if ((hitTestCircle(rocketObj,earthObj))||(hitTestCircle(rocketObj,marsObj)))
	{
		gameOff = true;
		rocketObj.vx=0;
		rocketObj.vy=0;
		rocketObj.img = explosionImg;
		scoreObj.text= "Game Over";

		rocketObj.sourceX+=64;
		var interval = window.setInterval(explosionDraw,100);
			
			function explosionDraw()
			{
				if (i<14)
				{
					i++;
				}
				
				else
				{
					window.clearInterval(interval);
					gameState = OVER;
				}
			}
		
		
	}
if (!gameOff)
{
	if (hitTestCircle(rocketObj,burgerObj))
	{
		burgerObj.x = Math.random()*gameWorld.width;
		burgerObj.y = Math.random()*gameWorld.height;
		score++;
		
		hamburgerSound.currentTime = 0;
		hamburgerSound.play();
		
		//Move the burger if it's too close to a planet.
		while (((Math.abs(earthObj.x-burgerObj.x) < 440) && (Math.abs(earthObj.y-burgerObj.y) < 440)) || 
		((Math.abs(marsObj.x-burgerObj.x) < 220) && (Math.abs(marsObj.y-burgerObj.y) < 220)))
		{
			burgerObj.x = Math.random()*gameWorld.width;
			burgerObj.y = Math.random()*gameWorld.height;
	
		}
	}
	
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
  rocketObj.earthXComponent = (rocketObj.x+rocketObj.halfWidth()) - (earthObj.x+earthObj.halfWidth()); 
  rocketObj.earthYComponent = (rocketObj.y+rocketObj.halfHeight()) - (earthObj.y+earthObj.halfHeight());
  rocketObj.earthAngle = Math.atan2(rocketObj.earthYComponent,rocketObj.earthXComponent);
  rocketObj.earthDistance = Math.sqrt((rocketObj.earthXComponent*rocketObj.earthXComponent + rocketObj.earthYComponent*rocketObj.earthYComponent)); 
  
  //Velocity vector due to earth's gravity, dependent on the reciprocal of the distance
  rocketObj.vxEg = -5000*(Math.cos(rocketObj.earthAngle) * (rocketObj.gravity)/(rocketObj.earthDistance));
  rocketObj.vyEg = -5000*(Math.sin(rocketObj.earthAngle) * (rocketObj.gravity)/(rocketObj.earthDistance));
  
  //Where is Mars from here?
  rocketObj.marsXComponent = (rocketObj.x+rocketObj.halfWidth()) - (marsObj.x+marsObj.halfWidth()); 
  rocketObj.marsYComponent = (rocketObj.y+rocketObj.halfHeight()) - (marsObj.y+marsObj.halfHeight());
  rocketObj.marsAngle = Math.atan2(rocketObj.marsYComponent,rocketObj.marsXComponent);
  rocketObj.marsDistance = Math.sqrt((rocketObj.marsXComponent*rocketObj.marsXComponent + rocketObj.marsYComponent*rocketObj.marsYComponent)); 
  
  //Mars has about .4 times the gravity of earth - NASA
  
  rocketObj.vxMg = -2000*(Math.cos(rocketObj.marsAngle) * (rocketObj.gravity)/(rocketObj.marsDistance));
  rocketObj.vyMg = -2000*(Math.sin(rocketObj.marsAngle) * (rocketObj.gravity)/(rocketObj.marsDistance));
  
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

  //Update the score's position
  scoreObj.x = rocketObj.x - 16;
  scoreObj.y = rocketObj.y - 16;
  
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
	if ((rocketObj.x > ((canvas.width/2)-(rocketObj.halfWidth())))&&(rocketObj.x < (gameWorld.width - (canvas.width/2) - (rocketObj.halfWidth()))))
	
	{
	drawingSurface.translate(-rocketObj.vx,0);
	drawingSurface.save();
	drawingSurface.restore();
	}
	if ((rocketObj.y > ((canvas.height/2) - (rocketObj.halfHeight()) ))&&(rocketObj.y < ((gameWorld.height - (canvas.height/2))) - (rocketObj.halfHeight())))
	{
	drawingSurface.translate(0,-rocketObj.vy);
    drawingSurface.save();
	drawingSurface.restore();
	}
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
   drawingSurface.drawImage(bgImg, -32, -32);
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
  	      Math.floor(sprite.x + (sprite.halfWidth()), 
  	      Math.floor(sprite.y + (sprite.halfWidth())
  	    );
  	    
  	    drawingSurface.rotate(sprite.rotation * Math.PI / 180);

  		  drawingSurface.drawImage
  		  (
  		    sprite.img, 
  		    sprite.sourceX, sprite.sourceY, 
  		    sprite.sourceWidth, sprite.sourceHeight,
  		    Math.floor(-sprite.halfWidth()), Math.floor(-sprite.halfHeight()), 
  		    sprite.width, sprite.height
  		  );
		 

        //Restore the drawing surface to its state before it was rotated
        drawingSurface.restore();
      }
  	}
  }

    //Display the game messages
  if(messages.length !== 0)
  {
    for(var i = 0; i < messages.length; i++)
    {
      var message = messages[i];
      if(message.visible)
      {
		drawingSurface.font = message.font;  
        drawingSurface.fillStyle = message.fillStyle;
        drawingSurface.textBaseline = message.textBaseline;
        drawingSurface.fillText(message.text, message.x, message.y);  
      }
    }
  }
 }
}
}());



