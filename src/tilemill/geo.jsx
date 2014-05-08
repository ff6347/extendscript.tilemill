////////////////////////
//This is src/tilemill/geo.jsx
////////////////////////

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
  if (DEBUG) $.writeln(geodata[0][keys.lat.constructor.name]);
  for (var i = 0; i < geodata.length; i++) {

    var xy = null;
    var lat = geodata[i][keys.lat];
    var lon = geodata[i][keys.lon];

    var locations = [];
    locations[0] = parseFloat(lon);
    locations[1] = parseFloat(lat);
    xy = transformer(doc, page, locations, zoomed, bounds, ptype);
    coordinates.push({
      "json": geodata[i].toSource(),
      "xy": xy
    });
  }
  return coordinates;
};

function ToGeographic(mercatorX_lon, mercatorY_lat) {
  if (Math.abs(mercatorX_lon) < 180 && Math.abs(mercatorY_lat) < 90)
    return;

  if ((Math.abs(mercatorX_lon) > 20037508.3427892) || (Math.abs(mercatorY_lat) > 20037508.3427892))
    return;

  var x = mercatorX_lon;
  var y = mercatorY_lat;
  var num3 = x / 6378137.0;
  var num4 = num3 * 57.295779513082323;
  var num5 = Math.floor(((num4 + 180.0) / 360.0));
  var num6 = num4 - (num5 * 360.0);
  var num7 = 1.5707963267948966 - (2.0 * Math.atan(Math.exp((-1.0 * y) / 6378137.0)));
  mercatorX_lon = num6;
  mercatorY_lat = num7 * 57.295779513082323;

  return [mercatorX_lon, mercatorY_lat];
}

function ToWebMercator(mercatorX_lon, mercatorY_lat) {
  if ((Math.abs(mercatorX_lon) > 180 || Math.abs(mercatorY_lat) > 90))
    return;

  var num = mercatorX_lon * 0.017453292519943295;
  var x = 6378137.0 * num;
  var a = mercatorY_lat * 0.017453292519943295;

  mercatorX_lon = x;
  mercatorY_lat = 3189068.5 * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)));

  return [mercatorX_lon, mercatorY_lat];
}

var geo_to_page_coords = function geo_to_page_coords(doc, page, marker, settings) {
  if (DEBUG) $.writeln("function " + arguments.callee.name + "\n");
  var min_lon = settings.bbox.min[0];
  var min_lat = settings.bbox.min[1];

  var max_lon = settings.bbox.max[0];
  var max_lat = settings.bbox.max[1];

  // to web mercator takes lon first then lat
  // var min = ToWebMercator(-14.0625, 46.4379);
  // var max = ToWebMercator(7.9102, 62.4311);

  var min = ToWebMercator(min_lon, min_lat);
  var max = ToWebMercator(max_lon, max_lat);


  var o_min_x = min[0];
  var o_min_y = min[1];

  var o_max_x = max[0];
  var o_max_y = max[1];

  var width = settings.pw; //800;
  var height = settings.ph; //1018;

  var x_ratio = width / (o_max_x - o_min_x);
  var y_ratio = height / (o_max_y - o_min_y);

  // var canvas = document.getElementById('holder');
  //       var ctx = canvas.getContext('2d');

  // var mapImg = new Image();
  // mapImg.onload = function() {
  // ctx.drawImage(mapImg, 0, 0, width, height);
  //mapping lat = y, lng = x
  var lat = 50.055977;
  var lng = -5.655096;
  var xy = ToWebMercator(lng, lat);
  $.writeln("xy " + xy);
  var centerX = (xy[0] - o_min_x) * x_ratio;
  var centerY = (xy[1] - o_min_y) * y_ratio;
  var coordinates = [];
  // centerY = settings.ph - centerY;
  // var newy = settings.ph - centerY;
  var coord = {
    "json": "{'name':'name'}",
    "xy": {
      "x": centerX,
      "y": centerY
    }
  };
  coordinates.push(coord);
  // if(DEBUG) $ .writeln( coord.toSource());
  if (DEBUG) $.writeln("Page height " + height);
  if (DEBUG) $.writeln("centerY " + centerY);

  // page.ovals.add({geometricBounds:[(height - centerY),centerX, ((height - centerY) + 10) , (centerX + 10) ]});
  place_markers(doc, page, marker, coordinates, settings);

};

////////////////////////
// End of geo.jsx
////////////////////////