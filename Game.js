class Game {
  constructor() {
    this.resetButton = createButton('')
    this.resetTitle = createElement('h2')

    this.leaderBoard = createElement('h2')
    this.leader1 = createElement('h2')
    this.leader2 = createElement('h2')
    this.playerMoving = false
    this.leftKey = false
    this.blast = false
  }

  getState() {
    var gameStateRef = database.ref('gameState')
    gameStateRef.on('value', function (data) {
      gameState = data.val()
    })
  }
  showLife() {
    push()
    image(lifeI, width / 2 - 130, height - player.positionY - 400, 20, 20)
    fill('white')
    rect(width / 2 - 100, height - player.positionY - 400, 185, 20)
    fill('aqua')
    rect(width / 2 - 100, height - player.positionY - 400, player.life, 20)
    pop()
  }
  showFuelBar() {
    push()
    image(gasolinaI, width / 2 - 130, height - player.positionY - 350, 20, 20)
    fill('white')
    rect(width / 2 - 100, height - player.positionY - 350, 185, 20)
    fill('orange')
    rect(width / 2 - 100, height - player.positionY - 350, player.fuel, 20)
    pop()
  }
  obstacleF(index) {
    if (cars[index - 1].collide(obs1)) {
      if (this.leftKey) {
        player.positionX = player.positionX + 100
      } else {
        player.positionX = player.positionX - 100
      }
      if (player.life > 0) {
        player.life = player.life - 185 / 4
      }
      player.update()
    }
  }
  handleCoins(index) {
    cars[index - 1].overlap(coin, function (collector, collected) {
      collected.remove()
      player.score = player.score + 21
      player.update()
    })
  }
  handleFuel(index) {
    cars[index - 1].overlap(gasolina, function (collector, collected) {
      collected.remove()
      player.fuel = 185
    })
    if (player.fuel > 0 && this.playerMoving) {
      player.fuel = player.fuel - 0.3
    }
    if (player.fuel <= 0) {
      gameState = 2
      this.gameOver()
      player.update()
    }
  }
  update(state) {
    database.ref('/').update({
      gameState: state
    })
  }
  addSprites(spriteGroup, numberOfSprites, spriteImage, scale, positions = []) {
    for (var i = 0; i < numberOfSprites; i++) {
      var x
      var y
      if (positions.lenght > 0) {
        x = positions[i].x
        y = positions[i].y
        spriteImage = positions[i].image
      } else {
        x = random(width / 2 + 150, width / 2 - 150)
        y = random(-height * 4.5, height - 400)
      }
      var sprite = createSprite(x, y)
      sprite.addImage(spriteImage)
      sprite.scale = scale
      spriteGroup.add(sprite)
    }
  }
  start() {
    player = new Player()
    playerCount = player.getCount()

    form = new Form()
    form.display()

    car1 = createSprite(width / 2 - 50, height - 100)
    car1.addImage('car1', car1_img)
    car1.scale = 0.07

    car2 = createSprite(width / 2 + 100, height - 100)
    car2.addImage('car2', car2_img)
    car2.scale = 0.07

    cars = [car1, car2]
    gasolina = new Group()
    coin = new Group()
    obs1 = new Group()

    this.addSprites(gasolina, 4, gasolinaI, 0.02)
    this.addSprites(coin, 18, coinI, 0.09)
    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
      { x: width / 2, y: height - 2800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
      { x: width / 2, y: height - 5300, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }
    ]
    this.addSprites(obs1, 10, obstacle1Image, 0.04, obstaclesPositions)
    this.addSprites(obs1, 10, obstacle2Image, 0.04, obstaclesPositions)
  }
  showLeaderboard() {
    var leader1
    var leader2
    var players = Object.values(allPlayers)
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      leader1 =
        players[0].rank +
        '&emsp;' +
        players[0].name +
        '&emsp;' +
        players[0].score

      leader2 =
        players[1].rank +
        '&emsp;' +
        players[1].name +
        '&emsp;' +
        players[1].score
    }
    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        '&emsp;' +
        players[1].name +
        '&emsp;' +
        players[1].score

      leader2 =
        players[0].rank +
        '&emsp;' +
        players[0].name +
        '&emsp;' +
        players[0].score
    }
    this.leader1.html('leader1')
    this.leader2.html('leader2')
  }

  handleResetButton() {
    this.resetButton.mousePressed(() => {
      database.ref('/').set({
        playerCount: 0,
        gameState: 0,
        carsAtEnd: 0,
        players: {}
      })

      window.location.reload()
    })
  }
  handleElements() {
    form.hide()
    form.titleImg.position(40, 50)
    form.titleImg.class('gameTitleAfterEffect')
    this.resetTitle.html('reiniciar jogo')
    this.resetTitle.class('resetText')
    this.resetTitle.position(width / 2 + 200, 40)
    this.resetButton.class('resetButton')
    this.resetButton.position(width / 2 + 230, 100)
    this.leader1.class('leadersText')
    this.leader1.position(width / 3 - 50, 80)
    this.leader2.class('leadersText')
    this.leader2.position(width / 3 - 50, 130)
    this.leaderBoard.html('PLACAR')
    this.leaderBoard.class('resetText')
    this.leaderBoard.position(width / 3 - 60, 40)
  }
  showRank() {
    swal({
      title: `Incrível!${'\n'}Rank${'\n'}${player.rank}`,
      text: 'Você alcançou a linha de chegada com sucesso!',
      imageUrl:
        'https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png',
      imageSize: '100x100',
      confirmButtonText: 'Ok'
    })
  }
  play() {
    this.handleElements()
    this.handleResetButton()
    Player.getPlayersInfo()
    player.getCarsAtEnd()
    if (allPlayers !== undefined) {
      image(track, 0, -height * 5, width, height * 6)
      this.showLeaderboard()
      this.showLife()
      this.showFuelBar()
      //índice da matriz
      var index = 0
      for (var plr in allPlayers) {
        //adicione 1 ao índice para cada loop
        index = index + 1

        //use os dados do banco de dados para exibir os carros nas direções x e y
        var x = allPlayers[plr].positionX
        var y = height - allPlayers[plr].positionY

        cars[index - 1].position.x = x
        cars[index - 1].position.y = y
      }

      this.handlePlayerControls()

      drawSprites()
      if (index === player.index) {
        stroke(10)
        fill('red')
        ellipse(x, y, 60, 60)
        this.handleFuel()
        this.powerCoins()
        this.obstaclesF()
        camera.position.x = cars[index - 1].position.x
        camera.position.y = cars[index - 1].position.y
      }
    }

    if (this.playerMoving) {
      player.positionY += 5
      player.update()
    }

    const finishLine = height * 6 - 100
    if (player.positionY > finishLine) {
      gameState = 2
      player.rank = player.rank + 1
      Player.updateCarsAtEnd(player.rank)
      player.update()
      this.showRank()
    }
  }
  gameOver() {
    swal({
      title: `Fim de Jogo`,
      text: 'Oops você perdeu a corrida!',
      imageUrl:
        'https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png',
      imageSize: '100x100',
      confirmButtonText: 'Obrigado por jogar'
    })
  }

  handlePlayerControls() {
    //manipulando eventos de teclado

    if (keyIsDown(UP_ARROW)) {
      player.positionY += 10
      this.playerMoving = true
      player.update()
    }
    if (keyIsDown(LEFT_ARROW)) {
      player.positionX -= 5
      this.leftKey = true
      player.update()
    }
    if (keyIsDown(RIGHT_ARROW)) {
      player.positionY += 5
      this.leftKey = false
      player.update()
    }
  }
}
