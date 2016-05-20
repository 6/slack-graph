'use strict'

require('dotenv').config({silent: true})
const token = process.env.SLACK_COMMAND_TOKEN
const port = process.env.PORT || '3000'
const express = require('express')
const bodyParser = require('body-parser')
const bars = require('bars')

let app = express()
app.use(bodyParser.urlencoded({extended: true}))

app.post('/graph', function (req, res, next) {
  if (req.params.token !== token) {
    return res.status(400).send('Invalid token').end()
  } else if (!req.body || !req.body.text) {
    return res.status(400).send('Must specify some numbers').end()
  }
  let parts = req.body.text.split(' ')
  let data;
  if (parts.length === 2) {
    let keys = parts[0].split(',')
    let values = parts[1].split(',')
    if (keys.length > 0 && keys.length === values.length) {
      data = {}
      keys.forEach(function (key, i) {
        data[key] = values[i]
      })
    }
  }
  data = data || parts[0].split(',')

  res.send(bars(data, {bar: '=', width: 20, sort: true}))
})

console.log("Listening on port: " + port)
app.listen(port)
