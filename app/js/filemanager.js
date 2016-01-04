const ipcRenderer = require('electron').ipcRenderer

$(document).ready(function () {
  var dataJSON = ipcRenderer.sendSync('FileManager', 'ready')

  for (i = 0; i < dataJSON[0].length; i++) {
    var element = document.createElement('UL')
    var text = document.createTextNode(dataJSON[0][i])
    element.appendChild(text)
    element.id = String(i)
    document.getElementById('thefilemanager').appendChild(element)


    for (j = 0; j < dataJSON[1][i].length; j++){
      var element1 = document.createElement('LI')
      var text1 = document.createTextNode(dataJSON[1][i][j])
      element1.appendChild(text1)
      document.getElementById(String(i)).appendChild(element1)
    }
  }
})
