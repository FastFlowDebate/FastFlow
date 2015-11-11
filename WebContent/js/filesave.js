var PythonShell = require('python-shell');
var pyshell = new PythonShell('backend/filesave.py');
//var args = process.argv.slice(4);

var tags;
var content;
var location;
var filename;

function filesave(tags, content, location, filename) {
  // sends a message to the Python script via stdin
  //tags
  //console.log(tags);
  //console.log(content);
  //console.log(location);
  //console.log(filename);

  pyshell.send(tags);
  //content
  pyshell.send(content);
  //folder location
  pyshell.send(location);
  //filename
  pyshell.send(filename);
/*
  pyshell.on('message', function (message) {
    // received a message sent from the Python script (a simple "print" statement)
    console.log(message);
  });
*/
  // end the input stream and allow the process to exit
  pyshell.end(function (err) {
    if (err) throw err;
    console.log('finished');
  });
}
filesave(process.argv[2], process.argv[3], process.argv[4], process.argv[5]);
