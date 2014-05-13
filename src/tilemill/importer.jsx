// this is src/lib/importer.jsx
// import the data this calls the
// extendscript.csv lib
// https://github.com/fabiantheblind/extendscript.csv
//
var importer = function (){
  var csvfile = File.openDialog("Select your csv file.","*.*",false);
  if(csvfile === null){
    // nothing selected or dialog aborted
    return null;
  }else{
    var data = CSV.toJSON(csvfile ,  useDialog = false, separator = ",");
    return data;
  }

};
// end of importer.jsx