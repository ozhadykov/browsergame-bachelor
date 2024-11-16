const Platform = require('../classes/platform.js')
const {levels} = require('../data/levels.js')

/**
 *
 * @param level
 * @returns {*[]}
 */
const generatePlatformsForLevel = (level) => {
  console.log('level:', level)
  const levelMarkup = levels[level].replace(/\s+/g, '').split('+')
  console.log(levelMarkup)

  const platforms = []

  levelMarkup.forEach((levelRow, y) => {
    //console.log(levelRow)
    levelRow.split('').forEach((levelEl, x) => {
      if (levelEl === 'P') {
        const platformEl = new Platform({
          position: {
            x: x * 30,
            y: y * 30,
          }
        })
        platforms.push(platformEl)
      }
    })
  })

  return platforms
}

module.exports = {
  generatePlatformsForLevel
}