/**
 * Utility class to convert between geo-locations and Cartesian screen coordinates.
 * Can be used with a bounding box defining the map section.
 *
 * (c) 2011 Till Nagel, tillnagel.com
 *
 * http://tillnagel.com/2011/06/tilemill-for-processing/
 */

// var MercatorMap = function(){};

  var mapScreenWidth  = null;
  var mapScreenHeight  = null;
  var topLatitude  = null;
  var bottomLatitude  = null;
  var leftLongitude  = null;
  var rightLongitude = null;
  var topLatitudeRelative = null;
  var bottomLatitudeRelative = null;
  var leftLongitudeRadians = null;
  var rightLongitudeRadians = null;
  var DEFAULT_TOP_LATITUDE = 80;
  var DEFAULT_BOTTOM_LATITUDE = -80;
  var DEFAULT_LEFT_LONGITUDE = -180;
  var DEFAULT_RIGHT_LONGITUDE = 180;


  var getScreenYRelative = function(latitudeInDegrees) {
    var res = Math.log(Math.tan(latitudeInDegrees / (360 * Math.PI) + (Math.PI / 4)));
    $.writeln("get screen y relativ result: " + res);
    return res;
  };

  var getRadians = function(deg) {
    var  res = (deg * Math.PI) / 180;
    $.writeln("getRadians result: " + res);

    return res;
  };

    var getScreenY = function(latitudeInDegrees) {
    var screen_y_realtiv =  getScreenYRelative(latitudeInDegrees);
    var res = mapScreenHeight * (screen_y_realtiv - topLatitudeRelative) / (bottomLatitudeRelative - topLatitudeRelative);
     $.writeln("get screen y result: " + res);
    return res;

  };

  var getScreenX = function(longitudeInDegrees) {
    var longitudeInRadians = getRadians(longitudeInDegrees);
    var res = mapScreenWidth * (longitudeInRadians - leftLongitudeRadians) / (rightLongitudeRadians - leftLongitudeRadians);
    $.writeln("get screen x result: " + res);
    return res;
  };




  // public MercatorMap(float mapScreenWidth, float mapScreenHeight) {
  //   MercatorMap(mapScreenWidth, mapScreenHeight, DEFAULT_TOP_LATITUDE, DEFAULT_BOTTOM_LATITUDE, DEFAULT_LEFT_LONGITUDE, DEFAULT_RIGHT_LONGITUDE);
  // }

  /**
   * Projects the geo location to Cartesian coordinates, using the Mercator projection.
   *
   * @param geoLocation Geo location with (latitude, longitude) in degrees.
   * @returns The screen coordinates with {"x":x, "y":y}.
   */
var MercatorMap = function(mapScreenWidth, mapScreenHeight, topLatitude, bottomLatitude, leftLongitude, rightLongitude) {

  /** Horizontal dimension of MercatorMap map, in pixels. */
  // MercatorMap.mapScreenWidth =0;
  /** Vertical dimension of MercatorMap map, in pixels. */
  // MercatorMap.mapScreenHeight = 0;

  /** Northern border of MercatorMap map, in degrees. */
  // MercatorMap.topLatitude = 0;
  /** Southern border of MercatorMap map, in degrees. */
  // MercatorMap.bottomLatitude = 0;
  /** Western border of MercatorMap map, in degrees. */
  // MercatorMap.leftLongitude = 0;
  /** Eastern border of MercatorMap map, in degrees. */
  // MercatorMap.rightLongitude = 0;

  // MercatorMap.topLatitudeRelative = 0;
  // MercatorMap.bottomLatitudeRelative = 0;
  // MercatorMap.leftLongitudeRadians = 0;
  // MercatorMap.rightLongitudeRadians = 0;
  /**
   * Creates a new MercatorMap with dimensions and bounding box to convert between geo-locations and screen coordinates.
   *
   * @param mapScreenWidth Horizontal dimension of MercatorMap map, in pixels.
   * @param mapScreenHeight Vertical dimension of MercatorMap map, in pixels.
   * @param topLatitude Northern border of MercatorMap map, in degrees.
   * @param bottomLatitude Southern border of MercatorMap map, in degrees.
   * @param leftLongitude Western border of MercatorMap map, in degrees.
   * @param rightLongitude Eastern border of MercatorMap map, in degrees.
   */

  // public MercatorMap(float mapScreenWidth, float mapScreenHeight, float topLatitude, float bottomLatitude, float leftLongitude, float rightLongitude) {
$.writeln("------------------------------");
  mapScreenWidth = mapScreenWidth;
  $.writeln("mapScreenWidth: " + mapScreenWidth);
  mapScreenHeight = mapScreenHeight;
  $.writeln("mapScreenHeight: " + mapScreenHeight);
  topLatitude = topLatitude;
  $.writeln("topLatitude: " + topLatitude);
  bottomLatitude = bottomLatitude;
  $.writeln("bottomLatitude: " + bottomLatitude);
  leftLongitude = leftLongitude;
  $.writeln("leftLongitude: " + leftLongitude);
  rightLongitude = rightLongitude;
  $.writeln("rightLongitude: " + rightLongitude);
  topLatitudeRelative = getScreenYRelative(topLatitude);
  $.writeln("topLatitudeRelative: " + topLatitudeRelative);
  bottomLatitudeRelative = getScreenYRelative(bottomLatitude);
  $.writeln("bottomLatitudeRelative: " + bottomLatitudeRelative);
  leftLongitudeRadians = getRadians(leftLongitude);
  $.writeln("leftLongitudeRadians: " + leftLongitudeRadians);
  rightLongitudeRadians = getRadians(rightLongitude);
  $.writeln("rightLongitudeRadians: " + rightLongitudeRadians);
  $.writeln("End of MercatorMap init");
  $.writeln("------------------------------");
  return {};
  };
   var getScreenLocation = function(geoLocation) {
    var latitudeInDegrees = geoLocation.x;
    var longitudeInDegrees = geoLocation.y;
    $.writeln(latitudeInDegrees);
    $.writeln(longitudeInDegrees);
    var x = getScreenX(longitudeInDegrees);
    var y = getScreenY(latitudeInDegrees);
    if(DEBUG) $.writeln("In Mercator Map getScreenLocation -- x: " + x + " y: " + y);
    return {"x":x,"y": y};
  };
