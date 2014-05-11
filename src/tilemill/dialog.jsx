  var dialog = app.dialogs.add({
    name: "Paste Mapbox Bounds",
    canCancel: true,
  });
  var d_col_one = dialog.dialogColumns.add();
  var d_col_two = dialog.dialogColumns.add();
  var d_col_three = dialog.dialogColumns.add();
  var d_col_four = dialog.dialogColumns.add();
  var d_col_five = dialog.dialogColumns.add();

  var min_lon_row = d_col_one.dialogRows.add();
  var label_min_lon = min_lon_row.staticTexts.add({
    staticLabel: "min lon:",
          staticAlignment:StaticAlignmentOptions.LEFT_ALIGN,

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
          staticAlignment:StaticAlignmentOptions.LEFT_ALIGN,

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
          staticAlignment:StaticAlignmentOptions.LEFT_ALIGN,

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
          staticAlignment:StaticAlignmentOptions.LEFT_ALIGN,

    minWidth: 70,
  });
  var max_lat_box = max_lat_row.realEditboxes.add({
    editValue:45,
    minimumValue: -90,
    maximumValue: 90,
    smallNudge:0.1,
    largeNudge:1
    });

var dd_label_row = d_col_five.dialogRows.add();
var dd_label = dd_label_row.staticTexts.add({
      staticLabel: "TextFrame Contents",
      staticAlignment:StaticAlignmentOptions.LEFT_ALIGN,
    minWidth: 70,
  });
var dd_row = d_col_five.dialogRows.add();

var dropdown = dd_row.dropdowns.add({
  // stringList : 
  });