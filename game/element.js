"use strict"

module.exports = class element {

    action() { }

    draw(ctx, r, g, b, a, x, y, width, height) {
        ctx.fillStyle = 'rgba(r, g, b, a)'
        ctx.fillRect(x, y, width, height)
        ctx.fillStyle = 'rgba(r, g, b, a)'
    }

/*     checkForVerticalCollisions() {
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
            this.velocity.x = -this.velocity.x
        }
        if (this.position.x + this.width + this.velocity.x > gameConstants.canvasWidth) {
            this.velocity.x = -this.velocity.x
            this.position.x = gameConstants.canvasWidth - this.width
        }

        if (this.position.x + this.velocity.x < 0) {
            this.position.x = 0;
            this.velocity.x = 0
        }
        if (this.position.x + this.width + this.velocity.x > gameConstants.canvasWidth) {
            this.velocity.x = 0
            this.position.x = gameConstants.canvasWidth - this.width
        }

    } */
}
