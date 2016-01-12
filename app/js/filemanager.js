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
      var link = document.createElement("A")

      link.href = "cardEditor.html?" + encodeURIComponent(dataJSON[1][i][j])

      text1 = document.createTextNode(path.basename(dataJSON[1][i][j]))

      link.appendChild(text1)

      element1.appendChild(link)

      element2.appendChild(element1)
    }

    //document.getElementById(String(i)).appendChild(element)
    element.appendChild(element2)
  }

  document.getElementById("thefilemanager").appendChild(theUL)

})
