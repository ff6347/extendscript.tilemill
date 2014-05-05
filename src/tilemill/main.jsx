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

var do_it = function() {
  var image = File.openDialog("Select your image", "*.png", false);
  if (image === null) {
    return 'no image selected or aborted';
  } else {
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
    var dialog = app.dialogs.add({
      name: "Paste Mapbox Bounds",
      canCancel: true
    });
    var d_col_one = dialog.dialogColumns.add();
    var t_box = d_col_one.textEditboxes.add({
      editContents: "-120,45,-120,-45"
    });

    if (dialog.show() === true) {

      var bboxstring = t_box.editContents;
      // alert(bboxstring);
      dialog.destroy();
      var arr = bboxstring.split(",");
      settings.bbox.xmin = parseFloat(arr[0]);
      settings.bbox.ymin = parseFloat(arr[3]);
      settings.bbox.xmax = parseFloat(arr[2]);
      settings.bbox.ymax = parseFloat(arr[1]);

      settings.boundingBox.bounds.ul_lat = settings.bbox.ymin;
      settings.boundingBox.bounds.ul_lon = settings.bbox.xmin;
      settings.boundingBox.bounds.lr_lat = settings.bbox.ymax;
      settings.boundingBox.bounds.lr_lon = settings.bbox.xmax;

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
  var topLatitude = parseFloat(arr[0]);
  var bottomLatitude = parseFloat(arr[3]);
  var leftLongitude = parseFloat(arr[2]);
  var rightLongitude = parseFloat(arr[1]);
  var lon1 = -132.3633;
  var lat1 = 14.4347;
  var lon2 = -58.3594;
  var lat2 = 57.7979;

  var tmp = MercatorMap(mapScreenWidth, mapScreenHeight, lat2, lat1, lon1, lon2);
  var coordinates = [];
  for(var i = 0; i < geodata.length;i++){
    var lat = parseFloat(geodata[i][keys.lat]);
    var lon = parseFloat(geodata[i][keys.lon]);
    var w = settings.pw;
    var h = settings.ph;
    var ul_lon = settings.boundingBox.bounds.ul_lon;
    var ul_lat = settings.boundingBox.bounds.ul_lat;
    var lr_lat = settings.boundingBox.bounds.lr_lat;
    var lr_lon = settings.boundingBox.bounds.lr_lon;
if(DEBUG){$.writeln("lat: "+ lat);}
if(DEBUG){$.writeln("lon: "+ lon);}
// if(DEBUG){$.writeln("w: "+ w);}
// if(DEBUG){$.writeln("h: "+ h);}
// if(DEBUG){$.writeln("ul_lon: "+ ul_lon);}
// if(DEBUG){$.writeln("ul_lat: "+ ul_lat);}
// if(DEBUG){$.writeln("lr_lat: "+ lr_lat);}
// if(DEBUG){$.writeln("lr_lon: "+ lr_lon);}
    // var xy = geo_to_pixel(lat, lon, w, h, ul_lat, ul_lon, lr_lat, lr_lon);
    var xy = getScreenLocation({x:lat,y: lon});

    coordinates.push({"json":geodata[i].toSource(),"xy":xy});
}
  // var coordinates = geodata_to_indesign_coords(settings, geodata, doc, page);
   // alert(coordinates.toSource());
  place_markers(doc, page, marker, coordinates, settings);
  }
    }
  };


do_it();