'use strict'

const slack = require('@slack/client')
const RtmClient = slack.RtmClient
const CLIENT_EVENTS = slack.CLIENT_EVENTS
require('dotenv').config({silent: true})

const token = process.env.SLACK_API_TOKEN

let rtm = new RtmClient(token, {logLevel: 'debug'})
rtm.start()
