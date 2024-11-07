(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const gameConstants = {
  canvasWidth: 960,
  canvasHeight: 540,
  gravity: 0.5
}

const gameState = {
  canJump: true,
}

const canvas = document.getElementById('my-canvas')
const ctx = canvas.getContext('2d')

module.exports = {
  gameConstants,
  canvas,
  ctx,
  gameState
};
},{}],2:[function(require,module,exports){
"use strict"

const Player = require('./player.js')
const {
  canvas,
  ctx,
  gameState
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
          if (this.player.velocity.y === 0 && gameState.canJump)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL29wdC9ob21lYnJldy9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lL2NvbnN0YW50cy5qcyIsImdhbWUvZ2FtZS5qcyIsImdhbWUvbWFpbi5qcyIsImdhbWUvcGxheWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IGdhbWVDb25zdGFudHMgPSB7XG4gIGNhbnZhc1dpZHRoOiA5NjAsXG4gIGNhbnZhc0hlaWdodDogNTQwLFxuICBncmF2aXR5OiAwLjVcbn1cblxuY29uc3QgZ2FtZVN0YXRlID0ge1xuICBjYW5KdW1wOiB0cnVlLFxufVxuXG5jb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXktY2FudmFzJylcbmNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBnYW1lQ29uc3RhbnRzLFxuICBjYW52YXMsXG4gIGN0eCxcbiAgZ2FtZVN0YXRlXG59OyIsIlwidXNlIHN0cmljdFwiXG5cbmNvbnN0IFBsYXllciA9IHJlcXVpcmUoJy4vcGxheWVyLmpzJylcbmNvbnN0IHtcbiAgY2FudmFzLFxuICBjdHgsXG4gIGdhbWVTdGF0ZVxufSA9IHJlcXVpcmUoJy4vY29uc3RhbnRzLmpzJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBHYW1lIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICAvLyByZXF1ZXN0IGFuaW1hdGlvbiBmcmFtZSBoYW5kbGVcbiAgICB0aGlzLnJhZiA9IG51bGxcbiAgICB0aGlzLnBsYXllciA9IG51bGxcbiAgICB0aGlzLmtleXMgPSB7XG4gICAgICBkOiB7XG4gICAgICAgIHByZXNzZWQ6IGZhbHNlLFxuICAgICAgfSxcbiAgICAgIGE6IHtcbiAgICAgICAgcHJlc3NlZDogZmFsc2UsXG4gICAgICB9XG4gICAgfVxuICB9XG5cblxuICBzdGFydCgpIHtcbiAgICAvLyB0aGlzIGlzIGltcG9ydGFudCBmb3IgYW5pbWF0aW9uIHB1cnBvc2VzLCBkbyBub3QgbmVlZCBub3dcbiAgICB0aGlzLnRpbWVPZkxhc3RGcmFtZSA9IERhdGUubm93KClcblxuICAgIC8vIGhlcmUgd2UgYXJlIHJlcXVpcmluZyB3aW5kb3cgdG8gcmVsb2FkIHRvIG1heCBmcmFtZXJhdGUgcG9zc2libGVcbiAgICB0aGlzLnJhZiA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy50aWNrLmJpbmQodGhpcykpXG5cbiAgICAvLyBjcmVhdGluZyBQbGF5ZXIgaW5zdGFuY2VcbiAgICB0aGlzLnBsYXllciA9IG5ldyBQbGF5ZXIoe1xuICAgICAgcG9zaXRpb246IHtcbiAgICAgICAgeDogMTAwLFxuICAgICAgICB5OiAwXG4gICAgICB9LFxuICAgICAgaGVpZ2h0OiAxMDAsXG4gICAgICB3aWR0aDogMTAwLFxuICAgIH0pXG5cbiAgICAvLyBsaXN0ZW5pbmcgdG8gdGhlIGtleWJvYXJkIGV2ZW50c1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcbiAgICAgIHN3aXRjaCAoZS5rZXkpIHtcbiAgICAgICAgY2FzZSAnZCc6XG4gICAgICAgICAgdGhpcy5rZXlzLmQucHJlc3NlZCA9IHRydWVcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdhJzpcbiAgICAgICAgICB0aGlzLmtleXMuYS5wcmVzc2VkID0gdHJ1ZVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ3cnOlxuICAgICAgICAgIGlmICh0aGlzLnBsYXllci52ZWxvY2l0eS55ID09PSAwICYmIGdhbWVTdGF0ZS5jYW5KdW1wKVxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIudmVsb2NpdHkueSA9IC04XG4gICAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgKGV2dCkgPT4ge1xuICAgICAgc3dpdGNoIChldnQua2V5KSB7XG4gICAgICAgIGNhc2UgJ2QnOlxuICAgICAgICAgIHRoaXMua2V5cy5kLnByZXNzZWQgPSBmYWxzZVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ2EnOlxuICAgICAgICAgIHRoaXMua2V5cy5hLnByZXNzZWQgPSBmYWxzZVxuICAgICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG5cbiAgc3RvcCgpIHtcbiAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5yYWYpXG4gIH1cblxuICB0aWNrKCkge1xuICAgIC8vLS0tIGNsZWFyIHNjcmVlblxuICAgIGN0eC5maWxsU3R5bGUgPSAnd2hpdGUnXG4gICAgY3R4LmZpbGxSZWN0KDAsIDAsIGNhbnZhcy5jbGllbnRXaWR0aCwgY2FudmFzLmNsaWVudEhlaWdodClcblxuICAgIC8vIGRyYXdpbmcgZWxlbWVudHNcbiAgICB0aGlzLnBsYXllci51cGRhdGUoKVxuXG4gICAgLy8gaGFuZGxpbmcgcGxheWVyIG1vdmluZyBvbiB4LWF4aXNcbiAgICB0aGlzLnBsYXllci52ZWxvY2l0eS54ID0gMFxuICAgIGlmICh0aGlzLmtleXMuZC5wcmVzc2VkKSB0aGlzLnBsYXllci52ZWxvY2l0eS54ID0gNVxuICAgIGVsc2UgaWYgKHRoaXMua2V5cy5hLnByZXNzZWQpIHRoaXMucGxheWVyLnZlbG9jaXR5LnggPSAtNVxuXG4gICAgLy8gY2FsbGluZyBhbmltYXRpb24gZnVuY3Rpb24gYWdhaW5cbiAgICB0aGlzLnJhZiA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy50aWNrLmJpbmQodGhpcykpXG4gIH1cbn0iLCJcInVzZSBzdHJpY3RcIlxuXG5jb25zdCBHYW1lID0gcmVxdWlyZShcIi4vZ2FtZVwiKVxubGV0IG15R2FtZSA9IG5ldyBHYW1lKClcbm15R2FtZS5zdGFydCgpXG4iLCJcInVzZSBzdHJpY3RcIlxuXG5jb25zdCB7XG4gIGdhbWVDb25zdGFudHMsXG4gIGN0eCxcbiAgZ2FtZVN0YXRlXG59ID0gcmVxdWlyZSgnLi9jb25zdGFudHMuanMnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFBsYXllciB7XG5cbiAgY29uc3RydWN0b3IocGFyYW1zKSB7XG4gICAgdGhpcy5wb3NpdGlvbiA9IHBhcmFtcy5wb3NpdGlvbjtcbiAgICB0aGlzLnZlbG9jaXR5ID0ge1xuICAgICAgeDogMCxcbiAgICAgIHk6IDFcbiAgICB9XG4gICAgdGhpcy5oZWlnaHQgPSBwYXJhbXMuaGVpZ2h0O1xuICAgIHRoaXMud2lkdGggPSBwYXJhbXMud2lkdGg7XG4gIH1cblxuICBkcmF3KCkge1xuICB9XG5cbiAgdXBkYXRlKCkge1xuXG4gICAgY3R4LmZpbGxTdHlsZSA9ICdyZ2JhKDAsIDI1NSwgMCwgMC41KSdcbiAgICBjdHguZmlsbFJlY3QodGhpcy5wb3NpdGlvbi54LCB0aGlzLnBvc2l0aW9uLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxuXG4gICAgLy8gd2Ugd2lsbCB1c2UgaXQgd2hlbiB3ZSB3aWxsIGdldCBvdXIgZ2FtZSBncmFwaGljc1xuICAgIC8vdGhpcy5kcmF3KCk7XG5cbiAgICB0aGlzLnBvc2l0aW9uLnggKz0gdGhpcy52ZWxvY2l0eS54XG4gICAgdGhpcy5jaGVja0Zvckhvcml6b250YWxDb2xsaXNpb25zKClcbiAgICB0aGlzLmFwcGx5R3Jhdml0eSgpXG4gICAgdGhpcy5jaGVja0ZvclZlcnRpY2FsQ29sbGlzaW9ucygpXG4gIH1cblxuICBhcHBseUdyYXZpdHkoKSB7XG4gICAgdGhpcy5wb3NpdGlvbi55ICs9IHRoaXMudmVsb2NpdHkueVxuICAgIHRoaXMudmVsb2NpdHkueSArPSBnYW1lQ29uc3RhbnRzLmdyYXZpdHlcbiAgfVxuXG4gIGNoZWNrRm9yVmVydGljYWxDb2xsaXNpb25zKCkge1xuICAgIC8vIHNpbXBsZSBjaGVja2luZywgYmVjYXVzZSB3ZSB3aWxsIHVzZSBzb29uIHNvbWV0aGluZyBiZXR0ZXIgOilcbiAgICBpZiAodGhpcy5wb3NpdGlvbi55ICsgdGhpcy5oZWlnaHQgKyB0aGlzLnZlbG9jaXR5LnkgPiBnYW1lQ29uc3RhbnRzLmNhbnZhc0hlaWdodCkge1xuICAgICAgdGhpcy52ZWxvY2l0eS55ID0gMFxuICAgICAgZ2FtZVN0YXRlLmNhbkp1bXAgPSB0cnVlXG4gICAgfSBlbHNlXG4gICAgICBnYW1lU3RhdGUuY2FuSnVtcCA9IGZhbHNlXG5cbiAgfVxuXG4gIGNoZWNrRm9ySG9yaXpvbnRhbENvbGxpc2lvbnMoKSB7XG4gICAgLy8gc2ltcGxlIGNoZWNraW5nLCBiZWNhdXNlIHdlIHdpbGwgdXNlIHNvb24gc29tZXRoaW5nIGJldHRlciA6KVxuICAgIGlmICh0aGlzLnBvc2l0aW9uLnggKyB0aGlzLnZlbG9jaXR5LnggPCAwKSB7XG4gICAgICB0aGlzLnBvc2l0aW9uLnggPSAwO1xuICAgICAgdGhpcy52ZWxvY2l0eS54ID0gMFxuICAgIH1cbiAgICBpZiAodGhpcy5wb3NpdGlvbi54ICsgdGhpcy53aWR0aCArIHRoaXMudmVsb2NpdHkueCA+IGdhbWVDb25zdGFudHMuY2FudmFzV2lkdGgpIHtcbiAgICAgIHRoaXMudmVsb2NpdHkueCA9IDBcbiAgICAgIHRoaXMucG9zaXRpb24ueCA9IGdhbWVDb25zdGFudHMuY2FudmFzV2lkdGggLSB0aGlzLndpZHRoXG4gICAgfVxuICB9XG5cbn1cbiJdfQ==
