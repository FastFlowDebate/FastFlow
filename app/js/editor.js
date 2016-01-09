var editor1 = AlloyEditor.editable('title')
var editor2 = AlloyEditor.editable('tags')
var editor3 = AlloyEditor.editable('content')

$( '#save' ).click ( function () {
  var TitleString = $( '#title' ).text()
  var TagString = $( '#tags' ).text()
  var ContentString = $( '#content' ).html()
  ipcRenderer.send('FileSave', [TitleString, TagString, ContentString])
  window.alert('Saved!')
} );
