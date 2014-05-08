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
//

var get_dim = function( /*PageItem*/ obj, /*bool*/ visible) {
  var boundsProperty = ((visible) ? 'visible' : 'geometric') + 'Bounds';
  var b = obj[boundsProperty];
  // width=right-left , height = bottom-top
  return [b[3] - b[1], b[2] - b[0]];
};




var set_bbox = function(arr) {

  // var arr = str.split(",");
  // settings.bbox.left_lon = parseFloat(arr[0]);
  // settings.bbox.bottom_lat = parseFloat(arr[1]);
  // settings.bbox.right_lon = parseFloat(arr[2]);
  // settings.bbox.top_lat = parseFloat(arr[3]);

  settings.bbox.min[0] = parseFloat(arr[0]);
  settings.bbox.min[1] = parseFloat(arr[1]);
  settings.bbox.max[0] = parseFloat(arr[2]);
  settings.bbox.max[1] = parseFloat(arr[3]);

  // settings.boundingBox.bounds.ul_lat = settings.bbox.top_lat;
  // settings.boundingBox.bounds.ul_lon = settings.bbox.left_lon;
  // settings.boundingBox.bounds.lr_lat = settings.bbox.bottom_lat;
  // settings.boundingBox.bounds.lr_lon = settings.bbox.right_lon;
  if (DEBUG) {
    for (var key in settings.bbox) {
      if (settings.bbox.hasOwnProperty(key)) {
        $.writeln("Key: " + key + " Obj: " + settings.bbox[key]);
      }
    } // end of loop
  } // end DEBUG
  return 0;
};