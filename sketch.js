
var weather;
//Washington = 4140963

//weather variables
var clouds, wind, temp, rain, humidity, sunrise, sunset;
//All consuming time
var time, skyColor;

var capeman;
var capeMotion, fallingMotion, hitAnim;
var isFalling;
var health;
var damage;

var birds;

//0 = newGame
//1 = gameOver
var gameState;

var isHit, isFlying;
var iFrameCounter;

function preload(){
	flyingMotion = loadAnimation("assets/capemanSprites01.png", "assets/capemanSprites06.png");
	fallingMotion = loadAnimation("assets/capemanFalling01.png", "assets/capemanFalling16.png");
	hitAnim = loadAnimation("assets/capeManHit01.png", "assets/capeManHit10.png")

	birdImage = loadImage("assets/bird.png");
	superBirdImage = loadImage("assets/SuperBird.png");

	health = 100;

	damage = 10;
}


function setup(){
	createCanvas(800, 800);
	// humidity = weather.main.humidity;
 //  	clouds = weather.clouds.all;
 //  	wind = weather.wind.speed;
 //  	temp = weather.main.temp;
 		//sunrise = weather.sys.sunrise; //this will be in UTC which is dumb. 

  	time = 12;
  	gameState = 0;

  	capeman = createSprite(width/2, height/2);
  	capeman.setCollider("rectangle", 65, 90);
  	capeman.addAnimation("falling", fallingMotion);
    capeman.addAnimation("hit", hitAnim);
  	capeman.addAnimation("flying", flyingMotion);


  	//isHit = false;
  	isFlying = true;
  	iFrameCounter = 0;

  	numBirds = 9;

  	birds = new Group();
  	superBirds = new Group();
  	for(var i = 0;i<numBirds;i++){
  		var newBird = createSprite(random(1,8)*100, random(-8,-1)*100);
  		if(i%3 == 0){
  			newBird.addImage(superBirdImage);
  			newBird.setSpeed(random(3,6), random(80,100));
  			newBird.attractionPoint(.5, capeman.position.x, capeman.position.y);
  			superBirds.add(newBird);
  		} else {
  			newBird.addImage(birdImage);
  			newBird.setSpeed(random(1,4), random(80,100));
  			birds.add(newBird);
  		}
  	}
}

function draw() {

	if ((time>-1 && time<7) || time>18){
		skyColor = color(5, 0, 43);
	} else if (time>7&&time<18){
		skyColor = color(130, 209, 229);
	}
	 background(skyColor);

	if(gameState == 0){
		if(keyIsPressed === true){
			capeman.speed = 4;
		} else {
			capeman.speed = 0;
		}

		if(capeman.position.x<0-capeman.width){
		 	capeman.position.x = width;
		}
		if(capeman.position.x>width){
			capeman.position.x = 0-capeman.width;
		}

	
		//capeman motion
		if(keyDown(LEFT_ARROW)){
			capeman.position.x = capeman.position.x-capeman.speed;
		}
		if(keyDown(RIGHT_ARROW)){
			capeman.position.x = capeman.position.x+capeman.speed;
		}
		if(keyDown(UP_ARROW)){
			capeman.position.y = capeman.position.y-capeman.speed;
		}
		if(keyDown(DOWN_ARROW)){
			capeman.position.y = capeman.position.y+capeman.speed;
		}

		for(var i = 0;i<numBirds/3;i++){
			superBirds[i].attractionPoint(.07, capeman.position.x, capeman.position.y);
			superBirds[i].maxSpeed = 7;
			//superBirds[i].rotateToDirection = true;
		}


		if(capeman.overlap(birds) || capeman.overlap(superBirds)){
			isHit = true;
			isFlying = false;
		}

		if(isFlying == true){
			capeman.changeAnimation("flying");
		}

		if(isHit == true){
			capeman.changeAnimation("hit");
			iFrameCounter=iFrameCounter+1;
			if(iFrameCounter == 1){
				health = health-damage;
				capeman.position.y = capeman.position.y+70;
			}
			isFlying = false;
			if(iFrameCounter>60){
				isFlying = true;
				isHit = false;
				iFrameCounter = 0;
			}
		}

		if(health<0){
			health = 0;
		}
		if(health == 0){
			gameState = 1;
		}
	} else if(gameState == 1){
		crash();
		textAlign(CENTER);
		textSize(50);
		text("Watch out for those birds...", width/2, height/2);
		text("Play again? Press ENTER", width/2, height/2+100);
		if(keyIsPressed){
			if(keyCode == ENTER){
				gameState = 0;
				health = 100;
			}
		}
	}



//Space managerment for birds and superBirds
	for(var i = 0;i<numBirds-numBirds/3;i++){
  		var b = birds[i];
  		if(b.position.y>height){
  			birds[i].position.y = -10;
  			birds[i].position.x = random(1,8)*100;
  			birds[i].setSpeed(random(1,4), random(80,100));
  		}
  	}

  	for(var i = 0;i<numBirds/3;i++){
		var s = superBirds[i];
  		if(s.position.y>height){
			s.position.y = -10;
  			s.position.x = random(1,8)*100;
  		}
  	} 
  	

  	textSize(20);
  	text("health: " + health, width-150, 50)

	drawSprites();
}

function crash(){
	capeman.speed = 0;
	capeman.changeAnimation("falling");
	capeman.animation.goToFrame(fallingMotion.getLastFrame());
}
