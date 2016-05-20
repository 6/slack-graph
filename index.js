'use strict'

let app = require('./app')
app.set('slackCommandToken', process.env.SLACK_COMMAND_TOKEN)
console.log("Listening on port: " + app.get('port'))
app.listen(app.get('port'))
