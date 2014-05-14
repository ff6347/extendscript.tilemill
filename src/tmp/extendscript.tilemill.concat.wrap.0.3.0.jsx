(function(thisObj) {

/*! extendscript.tilemill.jsx - v0.3.0 - 2014-05-14 */
//
// extendscript.tilemill
// https://github.com/fabiantheblind/extendscript.tilemill
// a script for placing markers on tilemill export images
//
// Copyright (c)  2014
// Fabian "fabiantheblind" Morón Zirfas
// Permission is hereby granted, free of charge, to any
// person obtaining a copy of this software and associated
// documentation files (the "Software"), to deal in the Software
// without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to  permit persons to
// whom the Software is furnished to do so, subject to
// the following conditions:
// The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF  CONTRACT,
// TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTIO
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// see also http://www.opensource.org/licenses/mit-license.php

// this is globals.jsx

var DEBUG = true;
var settings = {
  new_doc:true,
  new_layers: true,
  new_marker_layer_name: 'marker',
  new_text_layer_name: 'text',
  latitude_key:"",
  longitude_key:"",
  text_key:"",
  use_textframe:true,
  use_marker:true,
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
   */

  doc:null,
  pw:0,
  ph:0,
};

settings.bbox = {

  min:[],
  max:[]
};
// end of globals.jsx

// usage see
// https://github.com/fabiantheblind/extendscript/wiki/Progress-And-Delay
function progress_bar (w, stop, labeltext) {
    var txt = w.add('statictext',undefined,labeltext); // add some text to the window
    var pbar = w.add ("progressbar", undefined, 1, stop);// add the bar
    pbar.preferredSize = [300,20];// set the size
    w.show ();// show it
    return pbar; // return it for further use
    }

// take a look at this indiscripts blog post about get_dim()
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

var get_dim = function( /*PageItem*/ obj, /*bool*/ visible) {
  var boundsProperty = ((visible) ? 'visible' : 'geometric') + 'Bounds';
  var b = obj[boundsProperty];
  // width=right-left , height = bottom-top
  return [b[3] - b[1], b[2] - b[0]];
};

/**
 * takes the values the user entered and sets them into the settings as string
 * @param {[Array]} arr Array of 4 values min_lon, min_lat, max_lon, max_lat
 *
 */
var set_bbox = function(arr) {
  settings.bbox.min[0] = parseFloat(arr[0]);
  settings.bbox.min[1] = parseFloat(arr[1]);
  settings.bbox.max[0] = parseFloat(arr[2]);
  settings.bbox.max[1] = parseFloat(arr[3]);

  if (DEBUG) {
    for (var key in settings.bbox) {
      if (settings.bbox.hasOwnProperty(key)) {
        $.writeln("Key: " + key + " Obj: " + settings.bbox[key]);
      }
    } // end of loop
  } // end DEBUG
  return 0;
};
/**

 *
 */
/**
 * Load an image an get the size to create another doc that
 * has exactly the size of the image
 *
 * or get the current document
 * * @return {"doc": doc,"frame": frame,"page": page};
 */
var setup_doc = function() {
  var doc, page, frame; // hold the results
  // the user wants a new document
  if (settings.new_doc === true) {
    // select the image
    var image = File.openDialog("Select your image", "*.png", false);
    if (image === null) {
      // aborted by user :-(
      return null;
    }
    // this doc will be destroyed
    // it is only here for analysing the image
    var temp_doc = app.documents.add();
    // make sure we use PIXELS
    temp_doc.viewPreferences.horizontalMeasurementUnits = temp_doc.viewPreferences.verticalMeasurementUnits = MeasurementUnits.PIXELS;
    // create a frame that will hold the image
    var temp_rect = temp_doc.pages[0].rectangles.add({
      geometricBounds: [0, 0, 100, 100]
    });

    temp_rect.place(image); // place the image
    temp_rect.fit(FitOptions.FRAME_TO_CONTENT); // fit the frame
    var dim = get_dim(temp_rect, true); // get the sizes
    if (DEBUG) $.writeln("new doc will be w/h " + dim);
    settings.pw = dim[0]; // set the globals
    settings.ph = dim[1]; // set the globals
    // now this will be the doc we work in
    // make sure you use PIXELS by setting the height as string
    // with the px measurement
    // no facing pages
    // and also set it to use pixels
    doc = app.documents.add({
      documentPreferences: {
        pageWidth: dim[0] + "px",
        pageHeight: dim[1] + "px",
        facingPages: false
      },
      viewPreferences: {
        horizontalMeasurementUnits: MeasurementUnits.PIXELS,
        verticalMeasurementUnits: MeasurementUnits.PIXELS
      }
    });
    temp_doc.close(SaveOptions.NO);// destroy the temp doc

    page = doc.pages[0];// get the first page
    // add a frame in the right size
    frame = page.rectangles.add({
      geometricBounds: [0, 0, dim[1], dim[0]]
    });

    frame.place(image);// place the image
    // we are done for now
  } else {
    // the user wants to work in his own doc
    if (app.documents.length > 0) {

      doc = app.activeDocument; // there is a doc
      // make sure we have pixels
      doc.viewPreferences.horizontalMeasurementUnits = doc.viewPreferences.verticalMeasurementUnits = MeasurementUnits.PIXELS;

      settings.pw = doc.documentPreferences.pageWidth; // get width to globals
      settings.ph = doc.documentPreferences.pageHeight; // get height
      page = doc.layoutWindows[0].activePage;// get the page

      // for now we asume the user knows what he is doing
      // all the mapping will take place depending on the size of the
      // page
      // if (doc.selection.length > 0) {
      //   if (doc.selection[0] instanceof Rectangle) {
      //     if (doc.selection[0].images.length > 0) {
      //       frame = doc.selection[0];
      //     }else{
      //       alert("There is no image in here");
      //       return null;
      //     }
      //   }else{
      //     alert("This is no Rectangle");
      //     return null;
      //   }
      // }else{
      //   alert("Please select a Rectangle with an TileMill image");
      //   return null;
      // }
    } else {
      alert("You need a document with the right geo coordinates");
      return null;
    }
  }
 // give back the result
 // frame is not used at the moment
  return {
    "doc": doc,
    "frame": frame,
    "page": page
  };
};

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
// import the data this calls the
// extendscript.csv lib
// https://github.com/fabiantheblind/extendscript.csv
//
var importer = function (){
  var csvfile = File.openDialog("Select your csv file.","*.*",false);
  if(csvfile === null){
    // nothing selected or dialog aborted
    return null;
  }else{
    var data = CSV.toJSON(csvfile ,  useDialog = false, separator = ",");
    return data;
  }

};
// end of importer.jsx

// This is src/locations/marker.jsx

// this function gets the active seletion
// if there is no selection it falls bac to the basic marker
// returns a pageItem
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
  doc.layoutWindows[0].transformReferencePoint = AnchorPoint.CENTER_ANCHOR;
};

// creare a basic marker and add an object style
var get_marker = function(doc, page) {
  get_or_create_objectstyles(doc);
  var marker = page.ovals.add({
    geometricBounds: [0, -10, 10, 0],
    fillColor: doc.swatches.item(4)
  });
  marker.appliedObjectStyle = doc.objectStyles.item("marker basic");
  return marker;
};

// this function offsets a marker
// around his xy coordinate
// can be set in settings
//
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


// this actually loops a set of page coordinates
// and creates moves duplicates of the original markers to that position
// also creates text
var place_markers = function(doc, page, marker, coordinates, settings) {
  var mlayer;
  var tlayer;
  var orientation = settings.default_marker_orientation;
  set_transformation(doc, null);
  if (settings.new_layers === true) {

    if(settings.use_marker === true){

    mlayer = doc.layers.item(settings.new_marker_layer_name);
    try {
      var mname = mlayer.name;
    } catch (e) {
      mlayer = doc.layers.add({
        name: settings.new_marker_layer_name
      });
    }
    }
        if(settings.use_textframe === true){

   tlayer = doc.layers.item(settings.new_text_layer_name);
    try {
      var tname = tlayer.name;
    } catch (e) {
     tlayer = doc.layers.add({
        name: settings.new_text_layer_name
      });
    }
    }
  } else {
    mlayer = doc.activeLayer;
    tlayer = doc.activeLayer;
  }
     var progress_win = new Window ("palette"); // creste new palette
    var progress = progress_bar(progress_win, coordinates.length, 'Placing Markers'); // call the pbar function

  for (var i = 0; i < coordinates.length; i++) {
    var currentmarker = marker.duplicate();
    var xy = offset_marker(orientation, currentmarker,coordinates[i].xy.x,coordinates[i].xy.y);
    if(settings.use_marker){
    currentmarker.move(xy);
    currentmarker.label = coordinates[i].text;
    currentmarker.itemLayer = mlayer;

    }
    if(settings.use_textframe){
      var tf = page.textFrames.add({geometricBounds:[0,0,20,100]});
      tf.move(xy);
      tf.contents = coordinates[i].text;
      tf.itemLayer = tlayer;
    }
  progress.value++;
  }
  progress.parent.close();
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

// this creates an object style if there isn't any with the name
// marker basic
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

 // End of marker.jsx

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
    if (lat > 90.1 || lat < -90.1) {
      if (DEBUG) {
        $.writeln("your latitude value is out of the mapping range. I will skip this value");
        $.writeln("lat " + lat);
        continue;
      }

    }
    if (lng > 180.1 || lng < -180.1) {
      if (DEBUG) {
        $.writeln("your longitude value is out of the mapping range. I will skip this value");
        $.writeln("lng " + lng);
        continue;
      }
    }
    var xy = ToWebMercator(lng, lat);
    if (DEBUG) $.writeln("coords[" + String(c) + "].name: " + coords[c].name);
    if (DEBUG) $.writeln("xy " + xy);

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
// this normally should be in the draw function
// but it was cluttering up the whole thing.
// So I made the UI creatin global
//
var dialog = app.dialogs.add({
  name: "Paste Mapbox Bounds",
  canCancel: true,
});



// add some columns
var d_col_one = dialog.dialogColumns.add(); // holds the message
var msg_row_one = d_col_one.dialogRows.add(); // pt 1
var msg_row_two = d_col_one.dialogRows.add(); // pt 2
var msg_row_three = d_col_one.dialogRows.add(); // pt 3
var msg_row_four = d_col_one.dialogRows.add(); // pt 4

var msgpt1 = msg_row_one.staticTexts.add({
  minWidth: 200,
  staticLabel: "Paste the values you used in tilemill to create your bounding box.",
  staticAlignment: StaticAlignmentOptions.LEFT_ALIGN,
});
var msgpt2 = msg_row_two.staticTexts.add({
  minWidth: 200,
  staticLabel: "e.g. -120,-45,120,45 is ordered like this:",
  staticAlignment: StaticAlignmentOptions.LEFT_ALIGN,
});
var msgpt3 = msg_row_three.staticTexts.add({
  minWidth: 200,
  staticLabel: "[min lon, min lat, max lon, max lat]",
  staticAlignment: StaticAlignmentOptions.LEFT_ALIGN,
});

var msgpt4 = msg_row_four.staticTexts.add({
  minWidth: 200,
  staticLabel: "Then select the value for the TextFrame",
  staticAlignment: StaticAlignmentOptions.LEFT_ALIGN,
});

// end of message
//
var d_col_two = dialog.dialogColumns.add(); // will hold the min max fields
var d_col_three = dialog.dialogColumns.add(); // will hold the dropdown
// add some rows
var min_lon_row = d_col_two.dialogRows.add(); // min lon row
var min_lat_row = d_col_two.dialogRows.add(); // min lat row
var max_lon_row = d_col_two.dialogRows.add(); // max lon row
var max_lat_row = d_col_two.dialogRows.add(); // max lat row
var dd_label_row = d_col_two.dialogRows.add(); // dropdown label
var dd_row = d_col_two.dialogRows.add(); // dropdown

var label_min_lon = min_lon_row.staticTexts.add({
  staticLabel: "min lon:",
  staticAlignment: StaticAlignmentOptions.LEFT_ALIGN,
  minWidth: 70,
});
/**
 * the cool thing about realEditboxes is that they will
 * take care of the parsing of values.
 *
 * If the user enters astring that can not be parsed the ui will warn
 * also you can use the up down arrows to change the values
 */
var min_lon_box = min_lon_row.realEditboxes.add({
  editValue: -120,
  minimumValue: -180,
  maximumValue: 180,
  smallNudge: 0.1,
  largeNudge: 1
});
// label
var label_min_lat = min_lat_row.staticTexts.add({
  staticLabel: "min lat:",
  staticAlignment: StaticAlignmentOptions.LEFT_ALIGN,
  minWidth: 70,
});
// box
var min_lat_box = min_lat_row.realEditboxes.add({
  editValue: -45,
  minimumValue: -90,
  maximumValue: 90,
  smallNudge: 0.1,
  largeNudge: 1
});
// label
var label_max_lon = max_lon_row.staticTexts.add({
  staticLabel: "max lon:",
  staticAlignment: StaticAlignmentOptions.LEFT_ALIGN,
  minWidth: 70,
});
// box
var max_lon_box = max_lon_row.realEditboxes.add({
  editValue: 120,
  minimumValue: -180,
  maximumValue: 180,
  smallNudge: 0.1,
  largeNudge: 1
});
// label
var label_max_lat = max_lat_row.staticTexts.add({
  staticLabel: "max lat:",
  staticAlignment: StaticAlignmentOptions.LEFT_ALIGN,
  minWidth: 70,
});
// box
var max_lat_box = max_lat_row.realEditboxes.add({
  editValue: 45,
  minimumValue: -90,
  maximumValue: 90,
  smallNudge: 0.1,
  largeNudge: 1
});
// label for the dropdown
var dd_label = dd_label_row.staticTexts.add({
  staticLabel: "TextFrame Contents",
  staticAlignment: StaticAlignmentOptions.LEFT_ALIGN,
  minWidth: 70,
});
// dropdown
// we will set the values for the dropdown later on
// so we don't do nothing here right now
//
// it would be better to do it right away but this
// would mean to have the handling of the gejson analyse here
// or the ui creatin within the draw function
// both is not suitable for reading the script
var dropdown = dd_row.dropdowns.add({
  // stringList : 
});


// this is the main action. All sub funcitons get called from here
//
//
// check out http://dbsgeo.com/latlon/
// to get lat lon coordinates
//
var draw = function() {

  if(parseFloat(app.version) < 7){
    if(DEBUG) $.writeln(app.version);
    alert("You are working in InDesign " + app.version +"\nUnfortunately this script only works in higher versions if ID. Due to the fact that InDesign CS4 can't work with pixels. Sorry for that.");
    return;
  }
  // setup_doc.
  // This function creates a temporary document and loads the the image
  // The size of the image gets analyzed and another document is created
  // in the right size to hold the image
  // returns a doc frame and a page (frame is not used right now)
  var setup_result = setup_doc();

  if (setup_result === null) return; // aborted by user image loading

  var doc = setup_result.doc; // the new doc

  // make sure we work with pixels
  var current_unit = doc.viewPreferences.horizontalMeasurementUnits;
  doc.viewPreferences.horizontalMeasurementUnits = doc.viewPreferences.verticalMeasurementUnits = MeasurementUnits.PIXELS;

  ///////////////////////////////

  // var frame = setup_result.frame;
  var page = setup_result.page; // our page
  // this runs a file import and then a transformation from the CSV data to json
  var rawdata = importer();// import the data

// the real dropdown creation takes place bfore the draw function
//
  var dd_stringList = ["rawdata"];// this is the dialog dropdow list content
  // the dialog itself was created before
  //
  // we loop thru the data and get all the keys for the ddlist
  for (var k in rawdata[0]) {
    if (rawdata[0].hasOwnProperty(k)) {
      dd_stringList.push(k);
    }
  }

  dropdown.stringList = dd_stringList;// now set it in the dialog
  dropdown.selectedIndex = 0;// to make sure something is selected

  // now we analyse the first element to get the lat lon keys
  //
  var keys = geojson_analyzer(settings, rawdata[0]);
  if (keys === null) {
    // if we are here there are no lat lon keys found
    return 'no possible fields detected';
  }

  // this is just an alert to make sure they understand the UI
  //
  // alert("Paste the values you used in tilemill to create your bounding box.\ne.g. -120,-45,120,45 is ordered like this [min lon, min lat, max lon, max lat]");
  // see dialog.jsx for all the dialog settings
  if (dialog.show() === true) {
    // get the fields
    var min_lon = min_lon_box.editValue;
    var min_lat = min_lat_box.editValue;
    var max_lon = max_lon_box.editValue;
    var max_lat = max_lat_box.editValue;
    // get the index value
    var text_index = dropdown.selectedIndex;
    // get the key
    var text_key = dd_stringList[dropdown.selectedIndex];
    dialog.destroy(); // dont need the dialog anymore

    if (set_bbox([min_lon, min_lat, max_lon, max_lat]) !== 0) {
    // if this does not work the values where totally wrong.
      alert("error reading in the bbox values");
      return;
    }
    // To show some progress
    var progress_win = new Window("palette"); // creste new palette
    var progress = progress_bar(progress_win, rawdata.length, 'Analysing Data. Please be patient'); // call the pbar function

    var geodata = [];// will hold the geo values
    // loop the data and get the fields we need
    for (var i = 0; i < rawdata.length; i++) {
      var temp_lat = rawdata[i][keys.lat];
      var temp_lon = rawdata[i][keys.lon];
      var latlng = [temp_lat, temp_lon];
      // Woohoo we have coordiantes
      var temp_txt;// will hold the text

      if (text_index !== 0) {
        temp_txt = rawdata[i][text_key];// get the selected field
      } else {
        temp_txt = rawdata[i].toSource();// this is like a data dumb
      }

      geodata.push({
        name: temp_txt,
        "latlng": latlng
      });
      progress.value++;// update the bar
    }// end the loop
    progress.parent.close();// ed the bar
    var marker = selector(doc, page); // get the selection or create a marker
    geo_to_page_coords(doc, page, marker, settings, geodata);// now the magic
  }else{
    // dialog was aborted
  }

};

draw();// run it

////////////////////////
///END OF MAIN.JSX
////////////////////////
})(this);
