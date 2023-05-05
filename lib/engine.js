const log = require('log-to-file');
const checkRooms = require('./checkRoomObjects.js')
const checkUsers = require('./checkUsers.js')

module.exports = function engine(config) {
  config.engine.on('init', async type => {

    let lastRoomsObjects = null
    let lastUsers = null
    const { storage: { db, env } } = config.common
    if (type === 'main') {
      config.engine.on('mainLoopStage', async stage => {
        if (stage === 'waitForRooms') {
          try {
            const gameTime = parseInt(await env.get(env.keys.GAMETIME))
            if (gameTime < 100) {
              log(`Skipping engine run at tick ${gameTime}`, "logs/engine.log")
              return
            }

            const users = await db['users'].find({})
            const rooms = await db['rooms.objects'].find({})

            checkRooms(rooms, lastRoomsObjects, users, gameTime)
            checkUsers(users, lastUsers, gameTime)

            lastRoomsObjects = rooms
            lastUsers = users
          } catch (error) {
            console.log(error)
            log(error, "logs/history/error_engine.log")
          }
        }
      })
    }
  })
}