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



const canvas = document.getElementById('mycanvas')
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
      console.log('test')
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
"use strict";
const mainmenu1 = document.getElementById("mainmenu");
const mycanvas = document.getElementById("mycanvas"); 
const Game = require("./game");
let myGame = new Game();

mycanvas.style.display = "none"; 

function mainmenu() {
    mycanvas.style.display = "block";
    mainmenu1.style.display = "none"; 
    myGame.start();
}

document.getElementById("startbutton").onclick = mainmenu;
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

},{"./constants.js":1}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lL2NvbnN0YW50cy5qcyIsImdhbWUvZ2FtZS5qcyIsImdhbWUvbWFpbi5qcyIsImdhbWUvcGxheWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCBnYW1lQ29uc3RhbnRzID0ge1xyXG4gIGNhbnZhc1dpZHRoOiA5NjAsXHJcbiAgY2FudmFzSGVpZ2h0OiA1NDAsXHJcbiAgZ3Jhdml0eTogMC41XHJcbn1cclxuXHJcbmNvbnN0IGdhbWVTdGF0ZSA9IHtcclxuICBjYW5KdW1wOiB0cnVlLFxyXG4gIGluSnVtcDogZmFsc2UsXHJcbiAgbGFzdFByZXNzZWRSaWdodDogdHJ1ZSxcclxufVxyXG5cclxuY29uc3QgZ2FtZUhlbHBlcnMgPSB7XHJcbiAgc3RhcnRUaW1lOiBudWxsLFxyXG4gIGVuZFRpbWU6IG51bGwsXHJcbiAganVtcER1cmF0aW9uOiBudWxsLCBcclxufVxyXG5cclxuY29uc3Qgc3RhcnRlZFByZXNzaW5nSnVtcCA9ICgpID0+IHtcclxuICBnYW1lSGVscGVycy5zdGFydFRpbWUgPSBEYXRlLm5vdygpXHJcbn1cclxuXHJcbmNvbnN0IHN0b3BwZWRQcmVzc2luZ0p1bXAgPSAoKSA9PiB7XHJcbiAgZ2FtZUhlbHBlcnMuZW5kVGltZSA9IERhdGUubm93KClcclxufVxyXG5cclxuXHJcblxyXG5jb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXljYW52YXMnKVxyXG5jb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgZ2FtZUNvbnN0YW50cyxcclxuICBjYW52YXMsXHJcbiAgY3R4LFxyXG4gIGdhbWVTdGF0ZSxcclxuICBzdGFydGVkUHJlc3NpbmdKdW1wLFxyXG4gIHN0b3BwZWRQcmVzc2luZ0p1bXAsXHJcbiAgZ2FtZUhlbHBlcnNcclxufTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCJcclxuXHJcbmNvbnN0IFBsYXllciA9IHJlcXVpcmUoJy4vcGxheWVyLmpzJylcclxuY29uc3Qge1xyXG4gIGNhbnZhcyxcclxuICBjdHgsXHJcbiAgZ2FtZVN0YXRlLFxyXG4gIHN0YXJ0ZWRQcmVzc2luZ0p1bXAsXHJcbiAgc3RvcHBlZFByZXNzaW5nSnVtcCxcclxuICBnYW1lSGVscGVyc1xyXG59ID0gcmVxdWlyZSgnLi9jb25zdGFudHMuanMnKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBHYW1lIHtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAvLyByZXF1ZXN0IGFuaW1hdGlvbiBmcmFtZSBoYW5kbGVcclxuICAgIHRoaXMucmFmID0gbnVsbFxyXG4gICAgdGhpcy5wbGF5ZXIgPSBudWxsXHJcbiAgICB0aGlzLmtleXMgPSB7XHJcbiAgICAgIGQ6IHtcclxuICAgICAgICBwcmVzc2VkOiBmYWxzZSxcclxuICAgICAgfSxcclxuICAgICAgYToge1xyXG4gICAgICAgIHByZXNzZWQ6IGZhbHNlLFxyXG4gICAgICB9LFxyXG4gICAgICB3OiB7XHJcbiAgICAgICAgcHJlc3NlZDogZmFsc2UsXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICBzdGFydCgpIHtcclxuICAgIC8vIHRoaXMgaXMgaW1wb3J0YW50IGZvciBhbmltYXRpb24gcHVycG9zZXMsIGRvIG5vdCBuZWVkIG5vd1xyXG4gICAgdGhpcy50aW1lT2ZMYXN0RnJhbWUgPSBEYXRlLm5vdygpXHJcblxyXG4gICAgLy8gaGVyZSB3ZSBhcmUgcmVxdWlyaW5nIHdpbmRvdyB0byByZWxvYWQgdG8gbWF4IGZyYW1lcmF0ZSBwb3NzaWJsZVxyXG4gICAgdGhpcy5yYWYgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudGljay5iaW5kKHRoaXMpKVxyXG5cclxuICAgIC8vIGNyZWF0aW5nIFBsYXllciBpbnN0YW5jZVxyXG4gICAgdGhpcy5wbGF5ZXIgPSBuZXcgUGxheWVyKHtcclxuICAgICAgcG9zaXRpb246IHtcclxuICAgICAgICB4OiAxMDAsXHJcbiAgICAgICAgeTogMFxyXG4gICAgICB9LFxyXG4gICAgICBoZWlnaHQ6IDUwLFxyXG4gICAgICB3aWR0aDogNTAsXHJcbiAgICB9KVxyXG5cclxuICAgIC8vIG9ubHkgZGVidWdnaW5nXHJcbiAgICBjb25zdCBkZWJ1Z0J0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaG93LXN0YXRlJylcclxuICAgIGRlYnVnQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhnYW1lU3RhdGUpXHJcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMua2V5cylcclxuICAgICAgY29uc29sZS5sb2coJ3Rlc3QnKVxyXG4gICAgICBjb25zb2xlLmxvZyhnYW1lSGVscGVycy5qdW1wRHVyYXRpb24pXHJcbiAgICB9KVxyXG5cclxuICAgIC8vIGxpc3RlbmluZyB0byB0aGUga2V5Ym9hcmQgZXZlbnRzXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XHJcbiAgICAgIHN3aXRjaCAoZS5rZXkpIHtcclxuICAgICAgICBjYXNlICdkJzpcclxuICAgICAgICAgIHRoaXMua2V5cy5kLnByZXNzZWQgPSB0cnVlLFxyXG4gICAgICAgICAgZ2FtZVN0YXRlLmxhc3RQcmVzc2VkUmlnaHQgPSB0cnVlXHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICAgIGNhc2UgJ2EnOlxyXG4gICAgICAgICAgdGhpcy5rZXlzLmEucHJlc3NlZCA9IHRydWUsXHJcbiAgICAgICAgICBnYW1lU3RhdGUubGFzdFByZXNzZWRSaWdodCA9IGZhbHNlXHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICAgIGNhc2UgJ3cnOlxyXG4gICAgICAgICAgaWYgKCF0aGlzLmtleXMudy5wcmVzc2VkICYmIGdhbWVTdGF0ZS5jYW5KdW1wICYmICFnYW1lU3RhdGUuaW5KdW1wKSB7XHJcbiAgICAgICAgICAgIHN0YXJ0ZWRQcmVzc2luZ0p1bXAoKVxyXG4gICAgICAgICAgICBnYW1lU3RhdGUuaW5KdW1wID0gdHJ1ZVxyXG4gICAgICAgICAgICB0aGlzLmtleXMudy5wcmVzc2VkID0gdHJ1ZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoZXZ0KSA9PiB7XHJcbiAgICAgIHN3aXRjaCAoZXZ0LmtleSkge1xyXG4gICAgICAgIGNhc2UgJ2QnOlxyXG4gICAgICAgICAgdGhpcy5rZXlzLmQucHJlc3NlZCA9IGZhbHNlXHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICAgIGNhc2UgJ2EnOlxyXG4gICAgICAgICAgdGhpcy5rZXlzLmEucHJlc3NlZCA9IGZhbHNlXHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICAgIGNhc2UgJ3cnOlxyXG4gICAgICAgICAgaWYgKGdhbWVTdGF0ZS5jYW5KdW1wICYmIGdhbWVTdGF0ZS5pbkp1bXApIHtcclxuICAgICAgICAgICAgdGhpcy5rZXlzLncucHJlc3NlZCA9IGZhbHNlXHJcbiAgICAgICAgICAgIHN0b3BwZWRQcmVzc2luZ0p1bXAoKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZW5kIHRpbWUgdmFyJywgZ2FtZUhlbHBlcnMuZW5kVGltZSAtIGdhbWVIZWxwZXJzLnN0YXJ0VGltZSlcclxuICAgICAgICAgICAgY29uc29sZS5sb2coRGF0ZS5ub3coKSAtIGdhbWVIZWxwZXJzLnN0YXJ0VGltZSlcclxuICAgICAgICAgICAgZ2FtZUhlbHBlcnMuanVtcER1cmF0aW9uID0gZ2FtZUhlbHBlcnMuZW5kVGltZSAtIGdhbWVIZWxwZXJzLnN0YXJ0VGltZVxyXG4gICAgICAgICAgICB0aGlzLnBsYXllci52ZWxvY2l0eS55ID0gLTggKiAoZ2FtZUhlbHBlcnMuanVtcER1cmF0aW9uICogMC4wMDUpXHJcbiAgICAgICAgICAgIGlmKGdhbWVTdGF0ZS5sYXN0UHJlc3NlZFJpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5wbGF5ZXIudmVsb2NpdHkueCA9IGdhbWVIZWxwZXJzLmp1bXBEdXJhdGlvbiAqIDAuMDVcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICB0aGlzLnBsYXllci52ZWxvY2l0eS54ID0gLShnYW1lSGVscGVycy5qdW1wRHVyYXRpb24gKiAwLjA1KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBqdW1wXHJcbiAgICAgICAgICAgIGdhbWVTdGF0ZS5pbkp1bXAgPSBmYWxzZVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG5cclxuXHJcbiAgc3RvcCgpIHtcclxuICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLnJhZilcclxuICB9XHJcblxyXG4gIHRpY2soKSB7XHJcbiAgICAvLy0tLSBjbGVhciBzY3JlZW5cclxuICAgIGN0eC5maWxsU3R5bGUgPSAnd2hpdGUnXHJcbiAgICBjdHguZmlsbFJlY3QoMCwgMCwgY2FudmFzLmNsaWVudFdpZHRoLCBjYW52YXMuY2xpZW50SGVpZ2h0KVxyXG5cclxuICAgIC8vIGRyYXdpbmcgZWxlbWVudHNcclxuICAgIHRoaXMucGxheWVyLnVwZGF0ZSgpXHJcblxyXG4gICAgY3R4LmZpbGxSZWN0KDMwMCwgNTEwLCAxMjAsIDMwKVxyXG4gICAgLy8gaGFuZGxpbmcgcGxheWVyIG1vdmluZyBvbiB4LWF4aXNcclxuICAgIGlmICh0aGlzLnBsYXllci52ZWxvY2l0eS54ID4gMCkgdGhpcy5wbGF5ZXIudmVsb2NpdHkueCAtPSAwLjJcclxuICAgIGlmICh0aGlzLnBsYXllci52ZWxvY2l0eS54IDwgMCkgdGhpcy5wbGF5ZXIudmVsb2NpdHkueCArPSAwLjJcclxuICAgIGlmICh0aGlzLnBsYXllci52ZWxvY2l0eS54IDwgMC4yICYmIHRoaXMucGxheWVyLnZlbG9jaXR5LnggPiAtMC4yKSB0aGlzLnBsYXllci52ZWxvY2l0eS54ID0gMFxyXG4gICAgaWYgKHRoaXMua2V5cy5kLnByZXNzZWQgJiYgZ2FtZVN0YXRlLmNhbkp1bXApIHRoaXMucGxheWVyLnZlbG9jaXR5LnggPSA1XHJcbiAgICBlbHNlIGlmICh0aGlzLmtleXMuYS5wcmVzc2VkICYmIGdhbWVTdGF0ZS5jYW5KdW1wKSB0aGlzLnBsYXllci52ZWxvY2l0eS54ID0gLTVcclxuXHJcbiAgICAvLyBjYWxsaW5nIGFuaW1hdGlvbiBmdW5jdGlvbiBhZ2FpblxyXG4gICAgdGhpcy5yYWYgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudGljay5iaW5kKHRoaXMpKVxyXG4gIH1cclxufVxyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuY29uc3QgbWFpbm1lbnUxID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWlubWVudVwiKTtcclxuY29uc3QgbXljYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15Y2FudmFzXCIpOyBcclxuY29uc3QgR2FtZSA9IHJlcXVpcmUoXCIuL2dhbWVcIik7XHJcbmxldCBteUdhbWUgPSBuZXcgR2FtZSgpO1xyXG5cclxubXljYW52YXMuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiOyBcclxuXHJcbmZ1bmN0aW9uIG1haW5tZW51KCkge1xyXG4gICAgbXljYW52YXMuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgIG1haW5tZW51MS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7IFxyXG4gICAgbXlHYW1lLnN0YXJ0KCk7XHJcbn1cclxuXHJcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3RhcnRidXR0b25cIikub25jbGljayA9IG1haW5tZW51OyIsIlwidXNlIHN0cmljdFwiXHJcblxyXG5jb25zdCB7XHJcbiAgZ2FtZUNvbnN0YW50cyxcclxuICBjdHgsXHJcbiAgZ2FtZVN0YXRlXHJcbn0gPSByZXF1aXJlKCcuL2NvbnN0YW50cy5qcycpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFBsYXllciB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHBhcmFtcykge1xyXG4gICAgdGhpcy5wb3NpdGlvbiA9IHBhcmFtcy5wb3NpdGlvbjtcclxuICAgIHRoaXMudmVsb2NpdHkgPSB7XHJcbiAgICAgIHg6IDAsXHJcbiAgICAgIHk6IDFcclxuICAgIH1cclxuICAgIHRoaXMuaGVpZ2h0ID0gcGFyYW1zLmhlaWdodDtcclxuICAgIHRoaXMud2lkdGggPSBwYXJhbXMud2lkdGg7XHJcbiAgfVxyXG5cclxuICBkcmF3KCkge1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlKCkge1xyXG5cclxuICAgIGN0eC5maWxsU3R5bGUgPSAncmdiYSgwLCAyNTUsIDAsIDAuNSknXHJcbiAgICBjdHguZmlsbFJlY3QodGhpcy5wb3NpdGlvbi54LCB0aGlzLnBvc2l0aW9uLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxyXG5cclxuICAgIC8vIHdlIHdpbGwgdXNlIGl0IHdoZW4gd2Ugd2lsbCBnZXQgb3VyIGdhbWUgZ3JhcGhpY3NcclxuICAgIC8vdGhpcy5kcmF3KCk7XHJcblxyXG4gICAgdGhpcy5wb3NpdGlvbi54ICs9IHRoaXMudmVsb2NpdHkueFxyXG4gICAgdGhpcy5jaGVja0Zvckhvcml6b250YWxDb2xsaXNpb25zKClcclxuICAgIHRoaXMuYXBwbHlHcmF2aXR5KClcclxuICAgIHRoaXMuY2hlY2tGb3JWZXJ0aWNhbENvbGxpc2lvbnMoKVxyXG4gIH1cclxuXHJcbiAgYXBwbHlHcmF2aXR5KCkge1xyXG4gICAgdGhpcy5wb3NpdGlvbi55ICs9IHRoaXMudmVsb2NpdHkueVxyXG4gICAgdGhpcy52ZWxvY2l0eS55ICs9IGdhbWVDb25zdGFudHMuZ3Jhdml0eVxyXG4gIH1cclxuXHJcbiAgY2hlY2tGb3JWZXJ0aWNhbENvbGxpc2lvbnMoKSB7XHJcbiAgICAvLyBzaW1wbGUgY2hlY2tpbmcsIGJlY2F1c2Ugd2Ugd2lsbCB1c2Ugc29vbiBzb21ldGhpbmcgYmV0dGVyIDopXHJcbiAgICBpZiAodGhpcy5wb3NpdGlvbi55ICsgdGhpcy5oZWlnaHQgKyB0aGlzLnZlbG9jaXR5LnkgPiBnYW1lQ29uc3RhbnRzLmNhbnZhc0hlaWdodCkge1xyXG4gICAgICB0aGlzLnZlbG9jaXR5LnkgPSAwXHJcbiAgICAgIGdhbWVTdGF0ZS5jYW5KdW1wID0gdHJ1ZVxyXG4gICAgfSBlbHNlXHJcbiAgICAgIGdhbWVTdGF0ZS5jYW5KdW1wID0gZmFsc2VcclxuXHJcbiAgfVxyXG5cclxuICBjaGVja0Zvckhvcml6b250YWxDb2xsaXNpb25zKCkge1xyXG4gICAgLy8gc2ltcGxlIGNoZWNraW5nLCBiZWNhdXNlIHdlIHdpbGwgdXNlIHNvb24gc29tZXRoaW5nIGJldHRlciA6KVxyXG4gICAgaWYgKHRoaXMucG9zaXRpb24ueCArIHRoaXMudmVsb2NpdHkueCA8IDApIHtcclxuICAgICAgdGhpcy5wb3NpdGlvbi54ID0gMDtcclxuICAgICAgdGhpcy52ZWxvY2l0eS54ID0gMFxyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMucG9zaXRpb24ueCArIHRoaXMud2lkdGggKyB0aGlzLnZlbG9jaXR5LnggPiBnYW1lQ29uc3RhbnRzLmNhbnZhc1dpZHRoKSB7XHJcbiAgICAgIHRoaXMudmVsb2NpdHkueCA9IDBcclxuICAgICAgdGhpcy5wb3NpdGlvbi54ID0gZ2FtZUNvbnN0YW50cy5jYW52YXNXaWR0aCAtIHRoaXMud2lkdGhcclxuICAgIH1cclxuICB9XHJcblxyXG59XHJcbiJdfQ==
