// this is globals.jsx

var DEBUG = true;
var settings = {

 new_layer: true,
  new_layer_name: 'marker',
  latitude_key:"",
  longitude_key:"",
  text_key:"",
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
  projection_type:1,
  ptype:'mercator',
  doc:null,
  pw:0,
  ph:0,
  // check out http://dbsgeo.com/latlon/
  // to get lat lon coordinates
};

// this is the world bounding box
// will also be set by the script from the info of the doc
// settings.boundingBox = {
//   zoomed: true,
//   bounds: {
//     ul_lat:0,
//     ul_lon:0,
//     lr_lat:0,
//     lr_lon:0
//   }
// };

settings.bbox = {
  // top_lat:80,
  // bottom_lat:-80,
  // left_lon:-180,
  // right_lon:180,
  min:[],
  max:[]
};



