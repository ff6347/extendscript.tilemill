var draw = function() {

  var setup_result = setup_doc();

  if (setup_result === null) return; // aborted by user
  var doc = setup_result.doc;

  var current_unit = doc.viewPreferences.horizontalMeasurementUnits;

  doc.viewPreferences.horizontalMeasurementUnits = doc.viewPreferences.verticalMeasurementUnits = MeasurementUnits.PIXELS;

  ///////////////////////////////

  var frame = setup_result.frame;
  var page = setup_result.page;
  // import the data
  var rawdata = importer();
  var dd_stringList = ["rawdata"];
  for(var k in rawdata[0]){
    if(rawdata[0].hasOwnProperty(k)){
      dd_stringList.push(k);
    }
  }

  dropdown.stringList = dd_stringList;
  dropdown.selectedIndex = 0;

  // build the UI for interaction
    // if(DEBUG) $.writeln("rawdata.toSource(): " +rawdata.toSource());
    var keys = geojson_analyzer(settings, rawdata[0]);
    if (keys === null) {
      return 'no possible fields detected';
    }


  alert("Paste the values you used in tilemill to create your bounding box.\ne.g. -120,-45,120,45 is ordered like this [min lon, min lat, max lon, max lat]");
  // see dialog.jsx for all the dialog settings
  if (dialog.show() === true) {
    var min_lon = min_lon_box.editValue;
    var min_lat = min_lat_box.editValue;
    var max_lon = max_lon_box.editValue;
    var max_lat = max_lat_box.editValue;
    var text_index = dropdown.selectedIndex;
    var text_key = dd_stringList[dropdown.selectedIndex];
    dialog.destroy();

    if (set_bbox([min_lon, min_lat, max_lon, max_lat]) !== 0) {
      alert("error reading in the bbox values");
      return;
    }
    var progress_win = new Window ("palette"); // creste new palette
    var progress = progress_bar(progress_win, rawdata.length, 'Analysing Data. Please be patient'); // call the pbar function
    var geodata = [];
    for (var i = 0; i < rawdata.length; i++) {
      var temp_lat = rawdata[i][keys.lat];
      var temp_lon = rawdata[i][keys.lon];
      var latlng = [temp_lat, temp_lon];
      var temp_txt ;
      if(text_index !== 0){
        temp_txt = rawdata[i][text_key];
      }else{
        temp_txt = rawdata[i].toSource();
      }
      geodata.push({
        name: temp_txt,
        "latlng": latlng
      });
      progress.value++;
    }
    progress.parent.close();
    var marker = selector(doc, page);
    geo_to_page_coords(doc, page, marker, settings, geodata);


  }

};

draw();
 // console.close();

////////////////////////
///END OF MAIN.JSX
////////////////////////