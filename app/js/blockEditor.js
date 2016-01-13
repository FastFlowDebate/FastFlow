/* global AlloyEditor
 * global $
*/

const ipcRenderer = require('electron').ipcRenderer

$(document).ready(function () {
  var theURI = window.location.search

  if (theURI.length > 0) {
    var decodedURI = decodeURIComponent(theURI).substring(1)

    var FileArray = ipcRenderer.sendSync('FileOpen', decodedURI)

    document.getElementById('title').innerHTML = FileArray[0]
    document.getElementById('tags').innerHTML = FileArray[1]
    document.getElementById('content').innerHTML = FileArray[2]
  }
})

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
        buttons: ['bold', 'italic', 'underline', 'link', 'cardReference'],
        test: AlloyEditor.SelectionTest.text
    }, {
        name: 'table',
        buttons: ['tableRow', 'tableColumn', 'tableCell', 'tableRemove'],
        getArrowBoxClasses: AlloyEditor.SelectionGetArrowBoxClasses.table,
        setPosition: AlloyEditor.SelectionSetPosition.table,
        test: AlloyEditor.SelectionTest.table
}]

$(document).ready(function () {
  $('#saveButton').hide()
  addBlock()
})

function saveFunction () {
  var TitleString = $('#title').text()
  var TagString = $('#tags').text()
  var ContentString = $('#content').html()
  ipcRenderer.send('FileSave', [TitleString, TagString, ContentString])
  window.alert('Saved!')
}

function addBlock () {
  /* $('#addBlock').before(
    "<response><div id='content' style = 'font-size: 18px;' data-placeholder='Type here ...' onclick = 'showSave()'></div></response>"
  ) */
  var number = 1
  $('.content').each(function (i, obj) {
    var idNum = obj.attr('id').substring(5, obj.attr('id').length)
    if (idNum > number) {
      number = idNum
    }
  })

  var block = document.createElement('div')
  block.setAttribute('class', 'content')
  block.setAttribute('id', 'block' + number)
  block.style.fontSize = 'large'
  block.setAttribute('onclick', 'showSave()')
  block.setAttribute('date-placeholder', 'Type here ...')

  $('#addBlock').before(block)

  var editor = AlloyEditor.editable('block + number', {
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
  console.log('exec')
}

function showSave () {
  $('#saveButton').show()
}
