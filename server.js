// app.js
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/WebContent/'));
app.get('/', function(req, res,next) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(client) {
    console.log('Client connected...');

    client.on('join', function(data) {
        console.log(data);
    });
    client.on('newCard', function(data) {
    	console.log("card{ tag: " + data.tag + ", cite: " + data.cite + ", content: " + data.content + "}");
    	//do stuff with data, at the moment doesn't print data properly lol
    	//TODO parse data - card content and save to new card then return cardSaved(cardID);
      var PythonShell = require('python-shell');
      var filesavepy = new PythonShell('backend/filesave.py');
      var indexShell = new PythonShell('backend/tagindex.py');

      //var args = process.argv.slice(4);
      var tags;
      var content;
      var location;
      var filename;

      function filesave(tags, content, location, filename) {
        filesavepy.send(tags);
        console.log(tags);
        //content
        filesavepy.send(content);
        console.log(content);
        //folder location
        filesavepy.send(location);
        console.log(location);
        //filename
        filesavepy.send(filename);
        console.log(filename);

        indexShell.send(location);
        console.log(location);

        indexShell.send(location);
        console.log(location);
        //indexShell.send(location);

        indexShell.end(function (err) {
          if (err) throw err;
          console.log('finished');
        });

      }

      filesave(data.tag.toString(), "ugh", "backend/testfolder", data.cite.toString());

});
});

server.listen(4200);
