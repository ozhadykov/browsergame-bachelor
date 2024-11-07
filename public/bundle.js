(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const gameConstants = {
  canvasWidth: 960,
  canvasHeight: 540,
  gravity: 0.5
}

const gameState = {
  canJump: true,
  inJump: false
}

const gameHelpers = {
  startTime: null,
  endTime: null,
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
      height: 100,
      width: 100,
    })

    // only debugging
    const debugBtn = document.getElementById('show-state')
    debugBtn.addEventListener('click', () => {
      console.log(gameState)
      console.log(this.keys)
    })

    // listening to the keyboard events
    window.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'd':
          this.keys.d.pressed = true
          break
        case 'a':
          this.keys.a.pressed = true
          break
        case 'w':
          if (!this.keys.w.pressed && gameState.canJump && !gameState.inJump) {
            startedPressingJump()
            gameState.inJump = true
            this.keys.w.pressed = true
            break
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
            // jump
            this.player.velocity.y = -8
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
    this.player.velocity.x = 0
    if (this.keys.d.pressed) this.player.velocity.x = 5
    else if (this.keys.a.pressed) this.player.velocity.x = -5

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL29wdC9ob21lYnJldy9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lL2NvbnN0YW50cy5qcyIsImdhbWUvZ2FtZS5qcyIsImdhbWUvbWFpbi5qcyIsImdhbWUvcGxheWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IGdhbWVDb25zdGFudHMgPSB7XG4gIGNhbnZhc1dpZHRoOiA5NjAsXG4gIGNhbnZhc0hlaWdodDogNTQwLFxuICBncmF2aXR5OiAwLjVcbn1cblxuY29uc3QgZ2FtZVN0YXRlID0ge1xuICBjYW5KdW1wOiB0cnVlLFxuICBpbkp1bXA6IGZhbHNlXG59XG5cbmNvbnN0IGdhbWVIZWxwZXJzID0ge1xuICBzdGFydFRpbWU6IG51bGwsXG4gIGVuZFRpbWU6IG51bGwsXG59XG5cbmNvbnN0IHN0YXJ0ZWRQcmVzc2luZ0p1bXAgPSAoKSA9PiB7XG4gIGdhbWVIZWxwZXJzLnN0YXJ0VGltZSA9IERhdGUubm93KClcbn1cblxuY29uc3Qgc3RvcHBlZFByZXNzaW5nSnVtcCA9ICgpID0+IHtcbiAgZ2FtZUhlbHBlcnMuZW5kVGltZSA9IERhdGUubm93KClcbn1cblxuY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ215LWNhbnZhcycpXG5jb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZ2FtZUNvbnN0YW50cyxcbiAgY2FudmFzLFxuICBjdHgsXG4gIGdhbWVTdGF0ZSxcbiAgc3RhcnRlZFByZXNzaW5nSnVtcCxcbiAgc3RvcHBlZFByZXNzaW5nSnVtcCxcbiAgZ2FtZUhlbHBlcnNcbn07IiwiXCJ1c2Ugc3RyaWN0XCJcblxuY29uc3QgUGxheWVyID0gcmVxdWlyZSgnLi9wbGF5ZXIuanMnKVxuY29uc3Qge1xuICBjYW52YXMsXG4gIGN0eCxcbiAgZ2FtZVN0YXRlLFxuICBzdGFydGVkUHJlc3NpbmdKdW1wLFxuICBzdG9wcGVkUHJlc3NpbmdKdW1wLFxuICBnYW1lSGVscGVyc1xufSA9IHJlcXVpcmUoJy4vY29uc3RhbnRzLmpzJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBHYW1lIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICAvLyByZXF1ZXN0IGFuaW1hdGlvbiBmcmFtZSBoYW5kbGVcbiAgICB0aGlzLnJhZiA9IG51bGxcbiAgICB0aGlzLnBsYXllciA9IG51bGxcbiAgICB0aGlzLmtleXMgPSB7XG4gICAgICBkOiB7XG4gICAgICAgIHByZXNzZWQ6IGZhbHNlLFxuICAgICAgfSxcbiAgICAgIGE6IHtcbiAgICAgICAgcHJlc3NlZDogZmFsc2UsXG4gICAgICB9LFxuICAgICAgdzoge1xuICAgICAgICBwcmVzc2VkOiBmYWxzZSxcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuXG4gIHN0YXJ0KCkge1xuICAgIC8vIHRoaXMgaXMgaW1wb3J0YW50IGZvciBhbmltYXRpb24gcHVycG9zZXMsIGRvIG5vdCBuZWVkIG5vd1xuICAgIHRoaXMudGltZU9mTGFzdEZyYW1lID0gRGF0ZS5ub3coKVxuXG4gICAgLy8gaGVyZSB3ZSBhcmUgcmVxdWlyaW5nIHdpbmRvdyB0byByZWxvYWQgdG8gbWF4IGZyYW1lcmF0ZSBwb3NzaWJsZVxuICAgIHRoaXMucmFmID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnRpY2suYmluZCh0aGlzKSlcblxuICAgIC8vIGNyZWF0aW5nIFBsYXllciBpbnN0YW5jZVxuICAgIHRoaXMucGxheWVyID0gbmV3IFBsYXllcih7XG4gICAgICBwb3NpdGlvbjoge1xuICAgICAgICB4OiAxMDAsXG4gICAgICAgIHk6IDBcbiAgICAgIH0sXG4gICAgICBoZWlnaHQ6IDEwMCxcbiAgICAgIHdpZHRoOiAxMDAsXG4gICAgfSlcblxuICAgIC8vIG9ubHkgZGVidWdnaW5nXG4gICAgY29uc3QgZGVidWdCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2hvdy1zdGF0ZScpXG4gICAgZGVidWdCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhnYW1lU3RhdGUpXG4gICAgICBjb25zb2xlLmxvZyh0aGlzLmtleXMpXG4gICAgfSlcblxuICAgIC8vIGxpc3RlbmluZyB0byB0aGUga2V5Ym9hcmQgZXZlbnRzXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xuICAgICAgc3dpdGNoIChlLmtleSkge1xuICAgICAgICBjYXNlICdkJzpcbiAgICAgICAgICB0aGlzLmtleXMuZC5wcmVzc2VkID0gdHJ1ZVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ2EnOlxuICAgICAgICAgIHRoaXMua2V5cy5hLnByZXNzZWQgPSB0cnVlXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAndyc6XG4gICAgICAgICAgaWYgKCF0aGlzLmtleXMudy5wcmVzc2VkICYmIGdhbWVTdGF0ZS5jYW5KdW1wICYmICFnYW1lU3RhdGUuaW5KdW1wKSB7XG4gICAgICAgICAgICBzdGFydGVkUHJlc3NpbmdKdW1wKClcbiAgICAgICAgICAgIGdhbWVTdGF0ZS5pbkp1bXAgPSB0cnVlXG4gICAgICAgICAgICB0aGlzLmtleXMudy5wcmVzc2VkID0gdHJ1ZVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgKGV2dCkgPT4ge1xuICAgICAgc3dpdGNoIChldnQua2V5KSB7XG4gICAgICAgIGNhc2UgJ2QnOlxuICAgICAgICAgIHRoaXMua2V5cy5kLnByZXNzZWQgPSBmYWxzZVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ2EnOlxuICAgICAgICAgIHRoaXMua2V5cy5hLnByZXNzZWQgPSBmYWxzZVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ3cnOlxuICAgICAgICAgIGlmIChnYW1lU3RhdGUuY2FuSnVtcCAmJiBnYW1lU3RhdGUuaW5KdW1wKSB7XG4gICAgICAgICAgICB0aGlzLmtleXMudy5wcmVzc2VkID0gZmFsc2VcbiAgICAgICAgICAgIHN0b3BwZWRQcmVzc2luZ0p1bXAoKVxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2VuZCB0aW1lIHZhcicsIGdhbWVIZWxwZXJzLmVuZFRpbWUgLSBnYW1lSGVscGVycy5zdGFydFRpbWUpXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhEYXRlLm5vdygpIC0gZ2FtZUhlbHBlcnMuc3RhcnRUaW1lKVxuICAgICAgICAgICAgLy8ganVtcFxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIudmVsb2NpdHkueSA9IC04XG4gICAgICAgICAgICBnYW1lU3RhdGUuaW5KdW1wID0gZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cblxuICBzdG9wKCkge1xuICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLnJhZilcbiAgfVxuXG4gIHRpY2soKSB7XG4gICAgLy8tLS0gY2xlYXIgc2NyZWVuXG4gICAgY3R4LmZpbGxTdHlsZSA9ICd3aGl0ZSdcbiAgICBjdHguZmlsbFJlY3QoMCwgMCwgY2FudmFzLmNsaWVudFdpZHRoLCBjYW52YXMuY2xpZW50SGVpZ2h0KVxuXG4gICAgLy8gZHJhd2luZyBlbGVtZW50c1xuICAgIHRoaXMucGxheWVyLnVwZGF0ZSgpXG5cbiAgICAvLyBoYW5kbGluZyBwbGF5ZXIgbW92aW5nIG9uIHgtYXhpc1xuICAgIHRoaXMucGxheWVyLnZlbG9jaXR5LnggPSAwXG4gICAgaWYgKHRoaXMua2V5cy5kLnByZXNzZWQpIHRoaXMucGxheWVyLnZlbG9jaXR5LnggPSA1XG4gICAgZWxzZSBpZiAodGhpcy5rZXlzLmEucHJlc3NlZCkgdGhpcy5wbGF5ZXIudmVsb2NpdHkueCA9IC01XG5cbiAgICAvLyBjYWxsaW5nIGFuaW1hdGlvbiBmdW5jdGlvbiBhZ2FpblxuICAgIHRoaXMucmFmID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnRpY2suYmluZCh0aGlzKSlcbiAgfVxufSIsIlwidXNlIHN0cmljdFwiXG5cbmNvbnN0IEdhbWUgPSByZXF1aXJlKFwiLi9nYW1lXCIpXG5sZXQgbXlHYW1lID0gbmV3IEdhbWUoKVxubXlHYW1lLnN0YXJ0KClcbiIsIlwidXNlIHN0cmljdFwiXG5cbmNvbnN0IHtcbiAgZ2FtZUNvbnN0YW50cyxcbiAgY3R4LFxuICBnYW1lU3RhdGVcbn0gPSByZXF1aXJlKCcuL2NvbnN0YW50cy5qcycpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUGxheWVyIHtcblxuICBjb25zdHJ1Y3RvcihwYXJhbXMpIHtcbiAgICB0aGlzLnBvc2l0aW9uID0gcGFyYW1zLnBvc2l0aW9uO1xuICAgIHRoaXMudmVsb2NpdHkgPSB7XG4gICAgICB4OiAwLFxuICAgICAgeTogMVxuICAgIH1cbiAgICB0aGlzLmhlaWdodCA9IHBhcmFtcy5oZWlnaHQ7XG4gICAgdGhpcy53aWR0aCA9IHBhcmFtcy53aWR0aDtcbiAgfVxuXG4gIGRyYXcoKSB7XG4gIH1cblxuICB1cGRhdGUoKSB7XG5cbiAgICBjdHguZmlsbFN0eWxlID0gJ3JnYmEoMCwgMjU1LCAwLCAwLjUpJ1xuICAgIGN0eC5maWxsUmVjdCh0aGlzLnBvc2l0aW9uLngsIHRoaXMucG9zaXRpb24ueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXG5cbiAgICAvLyB3ZSB3aWxsIHVzZSBpdCB3aGVuIHdlIHdpbGwgZ2V0IG91ciBnYW1lIGdyYXBoaWNzXG4gICAgLy90aGlzLmRyYXcoKTtcblxuICAgIHRoaXMucG9zaXRpb24ueCArPSB0aGlzLnZlbG9jaXR5LnhcbiAgICB0aGlzLmNoZWNrRm9ySG9yaXpvbnRhbENvbGxpc2lvbnMoKVxuICAgIHRoaXMuYXBwbHlHcmF2aXR5KClcbiAgICB0aGlzLmNoZWNrRm9yVmVydGljYWxDb2xsaXNpb25zKClcbiAgfVxuXG4gIGFwcGx5R3Jhdml0eSgpIHtcbiAgICB0aGlzLnBvc2l0aW9uLnkgKz0gdGhpcy52ZWxvY2l0eS55XG4gICAgdGhpcy52ZWxvY2l0eS55ICs9IGdhbWVDb25zdGFudHMuZ3Jhdml0eVxuICB9XG5cbiAgY2hlY2tGb3JWZXJ0aWNhbENvbGxpc2lvbnMoKSB7XG4gICAgLy8gc2ltcGxlIGNoZWNraW5nLCBiZWNhdXNlIHdlIHdpbGwgdXNlIHNvb24gc29tZXRoaW5nIGJldHRlciA6KVxuICAgIGlmICh0aGlzLnBvc2l0aW9uLnkgKyB0aGlzLmhlaWdodCArIHRoaXMudmVsb2NpdHkueSA+IGdhbWVDb25zdGFudHMuY2FudmFzSGVpZ2h0KSB7XG4gICAgICB0aGlzLnZlbG9jaXR5LnkgPSAwXG4gICAgICBnYW1lU3RhdGUuY2FuSnVtcCA9IHRydWVcbiAgICB9IGVsc2VcbiAgICAgIGdhbWVTdGF0ZS5jYW5KdW1wID0gZmFsc2VcblxuICB9XG5cbiAgY2hlY2tGb3JIb3Jpem9udGFsQ29sbGlzaW9ucygpIHtcbiAgICAvLyBzaW1wbGUgY2hlY2tpbmcsIGJlY2F1c2Ugd2Ugd2lsbCB1c2Ugc29vbiBzb21ldGhpbmcgYmV0dGVyIDopXG4gICAgaWYgKHRoaXMucG9zaXRpb24ueCArIHRoaXMudmVsb2NpdHkueCA8IDApIHtcbiAgICAgIHRoaXMucG9zaXRpb24ueCA9IDA7XG4gICAgICB0aGlzLnZlbG9jaXR5LnggPSAwXG4gICAgfVxuICAgIGlmICh0aGlzLnBvc2l0aW9uLnggKyB0aGlzLndpZHRoICsgdGhpcy52ZWxvY2l0eS54ID4gZ2FtZUNvbnN0YW50cy5jYW52YXNXaWR0aCkge1xuICAgICAgdGhpcy52ZWxvY2l0eS54ID0gMFxuICAgICAgdGhpcy5wb3NpdGlvbi54ID0gZ2FtZUNvbnN0YW50cy5jYW52YXNXaWR0aCAtIHRoaXMud2lkdGhcbiAgICB9XG4gIH1cblxufVxuIl19
