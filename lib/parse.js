// This is mostly from fontnik's tests
// https://github.com/mapbox/node-fontnik

module.exports = function glyphs (buffer, padding) {
  var stacks = []

  var val, tag
  var end = buffer.length

  while (buffer.pos < end) {
    val = buffer.readVarint()
    tag = val >> 3
    if (tag === 1) {
      var fontstack = readFontstack()
      stacks.push(fontstack)
    } else {
      buffer.skip(val)
    }
  }

  return stacks

  function readFontstack () {
    var fontstack = { glyphs: {} }
    var bytes = buffer.readVarint()
    var val, tag
    var end = buffer.pos + bytes
    while (buffer.pos < end) {
      val = buffer.readVarint()
      tag = val >> 3

      if (tag === 1) {
        fontstack.name = buffer.readString()
      } else if (tag === 3) {
        var glyph = readGlyph()
        fontstack.glyphs[glyph.id] = glyph
      } else {
        buffer.skip(val)
      }
    }
    return fontstack
  }

  function readGlyph () {
    var glyph = {}
    var bytes = buffer.readVarint()
    var val, tag
    var end = buffer.pos + bytes
    while (buffer.pos < end) {
      val = buffer.readVarint()
      tag = val >> 3
      if (tag === 1) {
        glyph.id = buffer.readVarint()
      } else if (tag === 2) {
        glyph.bitmap = buffer.readBytes()
      } else if (tag === 3) {
        glyph.width = buffer.readVarint()
      } else if (tag === 4) {
        glyph.height = buffer.readVarint()
      } else if (tag === 5) {
        glyph.left = buffer.readSVarint()
      } else if (tag === 6) {
        glyph.top = buffer.readSVarint()
      } else if (tag === 7) {
        glyph.advance = buffer.readVarint()
      } else {
        buffer.skip(val)
      }
    }
    glyph.shape = [
      glyph.width + padding * 2,
      glyph.height + padding * 2
    ]
    return glyph
  }
}
