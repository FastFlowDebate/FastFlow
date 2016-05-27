const ipcRenderer = require('electron').ipcRenderer

function clearAll() {

    var content = document.getElementById('flowspace');

    var string = "<tr><td><table><tr><td><a href = \"#\" tabindex='500' onclick = deleteColumn(this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.cellIndex)>x</a></td>";
    string += "<td><a href = \"#\" tabindex='500' onclick = this.parentNode.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[0].innerHTML=\"\">x</a></td></tr>";
    string += "<tr><td><div contenteditable=\"true\" class=\"textbox\"></div></td>";
    string += "<td><a href = \"#\" tabindex='500' onclick = deleteRow(this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.rowIndex)>x</a></td></tr></table></td></tr>";
    content.innerHTML = string;

}

function deleteRow(row){
  var tbl = document.getElementById('flowspace')
  if (tbl.rows.length > 1) {
      tbl.deleteRow(row)
    }
  else {
    clearAll()
  }
}

function deleteColumn(cell){
   var tbl = document.getElementById('flowspace')
   if (tbl.rows[0].cells.length > 1){
     for (i = 0; i < tbl.rows.length; i++) {
         tbl.rows[i].deleteCell(cell)
     }
 }
 else {
   clearAll()
 }
}

function createCell(cell) {

    var content = document.createElement('DIV');

    var string = "<table><tr><td><a href = \"#\" tabindex='500' onclick = deleteColumn(this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.cellIndex)>x</a></td>";
    string += "<td><a href = \"#\" tabindex='500' onclick = this.parentNode.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[0].innerHTML=\"\">x</a></td></tr>";
    string += "<tr><td><div contenteditable=\"true\" class=\"textbox\"></div></td>";
    string += "<td><a href = \"#\" tabindex='500' onclick = deleteRow(this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.rowIndex)>x</a></td></tr></table>";
    content.innerHTML = string;
    cell.appendChild(content);

}

function newSpeech() {
  var tbl = document.getElementById('flowspace'), // table reference
        i;
    // open loop for each row and append cell
    for (i = 0; i < tbl.rows.length; i++) {
        createCell(tbl.rows[i].insertCell(tbl.rows[i].cells.length));
    }

}

function newContention() {
  var tbl = document.getElementById('flowspace'), // table reference
      row = tbl.insertRow(tbl.rows.length),      // append table row
      i;
  // insert table cells to the new row
  for (i = 0; i < tbl.rows[0].cells.length; i++) {
      createCell(row.insertCell(i));
  }

}

$(document).ready(function () {
  $('#deleteButton').hide()
  $('#saveButton').hide()
})

function buttonShow () {
  $('#deleteButton').show()
  $('#saveButton').show()
}

$(document).ready(function () {
  var theURI = window.location.search

  if (theURI.length > 0) {
    var decodedURI = decodeURIComponent(theURI).substring(1).split("\\")

    FileArray = ipcRenderer.sendSync('FlowOpen', decodedURI[decodedURI.length - 1])

    document.getElementById('title').innerHTML = FileArray[0]
    document.getElementById('tags').innerHTML = FileArray[1]
    document.getElementById('flowspace').innerHTML = FileArray[2]
  }
})

function saveFunction () {
  var TitleString = $('#title').text()
  var TagString = $('#tags').text()
  var ContentString = $('#flowspace').html()
  ipcRenderer.send('FlowSave', [TitleString, TagString, ContentString])
  console.log(TitleString)
  console.log(TagString)
  console.log(ContentString)

  window.alert('Saved!')
}

function deleteFunction () {
  var TitleString = $('#title').text()
  ipcRenderer.send('FlowRemove', TitleString)
  window.alert('Deleted!')

}

function buttonShow () {
  $('#deleteButton').show()
  $('#saveButton').show()
}
