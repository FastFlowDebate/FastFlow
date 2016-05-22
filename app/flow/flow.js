function deleteRow(row){
  var tbl = document.getElementById('flowspace')
  if (tbl.rows.length > 1) {
      tbl.deleteRow(row)
    }
}

function deleteColumn(cell){
   var tbl = document.getElementById('flowspace')
   if (tbl.rows[0].cells.length > 1){
     for (i = 0; i < tbl.rows.length; i++) {
         tbl.rows[i].deleteCell(cell)
     }
 }

}

function clearText() {
  window.alert("corner")
}
function createCell(cell) {

    var content = document.createElement('DIV');

    var string = "<table><tr><td><a href = \"#\" onclick = deleteColumn(this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.cellIndex)>x</a></td>";
    string += "<td><a href = \"#\" onclick = clearText()>x</a></td></tr>";
    string += "<tr><td><textarea></textarea></td>";
    string += "<td><a href = \"#\" onclick = deleteRow(this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.rowIndex)>x</a></td></tr></table>";
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