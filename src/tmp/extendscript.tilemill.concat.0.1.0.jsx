
/*! extendscript.tilemill.jsx - v0.1.0 - 2014-05-05 */
// this is globals.jsx

var DEBUG = true;
var settings = {

 new_layer: true,
  new_layer_name: 'marker',
  latitude_key:"",
  longitude_key:"",
  text_key:"",
  possible_lat_keys : ["latitude","Latitude","LATITUDE","lat", "Lat","LAT"],
  possible_lon_keys : ["longitude","Longitude","LONGITUDE","lon", "Lon","LON"],
  /**
   * orientation possibilites are:
   * DEFAULT
   * CENTER
   * TOP
   * BOTTOM
   * LEFT
   * RIGHT
   * UPPER_LEFT
   * LOWER_LEFT
   * UPPER_RIGHT
   * LOWER_RIGHT
   */
  default_marker_orientation: "CENTER",
  /*
  The script will set these infos below by itself. Don't change them.
  It reads data written by IDMap into the document.label
  mercator = 1
 // this script is only for tilemill. use mercator
  equirectangular = 0
  gallpeters = 2
  hammer = 3
  sinusoidal = 4
  aitoff = 5
   */
  projection_type:1,
  ptype:'mercator',
  doc:null,
  pw:null,
  ph:null,
  // check out http://dbsgeo.com/latlon/
  // to get lat lon coordinates
};

// this is the world bounding box
// will also be set by the script from the info of the doc
settings.boundingBox = {
  zoomed: true,
  bounds: {
    ul_lat:0,
    ul_lon:0,
    lr_lat:0,
    lr_lon:0
  }
};

settings.bbox = {
  top_lat:80,
  bottom_lat:-80,
  left_lon:-180,
  right_lon:180
};


/*! extendscript.geo.jsx - v0.0.1 - 2014-05-04 */
/*!
 * This is Geo.js
  * A collection of functions for calculating geo locations.
 * As used in AEMap.jsx and Locations.jsx
 * These functions are heavily based on mbostocks protoviz.
 * Why protoviz and not D3? because extracting some projection types from D3
 * is much more complex then using protoviz
 * https://github.com/mbostock/protovis
 *
 * License
 * Copyright (c) 2014 Fabian "fabiantheblind" Morón Zirfas
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify
 * copies of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies
 * or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
 * OR THE USE OR OTHER DEALNGS IN THE SOFTWARE.
 *
 * see also http://www.opensource.org/licenses/mit-license.php
 */
Geo = function () {};
// END OF Geo.js

Geo.Utilities = {
};

Geo.Utilities.radians = function (degrees) {
  return degrees * Math.PI / 180;
};

Geo.Utilities.map = function (value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
};

