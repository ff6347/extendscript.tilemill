
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
