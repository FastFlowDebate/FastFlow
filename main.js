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

function addCardToLoki(datab, cardTagline, cardTags, cardCitation, cardContent, cardNotes) {
	var cards = datab.getCollection("cards")
	console.log(cardTags)
	cards.insert({
		tagLine: cardTagline,
		sTags: cardTags,
		citation: cardCitation,
		content: cardContent,
		notes: cardNotes
	})
	datab.saveDatabase()
}
/**/
function removeCard(datab, cardTagline, cardTags, cardCitation, cardContent, CardNotes) {
	var cards = datab.getCollection("cards")
	cards.remove({
		tagLine: cardTagline,
		sTags: cardTags,
		citation: cardCitation,
		content: cardContent,
		notes: cardNotes
	})
	datab.saveDatabase()
}

function tagindex (datab) {
  //tab index will return JSON in the form of a map of sTag:[CardTitles]
  /* example JSON
  {
    Aff: [card1, card2, card3],
    Pro: [card1, card22, card4]
  }
  */
  var dict = {}
  var PFST = [] //Previously Found S Tags, to avoid needless transversal of dict
  var cards = datab.getCollection("cards").data;
  var card, s, sTags
  for (card in cards) {                           //  go through each card
    sTags = JSON.parse(cards[card].sTags)         // turn sTags String into an array for transversal
    for (s in sTags) {                            // go through each sTag
      if(dict.hasOwnProperty(sTags[s]) && !dict[sTags[s].includes(cards[card].tagLine)]) {       // if the node already exists and tag is not already in node then
        console.log('Adding card ' + cards[card].tagLine +' to tag ' + sTags[s])
        dict[sTags[s]].push(cards[card].tagLine)                                                 // add the tag to the node
      } else {
        console.log('Adding card ' + cards[card].tagLine +' to newly created tag ' + sTags[s])
        dict[sTags[s]] = [cards[card].tagLine]                                                   // if the node does not already exist then create it and add tag
      }
    }
  }
  console.log(dict)

  return dict;
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
  cards.removeWhere({'tagLine': {'$eq': cardName}})
}

function getCard(datab, searchTerm){
  var cards = datab.getCollection("cards");
  var cardNames = cards.find({'tagLine': {'$contains': searchTerm}});
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
    var foundCard = cards.find({'tagLine' : arg})
    if(foundCard[0]){
      console.log('opening: ' + foundCard[0])
      event.returnValue = foundCard[0]
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
    var tagLine = arg.tagLine
    var sTags = arg.sTags
    var content = arg.content
    var notes = arg.notes
    var cite = arg.citation
    var temp = cards.find({'tagLine' : tagLine})
    if (temp.length !== 0){
      cards.removeWhere({'tagLine' : TitleString})
    }
    addCardToLoki(db, tagLine, sTags, cite, content, notes);
    tagindex(db)
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
