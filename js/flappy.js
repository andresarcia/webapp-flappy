// the Game object used by the phaser.io library
//var stateActions = { preload: preload, create: create, update: update };

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
//var game = new Phaser.Game(790, 400, Phaser.AUTO, 'game', stateActions);

// the functions associated with preload, create and update.
var actions = { preload: preload, create: create, update: update };
// the Game object used by the phaser.io library
var game = new Phaser.Game(790, 400, Phaser.AUTO, "game", actions);
// Global score variable initialised to 0.
var score = 0;
// Global variable to hold the text displaying the score.
var labelScore;
// Global player variable declared but not initialised.
var player;
// Global pipes variable initialised to the empty array.
var pipes = [];
var balloons = [];
var weights = [];

// the interval (in seconds) at which new pipe columns are spawned
var pipeInterval = 1.75;

var gapSize = 100;
var gapMargin = 50;
var blockHeight = 50;
var width = 790;
var height = 400;
var gameSpeed = 200;
var gameGravity = 200;
var jumpPower = 200;


jQuery("#greeting-form").on("submit", function(event_details) {
        var greeting = "Hello ";
        var name = jQuery("#fullName").val();
        var greeting_message = greeting + name;
        jQuery("#greeting-form").hide();
        jQuery("#greeting").append("<p>" + greeting_message + "\("  + $("#email").val() + "\): " +  score + "</p>");
        //event_details.preventDefault();
});

// Loads all resources for the game and gives them names.
function preload() {
    // make image file available to game and associate with alias playerImg
    game.load.image("playerImg","../assets/flappy.png");
    // make sound file available to game and associate with alias score
    game.load.audio("score", "../assets/point.ogg");
    // make image file available to game and associate with alias pipe
    game.load.image("pipe","../assets/pipe.png");
    // make image file available to game and associate with alias pipe
    game.load.image("pipeEnd","../assets/pipe2-end.png");
    game.load.image("ballons","../assets/balloons.png");
    game.load.image("weight","../assets/weight.png");
}

// Initialises the game. This function is only called once.
function create() {
    // set the background colour of the scene
    game.stage.setBackgroundColor("#F3D3A3");
    // add welcome text
    game.add.text(20, 20, "Welcome to my game",
        {font: "30px Arial", fill: "#FFFFFF"});
    // add score text
    labelScore = game.add.text(20, 60, "0",
        {font: "30px Arial", fill: "#FFFFFF"});
    // initialise the player and associate it with playerImg
    player = game.add.sprite(80, 200, "playerImg");
    // Start the ARCADE physics engine.
    // ARCADE is the most basic physics engine in Phaser.
    game.physics.startSystem(Phaser.Physics.ARCADE);
    // enable physics for the player sprite
    game.physics.arcade.enable(player);
    // set the player's gravity
    player.body.gravity.y = 200;
    // associate spacebar with jump function
    game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(playerJump);
    // time loop for game to update
    game.time.events.loop(pipeInterval * Phaser.Timer.SECOND, generate);

    $.get("/score", function(scores){
        for (var i = 0; i < scores.length; i++) {
            $("#scoreboard").append(
                "<li>" +
                scores[i].name + ": " + scores[i].score +
                "</li>");
        }
    });

}
function generateWeight(){
    var bonus = game.add.sprite(width, height, "weights");
    weights.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = - 200;
    bonus.body.velocity.y = - game.rnd.integerInRange(60,100);
}

function generateBalloons(){
    var bonus = game.add.sprite(width, height, "balloons");
    balloons.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = - 200;
    bonus.body.velocity.y = - game.rnd.integerInRange(60,100);
}

function generate() {
    var diceRoll = game.rnd.integerInRange(1, 10);
    if(diceRoll==1) {
        generateBalloons();
    } else if(diceRoll==2) {
        generateWeight();
    } else {
        generatePipe();
    }
}


// This function updates the scene. It is called for every new frame.
function update() {
    // Call gameOver function when player overlaps with any pipe

    game.physics.arcade
        .overlap(player,
        pipes,
        gameOver);

    if(player.body.y < 0) {
        gameOver();
    }

    if(player.body.y > 400){
        gameOver();
    }

    player.rotation = Math.atan(player.body.velocity.y / 200);

}

