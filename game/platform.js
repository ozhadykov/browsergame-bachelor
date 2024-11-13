"use strict"
const {
    ctx
} = require('./platform.js')

module.exports = class Platform {

    constructor({ position}) {
        this.position = position
        this.width = 30
        this.height = 30
      }
    
      
    update () {
   // this.draw()
   ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'
   ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
   }


   draw(ctx) {
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'
   ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }


     move() {
        
    }

}