Geo.projections = {
  /** The identity or "none" projection. */
  equirectangular: {

    project: function (latlng) {
      return {
        x: latlng.lng,
        y: latlng.lat
      };
    },
    invert: function (xy) {
      return {
        lng: xy.x,
        lat: xy.y
      };
    }
  },
  /** @see http://en.wikipedia.org/wiki/Mercator_projection */
  mercator: {
    project: function (latlng) {
      // from unfoldingmaps
      // https://github.com/tillnagel/unfolding/blob/master/src/de/fhpotsdam/unfolding/geo/MercatorProjection.java
      var lat  = latlng.lat;
      var lon  = latlng.lng;
      var x = lon;
      var y = lat > 85 ? 1 : lat < -85 ? -1 : Math.log(Math.tan(Math.PI / 4 + Geo.Utilities.radians(lat) / 2)) / Math.PI;

      if (DEBUG)$.writeln("This is lon: " + lon);
      if (DEBUG)$.writeln("This is lat: " + lat);
      if (DEBUG)$.writeln("This is x: " + x);
      if (DEBUG)$.writeln("This is y: " + y);
      // return {"x":x, "y": y};

// http://dotnetfollower.com/wordpress/2011/08/javascript-how-to-convert-latitude-and-longitude-to-mercator-coordinates/
// function LatLonToMercator(lat, lon) {

    // var rMajor = 6378137; //Equatorial Radius, WGS84
    // var shift  = Math.PI * rMajor;
    // var x      = latlng.lng * shift / 180;
    // var y      = Math.log(Math.tan((90 + latlng.lat) * Math.PI / 360)) / (Math.PI / 180);
    // y = y * shift / 180;
    // if(DEBUG) $.writeln("from /extendscript.geo/src/Projections.jsx");
    // if(DEBUG) $.writeln("This is calculated x: " + x);
    // if(DEBUG) $.writeln("This is calculated y: " + y);
    // return {'x': x, 'y': y};
// }

 // return {x:lon, y: Math.log(Math.tan(Math.PI / 4 + Geo.Utilities.radians(latlat) / 2))};
      return {
        "x": x,
        "y": y
      };
    },
    // invert: function (xy) {
    //   return {
    //     lng: xy.x * 180,
    //     lat: Geo.Utilities.degrees(2 * Math.atan(Math.exp(xy.y * Math.PI)) - Math.PI / 2)
    //   };
    // }
  },

  // /** @see http://en.wikipedia.org/wiki/Gall-Peters_projection */
  gallpeters: {

    project: function (latlng) {
      return {
        x: latlng.lng / 180,
        y: Math.sin(Geo.Utilities.radians(latlng.lat))
      };
    },

    // invert: function (xy) {
    //   return {
    //     lng: xy.x * 180,
    //     lat: Geo.Utilities.degrees(Math.asin(xy.y))
    //   };
    // }
  },

  // /** @see http://en.wikipedia.org/wiki/Sinusoidal_projection */
  sinusoidal: {

    project: function (latlng) {
      return {
        x: Geo.Utilities.radians(latlng.lng) * Math.cos(Geo.Utilities.radians(latlng.lat)) / Math.PI,
        y: latlng.lat / 90
      };
    },
    // invert: function (xy) {
    //   return {
    //     lng: Geo.Utilities.degrees((xy.x * Math.PI) / Math.cos(xy.y * Math.PI / 2)),
    //     lat: xy.y * 90
    //   };
    // }
  },

  // /** @see http://en.wikipedia.org/wiki/Aitoff_projection */
  aitoff: {

    project: function (latlng) {
      var l = Geo.Utilities.radians(latlng.lng),
        f = Geo.Utilities.radians(latlng.lat),
        a = Math.acos(Math.cos(f) * Math.cos(l / 2));
      return {
        x: 2 * (a ? (Math.cos(f) * Math.sin(l / 2) * a / Math.sin(a)) : 0) / Math.PI,
        y: 2 * (a ? (Math.sin(f) * a / Math.sin(a)) : 0) / Math.PI
      };
    },
    // invert: function (xy) {
    //   var x = xy.x * Math.PI / 2,
    //     y = xy.y * Math.PI / 2;
    //   return {
    //     lng: Geo.Utilities.degrees(x / Math.cos(y)),
    //     lat: Geo.Utilities.degrees(y)
    //   };
    // }
  },

  // eckert1: {
  //   project: function (latlng) {

  //     var alpha = Math.sqrt(8 / (3 * Math.PI));
  //     return {

  //       x: alpha * latlng.lat * (1 - Math.abs(latlng.lng) / Math.PI),
  //       y: alpha * latlng.lng
  //     };

  //   }
  // },

  // /** @see http://en.wikipedia.org/wiki/Hammer_projection */
  hammer: {

    project: function (latlng) {
      var l = Geo.Utilities.radians(latlng.lng),
        f = Geo.Utilities.radians(latlng.lat),
        c = Math.sqrt(1 + Math.cos(f) * Math.cos(l / 2));
      return {
        x: 2 * Math.SQRT2 * Math.cos(f) * Math.sin(l / 2) / c / 3,
        y: Math.SQRT2 * Math.sin(f) / c / 1.5
      };
    },
    // invert: function (xy) {
    //   var x = xy.x * 3,
    //     y = xy.y * 1.5,
    //     z = Math.sqrt(1 - x * x / 16 - y * y / 4);
    //   return {
    //     lng: Geo.Utilities.degrees(2 * Math.atan2(z * x, 2 * (2 * z * z - 1))),
    //     lat: Geo.Utilities.degrees(Math.asin(z * y))
    //   };
    // }
  },

};

// END OF Projections.js
Geo.projections.ind = function () {};
Geo.projections.ind.equirectangular = {
  "name": "equirectangular",
  toIDPage: function (doc, latlng, page) {
    var w = doc.documentPreferences.pageWidth;
    var h = doc.documentPreferences.pageHeight;
    var xoff = (w / 2);
    var yoff = (h / 2);
    var x = (latlng.lng) + xoff;
    var y = (latlng.lat * -1) + yoff;
    return {
      "x": x,
      "y": y
    };
  }
};


/** @see http://en.wikipedia.org/wiki/Mercator_projection */
Geo.projections.ind.mercator = {
  name: "mercator",
  toIDPage: function (doc, latlng, page) {
    var w = doc.documentPreferences.pageWidth;
    var h = doc.documentPreferences.pageHeight;
    // taken from here http://stackoverflow.com/questions/1019997/convert-lat-longs-to-x-y-co-ordinates/1020681#1020681
    // Mercator projection
    // longitude: just scale and shift
    var x = (180 + latlng.lng) * (w / 360);

    // latitude: using the Mercator projection
    var latrad = Geo.Utilities.radians(latlng.lat); // convert from degrees to radians

    var mercN = Math.log(Math.tan((Math.PI / 4) + (latrad / 2))); // do the Mercator projection (w/ equator of 2pi units)
    var y = (h / 2) - (w * mercN / (2 * Math.PI)); // fit it to our map

    return {
      "x": x,
      "y": y
    };
  }
};

