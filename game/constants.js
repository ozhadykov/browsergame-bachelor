const gameConstants = {
  canvasWidth: 960,
  canvasHeight: 540,
  gravity: 0.5
}
const pausedConstants = { //Speichern der Bewegung vor Pause
  pausedPlayerVelocityX: 0
}

const gameState = {
  canJump: true,
  inJump: false,
  lastPressedRight: true,
}

const gameHelpers = {
  startTime: null,
  endTime: null,
  jumpDuration: null, 
}

const startedPressingJump = () => {
  gameHelpers.startTime = Date.now()
}

const stoppedPressingJump = () => {
  gameHelpers.endTime = Date.now()
}



const canvas = document.getElementById('mycanvas')
const ctx = canvas.getContext('2d')

module.exports = {
  gameConstants,
  pausedConstants,
  canvas,
  ctx,
  gameState,
  startedPressingJump,
  stoppedPressingJump,
  gameHelpers
};
