/**

 *
 */
/**
 * Load an image an get the size to create another doc that
 * has exactly the size of the image
 *
 * or get the current document
 * * @return {"doc": doc,"frame": frame,"page": page};
 */
var setup_doc = function() {
  var doc, page, frame;
  if (settings.new_doc === true) {

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
    if (DEBUG) $.writeln("new doc will be w/h " + dim);
    settings.pw = dim[0];
    settings.ph = dim[1];
    doc = app.documents.add({
      documentPreferences: {
        pageWidth: dim[0] + "px",
        pageHeight: dim[1] + "px",
        facingPages: false
      },
      viewPreferences: {
        horizontalMeasurementUnits: MeasurementUnits.PIXELS,
        verticalMeasurementUnits: MeasurementUnits.PIXELS
      }
    });
    temp_doc.close(SaveOptions.NO);
    page = doc.pages[0];
    frame = page.rectangles.add({
      geometricBounds: [0, 0, dim[1], dim[0]]
    });
    frame.place(image);
  } else {
    if (app.documents.length > 0) {
      doc = app.activeDocument;
      // make sure we have pixels
      doc.viewPreferences.horizontalMeasurementUnits = doc.viewPreferences.verticalMeasurementUnits = MeasurementUnits.PIXELS;


      settings.pw = doc.documentPreferences.pageWidth;
      settings.ph = doc.documentPreferences.pageHeight;
      page = doc.layoutWindows[0].activePage;
      // if (doc.selection.length > 0) {
      //   if (doc.selection[0] instanceof Rectangle) {
      //     if (doc.selection[0].images.length > 0) {
      //       frame = doc.selection[0];
      //     }else{
      //       alert("There is no image in here");
      //       return null;
      //     }
      //   }else{
      //     alert("This is no Rectangle");
      //     return null;
      //   }
      // }else{
      //   alert("Please select a Rectangle with an TileMill image");
      //   return null;
      // }
    }else{
      alert("You need a document with an TileMill image in it. Also you need to select the image.");
      return null;
    }
  }

  return {
    "doc": doc,
    "frame": frame,
    "page": page
  };
};