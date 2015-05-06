# sdf-bitmap-glyphs

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

Extract SDF bitmap tiles from font files. This is a thin wrapper around [node-fontnik](https://github.com/mapbox/node-fontnik). 

```js
var fs = require('fs')
var path = require('path')
var extract = require('sdf-bitmap-glyphs')

var file = path.join(__dirname, 'MyFont.otf')
var font = fs.readFileSync(file)

extract(font, {
  start: 0,  //code point range to extract
  end: 255
}, function(err, data) {
  console.log(data.family)  //"Open Sans"
  console.log(data.style)   //"Bold"
  console.log(data.points)  //available code points in font
  console.log(data.padding) //tile border padding (usually 3px)
  console.log(data.glyphs)  //glyph data { '65': {...}, etc }
})
```

Each glyph is stored by its code point and looks like this:

```
{
  id: 65,            //codepoint
  advance: 16,       //amount for x-advance
  width: 17,         //glyph width
  height: 17,        //glyph height
  left: 0,           //horizontal bearing
  top: -9,           //vertical bearing
  bitmap: Buffer,    //a single channel uint8 bitmap
  shape: [23, 23]    //the [width, height] of bitmap tile
}
```

See [test/demo.js](test/demo.js) for an example of rendering a bitmap tile like this:

![tile](http://i.imgur.com/hMH0hWL.png)

## Usage

[![NPM](https://nodei.co/npm/sdf-bitmap-glyphs.png)](https://www.npmjs.com/package/sdf-bitmap-glyphs)

#### `extract(font, [opt], cb)`

Extracts SDF glyphs from the given `font` Buffer. If `opt` is not defined, it will only extract ASCII glyphs (0-255). Returns the `cb` with `(err, data)` results.

Options:

- `start` the start code point to look for, default 0
- `end` the end code point to look for, default 255

## License

MIT, see [LICENSE.md](http://github.com/Jam3/sdf-bitmap-glyphs/blob/master/LICENSE.md) for details.
