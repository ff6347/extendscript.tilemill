// this is src/lib/importer.jsx

var importer = function (){
  var csvfile = File.openDialog("Select your csv file.","*.*",false);
  if(csvfile === null){
    // nothing selected or dialog aborted
    return null;
  }else{
    var geodata = CSV.toJSON(csvfile ,  useDialog = false, separator = ",");
    return geodata;
  }

};


// end of importer.jsx