// demo
// Extract a tile and save to PNG

// Usage:
// node test/demo.js A > tiles/A.png

var extract = require('../')
var fs = require('fs')
var path = require('path')
var save = require('save-pixels')
var ndarray = require('ndarray')

var font = fs.readFileSync(path.resolve(__dirname, 'fixtures/OpenSans-Bold.ttf'))

extract(font, function (err, data) {
  if (err) throw err
  var code = String((process.argv[2] || 'a').charCodeAt(0))
  var glyph = data.glyphs[code]
  var rgba = toRGBA(glyph)
  save(rgba, 'png').pipe(process.stdout)
})

function toRGBA (glyph) {
  var shape = [ glyph.shape[1], glyph.shape[0], 1 ]
  var alpha = ndarray(glyph.bitmap, shape)

  var width = alpha.shape[0],
    height = alpha.shape[1]
  var result = new Uint8ClampedArray(width * height * 4)
  var output = ndarray(result, [width, height, 4])

  for (var i = 0; i < width * height; i++) {
    var x = Math.floor(i % width),
      y = Math.floor(i / width)
    var a = alpha.get(x, y, 0)
    var idx = output.index(x, y, 0)
    result[idx + 0] = a
    result[idx + 1] = a
    result[idx + 2] = a
    result[idx + 3] = 0xff
  }
  return output.transpose(1, 0, 2)
}
