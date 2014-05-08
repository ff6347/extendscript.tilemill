/**
 * Load an image an get the size to create another doc that
 * has exactly the size of the image
 *
 *
 */
var setup_doc = function(){
  var image = File.openDialog("Select your image", "*.png", false);
  if (image === null) {
    return null;
  }
    var temp_doc = app.documents.add();
      temp_doc.viewPreferences.horizontalMeasurementUnits = temp_doc.viewPreferences.verticalMeasurementUnits = MeasurementUnits.PIXELS;
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
        pageWidth: dim[0] + "px",
        pageHeight: dim[1] + "px",
        facingPages: false
      },
      viewPreferences:{
        horizontalMeasurementUnits:MeasurementUnits.PIXELS,
        verticalMeasurementUnits:MeasurementUnits.PIXELS
      }
    });
    temp_doc.close(SaveOptions.NO);
    var page = doc.pages[0];
    var frame = page.rectangles.add({
      geometricBounds: [0, 0, dim[1], dim[0]]
    });
    frame.place(image);

return {"doc":doc,"frame":frame,"page":page};
};