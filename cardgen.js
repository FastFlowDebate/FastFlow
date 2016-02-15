const loki = require("lokijs")
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const db = new loki('mainDatabase.fcdb',
  {
    autoload: true,
    autosave: true,
    autosaveInterval: 10000,
  });

function addCardToLoki(db, cardName, cardTags, cardContent){
  var cards = db.getCollection("cards");
  cards.insert({
    name:cardName,
    tags:cardTags,
    content:cardContent
  });

  db.saveDatabase();
}

function save(TitleString, TagString, ContentString){
  var cards = db.getCollection("cards");

  var TagString = TagString.split(",")
  var temp = cards.find({'name' : TitleString})
  if (temp.length == 0){
    addCardToLoki(db, TitleString, TagString, ContentString);
    tagindex(db)
  }else{
      cards.removeWhere({'name' : TitleString})
      addCardToLoki(db, TitleString, TagString, ContentString);
      tagindex(db)
  }
}

function tagindex (db) {
  /* tagindexing */
  var cards = db.getCollection("cards");
  var tagArray = {};
  var tag;
  var tags;
  var tempTagList;
  var card;
  var names = [];
  for(tags in cards.data){
      tempTagList = cards.data[tags].tags;
      for(tag in tempTagList){
        var names = [];
        for(card in cards.data){
          if (cards.data[card].tags.indexOf(tempTagList[tag]) != -1){
            names.push(cards.data[card].name)
          }
        }
        tagArray[tempTagList[tag]] = names;
      }
  }
  var keys = Object.keys(tagArray)

  var values = []

  for (var i = 0; i < keys.length; i++) {
    values.push(tagArray[keys[i]])
  }

  var ReturnValue = [keys, values]
  return ReturnValue;
}

rl.question('iterations', (answer) => {
  console.log(answer)

  for (i = 0; i < parseInt(answer); i++){



    for (j = 0; j < 10; j++){
      var CardContent = "memetest" + String(i) + "_" + String(j)
      var CardTags = "CardTag" + String(i)
      var CardName = "CardName" + String(i) + "_" + String(j)
      save(CardName, CardTags, CardContent)

      console.log(CardName)
      console.log(CardTags)
      console.log(CardContent)
      console.log("---------------")
    }

  }

});
