const Platform = require('../platform.js')

/**
 *
 * @param level
 * @returns {*[]}
 */
const generatePlatformFromArray = (level) => {
  const platforms = []
  const platform = new Platform()
  platforms.push(platform)
  return platforms
}