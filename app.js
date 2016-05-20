'use strict'

const port = process.env.PORT || '3000'
const express = require('express')
const bodyParser = require('body-parser')
const bars = require('./vendor/bars')

let app = express()
app.set('port', port)
app.use(bodyParser.urlencoded({extended: true}))

// Slack Command API docs: https://api.slack.com/slash-commands
app.post('/graph', function (req, res) {
  if (req.body.token !== app.get('slackCommandToken')) {
    return res.status(400).send('Invalid token').end()
  }

  let data = getDataFromSlackText(req.body.text)
  if (!data) {
    res.json({
      "response_type": "ephemeral",
      "text": "How to use /graph",
      "attachments": [
        {
          "text": "Type `/graph 1,2,3` to display a simple graph with no labels.\nTo include labels, type `/graph cats,dogs,fish 1,2,3`."
        }
      ]
    })
  }
  else {
    let barChart = bars(data, {bar: '=', width: 20, sort: true})
    res.json({
      response_type: "in_channel",
      text: surroundCodeBlock(barChart)
    })
  }
})

function getDataFromSlackText(text) {
  if (!text || text === "help") return;

  let parts = text.split(' ')
  let data
  // Data in the format of "1,2,3"
  if (parts.length === 1) {
    data = parts[0].split(',').map(function (value) {
      return parseFloat(value)
    })
  }
  // Data in the format of "cats,dogs,fish 1,2,3"
  else if (parts.length === 2) {
    let keys = parts[0].split(',')
    let values = parts[1].split(',')
    if (keys.length > 0 && keys.length === values.length) {
      data = {}
      keys.forEach(function (key, i) {
        data[key] = parseFloat(values[i])
      })
    }
  }
  return data
}

function surroundCodeBlock(text) {
  return '```\n' + text + '```'
}

module.exports = app
