const log = require('log-to-file');

let lastUsers = null
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

function logToFile(message) {
    log(message, 'logs/history.log')
} 

module.exports = function (users, gameTime) {
    if (lastUsers) {
        users.forEach(user => {
            const lastUser = lastUsers.find(u => u._id === user._id)
            if (lastUser) {
                const gcl = user.gcl
                const lastGcl = lastUser.gcl
                gclScoreRequirements.forEach((score, index) => {
                    if (gcl >= score && lastGcl < score) {
                        logToFile(`${gameTime}: User ${user.username} reached GCL ${index + 2}`)
                    }
                })

                const rooms = user.rooms
                const lastRooms = lastUser.rooms
                if (rooms.length > lastRooms.length) {
                    logToFile(`${gameTime}: User ${user.username} claimed a new room`)
                }
                else if (rooms.length < lastRooms.length) {
                    logToFile(`${gameTime}: User ${user.username} lost a room`)
                }
            }
        });

        const newUsers = users.filter(user => !lastUsers.find(u => u._id === user._id))
        if (newUsers.length > 0) {
            logToFile(`${gameTime}: New users: ${newUsers.map(u => u.username).join(', ')}`)
        }

        const lostUsers = lastUsers.filter(user => !users.find(u => u._id === user._id))
        if (lostUsers.length > 0) {
            logToFile(`${gameTime}: Lost users: ${lostUsers.map(u => u.username).join(', ')}`)
        }
    }
    lastUsers = users
}