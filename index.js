'use strict'

require('dotenv').config({silent: true})
const token = process.env.SLACK_COMMAND_TOKEN
const port = process.env.PORT || '3000'
const express = require('express')
const bodyParser = require('body-parser')
const chart = require('ascii-chart')
const sparkly = require('sparkly')

let app = express()
app.use(bodyParser.urlencoded({extended: true}))

app.post('/graph', function (req, res, next) {
  if (req.params.token !== token) {
    return res.status(400).send('Invalid token').end()
  } else if (!req.body || !req.body.text) {
    return res.status(400).send('Must specify some numbers').end()
  }
  let data = req.body.text.split(',')
  res.send(sparkly(data))
})

console.log("Listening on port: " + port)
app.listen(port)
