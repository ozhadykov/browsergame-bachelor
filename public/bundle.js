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
            console.log('pressed jumping')
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
            console.log('stopped pressing')
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL29wdC9ob21lYnJldy9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lL2NvbnN0YW50cy5qcyIsImdhbWUvZ2FtZS5qcyIsImdhbWUvbWFpbi5qcyIsImdhbWUvcGxheWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCBnYW1lQ29uc3RhbnRzID0ge1xuICBjYW52YXNXaWR0aDogOTYwLFxuICBjYW52YXNIZWlnaHQ6IDU0MCxcbiAgZ3Jhdml0eTogMC41XG59XG5cbmNvbnN0IGdhbWVTdGF0ZSA9IHtcbiAgY2FuSnVtcDogdHJ1ZSxcbiAgaW5KdW1wOiBmYWxzZVxufVxuXG5jb25zdCBnYW1lSGVscGVycyA9IHtcbiAgc3RhcnRUaW1lOiBudWxsLFxuICBlbmRUaW1lOiBudWxsLFxufVxuXG5jb25zdCBzdGFydGVkUHJlc3NpbmdKdW1wID0gKCkgPT4ge1xuICBnYW1lSGVscGVycy5zdGFydFRpbWUgPSBEYXRlLm5vdygpXG59XG5cbmNvbnN0IHN0b3BwZWRQcmVzc2luZ0p1bXAgPSAoKSA9PiB7XG4gIGdhbWVIZWxwZXJzLmVuZFRpbWUgPSBEYXRlLm5vdygpXG59XG5cbmNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdteS1jYW52YXMnKVxuY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJylcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdhbWVDb25zdGFudHMsXG4gIGNhbnZhcyxcbiAgY3R4LFxuICBnYW1lU3RhdGUsXG4gIHN0YXJ0ZWRQcmVzc2luZ0p1bXAsXG4gIHN0b3BwZWRQcmVzc2luZ0p1bXAsXG4gIGdhbWVIZWxwZXJzXG59OyIsIlwidXNlIHN0cmljdFwiXG5cbmNvbnN0IFBsYXllciA9IHJlcXVpcmUoJy4vcGxheWVyLmpzJylcbmNvbnN0IHtcbiAgY2FudmFzLFxuICBjdHgsXG4gIGdhbWVTdGF0ZSxcbiAgc3RhcnRlZFByZXNzaW5nSnVtcCxcbiAgc3RvcHBlZFByZXNzaW5nSnVtcCxcbiAgZ2FtZUhlbHBlcnNcbn0gPSByZXF1aXJlKCcuL2NvbnN0YW50cy5qcycpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgR2FtZSB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgLy8gcmVxdWVzdCBhbmltYXRpb24gZnJhbWUgaGFuZGxlXG4gICAgdGhpcy5yYWYgPSBudWxsXG4gICAgdGhpcy5wbGF5ZXIgPSBudWxsXG4gICAgdGhpcy5rZXlzID0ge1xuICAgICAgZDoge1xuICAgICAgICBwcmVzc2VkOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgICBhOiB7XG4gICAgICAgIHByZXNzZWQ6IGZhbHNlLFxuICAgICAgfSxcbiAgICAgIHc6IHtcbiAgICAgICAgcHJlc3NlZDogZmFsc2UsXG4gICAgICB9XG4gICAgfVxuICB9XG5cblxuICBzdGFydCgpIHtcbiAgICAvLyB0aGlzIGlzIGltcG9ydGFudCBmb3IgYW5pbWF0aW9uIHB1cnBvc2VzLCBkbyBub3QgbmVlZCBub3dcbiAgICB0aGlzLnRpbWVPZkxhc3RGcmFtZSA9IERhdGUubm93KClcblxuICAgIC8vIGhlcmUgd2UgYXJlIHJlcXVpcmluZyB3aW5kb3cgdG8gcmVsb2FkIHRvIG1heCBmcmFtZXJhdGUgcG9zc2libGVcbiAgICB0aGlzLnJhZiA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy50aWNrLmJpbmQodGhpcykpXG5cbiAgICAvLyBjcmVhdGluZyBQbGF5ZXIgaW5zdGFuY2VcbiAgICB0aGlzLnBsYXllciA9IG5ldyBQbGF5ZXIoe1xuICAgICAgcG9zaXRpb246IHtcbiAgICAgICAgeDogMTAwLFxuICAgICAgICB5OiAwXG4gICAgICB9LFxuICAgICAgaGVpZ2h0OiAxMDAsXG4gICAgICB3aWR0aDogMTAwLFxuICAgIH0pXG5cbiAgICAvLyBvbmx5IGRlYnVnZ2luZ1xuICAgIGNvbnN0IGRlYnVnQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Nob3ctc3RhdGUnKVxuICAgIGRlYnVnQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coZ2FtZVN0YXRlKVxuICAgICAgY29uc29sZS5sb2codGhpcy5rZXlzKVxuICAgIH0pXG5cbiAgICAvLyBsaXN0ZW5pbmcgdG8gdGhlIGtleWJvYXJkIGV2ZW50c1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcbiAgICAgIHN3aXRjaCAoZS5rZXkpIHtcbiAgICAgICAgY2FzZSAnZCc6XG4gICAgICAgICAgdGhpcy5rZXlzLmQucHJlc3NlZCA9IHRydWVcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdhJzpcbiAgICAgICAgICB0aGlzLmtleXMuYS5wcmVzc2VkID0gdHJ1ZVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ3cnOlxuICAgICAgICAgIGlmICghdGhpcy5rZXlzLncucHJlc3NlZCAmJiBnYW1lU3RhdGUuY2FuSnVtcCAmJiAhZ2FtZVN0YXRlLmluSnVtcCkge1xuICAgICAgICAgICAgc3RhcnRlZFByZXNzaW5nSnVtcCgpXG4gICAgICAgICAgICBjb25zb2xlLmxvZygncHJlc3NlZCBqdW1waW5nJylcbiAgICAgICAgICAgIGdhbWVTdGF0ZS5pbkp1bXAgPSB0cnVlXG4gICAgICAgICAgICB0aGlzLmtleXMudy5wcmVzc2VkID0gdHJ1ZVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgKGV2dCkgPT4ge1xuICAgICAgc3dpdGNoIChldnQua2V5KSB7XG4gICAgICAgIGNhc2UgJ2QnOlxuICAgICAgICAgIHRoaXMua2V5cy5kLnByZXNzZWQgPSBmYWxzZVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ2EnOlxuICAgICAgICAgIHRoaXMua2V5cy5hLnByZXNzZWQgPSBmYWxzZVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ3cnOlxuICAgICAgICAgIGlmIChnYW1lU3RhdGUuY2FuSnVtcCAmJiBnYW1lU3RhdGUuaW5KdW1wKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnc3RvcHBlZCBwcmVzc2luZycpXG4gICAgICAgICAgICB0aGlzLmtleXMudy5wcmVzc2VkID0gZmFsc2VcbiAgICAgICAgICAgIHN0b3BwZWRQcmVzc2luZ0p1bXAoKVxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2VuZCB0aW1lIHZhcicsIGdhbWVIZWxwZXJzLmVuZFRpbWUgLSBnYW1lSGVscGVycy5zdGFydFRpbWUpXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhEYXRlLm5vdygpIC0gZ2FtZUhlbHBlcnMuc3RhcnRUaW1lKVxuICAgICAgICAgICAgLy8ganVtcFxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIudmVsb2NpdHkueSA9IC04XG4gICAgICAgICAgICBnYW1lU3RhdGUuaW5KdW1wID0gZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cblxuICBzdG9wKCkge1xuICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLnJhZilcbiAgfVxuXG4gIHRpY2soKSB7XG4gICAgLy8tLS0gY2xlYXIgc2NyZWVuXG4gICAgY3R4LmZpbGxTdHlsZSA9ICd3aGl0ZSdcbiAgICBjdHguZmlsbFJlY3QoMCwgMCwgY2FudmFzLmNsaWVudFdpZHRoLCBjYW52YXMuY2xpZW50SGVpZ2h0KVxuXG4gICAgLy8gZHJhd2luZyBlbGVtZW50c1xuICAgIHRoaXMucGxheWVyLnVwZGF0ZSgpXG5cbiAgICAvLyBoYW5kbGluZyBwbGF5ZXIgbW92aW5nIG9uIHgtYXhpc1xuICAgIHRoaXMucGxheWVyLnZlbG9jaXR5LnggPSAwXG4gICAgaWYgKHRoaXMua2V5cy5kLnByZXNzZWQpIHRoaXMucGxheWVyLnZlbG9jaXR5LnggPSA1XG4gICAgZWxzZSBpZiAodGhpcy5rZXlzLmEucHJlc3NlZCkgdGhpcy5wbGF5ZXIudmVsb2NpdHkueCA9IC01XG5cbiAgICAvLyBjYWxsaW5nIGFuaW1hdGlvbiBmdW5jdGlvbiBhZ2FpblxuICAgIHRoaXMucmFmID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnRpY2suYmluZCh0aGlzKSlcbiAgfVxufSIsIlwidXNlIHN0cmljdFwiXG5cbmNvbnN0IEdhbWUgPSByZXF1aXJlKFwiLi9nYW1lXCIpXG5sZXQgbXlHYW1lID0gbmV3IEdhbWUoKVxubXlHYW1lLnN0YXJ0KClcbiIsIlwidXNlIHN0cmljdFwiXG5cbmNvbnN0IHtcbiAgZ2FtZUNvbnN0YW50cyxcbiAgY3R4LFxuICBnYW1lU3RhdGVcbn0gPSByZXF1aXJlKCcuL2NvbnN0YW50cy5qcycpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUGxheWVyIHtcblxuICBjb25zdHJ1Y3RvcihwYXJhbXMpIHtcbiAgICB0aGlzLnBvc2l0aW9uID0gcGFyYW1zLnBvc2l0aW9uO1xuICAgIHRoaXMudmVsb2NpdHkgPSB7XG4gICAgICB4OiAwLFxuICAgICAgeTogMVxuICAgIH1cbiAgICB0aGlzLmhlaWdodCA9IHBhcmFtcy5oZWlnaHQ7XG4gICAgdGhpcy53aWR0aCA9IHBhcmFtcy53aWR0aDtcbiAgfVxuXG4gIGRyYXcoKSB7XG4gIH1cblxuICB1cGRhdGUoKSB7XG5cbiAgICBjdHguZmlsbFN0eWxlID0gJ3JnYmEoMCwgMjU1LCAwLCAwLjUpJ1xuICAgIGN0eC5maWxsUmVjdCh0aGlzLnBvc2l0aW9uLngsIHRoaXMucG9zaXRpb24ueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXG5cbiAgICAvLyB3ZSB3aWxsIHVzZSBpdCB3aGVuIHdlIHdpbGwgZ2V0IG91ciBnYW1lIGdyYXBoaWNzXG4gICAgLy90aGlzLmRyYXcoKTtcblxuICAgIHRoaXMucG9zaXRpb24ueCArPSB0aGlzLnZlbG9jaXR5LnhcbiAgICB0aGlzLmNoZWNrRm9ySG9yaXpvbnRhbENvbGxpc2lvbnMoKVxuICAgIHRoaXMuYXBwbHlHcmF2aXR5KClcbiAgICB0aGlzLmNoZWNrRm9yVmVydGljYWxDb2xsaXNpb25zKClcbiAgfVxuXG4gIGFwcGx5R3Jhdml0eSgpIHtcbiAgICB0aGlzLnBvc2l0aW9uLnkgKz0gdGhpcy52ZWxvY2l0eS55XG4gICAgdGhpcy52ZWxvY2l0eS55ICs9IGdhbWVDb25zdGFudHMuZ3Jhdml0eVxuICB9XG5cbiAgY2hlY2tGb3JWZXJ0aWNhbENvbGxpc2lvbnMoKSB7XG4gICAgLy8gc2ltcGxlIGNoZWNraW5nLCBiZWNhdXNlIHdlIHdpbGwgdXNlIHNvb24gc29tZXRoaW5nIGJldHRlciA6KVxuICAgIGlmICh0aGlzLnBvc2l0aW9uLnkgKyB0aGlzLmhlaWdodCArIHRoaXMudmVsb2NpdHkueSA+IGdhbWVDb25zdGFudHMuY2FudmFzSGVpZ2h0KSB7XG4gICAgICB0aGlzLnZlbG9jaXR5LnkgPSAwXG4gICAgICBnYW1lU3RhdGUuY2FuSnVtcCA9IHRydWVcbiAgICB9IGVsc2VcbiAgICAgIGdhbWVTdGF0ZS5jYW5KdW1wID0gZmFsc2VcblxuICB9XG5cbiAgY2hlY2tGb3JIb3Jpem9udGFsQ29sbGlzaW9ucygpIHtcbiAgICAvLyBzaW1wbGUgY2hlY2tpbmcsIGJlY2F1c2Ugd2Ugd2lsbCB1c2Ugc29vbiBzb21ldGhpbmcgYmV0dGVyIDopXG4gICAgaWYgKHRoaXMucG9zaXRpb24ueCArIHRoaXMudmVsb2NpdHkueCA8IDApIHtcbiAgICAgIHRoaXMucG9zaXRpb24ueCA9IDA7XG4gICAgICB0aGlzLnZlbG9jaXR5LnggPSAwXG4gICAgfVxuICAgIGlmICh0aGlzLnBvc2l0aW9uLnggKyB0aGlzLndpZHRoICsgdGhpcy52ZWxvY2l0eS54ID4gZ2FtZUNvbnN0YW50cy5jYW52YXNXaWR0aCkge1xuICAgICAgdGhpcy52ZWxvY2l0eS54ID0gMFxuICAgICAgdGhpcy5wb3NpdGlvbi54ID0gZ2FtZUNvbnN0YW50cy5jYW52YXNXaWR0aCAtIHRoaXMud2lkdGhcbiAgICB9XG4gIH1cblxufVxuIl19
