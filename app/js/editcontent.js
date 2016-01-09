const ipcRenderer = require('electron').ipcRenderer

$(document).ready(function () {
  var theURI = window.location.search

  if (theURI.length > 0) {
    var decodedURI = decodeURIComponent(theURI).substring(1)
    FileArray = ipcRenderer.sendSync('FileOpen', decodedURI)
    document.getElementById("title").innerHTML = FileArray[0]
    document.getElementById("tags").innerHTML = FileArray[1]
    document.getElementById("content").innerHTML = FileArray[2]

  }
})
