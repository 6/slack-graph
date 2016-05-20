'use strict'

require('dotenv').config({silent: true})
const token = process.env.SLACK_COMMAND_TOKEN
const port = process.env.PORT || '3000'
const express = require('express')
const bodyParser = require('body-parser')
const bars = require('./vendor/bars')

let app = express()
app.use(bodyParser.urlencoded({extended: true}))

// Slack Command API docs: https://api.slack.com/slash-commands
app.post('/graph', function (req, res, next) {
  if (req.params.token !== token) {
    return res.status(400).send('Invalid token').end()
  } else if (!req.body || !req.body.text || req.body.text === "help") {
    return res.json(usageJson()).end()
  }
  let parts = req.body.text.split(' ')
  let data;
  if (parts.length === 1) {
    data = parts[0].split(',')
  } else if (parts.length === 2) {
    let keys = parts[0].split(',')
    let values = parts[1].split(',')
    if (keys.length > 0 && keys.length === values.length) {
      data = {}
      keys.forEach(function (key, i) {
        data[key] = values[i]
      })
    } else {
      return res.json(usageJson()).end()
    }
  } else {
    return res.json(usageJson()).end()
  }

  res.json({
    response_type: "in_channel",
    text: surroundCodeBlock(bars(data, {bar: '=', width: 20, sort: true}))
  })
})

function usageJson() {
  return {
    "response_type": "ephemeral",
    "text": "How to use /graph",
    "attachments": [
      {
        "text": "Type `/graph 1,2,3` to display a simple graph with no labels.\nTo include labels, type `/graph cats,dogs,fish 1,2,3`."
      }
    ]
  }
}

function surroundCodeBlock(text) {
  return '```\n' + text + '```'
}

console.log("Listening on port: " + port)
app.listen(port)
