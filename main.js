'use strict'

const loki = require("lokijs")

const db = new loki('mainDatabase.ffdb',
  {
    autoload: true,
    autoloadCallback : loadHandler,
    autosave: true,
    autosaveInterval: 10000,
  });

  const db2 = new loki('flowDB.ffdb',
    {
      autoload: true,
      autoloadCallback : loadHandler,
      autosave: true,
      autosaveInterval: 10000,
    });

function loadHandler() {
  var coll = db.getCollection('cards');
  if (coll === null) {
    coll = db.addCollection('cards');
  }
}

function addCardToLoki(datab, cardName, cardTags, cardContent){
  var cards = datab.getCollection("cards");
  console.log(cardTags);
  cards.insert({
    name:cardName,
    tags:cardTags,
    content:cardContent
  });

  datab.saveDatabase();
}
/**/
function removeCard(datab, cardName, cardTags, cardContent){
  var cards = datab.getCollection("cards");
  cards.remove({
    name:cardName,
    tags:cardTags,
    content:cardContent
  });

  datab.saveDatabase();
}

function tagindex (datab) {
  /* tagindexing */
  var cards = datab.getCollection("cards");
  var tagArray = {};
  var tag;
  var tags;
  var tempTagList;
  var card;
  var a;
  var names = [];
  for(tags in cards.data){
    if(typeof cards.data[tags].tags === "string") {
      tempTagList = cards.data[tags].tags.split(" ")
    } else {
      tempTagList = cards.data[tags].tags[0].split(" ")
    }
    for(tag in tempTagList){
      var names = [];
      for(card in cards.data){
        //handle arrays of tags
        if(typeof cards.data[card].tags !== "string") {
          for(a in cards.data[card].tags) {
            if (a.indexOf(tempTagList[tag]) != -1){
              names.push(cards.data[card].name)
            }
          }
        } else if (cards.data[card].tags.split(" ").indexOf(tempTagList[tag]) != -1){
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


function flowindex (datab) {
  /* flowindexing */
  var cards = datab.getCollection("cards");
  var flowArray = [];
  var flows;
  var card;
  for(flows in cards.data){
    flowArray.push([flows["name"], flows["content"]])
  }
  console.log(flowArray)
  return flowArray;
}


var path = require('path')
var fs = require('fs')
const Regex = require("regex");
const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const crashReporter = electron.crashReporter
const shell = electron.shell
const ipcMain = require('electron').ipcMain
let menu
let template
let mainWindow = null

crashReporter.start()

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')()
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

require('electron-debug')({
  showDevTools: true
})

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 728
  })

  mainWindow.loadURL(`file://${__dirname}/app/app.html`)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.openDevTools()
  }

  if (process.platform === 'darwin') {
    template = [{
      label: 'Electron',
      submenu: [{
        label: 'About ElectronReact',
        selector: 'orderFrontStandardAboutPanel:'
      }, {
        type: 'separator'
      }, {
        label: 'Services',
        submenu: []
      }, {
        type: 'separator'
      }, {
        label: 'Hide ElectronReact',
        accelerator: 'Command+H',
        selector: 'hide:'
      }, {
        label: 'Hide Others',
        accelerator: 'Command+Shift+H',
        selector: 'hideOtherApplications:'
      }, {
        label: 'Show All',
        selector: 'unhideAllApplications:'
      }, {
        type: 'separator'
      }, {
        label: 'Quit',
        accelerator: 'Command+Q',
        click() {
          app.quit()
        }
      }]
    }, {
      label: 'Edit',
      submenu: [{
        label: 'Undo',
        accelerator: 'Command+Z',
        selector: 'undo:'
      }, {
        label: 'Redo',
        accelerator: 'Shift+Command+Z',
        selector: 'redo:'
      }, {
        type: 'separator'
      }, {
        label: 'Cut',
        accelerator: 'Command+X',
        selector: 'cut:'
      }, {
        label: 'Copy',
        accelerator: 'Command+C',
        selector: 'copy:'
      }, {
        label: 'Paste',
        accelerator: 'Command+V',
        selector: 'paste:'
      }, {
        label: 'Select All',
        accelerator: 'Command+A',
        selector: 'selectAll:'
      }]
    }, {
      label: 'View',
      submenu: (process.env.NODE_ENV === 'development') ? [{
        label: 'Reload',
        accelerator: 'Command+R',
        click() {
          mainWindow.restart()
        }
      }, {
        label: 'Toggle Full Screen',
        accelerator: 'Ctrl+Command+F',
        click() {
          mainWindow.setFullScreen(!mainWindow.isFullScreen())
        }
      }, {
        label: 'Toggle Developer Tools',
        accelerator: 'Alt+Command+I',
        click() {
          mainWindow.toggleDevTools()
        }
      }] : [{
        label: 'Toggle Full Screen',
        accelerator: 'Ctrl+Command+F',
        click() {
          mainWindow.setFullScreen(!mainWindow.isFullScreen())
        }
      }]
    }, {
      label: 'Window',
      submenu: [{
        label: 'Minimize',
        accelerator: 'Command+M',
        selector: 'performMiniaturize:'
      }, {
        label: 'Close',
        accelerator: 'Command+W',
        selector: 'performClose:'
      }, {
        type: 'separator'
      }, {
        label: 'Bring All to Front',
        selector: 'arrangeInFront:'
      }]
    }, {
      label: 'Help',
      submenu: [{
        label: 'Learn More',
        click() {
          shell.openExternal('http://electron.atom.io')
        }
      }, {
        label: 'Documentation',
        click() {
          shell.openExternal('https://github.com/atom/electron/tree/master/docs#readme')
        }
      }, {
        label: 'Community Discussions',
        click() {
          shell.openExternal('https://discuss.atom.io/c/electron')
        }
      }, {
        label: 'Search Issues',
        click() {
          shell.openExternal('https://github.com/atom/electron/issues')
        }
      }]
    }]

    menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
  } else {
    template = [{
      label: '&File',
      submenu: [{
        label: '&Open',
        accelerator: 'Ctrl+O'
      }, {
        label: '&Close',
        accelerator: 'Ctrl+W',
        click () {
          mainWindow.close()
        }
      }]
    }, {
      label: '&View',
      submenu: (process.env.NODE_ENV === 'development') ? [{
        label: '&Reload',
        accelerator: 'Ctrl+R',
        click () {
          mainWindow.reload()
        }
      }, {
        label: 'Toggle &Full Screen',
        accelerator: 'F11',
        click () {
          mainWindow.setFullScreen(!mainWindow.isFullScreen())
        }
      }, {
        label: 'Toggle &Developer Tools',
        accelerator: 'Alt+Ctrl+I',
        click () {
          mainWindow.toggleDevTools()
        }
      }] : [{
        label: 'Toggle &Full Screen',
        accelerator: 'F11',
        click () {
          mainWindow.setFullScreen(!mainWindow.isFullScreen())
        }
      }]
    }, {
      label: 'Help',
      submenu: [{
        label: 'Learn More',
        click () {
          shell.openExternal('http://electron.atom.io')
        }
      }, {
        label: 'Documentation',
        click () {
          shell.openExternal('https://github.com/atom/electron/tree/master/docs#readme')
        }
      }, {
        label: 'Community Discussions',
        click () {
          shell.openExternal('https://discuss.atom.io/c/electron')
        }
      }, {
        label: 'Search Issues',
        click () {
          shell.openExternal('https://github.com/atom/electron/issues')
        }
      }]
    }]
    menu = Menu.buildFromTemplate(template)
    mainWindow.setMenu(menu)
  }

  function uniq(a) {
    var prims = {"boolean":{}, "number":{}, "string":{}}, objs = [];

    return a.filter(function(item) {
        var type = typeof item;
        if(type in prims)
            return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
        else
            return objs.indexOf(item) >= 0 ? false : objs.push(item);
    });
  }

function deleteCard(datab, cardName){
  var cards = datab.getCollection("cards");
  cards.removeWhere({'name': {'$eq': cardName}})
}

function getCard(datab, searchTerm){
  var cards = datab.getCollection("cards");
  var cardNames = cards.find({'name': {'$contains': searchTerm}});
  return cardNames;
}


  function searchSimple(datab, searchTerm){
    var cards = datab.getCollection("cards");
    var returnListCards = []
    var cardTags = cards.find({'tags': {'$contains': searchTerm}})
    var cardNames = cards.find({'name': {'$contains': searchTerm}})
    var temp1 = 0;
    var temp2 = 0;

    if(cardTags != []){
      for (temp1 in cardTags){
        returnListCards.push(cardTags[temp1].name)
      }
    }

    if(cardNames != []){
      for (temp2 in cardNames){
        returnListCards.push(cardNames[temp2].name)
      }
    }
    return uniq(returnListCards)
  }



  ipcMain.on('Search', function (event, arg) {
    console.log(arg)
    console.log("-----------")
    console.log(searchSimple(db, arg))
    event.returnValue = searchSimple(db, arg)
  })

  ipcMain.on('FileOpen', function (event, arg) {
    var cards = db.getCollection("cards")
    var foundCard = cards.find({'name' : arg})
    if(foundCard[0]){
      var Title = foundCard[0].name
      var Tags = foundCard[0].tags.split(" ")
      var Content = foundCard[0].content
      var TheArray = [Title, Tags, Content]
      event.returnValue = TheArray
    } else {
      event.returnValue = false
    }
  })

  ipcMain.on('FlowOpen', function (event, arg) {
    var cards = db2.getCollection("cards");
    var FileArray = arg
    var foundCard = cards.find({'name' : arg})
    var Title = foundCard[0].name
    var Tags = ""
    var Content = foundCard[0].content
    var TheArray = [Title, Tags, Content]
    console.log('array: ' + TheArray)
    event.returnValue = TheArray

  })

  ipcMain.on('FileRemove', function (event, arg) {

    //removeCard(db, cardName, cardTags, cardContent)
    deleteCard(db, arg)
    console.log("removing:")
    console.log(arg)
    console.log("---------------")
    //removeCard(db, arg[0], arg[1], arg[2])
  })

  ipcMain.on('FlowRemove', function (event, arg) {

    //removeCard(db, cardName, cardTags, cardContent)
    deleteCard(db2, arg)
    console.log("removing:")
    console.log(arg)
    console.log("---------------")
    //removeCard(db, arg[0], arg[1], arg[2])
  })

  ipcMain.on('CardManager', function (event, arg) {
    var dataJSON = tagindex(db)
    event.returnValue = dataJSON
  })

  /* card saving */
  ipcMain.on('FileSave', function (event, arg) {
    console.log(arg)
    // [TitleString, TagString, ContentString]
    var cards = db.getCollection("cards");
    var TitleString = arg[0]
    var TagString = arg[1]
    while(TagString.indexOf(", ")  !=  -1){
      TagString = TagString.replace(", ", " ")
    }
    while(TagString.indexOf(",")  !=  -1){
      TagString = TagString.replace(",", " ")
    }
    var ContentString = arg[2]
    var temp = cards.find({'name' : TitleString})
    if (temp.length == 0){
      addCardToLoki(db, TitleString, TagString, ContentString);
      tagindex(db)
    }else{
        cards.removeWhere({'name' : TitleString})
        addCardToLoki(db, TitleString, TagString, ContentString);
        tagindex(db)
    }
  })
})

ipcMain.on('FlowSave', function (event, arg) {
  console.log(arg)
  // [TitleString, TagString, ContentString]
  var cards = db2.getCollection("cards");
  var TitleString = arg[0]
  var TagString = "";
  var ContentString = arg[2]
  var temp = cards.find({'name' : TitleString})
  if (temp.length == 0){
    addCardToLoki(db2, TitleString, TagString, ContentString);
  }else{
    console.log("hello")
      cards.removeWhere({'name' : TitleString})
      addCardToLoki(db2, TitleString, TagString, ContentString);
  }
})
