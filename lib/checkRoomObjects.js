const fs = require('fs');
const log = require('log-to-file');

function logToFile(message, gameTime) {
    if (!fs.existsSync('logs/history.log')) {
        fs.appendFileSync('logs/history.log', `${gameTime}: ${message}\n`)
        return;
    }

    const file = fs.readFileSync('logs/history.log', 'utf8');
    if (file.includes(message)) {
        return
    }
    fs.appendFileSync('logs/history.log', `${gameTime}: ${message}\n`)
}

module.exports = function (roomObjects, users, gameTime) {
    try {
        const usernames = {}
        users.forEach(user => {
            usernames[user._id] = user.username
        })

        roomObjects.forEach(object => {
            if (usernames[object.user]) {
                if (object.type === 'controller') {
                    const level = object.level
                    if (level > 1) {
                        logToFile(`Room ${usernames[object.user]}/${object.room} controller reached level ${level}`, gameTime)
                    }
                }
                if (object.type === "storage") {
                    logToFile(`Room ${usernames[object.user]}/${object.room} built a new storage`, gameTime)
                } else if (object.type === "terminal") {
                    logToFile(`Room ${usernames[object.user]}/${object.room} built a new terminal`, gameTime)
                }
            }
        })

        users.forEach(user => {
            const spawns = roomObjects.filter(o => o.type === 'spawn' && o.user === user._id)
            if (spawns.length > 1) {
                const message = (amount) => `Room ${usernames[spawns[0].user]}/${spawns[0].room} has ${amount} spawns now`
                logToFile(message(spawns.length), gameTime)
                const file = fs.readFileSync('logs/history.log', 'utf8');
                if (file.includes(message(spawns.length + 1))) {
                    logToFile(`Room ${usernames[spawns[0].user]}/${spawns[0].room} lost an spawn, has ${spawns.length} spawns now`, gameTime)
                }
            }
        })
    } catch (error) {
        log(error, "logs/history/error")
        logToFile(`ROOMOBJECTS: ${JSON.stringify(error)}`, gameTime)
    }
}