////////////////////////
//This is src/tilemill/geo.jsx
////////////////////////

// analys the csv data for lat lon values
//
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

/**
 * written by @sebastian-meier
 * adapted by @fabiantheblind
 * @param {[type]} mercatorX_lon [description]
 * @param {[type]} mercatorY_lat [description]
 */

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

/**
 * written by @sebastian-meier
 * adapted by @fabiantheblind
 * @param {[type]} mercatorX_lon [description]
 * @param {[type]} mercatorY_lat [description]
 */

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


/**
 * so this is the magic
 * using @sebastian-meier functions I can calc mercator to ID coords
 * thanks a lot. Needs more comments
 *
 *
 * @param  {[type]} doc      [description]
 * @param  {[type]} page     [description]
 * @param  {[type]} marker   [description]
 * @param  {[type]} settings [description]
 * @param  {[type]} geodata  [description]
 * @return {[type]}          [description]
 */
var geo_to_page_coords = function(doc, page, marker, settings, geodata) {
  var progress_win = new Window("palette"); // creste new palette
  var progress = progress_bar(progress_win, geodata.length, 'Calculating Locations'); // call the pbar function
  var min_lon = settings.bbox.min[0];
  var min_lat = settings.bbox.min[1];
  var max_lon = settings.bbox.max[0];
  var max_lat = settings.bbox.max[1];

  var tlngs = [min_lon, max_lon];
  var tlats = [min_lat, max_lat];

  // to web mercator takes lon first then lat
  // var min = ToWebMercator(-14.0625, 46.4379);
  // var max = ToWebMercator(7.9102, 62.4311);
  var lats, lngs = [];
  if (tlats[0] < tlats[1]) {
    lats = tlats;
  } else {
    lats[0] = tlats[1];
    lats[1] = tlats[0];
  }
  if (tlngs[0] < tlngs[1]) {
    lngs = tlngs;
  } else {
    lngs[0] = tlngs[1];
    lngs[1] = tlngs[0];
  }

  var max = ToWebMercator(lngs[1], lats[1]);
  var min = ToWebMercator(lngs[0], lats[0]);
  if (DEBUG) $.writeln("max:" + max);
  if (DEBUG) $.writeln("min:" + min);

  // var min = ToWebMercator(min_lon, min_lat);
  // var max = ToWebMercator(max_lon, max_lat);

  var o_min_x = min[0];
  var o_min_y = min[1];

  var o_max_x = max[0];
  var o_max_y = max[1];

  var width = settings.pw; //800;
  var height = settings.ph; //1018;

  var x_ratio = width / (o_max_x - o_min_x);
  var y_ratio = height / (o_max_y - o_min_y);

  var zero_y = height - y_ratio * min[1] * -1;
  var zero_x = x_ratio * min[0] * -1;
  if (DEBUG) $.writeln("zero_y: " + zero_y);
  if (DEBUG) $.writeln("zero_x: " + zero_x);

  var coords = geodata;

  var id_coordinates = [];
  for (var c = 0; c < coords.length; c++) {

    var lat = coords[c].latlng[0];
    var lng = coords[c].latlng[1];
    var xy = ToWebMercator(lng, lat);

    $.writeln("xy " + xy);

    var centerX = xy[0] * x_ratio + zero_x;
    var centerY;
    if (lat === 0) {
      centerY = xy[1] * y_ratio + zero_y;
    } else if (lat < 0) {
      centerY = zero_y + Math.abs(xy[1] * y_ratio);
    } else if (lat > 0) {
      centerY = zero_y - xy[1] * y_ratio;
    }

    if (DEBUG) $.writeln("centerX: " + centerX);
    if (DEBUG) $.writeln("centerY: " + centerY);

    var coord_res = {
      "text": coords[c].name,
      "xy": {
        "x": centerX,
        "y": centerY
      }
    };
    id_coordinates.push(coord_res);
    progress.value++;
  }
  progress.parent.close(); // close the palette

  place_markers(doc, page, marker, id_coordinates, settings);

};

////////////////////////
// End of geo.jsx
////////////////////////