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
  var doc, page, frame; // hold the results
  // the user wants a new document
  if (settings.new_doc === true) {
    // select the image
    var image = File.openDialog("Select your image", "*.png", false);
    if (image === null) {
      // aborted by user :-(
      return null;
    }
    // this doc will be destroyed
    // it is only here for analysing the image
    var temp_doc = app.documents.add();
    // make sure we use PIXELS
    temp_doc.viewPreferences.horizontalMeasurementUnits = temp_doc.viewPreferences.verticalMeasurementUnits = MeasurementUnits.PIXELS;
    // create a frame that will hold the image
    var temp_rect = temp_doc.pages[0].rectangles.add({
      geometricBounds: [0, 0, 100, 100]
    });

    temp_rect.place(image); // place the image
    temp_rect.fit(FitOptions.FRAME_TO_CONTENT); // fit the frame
    var dim = get_dim(temp_rect, true); // get the sizes
    if (DEBUG) $.writeln("new doc will be w/h " + dim);
    settings.pw = dim[0]; // set the globals
    settings.ph = dim[1]; // set the globals
    // now this will be the doc we work in
    // make sure you use PIXELS by setting the height as string
    // with the px measurement
    // no facing pages
    // and also set it to use pixels
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
    temp_doc.close(SaveOptions.NO);// destroy the temp doc

    page = doc.pages[0];// get the first page
    // add a frame in the right size
    frame = page.rectangles.add({
      geometricBounds: [0, 0, dim[1], dim[0]]
    });

    frame.place(image);// place the image
    // we are done for now
  } else {
    // the user wants to work in his own doc
    if (app.documents.length > 0) {

      doc = app.activeDocument; // there is a doc
      // make sure we have pixels
      doc.viewPreferences.horizontalMeasurementUnits = doc.viewPreferences.verticalMeasurementUnits = MeasurementUnits.PIXELS;

      settings.pw = doc.documentPreferences.pageWidth; // get width to globals
      settings.ph = doc.documentPreferences.pageHeight; // get height
      page = doc.layoutWindows[0].activePage;// get the page

      // for now we asume the user knows what he is doing
      // all the mapping will take place depending on the size of the
      // page
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
    } else {
      alert("You need a document with the right geo coordinates");
      return null;
    }
  }
 // give back the result
 // frame is not used at the moment
  return {
    "doc": doc,
    "frame": frame,
    "page": page
  };
};