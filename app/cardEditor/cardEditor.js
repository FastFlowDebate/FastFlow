const ipcRenderer = require('electron').ipcRenderer

angular.module('ngFastFlow', []).controller('ngCardEditorController', ['$scope', '$sce', function ($scope, $sce) {
  $scope.saveCard = saveCard
  $scope.deleteCard = deleteCard
  $scope.shareCard = shareCard

  $scope.title = 'Untitled Card'
  $scope.tags = 'tag1, tag2, tag3'
  $scope.content = 'content is loading'
  $scope.showSave = false

  $(document).ready(function () {
    var theURI = window.location.search

    if (theURI.length > 0) {
      var decodedURI = decodeURIComponent(theURI).substring(1).split('\\')
      var FileArray = ipcRenderer.sendSync('FileOpen', decodedURI[decodedURI.length - 1])

      $scope.title = FileArray[0]
      $scope.tags = FileArray[1]
      $scope.content = $sce.trustAsHtml(FileArray[2])
      $scope.$apply()
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
    var editor = AlloyEditor.editable('content', {
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

  function saveCard () {
    ipcRenderer.send('FileSave', [$scope.title, $scope.tags, $scope.content])
    window.alert('Saved!')
  }

  function deleteCard () {
  // TODO: deletion code
  }

  function shareCard () {
  // TODO: deletion code, redirects to filemanager
  }
}])
