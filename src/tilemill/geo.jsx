/**
 * This is src/locations/geo.jsx
 */

// found here
// http://stackoverflow.com/questions/2103924/mercator-longitude-and-latitude-calculations-to-x-and-y-on-a-cropped-map-of-the/10401734#10401734
//
var geo_to_pixel = function(lat, lon, w, h, ul_lat, ul_lon , lr_lat, lr_lon) {
  // var w;
  // var h;
  // var ul_lon = 9.8;
  // var lr_lon = 10.2;
  var lon_delta = lr_lon - ul_lon;
  $.writeln("lon_delta: " +lon_delta);
  // var lr_lat = 53.45;
  l_lat_deg = lr_lat * Math.PI / 180;
  $.writeln("l_lat_deg: " + l_lat_deg);
  var x = (lon - ul_lat) * (w / lon_delta);
$.writeln("x: " + x);
  lat = lat * Math.PI / 180;
  $.writeln("lat: " + lat);
  var worldMapWidth = ((w / lon_delta) * 360) / (2 * Math.PI);
  $.writeln("worldMapWidth: " + worldMapWidth);
  var mapOffsetY = (worldMapWidth / 2 * Math.log((1 + Math.sin(l_lat_deg)) / (1 - Math.sin(l_lat_deg))));
  $.writeln("mapOffsetY: " + mapOffsetY);

  var y = h - ((worldMapWidth / 2 * Math.log((1 + Math.sin(lat)) / (1 - Math.sin(lat)))) - mapOffsetY);
  $.writeln("y: " + y);
  return {"x":x,"y": y};
};


  var geojson_analyzer = function(settings, element) {
    var found_lat = false;
    var found_lon = false;
    var keys = {
      lon: null,
      lat: null
    };
    if (element.hasOwnProperty(settings.latitude_key)) {
      found_lat = true;
    }
    if (element.hasOwnProperty(settings.longitude_key)) {
      found_lon = true;
    }

    if (found_lat === true && found_lon === true) {
      keys.lon = settings.longitude_key;
      keys.lat = settings.latitude_key;
      return keys;
    }
    // if we are here we didn't match the right element
    // lets loop the possible keys
    for (var i = 0; i < settings.possible_lat_keys.length; i++) {
      for (var k in element) {
        if (element.hasOwnProperty(k)) {
          if ((settings.possible_lat_keys[i]).localeCompare(k) === 0) {
            keys.lat = k;
            found_lat = true;
            continue;
          }
        }
      }
      if (found_lat === true) {
        continue;
      }
    }
    for (var j = 0; j < settings.possible_lon_keys.length; j++) {
      for (var l in element) {
        if (element.hasOwnProperty(l)) {
          if ((settings.possible_lon_keys[j]).localeCompare(l) === 0) {
            keys.lon = l;
            found_lon = true;
            continue;
          }
        }
      }
      if (found_lon === true) {
        continue;
      }
    }
    if (found_lat === true && found_lon === true) {
      return keys;
    } else {
      alert("I could not find the right keys for your latitude and longitude fields\n" +
        "Please set them in the settings or call them:\n" +
        settings.possible_lat_keys + "\n\n" +
        settings.possible_lon_keys + "\n\n");
      return null;
    }
  };
var geodata_to_indesign_coords = function(settings, geodata, doc, page) {


  var keys = geojson_analyzer(settings, geodata[0]);
  if (keys === null) {
    return 'no possible fields detected';
  }

var transformer = Geo.projections.ind.transform;
var bounds = settings.boundingBox.bounds;
var ptype = settings.ptype;
var zoomed = settings.boundingBox.zoomed;

  var coordinates = [];
  if(DEBUG) $.writeln(geodata[0][keys.lat.constructor.name]);
  for (var i = 0; i < geodata.length; i++) {

    var xy = null;
    var lat = geodata[i][keys.lat];
    var lon = geodata[i][keys.lon];

    var locations = [];
    locations[0] = parseFloat(lon);
    locations[1] = parseFloat(lat);
    xy = transformer(doc, page, locations, zoomed, bounds ,ptype);
    coordinates.push({"json":geodata[i].toSource(),"xy":xy});
  }
  return coordinates;
};
/**
 * End of geo.jsx
 */