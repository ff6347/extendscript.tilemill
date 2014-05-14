
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