const gameConstants = {
  width: 960,
  height: 540,
  gravity: 0.5
}

const canvas = document.getElementById('my-canvas')
const ctx = canvas.getContext('2d')

module.exports = { gameConstants, canvas, ctx };