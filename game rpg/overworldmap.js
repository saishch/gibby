class OverworldMap {
    constructor(config) {
      this.gameObjects = config.gameObjects;
      this.walls = config.walls || {};
  
      this.lowerImage = new Image();
      this.lowerImage.src = config.lowerSrc;
  
      this.upperImage = new Image();
      this.upperImage.src = config.upperSrc;
    }
  
    drawLowerImage(ctx,cameraPerson) {
      ctx.drawImage(
        this.lowerImage, 
        utils.withGrid(15)-cameraPerson.x,
        utils.withGrid(10)-cameraPerson.y
      )
    }
  
    drawUpperImage(ctx,cameraPerson) {
      ctx.drawImage(
        this.upperImage, 
        utils.withGrid(15)-cameraPerson.x,
        utils.withGrid(10)-cameraPerson.y
      )
    }
    isSpaceTaken(currentX, currentY, direction) {
      const {x,y} = utils.nextPosition(currentX, currentY, direction);
      return this.walls[`${x},${y}`] || false;
    }

    mountObjects() {
      Object.keys(this.gameObjects).forEach(key => {
  
        let object = this.gameObjects[key];
        object.id = key;
  
        //TODO: determine if this object should actually mount
        object.mount(this);
  
      })
    }
  
    async startCutscene(events) {
      this.isCutscenePlaying = true;
  
      for (let i=0; i<events.length; i++) {
        const eventHandler = new OverworldEvent({
          event: events[i],
          map: this,
        })
        await eventHandler.init();
      }
  
      this.isCutscenePlaying = false;
  
      //Reset NPCs to do their idle behavior
      Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))
    }
  
    checkForActionCutscene() {
      const hero = this.gameObjects["hero"];
      const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
      const match = Object.values(this.gameObjects).find(object => {
        return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
      });
      if (!this.isCutscenePlaying && match && match.talking.length) {
        this.startCutscene(match.talking[0].events)
      }
    }
  
    checkForFootstepCutscene() {
      const hero = this.gameObjects["hero"];
      const match = this.cutsceneSpaces[ `${hero.x},${hero.y}` ];
      if (!this.isCutscenePlaying && match) {
        this.startCutscene( match[0].events )
      }
    }
  
    addWall(x,y) {
      this.walls[`${x},${y}`] = true;
    }
    removeWall(x,y) {
      delete this.walls[`${x},${y}`]
    }
    moveWall(wasX, wasY, direction) {
      this.removeWall(wasX, wasY);
      const {x,y} = utils.nextPosition(wasX, wasY, direction);
      this.addWall(x,y);
    }
}
  
  window.OverworldMaps = {
    mainmap: {
      lowerSrc: "/images/map.png",
      upperSrc: "/images/empty.png",
      gameObjects: {
        hero: new Person({
          isPlayerControlled: true,
          x: utils.withGrid(15),
          y: utils.withGrid(10),
        }),
        sdc1: new Person({
          x: utils.withGrid(12),
          y: utils.withGrid(12),
          src: "/images/sdc2.png",
          behaviorLoop: [
            { type: "stand",  direction: "left", time: 800 },
            { type: "stand",  direction: "up", time: 800 },
            { type: "stand",  direction: "right", time: 1200 },
            { type: "stand",  direction: "up", time: 300 },
          ],
          talking: [
            {
              events: [
                { type: "textMessage", text: "I'm busy...", faceHero: "sdc1" },
                { type: "textMessage", text: "Go away!"},
                { who: "hero", type: "walk",  direction: "left" },
              ]
            }
        ]
        }),
        sdc2: new Person({
          x: utils.withGrid(35),
          y: utils.withGrid(11),
          src: "/images/sdc2.png"

        }),
        sdc3: new Person({
          x: utils.withGrid(9),
          y: utils.withGrid(20),
          src: "/images/sdc4.png"
        }),
        sdc4: new Person({
          x: utils.withGrid(23),
          y: utils.withGrid(8),
          src: "/images/sdc4.png"


          
        })
      },walls:{
        [utils.asGridCoord(42,18)] : true,
        [utils.asGridCoord(42,17)] : true,
        [utils.asGridCoord(42,16)] : true,
        [utils.asGridCoord(42,15)] : true,
        [utils.asGridCoord(42,14)] : true,
        [utils.asGridCoord(42,13)] : true,
        [utils.asGridCoord(42,12)] : true,
        [utils.asGridCoord(43,18)] : true,
        [utils.asGridCoord(44,18)] : true,
        [utils.asGridCoord(45,18)] : true,
        [utils.asGridCoord(46,18)] : true,
        [utils.asGridCoord(47,18)] : true,
        [utils.asGridCoord(48,18)] : true,
        [utils.asGridCoord(49,18)] : true,
        [utils.asGridCoord(50,18)] : true,
        [utils.asGridCoord(42,12)] : true,
        [utils.asGridCoord(43,12)] : true,
        [utils.asGridCoord(44,12)] : true,
        [utils.asGridCoord(45,12)] : true,
        [utils.asGridCoord(46,12)] : true,
        [utils.asGridCoord(47,12)] : true,
        [utils.asGridCoord(48,12)] : true,
        [utils.asGridCoord(49,12)] : true,
        [utils.asGridCoord(50,12)] : true,
        [utils.asGridCoord(51,12)] : true,
        [utils.asGridCoord(52,12)] : true,
        [utils.asGridCoord(53,12)] : true,
        [utils.asGridCoord(54,12)] : true,
        
      },
      cutsceneSpaces: {
        [utils.asGridCoord(15,8)]: [
          {
            events: [
              { type: "changeMap", map: "house" }
          ]

          }

        ]
      
      
    },
    house: {
      lowerSrc: "./images/interior1.png",
      upperSrc: "./images/empty.png",
      gameObjects: {
        hero: new GameObject({
            x: 15,
            y: 10,
        }),
        sdc2: new GameObject({
            x: 12,
            y: 12,
            src: "/images/sdc2.png"
          })
        
        
      }
    },
    barn: {
        lowerSrc: "/images/interior2.png",
        upperSrc: "/images/empty.png",
        gameObjects: {
          hero: new GameObject({
            x: 15,
            y: 10,
          }),
          sdc3: new GameObject({
            x: 12,
            y: 12,
            src: "/images/sdc3.png"
          })
        }
      },
  }
}
  

