var path = require('path')
var fs = require('fs')
/*
var arg = ["TitleString", "TagString", "ContentString"]
console.log(arg)
//[TitleString, TagString, ContentString]
var TitleString = arg[0]
var TagString = arg[1]
var ContentString = arg[2]

var FilePath = path.join(__dirname, "documents", TitleString)

var stream = fs.createWriteStream(FilePath)

if (FilePath.existsSync == true){
  fs.unlinkSync(FilePath)
}

stream.once('open', function(fd) {
  stream.write("<!--" + TagString + "-->\n")
  stream.write(ContentString)
  stream.end()
});
*/
var tagFilePath = path.join(__dirname, "documents")

/*tagindexing*/
var TagArray = {}

var DocumentArray = fs.readdirSync(tagFilePath)

for (var i = 0; i < DocumentArray.length; i++) {
  if (DocumentArray[i] != "data.json") {

    var Lines = fs.readFileSync(path.join(tagFilePath, DocumentArray[i])).toString().split('\n')

    if (Lines[0].substring(0, 4) == "<!--") {
      var TheTag = Lines[0].slice(4,Lines[0].length - 3)
      console.log("TAG: " + TheTag)
    }

    var TagList = TheTag.split(", ")

    for (var j = 0; j < TagList.length; j++){

      if (TagList[j] in TagArray){
        console.log("THEPART: " + TagList[j])
        console.log(TagArray[TagList[j]])
        TagArray[TagList[j]].push(path.join(tagFilePath, DocumentArray[i]))
      }
      else {
        console.log("TAGLIST:" + TagList[j])
        TagArray[TagList[j]] = [path.join(tagFilePath, DocumentArray[i])]
        console.log("THETHING: " + TagArray[TagList[j]])

      }

    }

  }
}

console.log(TagArray)

if (fs.existsSync(path.join(tagFilePath, "data.json")) == true){
fs.unlinkSync(path.join(tagFilePath, "data.json"))
}
var stream = fs.createWriteStream(path.join(tagFilePath, "data.json"))
stream.once('open', function(fd) {
stream.write(String(TagArray))
stream.end()
});
