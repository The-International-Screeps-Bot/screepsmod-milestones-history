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

const gclScoreRequirements = [
    1000000,
    5278031,
    13966610,
    27857618,
    47591348,
    73716210,
    106717414,
    147033389,
    195066199,
    251188643
]

module.exports = function (users, gameTime) {
    try {
        users = users.reduce((filteredUsers, user) => {
            if (user.active !== 10000) return filteredUsers;
            filteredUsers.push(user);
            return filteredUsers;
        }, []);

        users.forEach(user => {
            const gcl = user.gcl
            gclScoreRequirements.forEach((score, index) => {
                if (gcl >= score) {
                    logToFile(`User ${user.username} reached GCL ${index + 2}`, gameTime)
                }
            })

            const rooms = user.rooms
            if (rooms.length > 1) {
                const message = (amount) => `User ${user.username} has ${amount} rooms now`
                logToFile(message(rooms.length), gameTime)
                const file = fs.readFileSync('logs/history.log', 'utf8');
                if (file.includes(message(rooms.length + 1))) {
                    logToFile(`User ${user.username} lost a room, has ${rooms.length} rooms now`, gameTime)
                }
            }
            else if (rooms.length === 0) {
                logToFile(`User ${user.username} lost all rooms`, gameTime)
            }
        })

    } catch (error) {
        log(error, "logs/history/error")
        logToFile(`USERS: ${error}`, gameTime)
    }
}