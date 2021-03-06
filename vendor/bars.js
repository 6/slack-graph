// Source (MIT): https://github.com/jstrace/bars/blob/master/index.js

/**
 * Module dependencies.
 */

var fmt = require('printf');
var util = require('util');

/**
 * Expose `histogram()`.
 */

module.exports = histogram;

/**
 * Return ascii histogram of `data`.
 *
 * @param {Object} data
 * @param {Object} [opts]
 * @return {String}
 * @api public
 */

function histogram(data, opts) {
  opts = opts || {};

  // options

  var width = opts.width || 60;
  var barc = opts.bar || '#';
  var map = opts.map || noop;

  // normalize data

  var data = toArray(data);
  if (opts.sort) data = data.sort(descending);

  var maxKey = max(data.map(function(d){ return d.key && d.key.length }));
  var values = data.map(function(d){ return d.val });
  var maxVal = max(values);
  var minVal = min(values);
  var str = '';

  var defaultShown;
  if (maxVal === minVal) {
    defaultShown = width;
  } else if (minVal <= 0 && data.length > 1) {
    defaultShown = 0;
  } else {
    defaultShown = 1;
  }

  // blah blah histo

  for (var i = 0; i < data.length; i++) {
    var d = data[i];
    var p = ((d.val - minVal) / (maxVal - minVal));
    var shown;
    if (p === 0 || isNaN(p)) {
      shown = defaultShown;
    } else {
      shown = Math.round(width * p);
    }
    var blank = width - shown
    var bar = Array(shown + 1).join(barc);
    bar += Array(blank + 1).join(' ');
    if (d.key === null) {
      str += fmt(' %s | %s\n', bar, map(d.val));
    }
    else {
      str += fmt(' %*s | %s | %s\n', d.key, maxKey, bar, map(d.val));
    }
  }

  return str;
}

/**
 * Sort descending.
 */

function descending(a, b) {
  return b.val - a.val;
}

/**
 * Return max in array.
 */

function max(data) {
  var n = data[0];

  for (var i = 1; i < data.length; i++) {
    n = data[i] > n ? data[i] : n;
  }

  return n;
}

function min(data) {
  var n = data[0];

  for (var i = 1; i < data.length; i++) {
    n = data[i] < n ? data[i] : n;
  }

  return n;
}

/**
 * Turn object into an array.
 */

function toArray(obj) {
  if (util.isArray(obj)) {
    return obj.map(function(val) {
      return {
        key: null,
        val: val
      }
    });
  }
  return Object.keys(obj).map(function(key){
    return {
      key: key,
      val: obj[key]
    }
  })
}

/**
 * Noop map function.
 */

function noop(val) {
  return val;
}
