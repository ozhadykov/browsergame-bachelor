
"use strict"
const {
    ctx
} = require('./constants.js')

const BaseGameElementelement = require("./element")

module.exports = class Platform extends BaseGameElementelement {

    constructor(params) {
        super(params)
       // this.position = position
        this.width = 30
        this.height = 30
           }


    update() {
    
    }


    draw(ctx) {
        if (!ctx) {
            console.error('ctx is undefined');
            return // oder Fehler
        }
        ctx.fillStyle = 'rgba(1, 14, 14, 1)'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

