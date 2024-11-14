
"use strict"
const {
    ctx
} = require('./constants.js')

module.exports = class Platform {

    constructor({ position}) {
        this.position = position
        this.width = 30
        this.height = 30
      }
    
      
    update () {
   // this.draw(ctx)
        if (!ctx) {
        console.error('ctx is undefined');
        return // oder werfen Sie einen Fehler, je nachdem, wie Sie damit umgehen möchten
    }
   ctx.fillStyle = 'darkred'
   //'rgba(0, 255, 255, 1)'
   ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
   }


   draw(ctx) {
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'
   ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }


     move() {
        
    }

}