// /** @see http://en.wikipedia.org/wiki/Gall-Peters_projection */
Geo.projections.ind.gallpeters = {
  name: "gallpeters",
  toIDPage: function (doc, latlng, page) {
    var w = doc.documentPreferences.pageWidth;
    var h = doc.documentPreferences.pageHeight;
    // based on this
    // https://developers.google.com/maps/documentation/javascript/examples/map-projection-simple
    var xoff = (w / 2);
    var yoff = (h / 2);
    // var _scale = scale * 1000;
    // var x = ((latlng.lng) * scale) + xoff;
    var x = xoff + (((w / 360) * latlng.lng));
    // var y = ((latlng.lat * -1) * scale) + yoff;
    var latRadians = Geo.Utilities.radians(latlng.lat);
    var y = yoff - ((h / 2) * Math.sin(latRadians));
    return {
      "x": x,
      "y": y
    };
  }

};

// /** @see http://en.wikipedia.org/wiki/Sinusoidal_projection */
Geo.projections.ind.sinusoidal = {
  name: "sinusoidal",
  toIDPage: function (doc, latlng, page) {
    var w = doc.documentPreferences.pageWidth;
    var h = doc.documentPreferences.pageHeight;

    var xy = {
      x: Geo.Utilities.radians(latlng.lng) * Math.cos(Geo.Utilities.radians(latlng.lat)) / Math.PI,
      y: latlng.lat / 90
    };

    xy.x = Geo.Utilities.map(xy.x, -1, 1, 0, w);
    xy.y = Geo.Utilities.map(xy.y * -1, -1, 1, 0, h);
    return xy;
  }

};

// /** @see http://en.wikipedia.org/wiki/Aitoff_projection */
Geo.projections.ind.aitoff = {
  name: "aitoff",
  toIDPage: function (doc, latlng, page) {
    var w = doc.documentPreferences.pageWidth;
    var h = doc.documentPreferences.pageHeight;
    var l = Geo.Utilities.radians(latlng.lng),
      f = Geo.Utilities.radians(latlng.lat),
      a = Math.acos(Math.cos(f) * Math.cos(l / 2));

    var xy = {
      x: 2 * (a ? (Math.cos(f) * Math.sin(l / 2) * a / Math.sin(a)) : 0) / Math.PI,
      y: 2 * (a ? (Math.sin(f) * a / Math.sin(a)) : 0) / Math.PI
    };
    xy.x = Geo.Utilities.map(xy.x, -1, 1, 0, w);
    xy.y = Geo.Utilities.map(xy.y * -1, -1, 1, 0, h);
    return xy;
  },
};


// /** @see http://en.wikipedia.org/wiki/Hammer_projection */
Geo.projections.ind.hammer = {
  name: "hammer",
  toIDPage: function (doc, latlng, page) {
    var w = doc.documentPreferences.pageWidth;
    var h = doc.documentPreferences.pageHeight;
    var l = Geo.Utilities.radians(latlng.lng),
      f = Geo.Utilities.radians(latlng.lat),
      c = Math.sqrt(1 + Math.cos(f) * Math.cos(l / 2));
    var xy = {
      x: 2 * Math.SQRT2 * Math.cos(f) * Math.sin(l / 2) / c / 3,
      y: Math.SQRT2 * Math.sin(f) / c / 1.5
    };
    xy.x = Geo.Utilities.map(xy.x, -1, 1, 0, w);
    xy.y = Geo.Utilities.map(xy.y * -1, -1, 1, 0, h);

    return xy;
  }

};

Geo.projections.ind.transform = function(doc, page, locations, zoomed, boundingBox, projectionType) {
  var latlng;
  if(zoomed === true){

  //  float x = width * ((BPM_westlon - loc.lon) / (BPM_westlon - BPM_eastlon));
  // float y = ( height * ((BPM_northlat - loc.lat)/(BPM_northlat - BPM_southlat)));
  // This is still in an experimanteal state
  // should be merged into the extendscript.geo lib
  var w = doc.documentPreferences.pageWidth;
  var h = doc.documentPreferences.pageHeight;
  latlng = {
    "lng": locations[0],
    "lat": locations[1]
  };
  //   boundingBox: {
  //   ul_lat: 90,
  //   ul_lon: -180,
  //   lr_lat: -90,
  //   lr_lon: 180
  // },
  var x = w * ((boundingBox.ul_lon - latlng.lng) / (boundingBox.ul_lon - boundingBox.lr_lon));
  var y = (h * ((boundingBox.ul_lat - latlng.lat) / (boundingBox.ul_lat - boundingBox.lr_lat)));
  if (x < 0) {
    x = 0;
  } else if (x > w) {
    x = w;
  }
  if (y < 0) {
    y = 0;
  } else if (y > h) {
    y = h;
  }
  return {
    "x": x,
    "y": y
  };

  }else if(zoomed !== true){
  latlng = {
    "lng": locations[0],
    "lat": locations[1]
  };
  var xy = null;
  if ((projectionType)
    .localeCompare('equirectangular') === 0) {
    xy = Geo.projections.ind.equirectangular.toIDPage(doc, latlng, page);
  } else if ((projectionType)
    .localeCompare('mercator') === 0) {
    xy = Geo.projections.ind.mercator.toIDPage(doc, latlng, page);
  } else if ((projectionType)
    .localeCompare('gallpeters') === 0) {
    xy = Geo.projections.ind.gallpeters.toIDPage(doc, latlng, page);
  } else if ((projectionType)
    .localeCompare('hammer') === 0) {
    xy = Geo.projections.ind.hammer.toIDPage(doc, latlng, page);
  } else if ((projectionType)
    .localeCompare('sinusoidal') === 0) {
    xy = Geo.projections.ind.sinusoidal.toIDPage(doc, latlng, page);
  } else if ((projectionType)
    .localeCompare('aitoff') === 0) {
    xy = Geo.projections.ind.aitoff.toIDPage(doc, latlng, page);
  } else {

    alert("Could not identify the selected projection type");
    return;
  } // end of projection type check
  // $.writeln(xy.x + " <--x || y--> " +xy.y);
  return xy;

  }
};

