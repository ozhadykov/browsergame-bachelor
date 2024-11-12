(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const gameConstants = {
  canvasWidth: 960,
  canvasHeight: 540,
  gravity: 0.5
}

const gameState = {
  canJump: true,
  inJump: false,
  lastPressedRight: true,
}

const gameHelpers = {
  startTime: null,
  endTime: null,
  jumpDuration: null, 
}

const startedPressingJump = () => {
  gameHelpers.startTime = Date.now()
}

const stoppedPressingJump = () => {
  gameHelpers.endTime = Date.now()
}



const canvas = document.getElementById('my-canvas')
const ctx = canvas.getContext('2d')

module.exports = {
  gameConstants,
  canvas,
  ctx,
  gameState,
  startedPressingJump,
  stoppedPressingJump,
  gameHelpers
};

},{}],2:[function(require,module,exports){
"use strict"

const Player = require('./player.js')
const {
  canvas,
  ctx,
  gameState,
  startedPressingJump,
  stoppedPressingJump,
  gameHelpers
} = require('./constants.js')

module.exports = class Game {

  constructor() {
    // request animation frame handle
    this.raf = null
    this.player = null
    this.keys = {
      d: {
        pressed: false,
      },
      a: {
        pressed: false,
      },
      w: {
        pressed: false,
      }
    }
  }


  start() {
    // this is important for animation purposes, do not need now
    this.timeOfLastFrame = Date.now()

    // here we are requiring window to reload to max framerate possible
    this.raf = window.requestAnimationFrame(this.tick.bind(this))

    // creating Player instance
    this.player = new Player({
      position: {
        x: 100,
        y: 0
      },
      height: 50,
      width: 50,
    })

    // only debugging
    const debugBtn = document.getElementById('show-state')
    debugBtn.addEventListener('click', () => {
      console.log(gameState)
      console.log(this.keys)
      console.log(gameHelpers.jumpDuration)
    })

    // listening to the keyboard events
    window.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'd':
          this.keys.d.pressed = true,
          gameState.lastPressedRight = true
          break
        case 'a':
          this.keys.a.pressed = true,
          gameState.lastPressedRight = false
          break
        case 'w':
          if (!this.keys.w.pressed && gameState.canJump && !gameState.inJump) {
            startedPressingJump()
            gameState.inJump = true
            this.keys.w.pressed = true
          }
          break
      }
    })

    window.addEventListener('keyup', (evt) => {
      switch (evt.key) {
        case 'd':
          this.keys.d.pressed = false
          break
        case 'a':
          this.keys.a.pressed = false
          break
        case 'w':
          if (gameState.canJump && gameState.inJump) {
            this.keys.w.pressed = false
            stoppedPressingJump()
            console.log('end time var', gameHelpers.endTime - gameHelpers.startTime)
            console.log(Date.now() - gameHelpers.startTime)
            gameHelpers.jumpDuration = gameHelpers.endTime - gameHelpers.startTime
            this.player.velocity.y = -8 * (gameHelpers.jumpDuration * 0.005)
            if(gameState.lastPressedRight) {
              this.player.velocity.x = gameHelpers.jumpDuration * 0.05
            } else {
              this.player.velocity.x = -(gameHelpers.jumpDuration * 0.05)
            }
            
            // jump
            gameState.inJump = false
            
          }
          break
      }
    })
  }


  stop() {
    window.cancelAnimationFrame(this.raf)
  }

  tick() {
    //--- clear screen
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight)

    // drawing elements
    this.player.update()

    // handling player moving on x-axis
    if (this.player.velocity.x > 0) this.player.velocity.x -= 0.2
    if (this.player.velocity.x < 0) this.player.velocity.x += 0.2
    if (this.player.velocity.x < 0.2 && this.player.velocity.x > -0.2) this.player.velocity.x = 0
    if (this.keys.d.pressed && gameState.canJump) this.player.velocity.x = 5
    else if (this.keys.a.pressed && gameState.canJump) this.player.velocity.x = -5

    // calling animation function again
    this.raf = window.requestAnimationFrame(this.tick.bind(this))
  }
}

},{"./constants.js":1,"./player.js":4}],3:[function(require,module,exports){
"use strict"

const Game = require("./game")
let myGame = new Game()
myGame.start()

},{"./game":2}],4:[function(require,module,exports){
"use strict"

const {
  gameConstants,
  ctx,
  gameState
} = require('./constants.js')

module.exports = class Player {

  constructor(params) {
    this.position = params.position;
    this.velocity = {
      x: 0,
      y: 1
    }
    this.height = params.height;
    this.width = params.width;
  }

  draw() {
  }

  update() {

    ctx.fillStyle = 'rgba(0, 255, 0, 0.5)'
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'
    if (gameState.lastPressedRight) {
      ctx.fillRect(this.position.x + (this.width - 2 * (this.width/5)), this.position.y + this.height/5, this.width/5, this.height/5)
    } else {
      ctx.fillRect(this.position.x + this.width/5, this.position.y + this.height/5, this.width/5, this.height/5)
    }
    

    // we will use it when we will get our game graphics
    //this.draw();

    this.position.x += this.velocity.x
    this.checkForHorizontalCollisions()
    this.applyGravity()
    this.checkForVerticalCollisions()
  }

  applyGravity() {
    this.position.y += this.velocity.y
    this.velocity.y += gameConstants.gravity
  }

  checkForVerticalCollisions() {
    // simple checking, because we will use soon something better :)
    if (this.position.y + this.height + this.velocity.y > gameConstants.canvasHeight) {
      this.velocity.y = 0
      gameState.canJump = true
    } else
      gameState.canJump = false

  }

  checkForHorizontalCollisions() {
    // simple checking, because we will use soon something better :)
    if (!gameState.canJump) {
      if (this.position.x + this.velocity.x < 0) {
        this.position.x = 0;
        this.velocity.x = -this.velocity.x
      }
      if (this.position.x + this.width + this.velocity.x > gameConstants.canvasWidth) {
        this.velocity.x = -this.velocity.x
        this.position.x = gameConstants.canvasWidth - this.width
      }  
    } else {
      if (this.position.x + this.velocity.x < 0) {
        this.position.x = 0;
        this.velocity.x = 0
      }
      if (this.position.x + this.width + this.velocity.x > gameConstants.canvasWidth) {
        this.velocity.x = 0
        this.position.x = gameConstants.canvasWidth - this.width
      }  
    }
  } 
}

},{"./constants.js":1}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL29wdC9ob21lYnJldy9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lL2NvbnN0YW50cy5qcyIsImdhbWUvZ2FtZS5qcyIsImdhbWUvbWFpbi5qcyIsImdhbWUvcGxheWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCBnYW1lQ29uc3RhbnRzID0ge1xuICBjYW52YXNXaWR0aDogOTYwLFxuICBjYW52YXNIZWlnaHQ6IDU0MCxcbiAgZ3Jhdml0eTogMC41XG59XG5cbmNvbnN0IGdhbWVTdGF0ZSA9IHtcbiAgY2FuSnVtcDogdHJ1ZSxcbiAgaW5KdW1wOiBmYWxzZSxcbiAgbGFzdFByZXNzZWRSaWdodDogdHJ1ZSxcbn1cblxuY29uc3QgZ2FtZUhlbHBlcnMgPSB7XG4gIHN0YXJ0VGltZTogbnVsbCxcbiAgZW5kVGltZTogbnVsbCxcbiAganVtcER1cmF0aW9uOiBudWxsLCBcbn1cblxuY29uc3Qgc3RhcnRlZFByZXNzaW5nSnVtcCA9ICgpID0+IHtcbiAgZ2FtZUhlbHBlcnMuc3RhcnRUaW1lID0gRGF0ZS5ub3coKVxufVxuXG5jb25zdCBzdG9wcGVkUHJlc3NpbmdKdW1wID0gKCkgPT4ge1xuICBnYW1lSGVscGVycy5lbmRUaW1lID0gRGF0ZS5ub3coKVxufVxuXG5cblxuY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ215LWNhbnZhcycpXG5jb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZ2FtZUNvbnN0YW50cyxcbiAgY2FudmFzLFxuICBjdHgsXG4gIGdhbWVTdGF0ZSxcbiAgc3RhcnRlZFByZXNzaW5nSnVtcCxcbiAgc3RvcHBlZFByZXNzaW5nSnVtcCxcbiAgZ2FtZUhlbHBlcnNcbn07XG4iLCJcInVzZSBzdHJpY3RcIlxuXG5jb25zdCBQbGF5ZXIgPSByZXF1aXJlKCcuL3BsYXllci5qcycpXG5jb25zdCB7XG4gIGNhbnZhcyxcbiAgY3R4LFxuICBnYW1lU3RhdGUsXG4gIHN0YXJ0ZWRQcmVzc2luZ0p1bXAsXG4gIHN0b3BwZWRQcmVzc2luZ0p1bXAsXG4gIGdhbWVIZWxwZXJzXG59ID0gcmVxdWlyZSgnLi9jb25zdGFudHMuanMnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEdhbWUge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIC8vIHJlcXVlc3QgYW5pbWF0aW9uIGZyYW1lIGhhbmRsZVxuICAgIHRoaXMucmFmID0gbnVsbFxuICAgIHRoaXMucGxheWVyID0gbnVsbFxuICAgIHRoaXMua2V5cyA9IHtcbiAgICAgIGQ6IHtcbiAgICAgICAgcHJlc3NlZDogZmFsc2UsXG4gICAgICB9LFxuICAgICAgYToge1xuICAgICAgICBwcmVzc2VkOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgICB3OiB7XG4gICAgICAgIHByZXNzZWQ6IGZhbHNlLFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG5cbiAgc3RhcnQoKSB7XG4gICAgLy8gdGhpcyBpcyBpbXBvcnRhbnQgZm9yIGFuaW1hdGlvbiBwdXJwb3NlcywgZG8gbm90IG5lZWQgbm93XG4gICAgdGhpcy50aW1lT2ZMYXN0RnJhbWUgPSBEYXRlLm5vdygpXG5cbiAgICAvLyBoZXJlIHdlIGFyZSByZXF1aXJpbmcgd2luZG93IHRvIHJlbG9hZCB0byBtYXggZnJhbWVyYXRlIHBvc3NpYmxlXG4gICAgdGhpcy5yYWYgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudGljay5iaW5kKHRoaXMpKVxuXG4gICAgLy8gY3JlYXRpbmcgUGxheWVyIGluc3RhbmNlXG4gICAgdGhpcy5wbGF5ZXIgPSBuZXcgUGxheWVyKHtcbiAgICAgIHBvc2l0aW9uOiB7XG4gICAgICAgIHg6IDEwMCxcbiAgICAgICAgeTogMFxuICAgICAgfSxcbiAgICAgIGhlaWdodDogNTAsXG4gICAgICB3aWR0aDogNTAsXG4gICAgfSlcblxuICAgIC8vIG9ubHkgZGVidWdnaW5nXG4gICAgY29uc3QgZGVidWdCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2hvdy1zdGF0ZScpXG4gICAgZGVidWdCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhnYW1lU3RhdGUpXG4gICAgICBjb25zb2xlLmxvZyh0aGlzLmtleXMpXG4gICAgICBjb25zb2xlLmxvZyhnYW1lSGVscGVycy5qdW1wRHVyYXRpb24pXG4gICAgfSlcblxuICAgIC8vIGxpc3RlbmluZyB0byB0aGUga2V5Ym9hcmQgZXZlbnRzXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xuICAgICAgc3dpdGNoIChlLmtleSkge1xuICAgICAgICBjYXNlICdkJzpcbiAgICAgICAgICB0aGlzLmtleXMuZC5wcmVzc2VkID0gdHJ1ZSxcbiAgICAgICAgICBnYW1lU3RhdGUubGFzdFByZXNzZWRSaWdodCA9IHRydWVcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdhJzpcbiAgICAgICAgICB0aGlzLmtleXMuYS5wcmVzc2VkID0gdHJ1ZSxcbiAgICAgICAgICBnYW1lU3RhdGUubGFzdFByZXNzZWRSaWdodCA9IGZhbHNlXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAndyc6XG4gICAgICAgICAgaWYgKCF0aGlzLmtleXMudy5wcmVzc2VkICYmIGdhbWVTdGF0ZS5jYW5KdW1wICYmICFnYW1lU3RhdGUuaW5KdW1wKSB7XG4gICAgICAgICAgICBzdGFydGVkUHJlc3NpbmdKdW1wKClcbiAgICAgICAgICAgIGdhbWVTdGF0ZS5pbkp1bXAgPSB0cnVlXG4gICAgICAgICAgICB0aGlzLmtleXMudy5wcmVzc2VkID0gdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH0pXG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoZXZ0KSA9PiB7XG4gICAgICBzd2l0Y2ggKGV2dC5rZXkpIHtcbiAgICAgICAgY2FzZSAnZCc6XG4gICAgICAgICAgdGhpcy5rZXlzLmQucHJlc3NlZCA9IGZhbHNlXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnYSc6XG4gICAgICAgICAgdGhpcy5rZXlzLmEucHJlc3NlZCA9IGZhbHNlXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAndyc6XG4gICAgICAgICAgaWYgKGdhbWVTdGF0ZS5jYW5KdW1wICYmIGdhbWVTdGF0ZS5pbkp1bXApIHtcbiAgICAgICAgICAgIHRoaXMua2V5cy53LnByZXNzZWQgPSBmYWxzZVxuICAgICAgICAgICAgc3RvcHBlZFByZXNzaW5nSnVtcCgpXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZW5kIHRpbWUgdmFyJywgZ2FtZUhlbHBlcnMuZW5kVGltZSAtIGdhbWVIZWxwZXJzLnN0YXJ0VGltZSlcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKERhdGUubm93KCkgLSBnYW1lSGVscGVycy5zdGFydFRpbWUpXG4gICAgICAgICAgICBnYW1lSGVscGVycy5qdW1wRHVyYXRpb24gPSBnYW1lSGVscGVycy5lbmRUaW1lIC0gZ2FtZUhlbHBlcnMuc3RhcnRUaW1lXG4gICAgICAgICAgICB0aGlzLnBsYXllci52ZWxvY2l0eS55ID0gLTggKiAoZ2FtZUhlbHBlcnMuanVtcER1cmF0aW9uICogMC4wMDUpXG4gICAgICAgICAgICBpZihnYW1lU3RhdGUubGFzdFByZXNzZWRSaWdodCkge1xuICAgICAgICAgICAgICB0aGlzLnBsYXllci52ZWxvY2l0eS54ID0gZ2FtZUhlbHBlcnMuanVtcER1cmF0aW9uICogMC4wNVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5wbGF5ZXIudmVsb2NpdHkueCA9IC0oZ2FtZUhlbHBlcnMuanVtcER1cmF0aW9uICogMC4wNSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8ganVtcFxuICAgICAgICAgICAgZ2FtZVN0YXRlLmluSnVtcCA9IGZhbHNlXG4gICAgICAgICAgICBcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cblxuICBzdG9wKCkge1xuICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLnJhZilcbiAgfVxuXG4gIHRpY2soKSB7XG4gICAgLy8tLS0gY2xlYXIgc2NyZWVuXG4gICAgY3R4LmZpbGxTdHlsZSA9ICd3aGl0ZSdcbiAgICBjdHguZmlsbFJlY3QoMCwgMCwgY2FudmFzLmNsaWVudFdpZHRoLCBjYW52YXMuY2xpZW50SGVpZ2h0KVxuXG4gICAgLy8gZHJhd2luZyBlbGVtZW50c1xuICAgIHRoaXMucGxheWVyLnVwZGF0ZSgpXG5cbiAgICAvLyBoYW5kbGluZyBwbGF5ZXIgbW92aW5nIG9uIHgtYXhpc1xuICAgIGlmICh0aGlzLnBsYXllci52ZWxvY2l0eS54ID4gMCkgdGhpcy5wbGF5ZXIudmVsb2NpdHkueCAtPSAwLjJcbiAgICBpZiAodGhpcy5wbGF5ZXIudmVsb2NpdHkueCA8IDApIHRoaXMucGxheWVyLnZlbG9jaXR5LnggKz0gMC4yXG4gICAgaWYgKHRoaXMucGxheWVyLnZlbG9jaXR5LnggPCAwLjIgJiYgdGhpcy5wbGF5ZXIudmVsb2NpdHkueCA+IC0wLjIpIHRoaXMucGxheWVyLnZlbG9jaXR5LnggPSAwXG4gICAgaWYgKHRoaXMua2V5cy5kLnByZXNzZWQgJiYgZ2FtZVN0YXRlLmNhbkp1bXApIHRoaXMucGxheWVyLnZlbG9jaXR5LnggPSA1XG4gICAgZWxzZSBpZiAodGhpcy5rZXlzLmEucHJlc3NlZCAmJiBnYW1lU3RhdGUuY2FuSnVtcCkgdGhpcy5wbGF5ZXIudmVsb2NpdHkueCA9IC01XG5cbiAgICAvLyBjYWxsaW5nIGFuaW1hdGlvbiBmdW5jdGlvbiBhZ2FpblxuICAgIHRoaXMucmFmID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnRpY2suYmluZCh0aGlzKSlcbiAgfVxufVxuIiwiXCJ1c2Ugc3RyaWN0XCJcblxuY29uc3QgR2FtZSA9IHJlcXVpcmUoXCIuL2dhbWVcIilcbmxldCBteUdhbWUgPSBuZXcgR2FtZSgpXG5teUdhbWUuc3RhcnQoKVxuIiwiXCJ1c2Ugc3RyaWN0XCJcblxuY29uc3Qge1xuICBnYW1lQ29uc3RhbnRzLFxuICBjdHgsXG4gIGdhbWVTdGF0ZVxufSA9IHJlcXVpcmUoJy4vY29uc3RhbnRzLmpzJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBQbGF5ZXIge1xuXG4gIGNvbnN0cnVjdG9yKHBhcmFtcykge1xuICAgIHRoaXMucG9zaXRpb24gPSBwYXJhbXMucG9zaXRpb247XG4gICAgdGhpcy52ZWxvY2l0eSA9IHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAxXG4gICAgfVxuICAgIHRoaXMuaGVpZ2h0ID0gcGFyYW1zLmhlaWdodDtcbiAgICB0aGlzLndpZHRoID0gcGFyYW1zLndpZHRoO1xuICB9XG5cbiAgZHJhdygpIHtcbiAgfVxuXG4gIHVwZGF0ZSgpIHtcblxuICAgIGN0eC5maWxsU3R5bGUgPSAncmdiYSgwLCAyNTUsIDAsIDAuNSknXG4gICAgY3R4LmZpbGxSZWN0KHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcbiAgICBjdHguZmlsbFN0eWxlID0gJ3JnYmEoMjU1LCAwLCAwLCAwLjUpJ1xuICAgIGlmIChnYW1lU3RhdGUubGFzdFByZXNzZWRSaWdodCkge1xuICAgICAgY3R4LmZpbGxSZWN0KHRoaXMucG9zaXRpb24ueCArICh0aGlzLndpZHRoIC0gMiAqICh0aGlzLndpZHRoLzUpKSwgdGhpcy5wb3NpdGlvbi55ICsgdGhpcy5oZWlnaHQvNSwgdGhpcy53aWR0aC81LCB0aGlzLmhlaWdodC81KVxuICAgIH0gZWxzZSB7XG4gICAgICBjdHguZmlsbFJlY3QodGhpcy5wb3NpdGlvbi54ICsgdGhpcy53aWR0aC81LCB0aGlzLnBvc2l0aW9uLnkgKyB0aGlzLmhlaWdodC81LCB0aGlzLndpZHRoLzUsIHRoaXMuaGVpZ2h0LzUpXG4gICAgfVxuICAgIFxuXG4gICAgLy8gd2Ugd2lsbCB1c2UgaXQgd2hlbiB3ZSB3aWxsIGdldCBvdXIgZ2FtZSBncmFwaGljc1xuICAgIC8vdGhpcy5kcmF3KCk7XG5cbiAgICB0aGlzLnBvc2l0aW9uLnggKz0gdGhpcy52ZWxvY2l0eS54XG4gICAgdGhpcy5jaGVja0Zvckhvcml6b250YWxDb2xsaXNpb25zKClcbiAgICB0aGlzLmFwcGx5R3Jhdml0eSgpXG4gICAgdGhpcy5jaGVja0ZvclZlcnRpY2FsQ29sbGlzaW9ucygpXG4gIH1cblxuICBhcHBseUdyYXZpdHkoKSB7XG4gICAgdGhpcy5wb3NpdGlvbi55ICs9IHRoaXMudmVsb2NpdHkueVxuICAgIHRoaXMudmVsb2NpdHkueSArPSBnYW1lQ29uc3RhbnRzLmdyYXZpdHlcbiAgfVxuXG4gIGNoZWNrRm9yVmVydGljYWxDb2xsaXNpb25zKCkge1xuICAgIC8vIHNpbXBsZSBjaGVja2luZywgYmVjYXVzZSB3ZSB3aWxsIHVzZSBzb29uIHNvbWV0aGluZyBiZXR0ZXIgOilcbiAgICBpZiAodGhpcy5wb3NpdGlvbi55ICsgdGhpcy5oZWlnaHQgKyB0aGlzLnZlbG9jaXR5LnkgPiBnYW1lQ29uc3RhbnRzLmNhbnZhc0hlaWdodCkge1xuICAgICAgdGhpcy52ZWxvY2l0eS55ID0gMFxuICAgICAgZ2FtZVN0YXRlLmNhbkp1bXAgPSB0cnVlXG4gICAgfSBlbHNlXG4gICAgICBnYW1lU3RhdGUuY2FuSnVtcCA9IGZhbHNlXG5cbiAgfVxuXG4gIGNoZWNrRm9ySG9yaXpvbnRhbENvbGxpc2lvbnMoKSB7XG4gICAgLy8gc2ltcGxlIGNoZWNraW5nLCBiZWNhdXNlIHdlIHdpbGwgdXNlIHNvb24gc29tZXRoaW5nIGJldHRlciA6KVxuICAgIGlmICghZ2FtZVN0YXRlLmNhbkp1bXApIHtcbiAgICAgIGlmICh0aGlzLnBvc2l0aW9uLnggKyB0aGlzLnZlbG9jaXR5LnggPCAwKSB7XG4gICAgICAgIHRoaXMucG9zaXRpb24ueCA9IDA7XG4gICAgICAgIHRoaXMudmVsb2NpdHkueCA9IC10aGlzLnZlbG9jaXR5LnhcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnBvc2l0aW9uLnggKyB0aGlzLndpZHRoICsgdGhpcy52ZWxvY2l0eS54ID4gZ2FtZUNvbnN0YW50cy5jYW52YXNXaWR0aCkge1xuICAgICAgICB0aGlzLnZlbG9jaXR5LnggPSAtdGhpcy52ZWxvY2l0eS54XG4gICAgICAgIHRoaXMucG9zaXRpb24ueCA9IGdhbWVDb25zdGFudHMuY2FudmFzV2lkdGggLSB0aGlzLndpZHRoXG4gICAgICB9ICBcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMucG9zaXRpb24ueCArIHRoaXMudmVsb2NpdHkueCA8IDApIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbi54ID0gMDtcbiAgICAgICAgdGhpcy52ZWxvY2l0eS54ID0gMFxuICAgICAgfVxuICAgICAgaWYgKHRoaXMucG9zaXRpb24ueCArIHRoaXMud2lkdGggKyB0aGlzLnZlbG9jaXR5LnggPiBnYW1lQ29uc3RhbnRzLmNhbnZhc1dpZHRoKSB7XG4gICAgICAgIHRoaXMudmVsb2NpdHkueCA9IDBcbiAgICAgICAgdGhpcy5wb3NpdGlvbi54ID0gZ2FtZUNvbnN0YW50cy5jYW52YXNXaWR0aCAtIHRoaXMud2lkdGhcbiAgICAgIH0gIFxuICAgIH1cbiAgfSBcbn1cbiJdfQ==
