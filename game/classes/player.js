"use strict"

const BaseGameElement = require('./element.js')

//fragwürdig:
const ElementList = require('./elementList')
const {generatePlatformsForLevel} = require("../utils/PlatfromElementGenerator.js")
const Platform = require('../classes/platform.js')


module.exports = class Player extends BaseGameElement {

  constructor(params) {
    super(params);

    this.velocity = {
      x: 0,
      y: 1,
    };

    this.elementList = new ElementList();

    this.keys = {
      d: {
        pressed: false,
      },
      a: {
        pressed: false,
      },
      w: {
        pressed: false,
      },
    };

    //Elementlisbefüllen:
    const levelPlatforms = generatePlatformsForLevel(0)
    levelPlatforms.forEach(platform => this.elementList.add(platform))

    this.canJump = true;
    this.inJump = false;
    this.lastPressedRight = false;

    this.jumpDuration = null;
    this.gravity = params.gravity ?? 0.5;

    this.startTime = null;
    this.endTime = null;

    // creating event listeners only once, do not need to create them each time, when we re-render
    window.addEventListener('keydown', e => {
      switch (e.key) {
        case 'd':
          this.keys.d.pressed = true,
            this.lastPressedRight = true
          break
        case 'a':
          this.keys.a.pressed = true,
            this.lastPressedRight = false
          break
        case 'w':
          if (!this.keys.w.pressed && this.canJump && !this.inJump) {
            this.startedPressingJump()
            this.inJump = true
            this.keys.w.pressed = true
          }
          break
      }
    })

    window.addEventListener('keyup', e => {
      switch (e.key) {
        case 'd':
          this.keys.d.pressed = false
          break
        case 'a':
          this.keys.a.pressed = false
          break
        case 'w':
          if (this.canJump && this.inJump) {
            this.keys.w.pressed = false
            this.stoppedPressingJump()

            this.jumpDuration = this.endTime - this.startTime
            this.velocity.y = -8 * (this.jumpDuration * 0.005)

            if (this.lastPressedRight)
              this.velocity.x = this.jumpDuration * 0.05
            else
              this.velocity.x = -(this.jumpDuration * 0.05)

            this.inJump = false
          }
          break
      }
    })
  }

  startedPressingJump() {
    this.startTime = Date.now()
  }

  stoppedPressingJump() {
    this.endTime = Date.now()
  }

  action() {
    if (this.velocity.x > 0)
      this.velocity.x -= 0.2

    if (this.velocity.x < 0)
      this.velocity.x += 0.2

    if (this.velocity.x < 0.2 && this.velocity.x > -0.2)
      this.velocity.x = 0

    if (this.keys.d.pressed && this.canJump)
      this.velocity.x = 5
    else if (this.keys.a.pressed && this.canJump)
      this.velocity.x = -5
  }

  checkForCollisions(ctx, canvas) {
    // simple checking, because we will use soon something better :)
    if (this.position.y + this.height + this.velocity.y > canvas.height) {
      this.velocity.y = 0
      this.canJump = true
    } else
      this.canJump = false

    if (this.position.x + this.velocity.x < 0) {
      this.position.x = 0;
      this.velocity.x = -this.velocity.x
    }

    if (this.position.x + this.width + this.velocity.x > canvas.width) {
      this.velocity.x = -this.velocity.x
      this.position.x = canvas.width - this.width
    }

    if (this.position.x + this.velocity.x < 0) {
      this.position.x = 0;
      this.velocity.x = 0
    }

    if (this.position.x + this.width + this.velocity.x > canvas.width) {
      this.velocity.x = 0
      this.position.x = canvas.width - this.width
    }

  }

checkForPlatformCollisions() {
  const playerBottom = this.position.y + this.height;
  const playerTop = this.position.y;
  const playerRight = this.position.x + this.width;
  const playerLeft = this.position.x;

  for (let i = 0; i < this.elementList.length; i++) {
      const element = this.elementList[i];

      // Ignoriere das eigene Element (den Spieler)
      if (element === this) continue;

      // Prüfe, ob es sich um eine Plattform handelt
      if (element instanceof Platform) {
          const platformBottom = element.position.y + element.height;
          const platformTop = element.position.y;
          const platformRight = element.position.x + element.width;
          const platformLeft = element.position.x;

          // 1. Der Spieler landet auf der Plattform (von oben auf die Plattform fallen)
          if (playerBottom <= platformTop && playerTop < platformTop && playerLeft < platformRight && playerRight > platformLeft) {
              // Der Spieler fällt auf die Plattform
              this.position.y = platformTop - this.height;  // Setze den Spieler direkt auf die Plattform
              this.canJump = true;  // Erlaube dem Spieler zu springen
          }

          // 2. Der Spieler trifft die Plattform von oben (die Bewegung nicht stoppen)
          if (playerTop <= platformBottom && playerBottom > platformBottom && playerLeft < platformRight && playerRight > platformLeft) {
              // Stoppe nicht die Bewegung, der Spieler fällt weiter
              this.position.y = platformBottom; // Setze den Spieler direkt unter die Plattform
          }

          // 3. Kollision von links (Player stößt an die rechte Seite der Plattform)
          if (playerRight > platformLeft && playerLeft < platformLeft && playerBottom > platformTop && playerTop < platformBottom) {
              this.position.x = platformLeft - this.width; // Setze den Spieler an den linken Rand der Plattform
              this.velocity.x = 0; // Stoppe die horizontale Bewegung
          }

          // 4. Kollision von rechts (Player stößt an die linke Seite der Plattform)
          if (playerLeft < platformRight && playerRight > platformRight && playerBottom > platformTop && playerTop < platformBottom) {
              this.position.x = platformRight; // Setze den Spieler an den rechten Rand der Plattform
              this.velocity.x = 0; // Stoppe die horizontale Bewegung
          }
      }
  }
}

  draw(ctx, canvas) {

    ctx.fillStyle = 'rgba(0, 255, 0, 0.5)'
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'

    if (this.lastPressedRight)
      ctx.fillRect(this.position.x + (this.width - 2 * (this.width / 5)), this.position.y + this.height / 5, this.width / 5, this.height / 5)
    else
      ctx.fillRect(this.position.x + this.width / 5, this.position.y + this.height / 5, this.width / 5, this.height / 5)


    this.position.x += this.velocity.x
    this.checkForCollisions(ctx, canvas)

    this.checkForPlatformCollisions()

    this.applyGravity()
  }

  applyGravity() {
    this.position.y += this.velocity.y
    this.velocity.y += this.gravity
  }
}