// indesign specific utilites



Geo.Utilities.ind = {

  info : {
    set : function(doc, bounds, ptype, zoomed){
      var info = {"bounds":bounds,"projectionType":ptype, "zoomed":zoomed};
      doc.label = info.toSource();
    },
    get: function(doc){

      return eval(doc.label);// jshint ignore:line
    }
  }
};

// END OF InDesign.js

/*! extendscript.csv.jsx - v0.0.1 - 2014-05-01 */
/*!
 * This is CSV.jsx
 * A collection of functions for reading CSV.
 * As used in Locations.jsx
 *
 * License
 * Copyright (c) 2014 Fabian "fabiantheblind" Morón Zirfas
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify
 * copies of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies
 * or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
 * OR THE USE OR OTHER DEALNGS IN THE SOFTWARE.
 *
 * see also http://www.opensource.org/licenses/mit-license.php
 */
if(DEBUG === undefined){
  var DEBUG = true;
}else{
  DEBUG = true;
}
CSV = function() {};
// END OF CSV.js

/**
 * This is a string prototype function
 * found here http://www.greywyvern.com/?post=258
 * @param  {String} sep is the separator we use only ,
 * @return {Array}     returns an Array of strings
 */
// String.prototype.splitCSV = function(sep) {
//   for (var foo = this.split(sep = sep || ","), x = foo.length - 1, tl; x >= 0; x--) {
//     if (foo[x].replace(/"\s+$/, '"').charAt(foo[x].length - 1) === '"') {
//       if ((tl = foo[x].replace(/^\s+"/, '"')).length > 1 && tl.charAt(0) === '"') {
//         foo[x] = foo[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
//       } else if (x) {
//         foo.splice(x - 1, 2, [foo[x - 1], foo[x]].join(sep));
//       } else foo = foo.shift().split(sep).concat(foo);
//     } else foo[x].replace(/""/g, '"');
//   } return foo;
// };


// Dont use prototypes?
// for the time beeing YES
// Makes problems with other scripts
// or we need to use a unique prefix! like ftb_splitCSV
CSV.Utilities = {};

