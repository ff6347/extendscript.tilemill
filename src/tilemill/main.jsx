var draw = function() {

  var setup_result = setup_doc();

  if (setup_result === null) return; // aborted by user

  var doc = setup_result.doc;

  var current_unit = doc.viewPreferences.horizontalMeasurementUnits;

  doc.viewPreferences.horizontalMeasurementUnits = doc.viewPreferences.verticalMeasurementUnits = MeasurementUnits.PIXELS;

  ///////////////////////////////

  var frame = setup_result.frame;
  var page = setup_result.page;
  // build the UI for interaction


  alert("Paste the values you used in tilemill to create your bounding box.\ne.g. -120,-45,120,45 is ordered like this [min lon, min lat, max lon, max lat]");
  var dialog = app.dialogs.add({
    name: "Paste Mapbox Bounds",
    canCancel: true,

  });

  var d_col_one = dialog.dialogColumns.add();
  var d_col_two = dialog.dialogColumns.add();
  var d_col_three = dialog.dialogColumns.add();
  var d_col_four = dialog.dialogColumns.add();

  var min_lon_row = d_col_one.dialogRows.add();
  var label_min_lon = min_lon_row.staticTexts.add({
    staticLabel: "min lon:",
    minWidth: 70,
  });
  var min_lon_box = min_lon_row.realEditboxes.add({
    editValue:-120,
    minimumValue: -180,
    maximumValue: 180,
    smallNudge:0.1,
    largeNudge:1
    });

  var min_lat_row = d_col_one.dialogRows.add();
  var label_min_lat = min_lat_row.staticTexts.add({
    staticLabel: "min lat:",
    minWidth: 70,
  });
  var min_lat_box = min_lat_row.realEditboxes.add({
    editValue:-45,
    minimumValue: -90,
    maximumValue: 90,
    smallNudge:0.1,
    largeNudge:1
    });

  var max_lon_row = d_col_one.dialogRows.add();
  var label_max_lon = max_lon_row.staticTexts.add({
    staticLabel: "max lon:",
    minWidth: 70,
  });
  var max_lon_box = max_lon_row.realEditboxes.add({
    editValue:120,
    minimumValue: -180,
    maximumValue: 180,
    smallNudge:0.1,
    largeNudge:1
    });

  var max_lat_row = d_col_one.dialogRows.add();
  var label_max_lat = max_lat_row.staticTexts.add({
    staticLabel: "max lat:",
    minWidth: 70,
  });
  var max_lat_box = max_lat_row.realEditboxes.add({
    editValue:45,
    minimumValue: -90,
    maximumValue: 90,
    smallNudge:0.1,
    largeNudge:1
    });

  if (dialog.show() === true) {
    var min_lon = min_lon_box.editValue;
    var min_lat = min_lat_box.editValue;
    var max_lon = max_lon_box.editValue;
    var max_lat = max_lat_box.editValue;
    dialog.destroy();

    if (set_bbox([min_lon, min_lat, max_lon, max_lat]) !== 0) {
      alert("error reading in the bbox values");
      return;
    }


    var marker = selector(doc, page);
    geo_to_page_coords(doc, page, marker, settings);


  }

};


draw();


////////////////////////
///END OF MAIN.JSX
////////////////////////