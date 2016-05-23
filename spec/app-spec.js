'use strict'

const request = require('supertest')
let app = require('../app')
const token = 'secret-token'
app.set('slackCommandToken', token)

describe("app", function() {
  describe("POST /graph", function() {
    it("returns 400 with no token provided", function(done) {
      request(app)
        .post('/graph')
        .expect(function(res) {
          expect(res.text).toEqual("Invalid token")
        })
        .expect(400, done)
    })

    it("returns a graph with just numbers provided", function(done) {
      request(app)
        .post('/graph')
        .type('form')
        .send({token: token, text: '1,2,3'})
        .expect(function(res) {
          expect(res.body['response_type']).toEqual('in_channel')
          expect(res.body['text']).toContain('==================== | 3')
        })
        .expect(200, done)
    })

    it("returns a graph with numbers and labels provided", function(done) {
      request(app)
        .post('/graph')
        .type('form')
        .send({token: token, text: 'cats,dogs,fish 1,2,3'})
        .expect(function(res) {
          expect(res.body['response_type']).toEqual('in_channel')
          expect(res.body['text']).toContain(' fish | ==================== | 3')
        })
        .expect(200, done)
    })

    it("adds comma separators to large numbers", function(done) {
      request(app)
        .post('/graph')
        .type('form')
        .send({token: token, text: '1000,20000000'})
        .expect(function(res) {
          expect(res.body['response_type']).toEqual('in_channel')
          expect(res.body['text']).toContain('1,000')
          expect(res.body['text']).toContain('20,000,000')
        })
        .expect(200, done)
    })

    it("supports use of other characters for the bar", function(done) {
      request(app)
        .post('/graph')
        .type('form')
        .send({token: token, text: '1,2,3 *'})
        .expect(function(res) {
          expect(res.body['text']).toContain('******************** | 3')
        })
        .expect(200, done)
    })

    it("supports use of other characters for the bar, with labels", function(done) {
      request(app)
        .post('/graph')
        .type('form')
        .send({token: token, text: 'a,b,c 1,2,3 ~'})
        .expect(function(res) {
          expect(res.body['text']).toContain(' c | ~~~~~~~~~~~~~~~~~~~~ | 3')
        })
        .expect(200, done)
    })

    it("supports floats", function(done) {
      request(app)
        .post('/graph')
        .type('form')
        .send({token: token, text: 'a,b 1,1.5'})
        .expect(function(res) {
          expect(res.body['text']).toContain(' b | ==================== | 1.5')
        })
        .expect(200, done)
    })

    it("supports negative numbers", function(done) {
      request(app)
        .post('/graph')
        .type('form')
        .send({token: token, text: 'a,b,c -100,0,100'})
        .expect(function(res) {
          expect(res.body['text']).toContain(' c | ==================== | 100')
          expect(res.body['text']).toContain(' b | ==========           | 0')
          expect(res.body['text']).toContain(' a |                      | -100')
        })
        .expect(200, done)
    })

    it("returns help text if requested", function(done) {
      request(app)
        .post('/graph')
        .type('form')
        .send({token: token, text: 'help'})
        .expect(function(res) {
          expect(res.body['response_type']).toEqual('ephemeral')
          expect(res.body['text']).toEqual('How to use /graph')
        })
        .expect(200, done)
    })

    it("returns help text if provided with an invalid command", function(done) {
      request(app)
        .post('/graph')
        .type('form')
        .send({token: token, text: 'a,b,c 1,2'})
        .expect(function(res) {
          expect(res.body['response_type']).toEqual('ephemeral')
          expect(res.body['text']).toEqual('How to use /graph')
        })
        .expect(200, done)
    })
  })
})
