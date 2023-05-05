const log = require('log-to-file');

function logToFile(message) {
    log(message, 'logs/history.log')
}

module.exports = function (roomObjects, lastRoomObjects, users, gameTime) {
    const usernames = {}
    users.forEach(user => {
        usernames[user._id] = user.username
    })

    if (!lastRoomObjects) {
        return;
    }
    roomObjects.forEach(object => {
        const lastObject = lastRoomObjects.find(o => o._id === object._id)
        if (lastObject) {
            if (object.type === 'controller') {
                const level = object.level
                const lastLevel = lastObject.level
                if (level > 1 && level > lastLevel) {
                    logToFile(`${gameTime}: Room ${usernames[object.user]}/${object.room} controller reached level ${level}`)
                }
            }
        }
        else {
            if (object.type === "storage") {
                logToFile(`${gameTime}: Room ${usernames[object.user]}/${object.room} built a new storage`)
            } else if (object.type === "terminal") {
                logToFile(`${gameTime}: Room ${usernames[object.user]}/${object.room} built a new terminal`)
            }
        }
    })

    const spawnCount = roomObjects.filter(o => o.type === 'spawn').length
    const lastSpawnCount = lastRoomObjects.filter(o => o.type === 'spawn').length
    if (spawnCount > lastSpawnCount) {
        logToFile(`${gameTime}: Room ${usernames[object.user]}/${object.room} built ${spawnCount - lastSpawnCount === 1 ? "a new spawn" : `${spawnCount - lastSpawnCount} new spawns`}`)
    }
    else if (spawnCount < lastSpawnCount) {
        logToFile(`${gameTime}: Room ${usernames[object.user]}/${object.room} lost ${lastSpawnCount - spawnCount === 1 ? "a spawn" : `${lastSpawnCount - spawnCount} spawns`}`)
    }
}