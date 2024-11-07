(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const gameConstants = {
  width: 960,
  height: 540,
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
    if (this.position.y + this.height + this.velocity.y > gameConstants.height) {
      this.velocity.y = 0
    }
  }

  checkForHorizontalCollisions() {
    // simple checking, because we will use soon something better :)
    if (this.position.x + this.width + this.velocity.x > gameConstants.width ||
      this.position.x + this.width + this.velocity.x < gameConstants.width) {
      this.velocity.x = 0
    }
  }

}

},{"./constants.js":1}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL29wdC9ob21lYnJldy9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lL2NvbnN0YW50cy5qcyIsImdhbWUvZ2FtZS5qcyIsImdhbWUvbWFpbi5qcyIsImdhbWUvcGxheWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IGdhbWVDb25zdGFudHMgPSB7XG4gIHdpZHRoOiA5NjAsXG4gIGhlaWdodDogNTQwLFxuICBncmF2aXR5OiAwLjVcbn1cblxuY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ215LWNhbnZhcycpXG5jb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgZ2FtZUNvbnN0YW50cywgY2FudmFzLCBjdHggfTsiLCJcInVzZSBzdHJpY3RcIlxuXG5jb25zdCBQbGF5ZXIgPSByZXF1aXJlKCcuL3BsYXllci5qcycpXG5jb25zdCB7Y2FudmFzLCBjdHh9ID0gcmVxdWlyZSgnLi9jb25zdGFudHMuanMnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEdhbWUge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIC8vIHJlcXVlc3QgYW5pbWF0aW9uIGZyYW1lIGhhbmRsZVxuICAgIHRoaXMucmFmID0gbnVsbFxuICAgIHRoaXMucGxheWVyID0gbnVsbFxuICAgIHRoaXMua2V5cyA9IHtcbiAgICAgIGQ6IHtcbiAgICAgICAgcHJlc3NlZDogZmFsc2UsXG4gICAgICB9LFxuICAgICAgYToge1xuICAgICAgICBwcmVzc2VkOiBmYWxzZSxcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuXG4gIHN0YXJ0KCkge1xuICAgIC8vIHRoaXMgaXMgaW1wb3J0YW50IGZvciBhbmltYXRpb24gcHVycG9zZXMsIGRvIG5vdCBuZWVkIG5vd1xuICAgIHRoaXMudGltZU9mTGFzdEZyYW1lID0gRGF0ZS5ub3coKVxuXG4gICAgLy8gaGVyZSB3ZSBhcmUgcmVxdWlyaW5nIHdpbmRvdyB0byByZWxvYWQgdG8gbWF4IGZyYW1lcmF0ZSBwb3NzaWJsZVxuICAgIHRoaXMucmFmID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnRpY2suYmluZCh0aGlzKSlcblxuICAgIC8vIGNyZWF0aW5nIFBsYXllciBpbnN0YW5jZVxuICAgIHRoaXMucGxheWVyID0gbmV3IFBsYXllcih7XG4gICAgICBwb3NpdGlvbjoge1xuICAgICAgICB4OiAxMDAsXG4gICAgICAgIHk6IDBcbiAgICAgIH0sXG4gICAgICBoZWlnaHQ6IDEwMCxcbiAgICAgIHdpZHRoOiAxMDAsXG4gICAgfSlcblxuICAgIC8vIGxpc3RlbmluZyB0byB0aGUga2V5Ym9hcmQgZXZlbnRzXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xuICAgICAgc3dpdGNoIChlLmtleSkge1xuICAgICAgICBjYXNlICdkJzpcbiAgICAgICAgICB0aGlzLmtleXMuZC5wcmVzc2VkID0gdHJ1ZVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ2EnOlxuICAgICAgICAgIHRoaXMua2V5cy5hLnByZXNzZWQgPSB0cnVlXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAndyc6XG4gICAgICAgICAgdGhpcy5wbGF5ZXIudmVsb2NpdHkueSA9IC04XG4gICAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgKGV2dCkgPT4ge1xuICAgICAgc3dpdGNoIChldnQua2V5KSB7XG4gICAgICAgIGNhc2UgJ2QnOlxuICAgICAgICAgIHRoaXMua2V5cy5kLnByZXNzZWQgPSBmYWxzZVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ2EnOlxuICAgICAgICAgIHRoaXMua2V5cy5hLnByZXNzZWQgPSBmYWxzZVxuICAgICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG5cbiAgc3RvcCgpIHtcbiAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5yYWYpXG4gIH1cblxuICB0aWNrKCkge1xuICAgIC8vLS0tIGNsZWFyIHNjcmVlblxuICAgIGN0eC5maWxsU3R5bGUgPSAnd2hpdGUnXG4gICAgY3R4LmZpbGxSZWN0KDAsIDAsIGNhbnZhcy5jbGllbnRXaWR0aCwgY2FudmFzLmNsaWVudEhlaWdodClcblxuICAgIC8vIGRyYXdpbmcgZWxlbWVudHNcbiAgICB0aGlzLnBsYXllci51cGRhdGUoKVxuXG4gICAgLy8gaGFuZGxpbmcgcGxheWVyIG1vdmluZyBvbiB4LWF4aXNcbiAgICB0aGlzLnBsYXllci52ZWxvY2l0eS54ID0gMFxuICAgIGlmICh0aGlzLmtleXMuZC5wcmVzc2VkKSB0aGlzLnBsYXllci52ZWxvY2l0eS54ID0gNVxuICAgIGVsc2UgaWYgKHRoaXMua2V5cy5hLnByZXNzZWQpIHRoaXMucGxheWVyLnZlbG9jaXR5LnggPSAtNVxuXG4gICAgLy8gY2FsbGluZyBhbmltYXRpb24gZnVuY3Rpb24gYWdhaW5cbiAgICB0aGlzLnJhZiA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy50aWNrLmJpbmQodGhpcykpXG4gIH1cbn0iLCJcInVzZSBzdHJpY3RcIlxuXG5jb25zdCBHYW1lID0gcmVxdWlyZShcIi4vZ2FtZVwiKVxubGV0IG15R2FtZSA9IG5ldyBHYW1lKClcbm15R2FtZS5zdGFydCgpXG4iLCJcInVzZSBzdHJpY3RcIlxuXG5jb25zdCB7Z2FtZUNvbnN0YW50cywgY3R4fSA9IHJlcXVpcmUoJy4vY29uc3RhbnRzLmpzJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBQbGF5ZXIge1xuXG4gIGNvbnN0cnVjdG9yKHBhcmFtcykge1xuICAgIHRoaXMucG9zaXRpb24gPSBwYXJhbXMucG9zaXRpb247XG4gICAgdGhpcy52ZWxvY2l0eSA9IHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAxXG4gICAgfVxuICAgIHRoaXMuaGVpZ2h0ID0gcGFyYW1zLmhlaWdodDtcbiAgICB0aGlzLndpZHRoID0gcGFyYW1zLndpZHRoO1xuICB9XG5cbiAgZHJhdygpIHtcbiAgfVxuXG4gIHVwZGF0ZSgpIHtcblxuICAgIGN0eC5maWxsU3R5bGUgPSAncmdiYSgwLCAyNTUsIDAsIDAuNSknXG4gICAgY3R4LmZpbGxSZWN0KHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcblxuICAgIC8vIHdlIHdpbGwgdXNlIGl0IHdoZW4gd2Ugd2lsbCBnZXQgb3VyIGdhbWUgZ3JhcGhpY3NcbiAgICAvL3RoaXMuZHJhdygpO1xuXG4gICAgdGhpcy5wb3NpdGlvbi54ICs9IHRoaXMudmVsb2NpdHkueFxuICAgIHRoaXMuY2hlY2tGb3JIb3Jpem9udGFsQ29sbGlzaW9ucygpXG4gICAgdGhpcy5hcHBseUdyYXZpdHkoKVxuICAgIHRoaXMuY2hlY2tGb3JWZXJ0aWNhbENvbGxpc2lvbnMoKVxuICB9XG5cbiAgYXBwbHlHcmF2aXR5KCkge1xuICAgIHRoaXMucG9zaXRpb24ueSArPSB0aGlzLnZlbG9jaXR5LnlcbiAgICB0aGlzLnZlbG9jaXR5LnkgKz0gZ2FtZUNvbnN0YW50cy5ncmF2aXR5XG4gIH1cblxuICBjaGVja0ZvclZlcnRpY2FsQ29sbGlzaW9ucygpIHtcbiAgICAvLyBzaW1wbGUgY2hlY2tpbmcsIGJlY2F1c2Ugd2Ugd2lsbCB1c2Ugc29vbiBzb21ldGhpbmcgYmV0dGVyIDopXG4gICAgaWYgKHRoaXMucG9zaXRpb24ueSArIHRoaXMuaGVpZ2h0ICsgdGhpcy52ZWxvY2l0eS55ID4gZ2FtZUNvbnN0YW50cy5oZWlnaHQpIHtcbiAgICAgIHRoaXMudmVsb2NpdHkueSA9IDBcbiAgICB9XG4gIH1cblxuICBjaGVja0Zvckhvcml6b250YWxDb2xsaXNpb25zKCkge1xuICAgIC8vIHNpbXBsZSBjaGVja2luZywgYmVjYXVzZSB3ZSB3aWxsIHVzZSBzb29uIHNvbWV0aGluZyBiZXR0ZXIgOilcbiAgICBpZiAodGhpcy5wb3NpdGlvbi54ICsgdGhpcy53aWR0aCArIHRoaXMudmVsb2NpdHkueCA+IGdhbWVDb25zdGFudHMud2lkdGggfHxcbiAgICAgIHRoaXMucG9zaXRpb24ueCArIHRoaXMud2lkdGggKyB0aGlzLnZlbG9jaXR5LnggPCBnYW1lQ29uc3RhbnRzLndpZHRoKSB7XG4gICAgICB0aGlzLnZlbG9jaXR5LnggPSAwXG4gICAgfVxuICB9XG5cbn1cbiJdfQ==
