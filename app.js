'use strict'

const port = process.env.PORT || '3000'
const express = require('express')
const bodyParser = require('body-parser')
const numeral = require('numeral')
const bars = require('./vendor/bars')
const GraphCommandParser = require('./graph-command-parser')

let app = express()
app.set('port', port)
app.use(bodyParser.urlencoded({extended: true}))

// Slack Command API docs: https://api.slack.com/slash-commands
app.post('/graph', function (req, res) {
  if (req.body.token !== app.get('slackCommandToken')) {
    return res.status(400).send('Invalid token').end()
  }

  let command = new GraphCommandParser(req.body.text)
  if (command.isHelp() || !command.isValid()) {
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
    let barChart = bars(command.asBarChartData(), {
      bar: '=',
      width: 20,
      sort: true,
      map: formatNumber
    })
    res.json({
      response_type: "in_channel",
      text: surroundCodeBlock(barChart)
    })
  }
})

function formatNumber(number) {
  return numeral(number).format('0,0')
}

function surroundCodeBlock(text) {
  return '```\n' + text + '```'
}

module.exports = app
