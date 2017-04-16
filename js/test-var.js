// the scaffolding for Phaser is here
var score = 0;
var labelScore;
var stateActions = { preload: preload, create: create, update: update };
var player;
var pipes = [];

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(800, 500, Phaser.AUTO, 'game', stateActions);

function preload() {
         // your previous code for preload is here
         game.load.image("playerImg", "../assets/jamesBond.gif");
         game.load.image("pipeBlock", "../assets/pipe.png");
}

function create() {
  game.stage.setBackgroundColor("#F3BFA3");
  game.physics.startSystem(Phaser.Physics.ARCADE);

  game.add.text(0, 20, "Welcome to my fun game");
         // your previous code for create is here
         labelScore = game.add.text(0,80,"0");
         changeScore();
  player = game.add.sprite(100,200,"playerImg");
  game.physics.arcade.enable(player);
  player.body.velocity.x = 0;
  player.body.velocity.y = -100;
  player.body.gravity.y = 200;
  game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
                        .onDown.add(moveRight);
  game.input.keyboard
    .addKey(Phaser.Keyboard.SPACEBAR)
    .onDown
    .add(playerJump);

    var pipeInterval = 1.75 * Phaser.Timer.SECOND;
    game.time.events.loop(
        pipeInterval,
        generatePipe
    );

//         alert(score);
}

function playerJump() {
    player.body.velocity.y = -200;
}

function generatePipe() {
  var gapStart = game.rnd.integerInRange(1, 7);

  for(var count=0; count<8; count+=1){
      if (count != gapStart && count != gapStart + 1){
    addPipeBlock(800, 50*count);
    }
  }
}

function update() {
  game.physics.arcade.overlap(player, pipes, gameOver);
}

function registerScore(score){
  var playerName = prompt("What's your name?");
  var scoreEntry = "<li>" + playerName + ":" + score.toString() + "</li>";
  jQuery("#scoreslist").append(scoreEntry);
}

function gameOver() {
  registerScore(score);
  game.state.restart();
}

function addPipeBlock(x, y) {
  //create a new pipe block
  var block = game.add.sprite(x,y,"pipeBlock");
  // insert it in the 'pipes' array
  pipes.push(block);
  game.physics.arcade.enable(block);
  block.body.velocity.x = -200;
}

function moveRight(){
  player.x = player.x + 10;
}

function changeScore() {
  score = score + 5;
  labelScore.setText(score.toString());
}