CSV.Utilities.split_csv = function(sep, the_string) {

  for (var foo = the_string.split(sep = sep || ","), x = foo.length - 1, tl; x >= 0; x--) {
    if (foo[x].replace(/"\s+$/, '"').charAt(foo[x].length - 1) === '"') {
      if ((tl = foo[x].replace(/^\s+"/, '"')).length > 1 && tl.charAt(0) === '"') {
        foo[x] = foo[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
      } else if (x) {
        foo.splice(x - 1, 2, [foo[x - 1], foo[x]].join(sep));
      } else foo = foo.shift().split(sep).concat(foo);
    } else foo[x].replace(/""/g, '"');
  }
  return foo;
};


CSV.toJSON = function(csvFile, useDialog, separator) {
  var textFile;
  var result = [];
  if (useDialog) {
    textFile = File.openDialog("Select a CSV or TSV file to import.", "*.*", false);
  } else {
    textFile = csvFile;
  }
  var textLines = [];
  if (textFile !== null) {
    textFile.open('r', undefined, undefined);
    while (!textFile.eof) {
      textLines[textLines.length] = textFile.readln();
    }
    textFile.close();
  }
  if (textLines.length < 1) {
    alert("ERROR Reading file");
    return null;
  } else {

    $.writeln(textLines);
    // var lines=csv.split("\n");
    var headers = CSV.Utilities.split_csv(separator, textLines[0]);
    if(DEBUG) $.writeln(headers);
    for (var i = 1; i < textLines.length; i++) {

      var obj = {};
      var currentline = CSV.Utilities.split_csv( separator, textLines[i]);

      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }
      if (DEBUG) $.writeln(obj.toSource());
      result.push(obj);

    }

  }
  // alert(result[0].toSource());
  //return result; //JavaScript object
  return result; //JSON
};

/**
 * this reads in a file
 * line by line
 * @return {Array of String}
 */

CSV.reader = {
  read_in_txt: function() {

    var textFile = File.openDialog("Select a text file to import.", "*.*", false);
    var textLines = [];
    if (textFile !== null) {
      textFile.open('r', undefined, undefined);
      while (!textFile.eof) {
        textLines[textLines.length] = textFile.readln();
      }
      textFile.close();
    }
    if (textLines.length < 1) {
      alert("ERROR Reading file");
      return null;
    } else {
      return textLines;
    }
  },

  /**
   * gets lines of strings and creates the data we need from
   * CSV Header and content
   * @param  {Array of String} textLines are , or \t separated values
   * @return {Object}
   */
  textlines_to_data: function(textLines, separator) {

    var data = {};
    data.fields = [];
    data.keys = [];

    for (var i = 0; i < textLines.length; i++) {

      var line_arr = CSV.Utilities.split_csv(separator, textLines[i]);
      if (i === 0) {
        for (var j = 0; j < line_arr.length; j++) {
          data.keys[j] = line_arr[j];
        }

      } else {
        var obj_str = "";
        for (var k = 0; k < line_arr.length; k++) {
          if (k !== line_arr.length - 1) {
            obj_str += 'field_' + k + ':"' + line_arr[k] + '",';
          } else {
            obj_str += 'field_' + k + ':"' + line_arr[k] + '"';
          }
        }
        // var parsedData = JSON.parse("{"+ obj_str+"}");
        data.fields.push(eval("({" + obj_str + "})")); // jshint ignore:line

      }
    }
    return data;
  }


};
// this is src/lib/importer.jsx

var importer = function (){
  var csvfile = File.openDialog("Select your csv file.","*.*",false);
  if(csvfile === null){
    // nothing selected or dialog aborted
    return null;
  }else{
    var geodata = CSV.toJSON(csvfile ,  useDialog = false, separator = ",");
    return geodata;
  }

};


// end of importer.jsx

// This is src/locations/marker.jsx

var selector = function(doc, page){
  var selection = doc.selection;
  var marker = null;
  if(selection.length < 1 ){
    $.writeln("no selection will fall back to basic marker");
    marker = get_marker(doc, page);
  }else{
    marker = selection[0];
  }
  return marker;
};


var set_transformation = function(doc, orientation) {
  // CENTER_ANCHOR
  // TOP_CENTER_ANCHOR
  doc.layoutWindows[0].transformReferencePoint = AnchorPoint.CENTER_ANCHOR;
};
var get_marker = function(doc, page) {
  get_or_create_objectstyles(doc);
  var marker = page.ovals.add({
    geometricBounds: [0, -2, 2, 0],
    fillColor: doc.swatches.item(4)
  });
  marker.appliedObjectStyle = doc.objectStyles.item("marker basic");
  return marker;
};


var offset_marker = function(orientation, pItem, x, y) {
  // orientaation possibilites are:
  // DEFAULT
  // CENTER
  // TOP
  // BOTTOM
  // LEFT
  // RIGHT
  // UPPER_LEFT
  // LOWER_LEFT
  // UPPER_RIGHT
  // LOWER_RIGHT

  var dim = naive_getDims(pItem, true);
  var mwidth = dim[0];
  var mheight = dim[1];

  if ((orientation).localeCompare('CENTER') === 0) {
    x = x - mwidth / 2;
    y = y - mheight / 2;
  } else if ((orientation).localeCompare('TOP') === 0) {
    x = x - mwidth / 2;
    // y = y - mheight / 2;
  } else if ((orientation).localeCompare('BOTTOM') === 0) {
    x = x - mwidth / 2;
    y = y - mheight;
  } else if ((orientation).localeCompare('LEFT') === 0) {
    // x = x - mwidth / 2;
    y = y - mheight / 2;
  } else if ((orientation).localeCompare('RIGHT') === 0) {
    x = x - mwidth;
    y = y - mheight / 2;
  } else if ((orientation).localeCompare('DEFAULT') === 0) {
    x = x - mwidth / 2;
    y = y - mheight / 2;
  }else if ((orientation).localeCompare('UPPER_LEFT') === 0) {
    x = x - mwidth;
    y = y - mheight;
  }else if ((orientation).localeCompare('LOWER_LEFT') === 0) {
    x = x -  mwidth;
    // y = y + mheight;
  }else if ((orientation).localeCompare('UPPER_RIGHT') === 0) {
    // x = x + mwidth/2;
    y = y - mheight;
  }else if ((orientation).localeCompare('LOWER_RIGHT') === 0) {
    // x = x + mwidth /2 ;
    // y = y;
  } else {
    // fall back to default
    x = x - mwidth / 2;
    y = y - mheight / 2;
  }

  return [x, y];
};

var place_markers = function(doc, page, marker, coordinates, settings) {
  var layer;
  var orientation = settings.default_marker_orientation;
  set_transformation(doc, null);
  if (settings.new_layer === true) {
    layer = doc.layers.item(settings.new_layer_name);
    try {
      var name = layer.name;
    } catch (e) {
      layer = doc.layers.add({
        name: settings.new_layer_name
      });
    }
  } else {
    layer = doc.activeLayer;
  }

  for (var i = 0; i < coordinates.length; i++) {
    var currentmarker = marker.duplicate();
    var xy = offset_marker(orientation, currentmarker,coordinates[i].xy.x,coordinates[i].xy.y);
    currentmarker.move(xy);
    currentmarker.label = coordinates[i].json;
    currentmarker.itemLayer = layer;
  }
};

// take a look at this indiscripts blog post
// I stay with the first version. because its easy and the other versions
// dont take in account that the marker could be outside of the page
// http://www.indiscripts.com/post/2009/10/work-around-the-width-height-gap
// TRACK 1 -- naive "getDims" function

// return the [width,height] of <obj>
// according to its (geometric|visible)Bounds
//
// // sample code
// var pItem = app.selection[0]; // get the selected object
// alert('Geometric Dims: ' + naive_getDims(pItem));
// alert('Visible Dims: ' + naive_getDims(pItem, true));

function naive_getDims( /*PageItem*/ obj, /*bool*/ visible) {
  var boundsProperty = ((visible) ? 'visible' : 'geometric') + 'Bounds';
  var b = obj[boundsProperty];
  // width=right-left , height = bottom-top
  return [b[3] - b[1], b[2] - b[0]];
}

/**
 * This is src/locations/styling.jsx
 */

var get_or_create_objectstyles = function(doc) {

  var objectstyle = doc.objectStyles.item("marker basic");

  try {
    var name = objectstyle.name;
  } catch (e) {
    objectstyle = doc.objectStyles.add();

    objectstyle.properties = {
      name: "marker basic",
      fillColor: doc.swatches.item(4),
      /* could also be doc.swatches[3] */
      fillTint: 50,
      strokeColor: doc.swatches.item(5),
      strokeTint: 70,
      strokeWeight: 0.5,
      // bottomLeftCornerOption: CornerOptions.FANCY_CORNER,
      transparencySettings: {
        blendingSettings: {
          opacity: 50,
          blendMode: BlendMode.COLOR
        }
      }
    };
  }
  return objectstyle;
};



/**
 * End of styling.jsx
 */



 // End of marker.jsx

/**
 * Utility class to convert between geo-locations and Cartesian screen coordinates.
 * Can be used with a bounding box defining the map section.
 *
 * (c) 2011 Till Nagel, tillnagel.com
 *
 * http://tillnagel.com/2011/06/tilemill-for-processing/
 */

// var MercatorMap = function(){};

  var mapScreenWidth  = null;
  var mapScreenHeight  = null;
  var topLatitude  = null;
  var bottomLatitude  = null;
  var leftLongitude  = null;
  var rightLongitude = null;
  var topLatitudeRelative = null;
  var bottomLatitudeRelative = null;
  var leftLongitudeRadians = null;
  var rightLongitudeRadians = null;
  var DEFAULT_TOP_LATITUDE = 80;
  var DEFAULT_BOTTOM_LATITUDE = -80;
  var DEFAULT_LEFT_LONGITUDE = -180;
  var DEFAULT_RIGHT_LONGITUDE = 180;


  var getScreenYRelative = function(latitudeInDegrees) {
    var res = Math.log(Math.tan(latitudeInDegrees / (360 * Math.PI) + (Math.PI / 4)));
    $.writeln("get screen y relativ result: " + res);
    return res;
  };

  var getRadians = function(deg) {
    var  res = (deg * Math.PI) / 180;
    $.writeln("getRadians result: " + res);

    return res;
  };

    var getScreenY = function(latitudeInDegrees) {
    var screen_y_realtiv =  getScreenYRelative(latitudeInDegrees);
    var res = mapScreenHeight * (screen_y_realtiv - topLatitudeRelative) / (bottomLatitudeRelative - topLatitudeRelative);
     $.writeln("get screen y result: " + res);
    return res;

  };

  var getScreenX = function(longitudeInDegrees) {
    var longitudeInRadians = getRadians(longitudeInDegrees);
    var res = mapScreenWidth * (longitudeInRadians - leftLongitudeRadians) / (rightLongitudeRadians - leftLongitudeRadians);
    $.writeln("get screen x result: " + res);
    return res;
  };




  // public MercatorMap(float mapScreenWidth, float mapScreenHeight) {
  //   MercatorMap(mapScreenWidth, mapScreenHeight, DEFAULT_TOP_LATITUDE, DEFAULT_BOTTOM_LATITUDE, DEFAULT_LEFT_LONGITUDE, DEFAULT_RIGHT_LONGITUDE);
  // }

  /**
   * Projects the geo location to Cartesian coordinates, using the Mercator projection.
   *
   * @param geoLocation Geo location with (latitude, longitude) in degrees.
   * @returns The screen coordinates with {"x":x, "y":y}.
   */
var MercatorMap = function(mapScreenWidth, mapScreenHeight, topLatitude, bottomLatitude, leftLongitude, rightLongitude) {

  /** Horizontal dimension of MercatorMap map, in pixels. */
  // MercatorMap.mapScreenWidth =0;
  /** Vertical dimension of MercatorMap map, in pixels. */
  // MercatorMap.mapScreenHeight = 0;

  /** Northern border of MercatorMap map, in degrees. */
  // MercatorMap.topLatitude = 0;
  /** Southern border of MercatorMap map, in degrees. */
  // MercatorMap.bottomLatitude = 0;
  /** Western border of MercatorMap map, in degrees. */
  // MercatorMap.leftLongitude = 0;
  /** Eastern border of MercatorMap map, in degrees. */
  // MercatorMap.rightLongitude = 0;

  // MercatorMap.topLatitudeRelative = 0;
  // MercatorMap.bottomLatitudeRelative = 0;
  // MercatorMap.leftLongitudeRadians = 0;
  // MercatorMap.rightLongitudeRadians = 0;
  /**
   * Creates a new MercatorMap with dimensions and bounding box to convert between geo-locations and screen coordinates.
   *
   * @param mapScreenWidth Horizontal dimension of MercatorMap map, in pixels.
   * @param mapScreenHeight Vertical dimension of MercatorMap map, in pixels.
   * @param topLatitude Northern border of MercatorMap map, in degrees.
   * @param bottomLatitude Southern border of MercatorMap map, in degrees.
   * @param leftLongitude Western border of MercatorMap map, in degrees.
   * @param rightLongitude Eastern border of MercatorMap map, in degrees.
   */

  // public MercatorMap(float mapScreenWidth, float mapScreenHeight, float topLatitude, float bottomLatitude, float leftLongitude, float rightLongitude) {
$.writeln("------------------------------");
  mapScreenWidth = mapScreenWidth;
  $.writeln("mapScreenWidth: " + mapScreenWidth);
  mapScreenHeight = mapScreenHeight;
  $.writeln("mapScreenHeight: " + mapScreenHeight);
  topLatitude = topLatitude;
  $.writeln("topLatitude: " + topLatitude);
  bottomLatitude = bottomLatitude;
  $.writeln("bottomLatitude: " + bottomLatitude);
  leftLongitude = leftLongitude;
  $.writeln("leftLongitude: " + leftLongitude);
  rightLongitude = rightLongitude;
  $.writeln("rightLongitude: " + rightLongitude);
  topLatitudeRelative = getScreenYRelative(topLatitude);
  $.writeln("topLatitudeRelative: " + topLatitudeRelative);
  bottomLatitudeRelative = getScreenYRelative(bottomLatitude);
  $.writeln("bottomLatitudeRelative: " + bottomLatitudeRelative);
  leftLongitudeRadians = getRadians(leftLongitude);
  $.writeln("leftLongitudeRadians: " + leftLongitudeRadians);
  rightLongitudeRadians = getRadians(rightLongitude);
  $.writeln("rightLongitudeRadians: " + rightLongitudeRadians);
  $.writeln("End of MercatorMap init");
  $.writeln("------------------------------");
  return {};
  };
   var getScreenLocation = function(geoLocation) {
    var latitudeInDegrees = geoLocation.x;
    var longitudeInDegrees = geoLocation.y;
    $.writeln(latitudeInDegrees);
    $.writeln(longitudeInDegrees);
    var x = getScreenX(longitudeInDegrees);
    var y = getScreenY(latitudeInDegrees);
    if(DEBUG) $.writeln("In Mercator Map getScreenLocation -- x: " + x + " y: " + y);
    return {"x":x,"y": y};
  };

/**
 * This is src/locations/geo.jsx
 */


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
/*
 * extendscript.tilemill
 * https://github.com/fabiantheblind/extendscript.tilemill
 *
 * Copyright (c) 2014 fabiantheblind
 * Licensed under the MIT license.
 */


// take a look at this indiscripts blog post
// I stay with the first version. because its easy and the other versions
// dont take in account that the marker could be outside of the page
// http://www.indiscripts.com/post/2009/10/work-around-the-width-height-gap
// TRACK 1 -- naive "getDims" function

// return the [width,height] of <obj>
// according to its (geometric|visible)Bounds
//
// // sample code
// var pItem = app.selection[0]; // get the selected object
// alert('Geometric Dims: ' + naive_getDims(pItem));
// alert('Visible Dims: ' + naive_getDims(pItem, true));
//

var get_dim = function( /*PageItem*/ obj, /*bool*/ visible) {
  var boundsProperty = ((visible) ? 'visible' : 'geometric') + 'Bounds';
  var b = obj[boundsProperty];
  // width=right-left , height = bottom-top
  return [b[3] - b[1], b[2] - b[0]];
};

var setup_doc = function(){
  var image = File.openDialog("Select your image", "*.png", false);
  if (image === null) {
    return null;
  }
    var temp_doc = app.documents.add();
    var temp_rect = temp_doc.pages[0].rectangles.add({
      geometricBounds: [0, 0, 100, 100]
    });
    temp_rect.place(image);
    temp_rect.fit(FitOptions.FRAME_TO_CONTENT);
    var dim = get_dim(temp_rect, true);
    if(DEBUG) $.writeln( "new doc will be w/h " + dim);
    settings.pw = dim[0];
    settings.ph = dim[1];
    var doc = app.documents.add({
      documentPreferences: {
        pageWidth: dim[0],
        pageHeight: dim[1],
        facingPages: false
      }
    });
    temp_doc.close(SaveOptions.NO);
    var page = doc.pages[0];
    var frame = page.rectangles.add({
      geometricBounds: [0, 0, dim[1], dim[0]]
    });
    frame.place(image);

return {"doc":doc,"frame":frame,"page":page};
};



var draw = function() {

var setup_result = setup_doc();

if(setup_result === null) return; // aborted by user

  var doc = setup_result.doc;
  var frame = setup_result.frame;
  var page = setup_result.page;


    var dialog = app.dialogs.add({
      name: "Paste Mapbox Bounds",
      canCancel: true
    });
    var d_col_one = dialog.dialogColumns.add();
    var t_box = d_col_one.textEditboxes.add({
      editContents: "-120,-45,120,45"
    });



    if (dialog.show() === true) {

      var bboxstring = t_box.editContents;
      // alert(bboxstring);
      dialog.destroy();
      var arr = bboxstring.split(",");

      settings.bbox.left_lon = parseFloat(arr[0]);
      settings.bbox.bottom_lat = parseFloat(arr[1]);
      settings.bbox.right_lon = parseFloat(arr[2]);
      settings.bbox.top_lat = parseFloat(arr[3]);

      settings.boundingBox.bounds.ul_lat = settings.bbox.top_lat;
      settings.boundingBox.bounds.ul_lon = settings.bbox.left_lon;
      settings.boundingBox.bounds.lr_lat = settings.bbox.bottom_lat;
      settings.boundingBox.bounds.lr_lon = settings.bbox.right_lon;

      if (DEBUG) {
        for (var key in settings.bbox) {
          if (settings.bbox.hasOwnProperty(key)) {
            $.writeln("Key: " + key + " Obj: " + settings.bbox[key]);
          }
        } // end of loop
      }// end DEBUG
     var geodata =  importer();
    if (geodata === null){
    alert("There was an error transforming your csv to json.\n"+
      "Please inspect your csv file");
    return 0;
  }
  var marker = selector(doc, page);
  // alert(geodata.toSource());
  var keys = geojson_analyzer(settings, geodata[0]);
    if (keys === null) {
    return 'no possible fields detected';
  }




  var mapScreenWidth = settings.pw;
  var mapScreenHeight = settings.ph;
  var topLatitude = settings.bbox.top_lat;
  var bottomLatitude = settings.bbox.bottom_lat;
  var leftLongitude = settings.bbox.left_lon;
  var rightLongitude = settings.bbox.right_lon;
  // var lon1 = -132.3633;
  // var lat1 = 14.4347;
  // var lon2 = -58.3594;
  // var lat2 = 57.7979;
  var map = MercatorMap(mapScreenWidth, mapScreenHeight, topLatitude, bottomLatitude, leftLongitude, rightLongitude);


  var coordinates = [];

  for(var i = 0; i < geodata.length;i++){
    var lat = parseFloat(geodata[i][keys.lat]);
    var lon = parseFloat(geodata[i][keys.lon]);
    var w = settings.pw;
    var h = settings.ph;
    // var ul_lon = settings.boundingBox.bounds.ul_lon;
    // var ul_lat = settings.boundingBox.bounds.ul_lat;
    // var lr_lat = settings.boundingBox.bounds.lr_lat;
    // var lr_lon = settings.boundingBox.bounds.lr_lon;
if(DEBUG){$.writeln("lat: "+ lat);}
if(DEBUG){$.writeln("lon: "+ lon);}
// if(DEBUG){$.writeln("w: "+ w);}
// if(DEBUG){$.writeln("h: "+ h);}
// if(DEBUG){$.writeln("ul_lon: "+ ul_lon);}
// if(DEBUG){$.writeln("ul_lat: "+ ul_lat);}
// if(DEBUG){$.writeln("lr_lat: "+ lr_lat);}
// if(DEBUG){$.writeln("lr_lon: "+ lr_lon);}
//
    var xy = getScreenLocation({x:lat,y: lon});

    coordinates.push({"json":geodata[i].toSource(),"xy":xy});
}
  // var coordinates = geodata_to_indesign_coords(settings, geodata, doc, page);
   // alert(coordinates.toSource());
  place_markers(doc, page, marker, coordinates, settings);
  }

  };


draw();