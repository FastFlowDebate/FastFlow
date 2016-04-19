var contentionnumber = 0;
var speechnumber = 0

function newContention() {

  var newRow = document.createElement("TR")
  newRow.className = "externalTD"

  var numColumn = document.createElement("TD")

  newRow.appendChild(numColumn)

  for (i = 0; i <= speechnumber; i++) {
    var newColumn = document.createElement("TD")


    ////////////////////////////////////////////////////////////

    var flowTextArea = document.createElement("TEXTAREA")
    var flowTextAreaTD = document.createElement('TD')
    flowTextAreaTD.appendChild(flowTextArea)
////
    var linkTop = document.createElement('a');
    var linktextTop = document.createTextNode("x")
    linkTop.onclick = function() {
        window.alert("top")
    }
    var linkTopTD = document.createElement('TD')
    linkTop.appendChild(linktextTop)
    linkTopTD.appendChild(linkTop)
/////

    var linkCorner = document.createElement('a');
    var linktextCorner = document.createTextNode("x")
    linkCorner.onclick = function() {
        window.alert("corner")
    }
    var linkCornerTD = document.createElement('TD')
    linkCorner.appendChild(linktextCorner)
    linkCornerTD.appendChild(linkCorner)
/////
    var linkRight = document.createElement('a');
    var linktextRight = document.createTextNode("x")
    linkRight.onclick = function() {
        window.alert("right")
    }
    var linkRightTD = document.createElement('TD')
    linkRight.appendChild(linktextRight)
    linkRightTD.appendChild(linkRight)
/////

////
    var topColumn = document.createElement('TR')
    topColumn.appendChild(linkTopTD)
    topColumn.appendChild(linkCornerTD)
  ////
    var bottomColumn = document.createElement('TR')
    bottomColumn.appendChild(flowTextAreaTD)
    bottomColumn.appendChild(linkRightTD)
/////
    var textModule = document.createElement('TABLE')
    textModule.appendChild(topColumn)
    textModule.appendChild(bottomColumn)



////////////////////////////////////////////////////////

    newColumn.appendChild(textModule)
    newRow.appendChild(newColumn)
  }


  contentionnumber = contentionnumber + 1

  document.getElementById("flowspace").appendChild(newRow)



}




//##########################################################################

function newSpeech() {

  ////////////////////////////////////////////////////////////

  var flowTextArea = document.createElement("TEXTAREA")
  var flowTextAreaTD = document.createElement('TD')
  flowTextAreaTD.appendChild(flowTextArea)
////
  var linkTop = document.createElement('a');
  var linktextTop = document.createTextNode("x")
  linkTop.onclick = function() {
      window.alert("top")
  }
  var linkTopTD = document.createElement('TD')
  linkTop.appendChild(linktextTop)
  linkTopTD.appendChild(linkTop)
/////

  var linkCorner = document.createElement('a');
  var linktextCorner = document.createTextNode("x")
  linkCorner.onclick = function() {
      window.alert("corner")
  }
  var linkCornerTD = document.createElement('TD')
  linkCorner.appendChild(linktextCorner)
  linkCornerTD.appendChild(linkCorner)
/////
  var linkRight = document.createElement('a');
  var linktextRight = document.createTextNode("x")
  linkRight.onclick = function() {
      window.alert("right")
  }
  var linkRightTD = document.createElement('TD')
  linkRight.appendChild(linktextRight)
  linkRightTD.appendChild(linkRight)
/////

////
  var topColumn = document.createElement('TR')
  topColumn.appendChild(linkTopTD)
  topColumn.appendChild(linkCornerTD)
////
  var bottomColumn = document.createElement('TR')
  bottomColumn.appendChild(flowTextAreaTD)
  bottomColumn.appendChild(linkRightTD)
/////
  var textModule = document.createElement('TABLE')
  textModule.appendChild(topColumn)
  textModule.appendChild(bottomColumn)



////////////////////////////////////////////////////////



  var newColumn = document.createElement("TD")

  newColumn.appendChild(textModule)

  speechnumber = speechnumber + 1

  $(".externalTD").append(newColumn);
}
