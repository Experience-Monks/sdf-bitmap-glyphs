var fontnik = require('fontnik')
var Protobuf = require('pbf')
var parse = require('./lib/parse')

// Currently this seems hard-coded into fontnik
var PADDING = 3

module.exports = extract

function extract (buffer, opt, cb) {
  if (typeof opt === 'function') {
    cb = opt
    opt = {}
  }
  opt = opt || {}

  // default to ASCII 0-255
  var start = opt.start || 0
  var end = typeof opt.end === 'number' ? opt.end : 255

  // load font meta data
  load(buffer, function (err, data) {
    if (err) return cb(err)
    range(buffer, { start: start, end: end }, function (err, ranges) {
      if (err) return cb(err)
      data.glyphs = ranges.glyphs
      cb(null, data)
    })
  })
}

// internal for now

function range (buffer, opt, cb) {
  var start = opt.start
  var end = opt.end

  fontnik.range({
    start: start,
    end: end,
    font: buffer
  }, function (err, data) {
    if (err) return cb(err)

    var pbuf = new Protobuf(new Uint8Array(data))
    var stacks = parse(pbuf, PADDING)
    if (stacks.length > 1) {
      return cb(new Error('multiface not yet supported'))
    }
    cb(null, stacks[0])
  })
}

function load (buffer, cb) {
  fontnik.load(buffer, function (err, data) {
    if (err) return cb(err)

    if (data.length > 1) {
      return cb(new Error('multiface not yet supported'))
    }
    data = data[0]
    cb(null, {
      points: data.points,
      style: data.style_name,
      family: data.family_name,
      padding: PADDING
    })
  })
}
