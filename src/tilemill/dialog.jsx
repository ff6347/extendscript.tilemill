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
});


var msgpt2 = msg_row_two.staticTexts.add({
  minWidth: 200,
  staticLabel: "e.g. -120,-45,120,45 is ordered like this:",
});
var msgpt3 = msg_row_three.staticTexts.add({
  minWidth: 200,
  staticLabel: "[min lon, min lat, max lon, max lat]",
});

var msgpt4 = msg_row_four.staticTexts.add({
  minWidth: 200,
  staticLabel: "Then select the value for the TextFrame",
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

// checking if we are in CS6 or higher
// if we are we can use some more styling for the UI
//
if(parseFloat(app.version) >= 8){
msgpt1.staticAlignment = StaticAlignmentOptions.LEFT_ALIGN;
msgpt2.staticAlignment = StaticAlignmentOptions.LEFT_ALIGN;
msgpt3.staticAlignment = StaticAlignmentOptions.LEFT_ALIGN;
msgpt4.staticAlignment = StaticAlignmentOptions.LEFT_ALIGN;
label_min_lon.staticAlignment = StaticAlignmentOptions.LEFT_ALIGN;
label_min_lat.staticAlignment = StaticAlignmentOptions.LEFT_ALIGN;
label_max_lon.staticAlignment = StaticAlignmentOptions.LEFT_ALIGN;
label_max_lat.staticAlignment = StaticAlignmentOptions.LEFT_ALIGN;
dd_label.staticAlignment = StaticAlignmentOptions.LEFT_ALIGN;
}
