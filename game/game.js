"use strict"

const player = require('./player')
let playerdraw = new player()



// DAS IST EIN NEUER TEST KOMMENTAR

//----------------------

module.exports = class Game {

    constructor() {}

    drawMenu() {

    }



    start() {
        let mycanvas = window.document.getElementById("mycanvas")

        let ctx = mycanvas.getContext('2d')

        playerdraw.drawPlayer(ctx, 1280 / 2, 720 / 2)
    }



    update() {

    }



    end() {

    }



    pause() {

    }



    updateFrames() {

    }
}
