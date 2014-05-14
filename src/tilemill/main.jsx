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