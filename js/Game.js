class Game {
  constructor() {
    this.leaderboardTitle = createElement("h2")
    this.leader1 = createElement("h2")
    this.leader2 = createElement("h2")
  }
  //reading the gamestate value from the database
  getState(){
    database.ref("gameState").on("value", function(data){
      gameState = data.val()
    })
  }
  //writing the gamestate value to the database
  updateState(state){
    database.ref("/").update({
      gameState: state
    })
  }
  start() {
    form = new Form();
    form.display();
    player = new Player();
    player.getCount()
    car1 = createSprite(width /2 - 100, height - 100)
    car1.addImage(carImage1)
    car1.scale = 0.07
    car2 = createSprite(width /2 + 100, height - 100)
    car2.addImage(carImage2)
    car2.scale = 0.07
    cars = [car1, car2]
    fuelGroup = new Group()
    powerGroup = new Group()
    obstacleGroup = new Group()
    this.addSprites(fuelGroup, 5, fuelimg, 0.02)
    this.addSprites(powerGroup, 15, powerimg, 0.09)
    this.addSprites(obstacleGroup, 6, obstacleimg, 0.04)
    
  }

  addSprites(group, number, img, scale){
    for(var i = 0; i < number; i ++){
      var x = random(width/2 - 150, width/2 + 150)
      var y = random(-height*4.5,height - 400)
      var object = createSprite(x, y)
      object.addImage(img)
      object.scale = scale
      group.add(object)
    }
  }

  //!== not equal
  play(){
    form.hide()
    Player.getPlayersInfo()
    this.leaderboardTitle.html("Leaderboard")
    this.leaderboardTitle.position(95,140)
    this.leader1.position(95,180)
    this.leader2.position(95,230)
    if(allPlayers!== undefined){
      background("lightblue")
      image(TheEntireMap, 0, -height*5,width,height*6)
      var leader1, leader2
      var players = Object.values(allPlayers)
      if (
        (players[0].rank === 0 && players[1].rank === 0) ||
        players[0].rank === 1
      ) {
        leader1 =
        players[0].rank +
        "     " +
        players[0].name + 
        "     "+ 
        players[0].score 
        leader2 =
        players[1].rank +
        "     " +
        players[1].name +
        "     "+ 
        players[1].score 
      }

      if (players[1].rank === 1) {
        leader2 =
        players[0].rank +
        "     " +
        players[0].name +
        "     "+ 
        players[0].score 
        leader1 =
        players[1].rank +
        "     " +
        players[1].name  +
        "     "+ 
        players[1].score 

      }
      this.leader1.html(leader1);
      this.leader2.html(leader2);
      var index = 0
      for(var i in allPlayers){
        index = index+1
        var x = allPlayers[i].positionX
        var y = height - allPlayers[i].positionY
        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;
        if(index===player.index){
          this.handleFuel(index)
          this.handlePower(index)
          camera.position.y = cars[index - 1].position.y
        }
      }
      if(keyIsDown(UP_ARROW)){
        player.positionY = player.positionY+10
        player.updateDistance()
      }
      if(keyIsDown(LEFT_ARROW) &&player.positionX>500){
        player.positionX = player.positionX-5
        player.updateDistance()
      }
      if(keyIsDown(RIGHT_ARROW) &&player.positionX<width-500){
        player.positionX = player.positionX+5
        player.updateDistance()
      }
      
      drawSprites()
    }
  }

  handleFuel(index){
   cars[index - 1].overlap(fuelGroup, function(a, b){
      player.fuel = 185
      b.remove()
    })
  }

  handlePower(index){
    cars[index - 1].overlap(powerGroup, function(a, b){
      player.score = player.score+20
      player.updateDistance()
      b.remove()
    })
  }
}

