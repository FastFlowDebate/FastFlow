const ipcRenderer = require('electron').ipcRenderer

$(document).ready(function () {

  var theURI = window.location.search

  if (theURI.length > 0){
    var decodedURI = decodeURIComponent(theURI).substring(1)

    FileArray = ipcRenderer.sendSync('FileOpen', decodedURI)

    document.getElementById("title").innerHTML = FileArray[0]
    document.getElementById("tags").innerHTML = FileArray[1]
    document.getElementById("content").innerHTML = FileArray[2]

    }

})

function saveFunction() {
  var TitleString = $( "#title" ).text();
  var TagString = $( "#tags" ).text();
  var ContentString = $( "#content" ).html();
  ipcRenderer.send('FileSave', [TitleString, TagString, ContentString]);
  window.alert("Saved!");
}

EasyEditor.prototype.highlight = function(){
    var _this = this;
    var settings = {
        buttonIdentifier: 'highlight',
        buttonHtml: 'H',
        clickHandler: function(){
            _this.wrapSelectionWithNodeName({ style: 'background-color: #FFFF00', keepHtml: true });
        }
    };

    _this.injectButton(settings);
};

EasyEditor.prototype.underline = function(){
        var _this = this;
        var settings = {
            buttonIdentifier: 'underline',
            buttonHtml: 'U',
            clickHandler: function(){
                _this.wrapSelectionWithNodeName({ style:'text-decoration: underline;', keepHtml: true });
            }
        };

        _this.injectButton(settings);
    };


jQuery(document).ready(function($) {

    new EasyEditor('#content', {
            buttons: ['bold', 'italic', 'underline','highlight', 'x'],

  });
});
