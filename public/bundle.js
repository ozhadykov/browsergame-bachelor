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

    ctx.fillRect(300, 510, 120, 30)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL29wdC9ob21lYnJldy9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lL2NvbnN0YW50cy5qcyIsImdhbWUvZ2FtZS5qcyIsImdhbWUvbWFpbi5qcyIsImdhbWUvcGxheWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IGdhbWVDb25zdGFudHMgPSB7XG4gIGNhbnZhc1dpZHRoOiA5NjAsXG4gIGNhbnZhc0hlaWdodDogNTQwLFxuICBncmF2aXR5OiAwLjVcbn1cblxuY29uc3QgZ2FtZVN0YXRlID0ge1xuICBjYW5KdW1wOiB0cnVlLFxuICBpbkp1bXA6IGZhbHNlLFxuICBsYXN0UHJlc3NlZFJpZ2h0OiB0cnVlLFxufVxuXG5jb25zdCBnYW1lSGVscGVycyA9IHtcbiAgc3RhcnRUaW1lOiBudWxsLFxuICBlbmRUaW1lOiBudWxsLFxuICBqdW1wRHVyYXRpb246IG51bGwsIFxufVxuXG5jb25zdCBzdGFydGVkUHJlc3NpbmdKdW1wID0gKCkgPT4ge1xuICBnYW1lSGVscGVycy5zdGFydFRpbWUgPSBEYXRlLm5vdygpXG59XG5cbmNvbnN0IHN0b3BwZWRQcmVzc2luZ0p1bXAgPSAoKSA9PiB7XG4gIGdhbWVIZWxwZXJzLmVuZFRpbWUgPSBEYXRlLm5vdygpXG59XG5cblxuXG5jb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXktY2FudmFzJylcbmNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBnYW1lQ29uc3RhbnRzLFxuICBjYW52YXMsXG4gIGN0eCxcbiAgZ2FtZVN0YXRlLFxuICBzdGFydGVkUHJlc3NpbmdKdW1wLFxuICBzdG9wcGVkUHJlc3NpbmdKdW1wLFxuICBnYW1lSGVscGVyc1xufTtcbiIsIlwidXNlIHN0cmljdFwiXG5cbmNvbnN0IFBsYXllciA9IHJlcXVpcmUoJy4vcGxheWVyLmpzJylcbmNvbnN0IHtcbiAgY2FudmFzLFxuICBjdHgsXG4gIGdhbWVTdGF0ZSxcbiAgc3RhcnRlZFByZXNzaW5nSnVtcCxcbiAgc3RvcHBlZFByZXNzaW5nSnVtcCxcbiAgZ2FtZUhlbHBlcnNcbn0gPSByZXF1aXJlKCcuL2NvbnN0YW50cy5qcycpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgR2FtZSB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgLy8gcmVxdWVzdCBhbmltYXRpb24gZnJhbWUgaGFuZGxlXG4gICAgdGhpcy5yYWYgPSBudWxsXG4gICAgdGhpcy5wbGF5ZXIgPSBudWxsXG4gICAgdGhpcy5rZXlzID0ge1xuICAgICAgZDoge1xuICAgICAgICBwcmVzc2VkOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgICBhOiB7XG4gICAgICAgIHByZXNzZWQ6IGZhbHNlLFxuICAgICAgfSxcbiAgICAgIHc6IHtcbiAgICAgICAgcHJlc3NlZDogZmFsc2UsXG4gICAgICB9XG4gICAgfVxuICB9XG5cblxuICBzdGFydCgpIHtcbiAgICAvLyB0aGlzIGlzIGltcG9ydGFudCBmb3IgYW5pbWF0aW9uIHB1cnBvc2VzLCBkbyBub3QgbmVlZCBub3dcbiAgICB0aGlzLnRpbWVPZkxhc3RGcmFtZSA9IERhdGUubm93KClcblxuICAgIC8vIGhlcmUgd2UgYXJlIHJlcXVpcmluZyB3aW5kb3cgdG8gcmVsb2FkIHRvIG1heCBmcmFtZXJhdGUgcG9zc2libGVcbiAgICB0aGlzLnJhZiA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy50aWNrLmJpbmQodGhpcykpXG5cbiAgICAvLyBjcmVhdGluZyBQbGF5ZXIgaW5zdGFuY2VcbiAgICB0aGlzLnBsYXllciA9IG5ldyBQbGF5ZXIoe1xuICAgICAgcG9zaXRpb246IHtcbiAgICAgICAgeDogMTAwLFxuICAgICAgICB5OiAwXG4gICAgICB9LFxuICAgICAgaGVpZ2h0OiA1MCxcbiAgICAgIHdpZHRoOiA1MCxcbiAgICB9KVxuXG4gICAgLy8gb25seSBkZWJ1Z2dpbmdcbiAgICBjb25zdCBkZWJ1Z0J0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaG93LXN0YXRlJylcbiAgICBkZWJ1Z0J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGdhbWVTdGF0ZSlcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMua2V5cylcbiAgICAgIGNvbnNvbGUubG9nKGdhbWVIZWxwZXJzLmp1bXBEdXJhdGlvbilcbiAgICB9KVxuXG4gICAgLy8gbGlzdGVuaW5nIHRvIHRoZSBrZXlib2FyZCBldmVudHNcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XG4gICAgICBzd2l0Y2ggKGUua2V5KSB7XG4gICAgICAgIGNhc2UgJ2QnOlxuICAgICAgICAgIHRoaXMua2V5cy5kLnByZXNzZWQgPSB0cnVlLFxuICAgICAgICAgIGdhbWVTdGF0ZS5sYXN0UHJlc3NlZFJpZ2h0ID0gdHJ1ZVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ2EnOlxuICAgICAgICAgIHRoaXMua2V5cy5hLnByZXNzZWQgPSB0cnVlLFxuICAgICAgICAgIGdhbWVTdGF0ZS5sYXN0UHJlc3NlZFJpZ2h0ID0gZmFsc2VcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICd3JzpcbiAgICAgICAgICBpZiAoIXRoaXMua2V5cy53LnByZXNzZWQgJiYgZ2FtZVN0YXRlLmNhbkp1bXAgJiYgIWdhbWVTdGF0ZS5pbkp1bXApIHtcbiAgICAgICAgICAgIHN0YXJ0ZWRQcmVzc2luZ0p1bXAoKVxuICAgICAgICAgICAgZ2FtZVN0YXRlLmluSnVtcCA9IHRydWVcbiAgICAgICAgICAgIHRoaXMua2V5cy53LnByZXNzZWQgPSB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfSlcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChldnQpID0+IHtcbiAgICAgIHN3aXRjaCAoZXZ0LmtleSkge1xuICAgICAgICBjYXNlICdkJzpcbiAgICAgICAgICB0aGlzLmtleXMuZC5wcmVzc2VkID0gZmFsc2VcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdhJzpcbiAgICAgICAgICB0aGlzLmtleXMuYS5wcmVzc2VkID0gZmFsc2VcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICd3JzpcbiAgICAgICAgICBpZiAoZ2FtZVN0YXRlLmNhbkp1bXAgJiYgZ2FtZVN0YXRlLmluSnVtcCkge1xuICAgICAgICAgICAgdGhpcy5rZXlzLncucHJlc3NlZCA9IGZhbHNlXG4gICAgICAgICAgICBzdG9wcGVkUHJlc3NpbmdKdW1wKClcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlbmQgdGltZSB2YXInLCBnYW1lSGVscGVycy5lbmRUaW1lIC0gZ2FtZUhlbHBlcnMuc3RhcnRUaW1lKVxuICAgICAgICAgICAgY29uc29sZS5sb2coRGF0ZS5ub3coKSAtIGdhbWVIZWxwZXJzLnN0YXJ0VGltZSlcbiAgICAgICAgICAgIGdhbWVIZWxwZXJzLmp1bXBEdXJhdGlvbiA9IGdhbWVIZWxwZXJzLmVuZFRpbWUgLSBnYW1lSGVscGVycy5zdGFydFRpbWVcbiAgICAgICAgICAgIHRoaXMucGxheWVyLnZlbG9jaXR5LnkgPSAtOCAqIChnYW1lSGVscGVycy5qdW1wRHVyYXRpb24gKiAwLjAwNSlcbiAgICAgICAgICAgIGlmKGdhbWVTdGF0ZS5sYXN0UHJlc3NlZFJpZ2h0KSB7XG4gICAgICAgICAgICAgIHRoaXMucGxheWVyLnZlbG9jaXR5LnggPSBnYW1lSGVscGVycy5qdW1wRHVyYXRpb24gKiAwLjA1XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLnBsYXllci52ZWxvY2l0eS54ID0gLShnYW1lSGVscGVycy5qdW1wRHVyYXRpb24gKiAwLjA1KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBqdW1wXG4gICAgICAgICAgICBnYW1lU3RhdGUuaW5KdW1wID0gZmFsc2VcbiAgICAgICAgICAgIFxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH0pXG4gIH1cblxuXG4gIHN0b3AoKSB7XG4gICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMucmFmKVxuICB9XG5cbiAgdGljaygpIHtcbiAgICAvLy0tLSBjbGVhciBzY3JlZW5cbiAgICBjdHguZmlsbFN0eWxlID0gJ3doaXRlJ1xuICAgIGN0eC5maWxsUmVjdCgwLCAwLCBjYW52YXMuY2xpZW50V2lkdGgsIGNhbnZhcy5jbGllbnRIZWlnaHQpXG5cbiAgICAvLyBkcmF3aW5nIGVsZW1lbnRzXG4gICAgdGhpcy5wbGF5ZXIudXBkYXRlKClcblxuICAgIGN0eC5maWxsUmVjdCgzMDAsIDUxMCwgMTIwLCAzMClcbiAgICAvLyBoYW5kbGluZyBwbGF5ZXIgbW92aW5nIG9uIHgtYXhpc1xuICAgIGlmICh0aGlzLnBsYXllci52ZWxvY2l0eS54ID4gMCkgdGhpcy5wbGF5ZXIudmVsb2NpdHkueCAtPSAwLjJcbiAgICBpZiAodGhpcy5wbGF5ZXIudmVsb2NpdHkueCA8IDApIHRoaXMucGxheWVyLnZlbG9jaXR5LnggKz0gMC4yXG4gICAgaWYgKHRoaXMucGxheWVyLnZlbG9jaXR5LnggPCAwLjIgJiYgdGhpcy5wbGF5ZXIudmVsb2NpdHkueCA+IC0wLjIpIHRoaXMucGxheWVyLnZlbG9jaXR5LnggPSAwXG4gICAgaWYgKHRoaXMua2V5cy5kLnByZXNzZWQgJiYgZ2FtZVN0YXRlLmNhbkp1bXApIHRoaXMucGxheWVyLnZlbG9jaXR5LnggPSA1XG4gICAgZWxzZSBpZiAodGhpcy5rZXlzLmEucHJlc3NlZCAmJiBnYW1lU3RhdGUuY2FuSnVtcCkgdGhpcy5wbGF5ZXIudmVsb2NpdHkueCA9IC01XG5cbiAgICAvLyBjYWxsaW5nIGFuaW1hdGlvbiBmdW5jdGlvbiBhZ2FpblxuICAgIHRoaXMucmFmID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnRpY2suYmluZCh0aGlzKSlcbiAgfVxufVxuIiwiXCJ1c2Ugc3RyaWN0XCJcblxuY29uc3QgR2FtZSA9IHJlcXVpcmUoXCIuL2dhbWVcIilcbmxldCBteUdhbWUgPSBuZXcgR2FtZSgpXG5teUdhbWUuc3RhcnQoKVxuIiwiXCJ1c2Ugc3RyaWN0XCJcblxuY29uc3Qge1xuICBnYW1lQ29uc3RhbnRzLFxuICBjdHgsXG4gIGdhbWVTdGF0ZVxufSA9IHJlcXVpcmUoJy4vY29uc3RhbnRzLmpzJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBQbGF5ZXIge1xuXG4gIGNvbnN0cnVjdG9yKHBhcmFtcykge1xuICAgIHRoaXMucG9zaXRpb24gPSBwYXJhbXMucG9zaXRpb247XG4gICAgdGhpcy52ZWxvY2l0eSA9IHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAxXG4gICAgfVxuICAgIHRoaXMuaGVpZ2h0ID0gcGFyYW1zLmhlaWdodDtcbiAgICB0aGlzLndpZHRoID0gcGFyYW1zLndpZHRoO1xuICB9XG5cbiAgZHJhdygpIHtcbiAgfVxuXG4gIHVwZGF0ZSgpIHtcblxuICAgIGN0eC5maWxsU3R5bGUgPSAncmdiYSgwLCAyNTUsIDAsIDAuNSknXG4gICAgY3R4LmZpbGxSZWN0KHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcbiAgICBjdHguZmlsbFN0eWxlID0gJ3JnYmEoMjU1LCAwLCAwLCAwLjUpJ1xuICAgIGlmIChnYW1lU3RhdGUubGFzdFByZXNzZWRSaWdodCkge1xuICAgICAgY3R4LmZpbGxSZWN0KHRoaXMucG9zaXRpb24ueCArICh0aGlzLndpZHRoIC0gMiAqICh0aGlzLndpZHRoLzUpKSwgdGhpcy5wb3NpdGlvbi55ICsgdGhpcy5oZWlnaHQvNSwgdGhpcy53aWR0aC81LCB0aGlzLmhlaWdodC81KVxuICAgIH0gZWxzZSB7XG4gICAgICBjdHguZmlsbFJlY3QodGhpcy5wb3NpdGlvbi54ICsgdGhpcy53aWR0aC81LCB0aGlzLnBvc2l0aW9uLnkgKyB0aGlzLmhlaWdodC81LCB0aGlzLndpZHRoLzUsIHRoaXMuaGVpZ2h0LzUpXG4gICAgfVxuICAgIFxuXG4gICAgLy8gd2Ugd2lsbCB1c2UgaXQgd2hlbiB3ZSB3aWxsIGdldCBvdXIgZ2FtZSBncmFwaGljc1xuICAgIC8vdGhpcy5kcmF3KCk7XG5cbiAgICB0aGlzLnBvc2l0aW9uLnggKz0gdGhpcy52ZWxvY2l0eS54XG4gICAgdGhpcy5jaGVja0Zvckhvcml6b250YWxDb2xsaXNpb25zKClcbiAgICB0aGlzLmFwcGx5R3Jhdml0eSgpXG4gICAgdGhpcy5jaGVja0ZvclZlcnRpY2FsQ29sbGlzaW9ucygpXG4gIH1cblxuICBhcHBseUdyYXZpdHkoKSB7XG4gICAgdGhpcy5wb3NpdGlvbi55ICs9IHRoaXMudmVsb2NpdHkueVxuICAgIHRoaXMudmVsb2NpdHkueSArPSBnYW1lQ29uc3RhbnRzLmdyYXZpdHlcbiAgfVxuXG4gIGNoZWNrRm9yVmVydGljYWxDb2xsaXNpb25zKCkge1xuICAgIC8vIHNpbXBsZSBjaGVja2luZywgYmVjYXVzZSB3ZSB3aWxsIHVzZSBzb29uIHNvbWV0aGluZyBiZXR0ZXIgOilcbiAgICBpZiAodGhpcy5wb3NpdGlvbi55ICsgdGhpcy5oZWlnaHQgKyB0aGlzLnZlbG9jaXR5LnkgPiBnYW1lQ29uc3RhbnRzLmNhbnZhc0hlaWdodCkge1xuICAgICAgdGhpcy52ZWxvY2l0eS55ID0gMFxuICAgICAgZ2FtZVN0YXRlLmNhbkp1bXAgPSB0cnVlXG4gICAgfSBlbHNlXG4gICAgICBnYW1lU3RhdGUuY2FuSnVtcCA9IGZhbHNlXG5cbiAgfVxuXG4gIGNoZWNrRm9ySG9yaXpvbnRhbENvbGxpc2lvbnMoKSB7XG4gICAgLy8gc2ltcGxlIGNoZWNraW5nLCBiZWNhdXNlIHdlIHdpbGwgdXNlIHNvb24gc29tZXRoaW5nIGJldHRlciA6KVxuICAgIGlmICghZ2FtZVN0YXRlLmNhbkp1bXApIHtcbiAgICAgIGlmICh0aGlzLnBvc2l0aW9uLnggKyB0aGlzLnZlbG9jaXR5LnggPCAwKSB7XG4gICAgICAgIHRoaXMucG9zaXRpb24ueCA9IDA7XG4gICAgICAgIHRoaXMudmVsb2NpdHkueCA9IC10aGlzLnZlbG9jaXR5LnhcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnBvc2l0aW9uLnggKyB0aGlzLndpZHRoICsgdGhpcy52ZWxvY2l0eS54ID4gZ2FtZUNvbnN0YW50cy5jYW52YXNXaWR0aCkge1xuICAgICAgICB0aGlzLnZlbG9jaXR5LnggPSAtdGhpcy52ZWxvY2l0eS54XG4gICAgICAgIHRoaXMucG9zaXRpb24ueCA9IGdhbWVDb25zdGFudHMuY2FudmFzV2lkdGggLSB0aGlzLndpZHRoXG4gICAgICB9ICBcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMucG9zaXRpb24ueCArIHRoaXMudmVsb2NpdHkueCA8IDApIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbi54ID0gMDtcbiAgICAgICAgdGhpcy52ZWxvY2l0eS54ID0gMFxuICAgICAgfVxuICAgICAgaWYgKHRoaXMucG9zaXRpb24ueCArIHRoaXMud2lkdGggKyB0aGlzLnZlbG9jaXR5LnggPiBnYW1lQ29uc3RhbnRzLmNhbnZhc1dpZHRoKSB7XG4gICAgICAgIHRoaXMudmVsb2NpdHkueCA9IDBcbiAgICAgICAgdGhpcy5wb3NpdGlvbi54ID0gZ2FtZUNvbnN0YW50cy5jYW52YXNXaWR0aCAtIHRoaXMud2lkdGhcbiAgICAgIH0gIFxuICAgIH1cbiAgfSBcbn1cbiJdfQ==
