"use strict"

module.exports = class Element {

    drawPlayer(ctx, x, y) {
        
        ctx.clear;
        ctx.beginPath();
        ctx.fillStyle = "#fca400";
        ctx.rect(x, y, 15, 15); 
        ctx.fill();
        ctx.closePath();
    }



    checkCollision(element) {

    }

}
