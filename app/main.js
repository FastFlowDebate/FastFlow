'use strict'
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

const loki = require("lokijs")
console.log(app.getPath('userData'))


const cardDb = new loki(app.getPath('userData') + '/mainDatabase.ffdb',
  {
    autoload: true,
    autoloadCallback : loadHandler,
    autosave: true,
    autosaveInterval: 1000,
  });

  function loadHandler() {
    var coll = cardDb.getCollection('cards');
    if (coll === null) {
      coll = cardDb.addCollection('cards');
    }
    var coll1 = cardDb.getCollection('speech');
    if (coll1 === null) {
      coll1 = cardDb.addCollection('speech');
    }
  }

  function tagindex (datab) {
    console.log('\n')
    console.log('starting indexing: ')
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
      sTags = JSON.parse(cards[card].sTags)      // turn sTags String into an array for transversal
      for (s in sTags) {                            // go through each sTag
        if(dict.hasOwnProperty(sTags[s]) && !dict[sTags[s]].includes(cards[card].tagLine)) {       // if the node already exists and tag is not already in node then
          console.log('Adding card ' + cards[card].tagLine +' to tag ' + sTags[s])
          dict[sTags[s]].push(cards[card].tagLine)                                                 // add the tag to the node
        } else {
          console.log('Adding card ' + cards[card].tagLine +' to newly created tag ' + sTags[s])
          dict[sTags[s]] = [cards[card].tagLine]                                                   // if the node does not already exist then create it and add tag
        }
      }
    }
    console.log(dict)
    console.log('\n')
    return dict;
  }

