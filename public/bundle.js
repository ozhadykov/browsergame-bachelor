(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const gameConstants = {
  canvasWidth: 960,
  canvasHeight: 540,
  gravity: 0.5
}

const canvas = document.getElementById('my-canvas')
const ctx = canvas.getContext('2d')

module.exports = { gameConstants, canvas, ctx };
},{}],2:[function(require,module,exports){
"use strict"

const Player = require('./player.js')
const {canvas, ctx} = require('./constants.js')

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
          this.player.velocity.y = -8
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

const {gameConstants, ctx} = require('./constants.js')

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
    }
  }

  checkForHorizontalCollisions() {
    // simple checking, because we will use soon something better :)
    if (this.position.x + this.velocity.x < 0){
      this.position.x = 0;
      this.velocity.x = 0
    }
    if (this.position.x + this.width + this.velocity.x > gameConstants.canvasWidth){
      this.velocity.x = 0
      this.position.x = gameConstants.canvasWidth - this.width
    }
  }

}

},{"./constants.js":1}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL29wdC9ob21lYnJldy9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lL2NvbnN0YW50cy5qcyIsImdhbWUvZ2FtZS5qcyIsImdhbWUvbWFpbi5qcyIsImdhbWUvcGxheWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY29uc3QgZ2FtZUNvbnN0YW50cyA9IHtcbiAgY2FudmFzV2lkdGg6IDk2MCxcbiAgY2FudmFzSGVpZ2h0OiA1NDAsXG4gIGdyYXZpdHk6IDAuNVxufVxuXG5jb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXktY2FudmFzJylcbmNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXG5cbm1vZHVsZS5leHBvcnRzID0geyBnYW1lQ29uc3RhbnRzLCBjYW52YXMsIGN0eCB9OyIsIlwidXNlIHN0cmljdFwiXG5cbmNvbnN0IFBsYXllciA9IHJlcXVpcmUoJy4vcGxheWVyLmpzJylcbmNvbnN0IHtjYW52YXMsIGN0eH0gPSByZXF1aXJlKCcuL2NvbnN0YW50cy5qcycpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgR2FtZSB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgLy8gcmVxdWVzdCBhbmltYXRpb24gZnJhbWUgaGFuZGxlXG4gICAgdGhpcy5yYWYgPSBudWxsXG4gICAgdGhpcy5wbGF5ZXIgPSBudWxsXG4gICAgdGhpcy5rZXlzID0ge1xuICAgICAgZDoge1xuICAgICAgICBwcmVzc2VkOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgICBhOiB7XG4gICAgICAgIHByZXNzZWQ6IGZhbHNlLFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG5cbiAgc3RhcnQoKSB7XG4gICAgLy8gdGhpcyBpcyBpbXBvcnRhbnQgZm9yIGFuaW1hdGlvbiBwdXJwb3NlcywgZG8gbm90IG5lZWQgbm93XG4gICAgdGhpcy50aW1lT2ZMYXN0RnJhbWUgPSBEYXRlLm5vdygpXG5cbiAgICAvLyBoZXJlIHdlIGFyZSByZXF1aXJpbmcgd2luZG93IHRvIHJlbG9hZCB0byBtYXggZnJhbWVyYXRlIHBvc3NpYmxlXG4gICAgdGhpcy5yYWYgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudGljay5iaW5kKHRoaXMpKVxuXG4gICAgLy8gY3JlYXRpbmcgUGxheWVyIGluc3RhbmNlXG4gICAgdGhpcy5wbGF5ZXIgPSBuZXcgUGxheWVyKHtcbiAgICAgIHBvc2l0aW9uOiB7XG4gICAgICAgIHg6IDEwMCxcbiAgICAgICAgeTogMFxuICAgICAgfSxcbiAgICAgIGhlaWdodDogMTAwLFxuICAgICAgd2lkdGg6IDEwMCxcbiAgICB9KVxuXG4gICAgLy8gbGlzdGVuaW5nIHRvIHRoZSBrZXlib2FyZCBldmVudHNcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XG4gICAgICBzd2l0Y2ggKGUua2V5KSB7XG4gICAgICAgIGNhc2UgJ2QnOlxuICAgICAgICAgIHRoaXMua2V5cy5kLnByZXNzZWQgPSB0cnVlXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnYSc6XG4gICAgICAgICAgdGhpcy5rZXlzLmEucHJlc3NlZCA9IHRydWVcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICd3JzpcbiAgICAgICAgICB0aGlzLnBsYXllci52ZWxvY2l0eS55ID0gLThcbiAgICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH0pXG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoZXZ0KSA9PiB7XG4gICAgICBzd2l0Y2ggKGV2dC5rZXkpIHtcbiAgICAgICAgY2FzZSAnZCc6XG4gICAgICAgICAgdGhpcy5rZXlzLmQucHJlc3NlZCA9IGZhbHNlXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnYSc6XG4gICAgICAgICAgdGhpcy5rZXlzLmEucHJlc3NlZCA9IGZhbHNlXG4gICAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cblxuICBzdG9wKCkge1xuICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLnJhZilcbiAgfVxuXG4gIHRpY2soKSB7XG4gICAgLy8tLS0gY2xlYXIgc2NyZWVuXG4gICAgY3R4LmZpbGxTdHlsZSA9ICd3aGl0ZSdcbiAgICBjdHguZmlsbFJlY3QoMCwgMCwgY2FudmFzLmNsaWVudFdpZHRoLCBjYW52YXMuY2xpZW50SGVpZ2h0KVxuXG4gICAgLy8gZHJhd2luZyBlbGVtZW50c1xuICAgIHRoaXMucGxheWVyLnVwZGF0ZSgpXG5cbiAgICAvLyBoYW5kbGluZyBwbGF5ZXIgbW92aW5nIG9uIHgtYXhpc1xuICAgIHRoaXMucGxheWVyLnZlbG9jaXR5LnggPSAwXG4gICAgaWYgKHRoaXMua2V5cy5kLnByZXNzZWQpIHRoaXMucGxheWVyLnZlbG9jaXR5LnggPSA1XG4gICAgZWxzZSBpZiAodGhpcy5rZXlzLmEucHJlc3NlZCkgdGhpcy5wbGF5ZXIudmVsb2NpdHkueCA9IC01XG5cbiAgICAvLyBjYWxsaW5nIGFuaW1hdGlvbiBmdW5jdGlvbiBhZ2FpblxuICAgIHRoaXMucmFmID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnRpY2suYmluZCh0aGlzKSlcbiAgfVxufSIsIlwidXNlIHN0cmljdFwiXG5cbmNvbnN0IEdhbWUgPSByZXF1aXJlKFwiLi9nYW1lXCIpXG5sZXQgbXlHYW1lID0gbmV3IEdhbWUoKVxubXlHYW1lLnN0YXJ0KClcbiIsIlwidXNlIHN0cmljdFwiXG5cbmNvbnN0IHtnYW1lQ29uc3RhbnRzLCBjdHh9ID0gcmVxdWlyZSgnLi9jb25zdGFudHMuanMnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFBsYXllciB7XG5cbiAgY29uc3RydWN0b3IocGFyYW1zKSB7XG4gICAgdGhpcy5wb3NpdGlvbiA9IHBhcmFtcy5wb3NpdGlvbjtcbiAgICB0aGlzLnZlbG9jaXR5ID0ge1xuICAgICAgeDogMCxcbiAgICAgIHk6IDFcbiAgICB9XG4gICAgdGhpcy5oZWlnaHQgPSBwYXJhbXMuaGVpZ2h0O1xuICAgIHRoaXMud2lkdGggPSBwYXJhbXMud2lkdGg7XG4gIH1cblxuICBkcmF3KCkge1xuICB9XG5cbiAgdXBkYXRlKCkge1xuXG4gICAgY3R4LmZpbGxTdHlsZSA9ICdyZ2JhKDAsIDI1NSwgMCwgMC41KSdcbiAgICBjdHguZmlsbFJlY3QodGhpcy5wb3NpdGlvbi54LCB0aGlzLnBvc2l0aW9uLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxuXG4gICAgLy8gd2Ugd2lsbCB1c2UgaXQgd2hlbiB3ZSB3aWxsIGdldCBvdXIgZ2FtZSBncmFwaGljc1xuICAgIC8vdGhpcy5kcmF3KCk7XG5cbiAgICB0aGlzLnBvc2l0aW9uLnggKz0gdGhpcy52ZWxvY2l0eS54XG4gICAgdGhpcy5jaGVja0Zvckhvcml6b250YWxDb2xsaXNpb25zKClcbiAgICB0aGlzLmFwcGx5R3Jhdml0eSgpXG4gICAgdGhpcy5jaGVja0ZvclZlcnRpY2FsQ29sbGlzaW9ucygpXG4gIH1cblxuICBhcHBseUdyYXZpdHkoKSB7XG4gICAgdGhpcy5wb3NpdGlvbi55ICs9IHRoaXMudmVsb2NpdHkueVxuICAgIHRoaXMudmVsb2NpdHkueSArPSBnYW1lQ29uc3RhbnRzLmdyYXZpdHlcbiAgfVxuXG4gIGNoZWNrRm9yVmVydGljYWxDb2xsaXNpb25zKCkge1xuICAgIC8vIHNpbXBsZSBjaGVja2luZywgYmVjYXVzZSB3ZSB3aWxsIHVzZSBzb29uIHNvbWV0aGluZyBiZXR0ZXIgOilcbiAgICBpZiAodGhpcy5wb3NpdGlvbi55ICsgdGhpcy5oZWlnaHQgKyB0aGlzLnZlbG9jaXR5LnkgPiBnYW1lQ29uc3RhbnRzLmNhbnZhc0hlaWdodCkge1xuICAgICAgdGhpcy52ZWxvY2l0eS55ID0gMFxuICAgIH1cbiAgfVxuXG4gIGNoZWNrRm9ySG9yaXpvbnRhbENvbGxpc2lvbnMoKSB7XG4gICAgLy8gc2ltcGxlIGNoZWNraW5nLCBiZWNhdXNlIHdlIHdpbGwgdXNlIHNvb24gc29tZXRoaW5nIGJldHRlciA6KVxuICAgIGlmICh0aGlzLnBvc2l0aW9uLnggKyB0aGlzLnZlbG9jaXR5LnggPCAwKXtcbiAgICAgIHRoaXMucG9zaXRpb24ueCA9IDA7XG4gICAgICB0aGlzLnZlbG9jaXR5LnggPSAwXG4gICAgfVxuICAgIGlmICh0aGlzLnBvc2l0aW9uLnggKyB0aGlzLndpZHRoICsgdGhpcy52ZWxvY2l0eS54ID4gZ2FtZUNvbnN0YW50cy5jYW52YXNXaWR0aCl7XG4gICAgICB0aGlzLnZlbG9jaXR5LnggPSAwXG4gICAgICB0aGlzLnBvc2l0aW9uLnggPSBnYW1lQ29uc3RhbnRzLmNhbnZhc1dpZHRoIC0gdGhpcy53aWR0aFxuICAgIH1cbiAgfVxuXG59XG4iXX0=
