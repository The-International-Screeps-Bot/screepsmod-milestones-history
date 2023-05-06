const log = require('log-to-file');
const checkRooms = require('./checkRoomObjects.js')
const checkUsers = require('./checkUsers.js')

module.exports = function engine(config) {
  config.engine.on('init', async type => {

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
            checkRooms(rooms, users, gameTime)
            checkUsers(users, gameTime)
          } catch (error) {
            log(error, "logs/history")
            log(error, "logs/history/error_engine.log")
          }
        }
      })
    }
  })
}