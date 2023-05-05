const bodyParser = require("body-parser");
const log = require('log-to-file');
const fs = require('fs');
const packageJson = require('../package.json');

module.exports = function (config) {
  config.backend.on('expressPreConfig', function (app) {
    try {
      app.use(bodyParser.json({ limit: '5mb' }));
      app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
      app.get('/api/history/version', (req, res) => {
        res.send(packageJson.version)
      })

      app.get('/api/history', (req, res) => {
        if (!fs.existsSync('logs/history.log')) {
          return res.send("No history file found")
        }
        
        if (req.query.filter) {
          const history = fs.readFileSync('logs/history.log', 'utf8');
          const filteredHistory = history.split("\n").filter(line => line.includes(req.query.filter)).join("\n")
          res.send(filteredHistory)
        }
        else {
          const history = fs.readFileSync('logs/history.log', 'utf8');
          res.send(history)
        }
      })
    } catch (error) {
      console.log(error)
      log(error, "logs/history/error_backend.log")
    }
  })
} 