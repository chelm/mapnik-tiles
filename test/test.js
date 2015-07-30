var tape = require('tape');
var fs = require('fs');

var tiles = require('../');

tape('generate polygon tiles', function (t) {
    t.plan(3);

    var polygons = JSON.parse(fs.readFileSync(__dirname + '/fixtures/polygons.geojson').toString());
    var polygonPNG = fs.readFileSync(__dirname + '/fixtures/polygons.png').toString();
    var polygonPBF = fs.readFileSync(__dirname + '/fixtures/polygons.4.4.5.pbf').toString();
    var polygonUTF = JSON.parse(fs.readFileSync(__dirname + '/fixtures/polygons.4.4.5.utf').toString());

    var params = {
      format: 'png',
      name: 'polygon-data',
      z: 5,
      x: 5,
      y: 12
    };

    // return png buffer
    tiles.generate(polygons, params, function(err, tile){
      fs.writeFile( __dirname + '/out/polygons.png', tile, function( err ) {
        t.equals(tile.toString(), polygonPNG);
      });
    });
  
   var polygons445 = JSON.parse(fs.readFileSync(__dirname + '/fixtures/polygons.4.4.5.geojson').toString());
   var params = {
      format: 'pbf',
      name: 'polygon-data',
      z: 4,
      x: 4,
      y: 5
    };

    // return png buffer
    tiles.generate(polygons445, params, function(err, tile){
      fs.writeFile( __dirname + '/out/polygons.4.4.5.pbf', tile, function( err ) {
        t.equals(tile.toString(), polygonPBF);
      });
    });

    var params = {
      format: 'utf',
      name: 'polygon-data',
      z: 4,
      x: 4,
      y: 5
    };

    // return utf buffer
    tiles.generate(polygons445, params, function(err, tile){
      fs.writeFile( __dirname + '/out/polygons.4.4.5.utf', JSON.stringify(tile), function( err ) {
        t.equals(JSON.stringify(tile), JSON.stringify(polygonUTF));
      });
    });
    
});


