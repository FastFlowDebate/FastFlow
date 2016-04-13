var contentionnumber = 0;
var speechnumber = 0

function newContention() {

  var newRow = document.createElement("TR")

  var numColumn = document.createElement("TD")

  newRow.appendChild(numColumn)

  for (i = 0; i <= speechnumber; i++) {
    var newColumn = document.createElement("TD")

    //var flowDiv = document.createElement("DIV")
    //flowDiv.setAttribute("class", "mui-textfield")

    var flowTextArea = document.createElement("TEXTAREA")
    //flowTextArea.setAttribute("class", "mui-textfield")

    //flowDiv.appendChild(flowTextArea)
    newColumn.appendChild(flowTextArea)
    newRow.appendChild(newColumn)
  }

  //newColumn.appendChild(flowDiv)

  contentionnumber = contentionnumber + 1

  document.getElementById("flowspace").appendChild(newRow)



}

function newSpeech() {
  //var flowDiv = document.createElement("DIV")
  //flowDiv.setAttribute("class", "mui-textfield")

  var flowTextArea = document.createElement("TEXTAREA")
  //flowTextArea.setAttribute("class", "mui-textfield")

  //flowDiv.appendChild(flowTextArea)
  var newColumn = document.createElement("TD")

  newColumn.appendChild(flowTextArea)

  speechnumber = speechnumber + 1

  $("tr").append(newColumn);
}
