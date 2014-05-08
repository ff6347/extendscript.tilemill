
var draw = function() {

var setup_result = setup_doc();

if(setup_result === null) return; // aborted by user

  var doc = setup_result.doc;

var current_unit = doc.viewPreferences.horizontalMeasurementUnits;

  doc.viewPreferences.horizontalMeasurementUnits = doc.viewPreferences.verticalMeasurementUnits = MeasurementUnits.PIXELS;

///////////////////////////////

  var frame = setup_result.frame;
  var page = setup_result.page;

    var dialog = app.dialogs.add({
      name: "Paste Mapbox Bounds",
      canCancel: true
    });
    var d_col_one = dialog.dialogColumns.add();
    var t_box = d_col_one.textEditboxes.add({
      editContents: "-120,-45,120,45"
    });



    if (dialog.show() === true) {

      var bboxstring = t_box.editContents;
      // alert(bboxstring);
      dialog.destroy();

      if(set_bbox(bboxstring) !== 0){
        alert("error reading in the pasted bbox");
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
