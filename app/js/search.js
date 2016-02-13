function searchFunction() {
  var div = document.getElementById('searchResults');
  while(div.firstChild){
      div.removeChild(div.firstChild);
  }

  var Text = document.getElementById('sidebarinput').value
  var SearchedText = ipcRenderer.sendSync('Search', Text)
  if (SearchedText == ""){
    SearchedText = ["No Matches"]
  }

  var theDiv = document.createElement("DIV")

  for (i = 0; i < SearchedText.length; i++) {
    var theLI = document.createElement("LI");
    var link = document.createElement("A")

    link.href = "cardEditor.html?" + encodeURIComponent(SearchedText[i])

    text = document.createTextNode(SearchedText[i])
    link.appendChild(text)

    theLI.appendChild(link)

    theDiv.appendChild(theLI)

  }
  document.getElementById("searchResults").appendChild(theDiv)
}
