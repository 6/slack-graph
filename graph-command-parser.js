'use strict'

function GraphCommandParser (commandText) {
  this.commandText = commandText
  if (this.commandText) {
    this.commandParts = this.commandText.split(' ').map(function (part) {
      return part.split(',')
    })
  }
}

GraphCommandParser.prototype.isHelp = function () {
  return this.commandText === 'help'
}

GraphCommandParser.prototype.isValid = function () {
  return !!this.asBarChartData()
}

GraphCommandParser.prototype.asBarChartData = function () {
  let data
  if (!this.commandParts) {
    // Do nothing if command is invalid
  } else if (this.commandParts.length === 1) {
    // Handle command in the format of '1,2,3'
    data = this.commandParts[0].map(function (value) {
      return parseFloat(value)
    })
  } else if (this.commandParts.length === 2) {
    // Handle command in the format of 'cats,dogs,fish 1,2,3'
    let keys = this.commandParts[0]
    let values = this.commandParts[1]
    if (keys.length > 0 && keys.length === values.length) {
      data = {}
      keys.forEach(function (key, i) {
        data[key] = parseFloat(values[i])
      })
    }
  }
  return data
}

module.exports = GraphCommandParser
