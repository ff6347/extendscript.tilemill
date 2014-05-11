// this is globals.jsx

var DEBUG = true;
var settings = {
 new_layers: true,
  new_marker_layer_name: 'marker',
  new_text_layer_name: 'text',
  latitude_key:"",
  longitude_key:"",
  text_key:"",
  use_textframe:true,
  use_marker:true,
  possible_lat_keys : ["latitude","Latitude","LATITUDE","lat", "Lat","LAT"],
  possible_lon_keys : ["longitude","Longitude","LONGITUDE","lon", "Lon","LON"],
  /**
   * orientation possibilites are:
   * DEFAULT
   * CENTER
   * TOP
   * BOTTOM
   * LEFT
   * RIGHT
   * UPPER_LEFT
   * LOWER_LEFT
   * UPPER_RIGHT
   * LOWER_RIGHT
   */
  default_marker_orientation: "CENTER",
  /*
  The script will set these infos below by itself. Don't change them.
  It reads data written by IDMap into the document.label
  mercator = 1
 // this script is only for tilemill. use mercator
  equirectangular = 0
  gallpeters = 2
  hammer = 3
  sinusoidal = 4
  aitoff = 5
   */
  // projection_type:1,
  // ptype:'mercator',
  doc:null,
  pw:0,
  ph:0,
  // check out http://dbsgeo.com/latlon/
  // to get lat lon coordinates
};

settings.bbox = {

  min:[],
  max:[]
};
// end of globals.jsx