const ipcRenderer = require('electron').ipcRenderer
var path = require('path')

//This function hides a div based on button click
function unhide(clickedButton, divID) {
var item = document.getElementById(divID);
if (item) {
    if(item.className=='hidden'){
        item.className = 'unhidden' ;
        clickedButton.value = 'hide'
    }else{
        item.className = 'hidden';
        clickedButton.value = 'unhide'
    }
  }
}

document.write("<style> .hidden{display:none;} .unhidden{display:block;} </style>")


$(document).ready(function () {
  var dataJSON = ipcRenderer.sendSync('FileManager', 'ready')

  var theUL = document.createElement("UL")

  for (i = 0; i < dataJSON[0].length; i++) {
    //Changed from UL here
    var element = document.createElement("UL")
    var my_string = "unhide(this, '" + i +"')";

    element.setAttribute("onClick", my_string)

    var text = document.createTextNode(path.basename(dataJSON[0][i]))

    element.appendChild(text)

    theUL.appendChild(element)

    var element2 = document.createElement("div");
    element2.setAttribute('id',i)
    element2.setAttribute('class', 'hidden')


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
