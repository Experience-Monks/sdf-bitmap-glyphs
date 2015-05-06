var extract = require('../')
var test = require('tape')
var fs = require('fs')
var path = require('path')

test('get font info', function (t) {
  var font = fs.readFileSync(path.resolve(__dirname, 'fixtures/OpenSans-Bold.ttf'))
  extract(font, function (err, data) {
    if (err) t.fail(err)
    t.equal(data.style, 'Bold')
    t.equal(data.family, 'Open Sans')
    t.deepEqual(data.points, require('./fixtures/OpenSans-points.json'))
  })
  t.plan(3)
})

test('gets some font glyphs', function (t) {
  var font = fs.readFileSync(path.resolve(__dirname, 'fixtures/OpenSans-Bold.ttf'))
  var start = 0
  var end = 128
  var comp = function (a, b) {
    return a - b
  }

  var expected = require('./fixtures/OpenSans-points.json')
    .slice()
    .sort(comp)

  extract(font, {
    start: start,
    end: end
  }, function (err, data) {
    if (err) t.fail(err)
    var actual = Object.keys(data.glyphs).map(function (n) {
      return parseInt(n, 10)
    }).sort(comp)
    t.ok(actual.length > 0, 'found ' + actual.length + ' glyphs')
    expected.unshift(32) // space is included in the returned data set
    t.deepEqual(actual, expected.slice(0, actual.length))
  })
  t.plan(2)
})

test('font glyph data', function (t) {
  var font = fs.readFileSync(path.resolve(__dirname, 'fixtures/OpenSans-Bold.ttf'))
  var start = 0
  var end = 128

  extract(font, {
    start: start,
    end: end
  }, function (err, data) {
    if (err) t.fail(err)
    var A = data.glyphs['65']
    t.equal(A.advance, 16)
    t.equal(A.width, 17)
    t.equal(A.height, 17)
    t.equal(A.id, 65)
    t.equal(A.left, 0)
    t.equal(A.top, -9)
    t.deepEqual(A.shape, [23, 23])
    t.deepEqual(A.bitmap.length, A.shape[0] * A.shape[1])
  })
  t.plan(8)
})
