const Platform = require('../classes/platform.js')
const {levels}      = require('../data/levels.js')

/**
 *
 * @param level
 * @returns {*[]}
 */
const generatePlatformsForLevel = (level) => {
  const levelMarkup = levels[level].replace(/\s+/g, '').split('+')
  const platforms = []

  levelMarkup.forEach((levelRow, y) => {
    levelRow.split('').forEach((levelEl, x) => {
      // TODO: Define, what kind of platform should be created
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