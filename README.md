Generate Tiles with Mapnik and GeoJSON
---

Uses geojson to create a tile in either PNG, PBF, or UTF Grid formats.

## Install

  ```
  npm install mapnik-tiles
  ```

### Usage 

  ```
  var tiles = require('mapnik-tiles');

  var params = {
    format: 'png',
    name: 'tile-layer',
    z: 5,
    x: 5,
    y: 12
  };

  tiles.generate(geojson, params, callback); 
  ```

## Test

  ```
  npm test
  ``` 
