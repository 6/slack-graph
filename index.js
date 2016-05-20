'use strict'

require('dotenv').config({silent: true})
const token = process.env.SLACK_COMMAND_TOKEN
const port = process.env.PORT || '3000'
const express = require('express')
let app = express()

app.post('/graph', function (req, res, next) {
  if (req.params.token !== token) {
    return res.status(400).send('Invalid token').end()
  } else if (!req.params.text || req.params.text === "") {
    return res.status(400).send('Must specify some numbers').end()
  }
  res.send('it works :shipit: ' + req.params.text)
})

console.log("Listening on port: " + port)
app.listen(port)
