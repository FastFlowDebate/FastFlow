'use strict'

const loki = require("lokijs")
const db = new loki('mainDatabase.ffdb',
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

function addCardToLoki(db, cardName, cardTags, cardContent){
  var cards = db.getCollection("cards");
  cards.insert({
    name:cardName,
    tags:cardTags,
    content:cardContent
  });

  db.saveDatabase();
}
/**/
function removeCard(db, cardName, cardTags, cardContent){
  var cards = db.getCollection("cards");
  cards.remove({
    name:cardName,
    tags:cardTags,
    content:cardContent
  });

  db.saveDatabase();
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
      tempTagList = cards.data[tags].tags.split(" ");
      for(tag in tempTagList){
        var names = [];
        for(card in cards.data){
          if (cards.data[card].tags.split(" ").indexOf(tempTagList[tag]) != -1){
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

  if (process.env.HOT) {
    mainWindow.loadURL(`file://${__dirname}/app/hot-dev-app.html`)
  } else {
    mainWindow.loadURL(`file://${__dirname}/app/app.html`)
  }

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

  function searchSimple(db, searchTerm){
    var cards = db.getCollection("cards");
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
    var cards = db.getCollection("cards");
    var FileArray = arg
    var foundCard = cards.find({'name' : arg})
    var Title = foundCard[0].name
    var Tags = foundCard[0].tags.split(" ")
    var Content = foundCard[0].content
    var TheArray = [Title, Tags, Content]
    event.returnValue = TheArray

  })
  ipcMain.on('FileRemove', function (event, arg) {

    //removeCard(db, cardName, cardTags, cardContent)
    console.log("removing:")
    console.log(arg)
    console.log("---------------")
    //removeCard(db, arg[0], arg[1], arg[2])
  })

  ipcMain.on('FileManager', function (event, arg) {
    var dataJSON = tagindex(db)
    event.returnValue = dataJSON
  })

  /* card saving */
  ipcMain.on('FileSave', function (event, arg) {
    console.log(arg)
    // [TitleString, TagString, ContentString]
    var cards = db.getCollection("cards");
    var TitleString = arg[0]
    var TagString = arg[1].replace(",", " ")
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
