var mapnik = require('mapnik'), 
  path = require('path'), 
  fs = require('fs'),
  zlib = require('zlib'),
  mercator = new(require('sphericalmercator'))(),
  mapnikify = require('geojson-mapnikify');

//mapnik.register_default_input_plugins();
mapnik.register_datasource(path.join(mapnik.settings.paths.input_plugins,'geojson.input'));


exports.generate = function( geojson, params, callback ) {

  var size = params.size || 256;
  var format = params.format;
  var name = params.name || 'layer';

  createStyleSheet( geojson, name, function(err, stylesheet){

    if ( err ){
      return callback(err, null);
    }

    map = new mapnik.Map(size, size);
    map.fromStringSync( stylesheet );
    map.extent = mercator.bbox(params.x, params.y, params.z, false, '900913');

    if ( format == 'png' ){
      var image = new mapnik.Image(size, size);

      map.render( image, {}, function( err, im ) {
        if (err) {
          callback( err, null );
        } 
        else {
          im.encode( 'png', function( err, buffer ) {
            callback( null, buffer );
          });
        }
      });
      
    } 
    else if (format == 'vector.pbf' || format == 'pbf') {

      var vtile = new mapnik.VectorTile( params.z, params.x, params.y );

      map.render( vtile, {}, function( err, vtile ) {
        if (err) {
          callback( err, null );
        } 
        else {
          zlib.deflate(vtile.getData(), function(err, buffer) {
            callback( null, buffer );
          });
        }
      });

    } else if ( format == 'utf' ) {

      var grid = new mapnik.Grid(size, size, {key: '__id__'});

      map.render( grid, {layer: name}, function( err, g ) {
        if (err) {
          callback( err, null );
        } 
        else {
            var utf = g.encodeSync('utf', {resolution: 4});
            callback( null, utf );
        }
      });

    } 
    else {
      callback( 'Unknown or missing file format', null );
    }
  
  });
};

// replace template strings with real data 
var createStyleSheet = function(geojson, layerName, callback){
  try {
    var template = fs.readFileSync(__dirname + '/lib/stylesheet.xml', 'utf8');
    var geom_type = geojson.features[0].geometry.type.toLowerCase();
    template = template.replace('{{name}}', layerName);
    template = template.replace('{{style}}', geom_type);
    template = template.replace('{{geojson}}', JSON.stringify( geojson ) );
    callback(null, template);
  } catch(e) {
    console.log(e);
    callback('Could not create stylesheet', null);
  }
}
