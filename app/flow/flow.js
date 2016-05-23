var Selections = [{
        name: 'link',
        buttons: ['linkEdit'],
        test: AlloyEditor.SelectionTest.link
    }, {
        name: 'image',
        buttons: ['imageLeft', 'imageRight'],
        test: AlloyEditor.SelectionTest.image
    }, {
        name: 'text',
        buttons: ['bold', 'italic', 'underline', 'link'],
        test: AlloyEditor.SelectionTest.text
    }, {
        name: 'table',
        buttons: ['tableRow', 'tableColumn', 'tableCell', 'tableRemove'],
        getArrowBoxClasses: AlloyEditor.SelectionGetArrowBoxClasses.table,
        setPosition: AlloyEditor.SelectionSetPosition.table,
        test: AlloyEditor.SelectionTest.table
}]

$(document).ready(function () {
  var editor = AlloyEditor.editable('.textbox', {
    toolbars: {
      add: {
        buttons: ['hline', 'table'],
        tabIndex: 2
      },
      styles: {
        selections: Selections,
        tabIndex: 1
      }
    }
  })
})

function createCell(cell) {

    var content = document.createElement('DIV');

    var string = "<table><tr><td><a href = \"#\" onclick = deleteColumn(this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.cellIndex)>x</a></td>";
    string += "<td><a href = \"#\" onclick = this.parentNode.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[0].value=\"\">x</a></td></tr>";
    string += "<tr><td><div contenteditable=\"true\" class=\"textbox\"></div></td>";
    string += "<td><a href = \"#\" onclick = deleteRow(this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.rowIndex)>x</a></td></tr></table>";
    content.innerHTML = string;
    $(".content").addClass('textBoxDiv')
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