function speechindex (datab) {
  console.log('\n')
  console.log('starting indexing: ')
  //tab index will return JSON in the form of a map of sTag:[CardTitles]
  /* example JSON
  {
    Aff: [card1, card2, card3],
    Pro: [card1, card22, card4]
  }
  */
  var dict = {}
  var PFST = [] //Previously Found S Tags, to avoid needless transversal of dict
  var cards = datab.getCollection("speech").data;
  var card, s, sTags, content, tagline
  console.log(cards)
  for (card in cards) {                           //  go through each card
    sTags = cards[card].sTags
    content = cards[card].content
    tagline = cards[card].tagline

  }

  console.log(dict)
  console.log('\n')
  return dict;

}

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

  mainWindow.loadURL(`file://${__dirname}/app.html`)

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


  function uniq(a){
    //Im not walking through this, cuz honestly, i dont know what this does anymore, but it works, so be happy
      var prims = {"boolean":{}, "number":{}, "string":{}}, objs = [];

      return a.filter(function(item) {
          var type = typeof item;
          if(type in prims)
              return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
          else
              return objs.indexOf(item) >= 0 ? false : objs.push(item);
      });
    }

  function addCardToLoki(datab, cardTagline, cardTags, cardCitation, cardContent, cardNotes) {
     //If you are reading this code and cant figure out what this does, then you need to stop reading this code right now and
     //get a different profession. It legit says "addCardToLoki" cuz thats what it does
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

  function addCardToSpeech(datab, cardTagline, cardTags, cardContent) {
     //If you are reading this code and cant figure out what this does, then you need to stop reading this code right now and
     //get a different profession. It legit says "addCardToSpeech" cuz thats what it does
      var cards = datab.getCollection("speech")
    	console.log(cardTags)
    	cards.insert({
    		tagLine: cardTagline,
    		sTags: cardTags,
    		content: cardContent
    	})
    	datab.saveDatabase()
    }

  function deleteCard(datab, collection, cardName){
    //Umm, its pretty obvious, it deletes a card, duh
      var cards = datab.getCollection(collection);
      cards.removeWhere({'tagLine': {'$eq': cardName}})
    }

  function getCard(datab, collection, searchTerm){
    //ok, so this should be used to get cards from anything, but as you can see, its not, so maybe we'll integrate that to make it better
      var cards = datab.getCollection(collection);
      var cardNames = cards.find({'tagLine': {'$contains': searchTerm}});
      return cardNames;
    }


  function searchSimple(datab, collection, searchTerm){
    /*Okie dokie kids, this should work, I'm fairly confident, but if it doesnt, Uncle Pranav
     has a long day ahead of him or maybe a short day depending on what he wants to do with it idk*/
      var cards = datab.getCollection(collection);
      var returnListCards = []
      var cardTags = cards.find({'sTags': {'$contains': searchTerm}})
      var cardNames = cards.find({'tagLine': {'$contains': searchTerm}})
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

  /* The rest of this is IPC stuff */

    ipcMain.on('Search', function (event, arg) {
      console.log(arg)
      console.log("-----------")
      console.log(searchSimple(cardDb, "cards", arg))
      event.returnValue = searchSimple(cardDb, arg)
    })

    ipcMain.on('SearchSpeeches', function (event, arg) {
      console.log(arg)
      console.log("-----------")
      console.log(searchSimple(cardDb, "speech", arg))
      event.returnValue = searchSimple(cardDb,"speech", arg)
    })

    ipcMain.on('FileOpen', function (event, arg) {
      var foundCard = getCard(cardDb, "cards", arg)
      if(foundCard[0]){
        console.log('opening: ' + foundCard[0])
        event.returnValue = foundCard[0]
      } else {
        event.returnValue = false
      }
    })

    ipcMain.on('SpeechOpen', function (event, arg) {
      var foundCard = getCard(cardDb, "speech", arg)
      if(foundCard[0]){
        console.log('opening: ' + foundCard[0])
        event.returnValue = foundCard[0]
      } else {
        event.returnValue = false
      }
    })

    ipcMain.on('FileRemove', function (event, arg) {
      //removeCard(db, cardName, cardTags, cardContent)
      deleteCard(cardDb, "cards", arg)
      console.log("removing:")
      console.log(arg)
      console.log("---------------")
      //removeCard(cardDb, arg[0], arg[1], arg[2])
    })

    ipcMain.on('SpeechRemove', function (event, arg) {
      //removeCard(db, cardName, cardTags, cardContent)
      deleteCard(cardDb, "speech", arg)
      console.log("removing:")
      console.log(arg)
      console.log("---------------")
      //removeCard(cardDb, arg[0], arg[1], arg[2])
    })

    ipcMain.on('CardManager', function (event, arg) {
      var dataJSON = tagindex(cardDb)
      console.log(dataJSON)
      event.returnValue = dataJSON
    })

    ipcMain.on('SpeechManager', function (event, arg) {
      var dataJSON = speechindex(cardDb)
      event.returnValue = dataJSON
    })

    /* card saving */
    ipcMain.on('FileSave', function (event, arg) {
      console.log(arg)
      // [TitleString, TagString, ContentString]
      var cards = cardDb.getCollection("cards");
      var tagLine = arg.tagLine
      console.log(arg.sTags)
      var sTags = arg.sTags
      var content = arg.content
      var notes = arg.notes
      var cite = arg.citation
      var temp = cards.find({'tagLine' : tagLine})
      if (temp.length !== 0){
        cards.removeWhere({'tagLine' : TitleString})
      }
      addCardToLoki(cardDb, tagLine, sTags, cite, content, notes);
      tagindex(cardDb)
    })

    /* speech saving */
    ipcMain.on('SpeechSave', function (event, arg) {
      console.log(arg)
      // [TitleString, TagString, ContentString]
      var cards = cardDb.getCollection("speech");
      var tagLine = arg.tagLine
      var sTags = arg.sTags
      var content = arg.content
      var temp = cards.find({'tagLine' : tagLine})
      if (temp.length !== 0){
        cards.removeWhere({'tagLine' : TitleString})
      }
      addCardToSpeech(cardDb, tagLine, sTags, content);
      speechindex(cardDb);
    })

  })
