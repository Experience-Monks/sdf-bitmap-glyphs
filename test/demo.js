// demo
// Extract a tile and save to PNG

// Usage:
// node test/demo.js A > tiles/A.png

var extract = require('../')
var fs = require('fs')
var path = require('path')
var save = require('save-pixels')
var ndarray = require('ndarray')
var ops = require('ndarray-ops')

var font = fs.readFileSync(path.resolve(__dirname, 'fixtures/OpenSans-Bold.ttf'))

extract(font, function (err, data) {
  if (err) throw err
  var code = String((process.argv[2] || 'a').charCodeAt(0))
  var glyph = data.glyphs[code]
  var rgba = toRGBA(glyph)
  save(rgba, 'png').pipe(process.stdout)
})

function toRGBA (glyph) {
  var w = glyph.shape[0], h = glyph.shape[1]

  //glyph.bitmap is rotated, so we use [h, w]
  var alpha = ndarray(glyph.bitmap, [h, w, 1])
  var buf = new Uint8ClampedArray(alpha.size * 4)
  var output = ndarray(buf, [h, w, 4])

  //fill R,G,B as the signed distance
  for (var i = 0; i < 3; ++i)
    ops.assign(output.pick(-1, -1, i), alpha)
  
  //fill alpha as 0xff
  ops.assigns(output.pick(-1, -1, 3), 0xff)
  return output.transpose(1, 0, 2)
}