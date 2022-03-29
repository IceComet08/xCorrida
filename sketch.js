var canvas;
var backgroundImage, car1_img, car2_img, track;
var database, gameState;
var form, player, playerCount;
var allPlayers, car1, car2;
var cars = [];
var gasolina
var coin, gasolinaI, coinI
var obs1,obs2
var obstacle1Image, obstacle2Image
var lifeI,boomI
function preload() {
  backgroundImage = loadImage("./assets/planodefundo.png");
  car1_img = loadImage("./assets/car1.png");
  car2_img = loadImage("./assets/car2.png");
  track = loadImage("./assets/pista.png");
  coinI = loadImage("./assets/goldCoin.png")
  gasolinaI = loadImage("./assets/fuel.png")
  obstacle1Image = loadImage("./assets/obstacle1.png")
  obstacle2Image = loadImage("./assets/obstacle2.png")
  lifeI = loadImage("./assets/life.png")
  boomI = loadImage("./assets/blast.png")
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();
}

function draw() {
  background(backgroundImage);
  if (playerCount === 2) {
    game.update(1);
  }

  if (gameState === 1) {
    game.play();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
