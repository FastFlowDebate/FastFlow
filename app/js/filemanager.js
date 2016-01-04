const ipcRenderer = require('electron').ipcRenderer
var path = require('path')

$(document).ready(function () {
  var dataJSON = ipcRenderer.sendSync('FileManager', 'ready')


  var theUL = document.createElement("UL")

  for (i = 0; i < dataJSON[0].length; i++) {
    var element = document.createElement("LI")

    var text = document.createTextNode(path.basename(dataJSON[0][i]))
    element.appendChild(text)

    theUL.appendChild(element)

    var element2 = document.createElement("UL");

    for (j = 0; j < dataJSON[1][i].length; j++){
      var element1 = document.createElement("LI");
      var text1 = document.createTextNode(path.basename(dataJSON[1][i][j]))
      element1.appendChild(text1)

      element2.appendChild(element1)
    }

    //document.getElementById(String(i)).appendChild(element)
    element.appendChild(element2)
  }

  document.getElementById("thefilemanager").appendChild(theUL)


})

$('#thefilemanager').easytree();