// Adds a pipe part to the pipes array
function addPipeBlock(x, y) {
    // make a new pipe block
    var block = game.add.sprite(x,y,"pipe");
    // insert it in the pipe array
    pipes.push(block);
    // enable physics engine for the block
    game.physics.arcade.enable(block);
    // set the block's horizontal velocity to a negative value
    // (negative x value for velocity means movement will be towards left)
    block.body.velocity.x = -200;
}

// Generate moving pipe
function generatePipe1() {
    // Generate  random integer between 1 and 5. This is the location of the
    // start point of the gap.
    var gapStart = game.rnd.integerInRange(1, 5);
    // Loop 8 times (8 is the height of the canvas).
    for (var count = 0; count < 8; count++) {
        // If the value of count is not equal to the gap start point
        // or end point, add the pipe image.
        if(count != gapStart && count != gapStart+1){
            addPipeBlock(750, count * 50);
        }
    }
    // Increment the score each time a new pipe is generated.
    changeScore();
}

function generatePipe2() {
    var gapStart = game.rnd.integerInRange(gapMargin, height - gapSize - gapMargin);

    for( y=gapStart; y > 0 ; y -= blockHeight){
        addPipeBlock(width,y - blockHeight);
    }
    for( y = gapStart + gapSize; y < height; y += blockHeight) {
        addPipeBlock(width, y);
    }
    changeScore();
}

function addPipeEnd(x, y){
    // make a new pipe block
    var block = game.add.sprite(x,y,"pipeEnd");
    // insert it in the pipe array
    pipes.push(block);
    // enable physics engine for the block
    game.physics.arcade.enable(block);
    // set the block's horizontal velocity to a negative value
    // (negative x value for velocity means movement will be towards left)
    block.body.velocity.x = -200;
}

function generatePipe() {
    var gapStart = game.rnd.integerInRange(gapMargin, height-gapSize-gapMargin);
var pipeEndExtraWidth =4;
var    pipeEndHeight = 12;


    addPipeEnd(width-(pipeEndExtraWidth/2), gapStart-pipeEndHeight);
    for(var y=gapStart-pipeEndHeight; y>0 ; y-=blockHeight) {
        addPipeBlock(width,y - blockHeight);
    }

    addPipeEnd(width-(pipeEndExtraWidth/2), gapStart+gapSize);
    for(var y=gapStart+gapSize+pipeEndHeight; y<height; y+=blockHeight) {
        addPipeBlock(width,y);
    }

    changeScore();
}


function playerJump() {
    // the more negative the value the higher it jumps
    player.body.velocity.y = -200;
}

// Function to change the score
function changeScore() {
    //increments global score variable by 1
    score++;
    // updates the score label
    labelScore.setText(score.toString());
}

function gameOver() {
    // stop the game (update() function no longer called)
    game.state.restart();
//    game.destroy();
//    $("#score").val(score.toString());
//    $("#greeting").show();


}


//var scoreV =0;
//var labelScore;
//var player; // a player must be global

/*
 * Loads all resources for the game and gives them names.
 */
//function preload() {
//    game.load.image("playerImg","../assets/jamesBond.gif");
//    game.load.image("bgImg","../assets/screenshot.png");
//    game.load.audio("score","../assets/point.ogg");
//}
//
///*
// * Initialises the game. This function is only called once.
// */
//function create() {
//    // set the background colour of the scene
//    game.stage.setBackgroundColor("#888888");
//    var bg=game.add.image(10,10,"bgImg");
//    bg.width=100;
//    bg.height=80;
//    game.add.text(20,20,"Welcome to my game!", {font: "30px Arial",  fill: "#FFFFFF"});
//    player = game.add.sprite(10,270,"playerImg");
//    game.input.onDown.add(clickHandler);
//    game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(moveright);
//    game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(moveleft);
//    //score printing
//    labelScore=game.add.text(20,20,"033");
//    scoreV=329392;
//    labelScore.setText(scoreV.toString());
////    alert(scoreV);
//}



//function clickHandler(event) {
//   // alert("You just clicked: x "+event.x+","+event.y);
//    game.add.sprite(event.x,event.y,"playerImg");
//    changeScore();
//    labelScore.setText(scoreV.toString());
//}
//
//function moveright(event) {
//    game.sound.play("score");
//    player.x = player.x +1;
//}
//
//function moveleft(event) {
//    game.sound.play("score");
//    player.x=player.x-1;
//}
//
//
//function changeScore() {
//    scoreV = scoreV + 2;
//}

/*
 * This function updates the scene. It is called for every new frame.
 */
//function update() {
//
//
//}