'use strict'
var path = require('path')
var fs = require('fs')
const electron = require('electron')
var pjson = require('./package.json')
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
var file = app.getPath('userData') + '/testDatabase.ffdb'

if (!fs.existsSync(file)) {
    console.log("Creating DB file")
    fs.openSync(file, "w")
}
console.log("Database created at " + file)
console.log("file exists" + fs.existsSync(file))
//sql database
const sqlite3 = require('sqlite3').verbose()
//in memory for now
const db = new sqlite3.Database(file, sqlite3.OPEN_READWRITE, function (error) {
    console.log(error)
});
//uuid generator
const uuidV1 = require('uuid/v1')

    db.serialize(function() {
        //the main table
        db.run("CREATE TABLE IF NOT EXISTS MAINTABLE(ID CHAR(36), TYPE INTEGER(1))")
        //defs for main table
        //TYPE
        //1. block: 1
        //2. card: 2
        //3. flow: 3
        //4. speech: 4
        var maindefval = ["BLOCK", "CARD", "FLOW", "SPEECH"]
        db.run("CREATE TABLE IF NOT EXISTS MAINDEF(TYPE INTEGER(1), REALTYPE TEXT)")
        var maindef = db.prepare("INSERT INTO MAINDEF VALUES (?, ?)")
        for (var i = 1; i < 5; i++) {
            maindef.run(i, maindefval[i])
        }
        maindef.finalize()

        //defs for side table
        //SIDE
        //true: aff
        //false: neg
        //NULL: none
        var sidebools = [true, false, null]
        var sidedefval = ["AFF", "NEG", "NONE"]
        db.run("CREATE TABLE IF NOT EXISTS SIDEDEF(SIDE BOOLEAN, REALSIDE TEXT)")
        var sidedef = db.prepare("INSERT INTO SIDEDEF VALUES (?, ?)")
        for (var i = 0; i < 3; i++) {
            sidedef.run(sidebools[i], sidedefval[i])
        }
        sidedef.finalize()

        //the block table
        //db.run("CREATE TABLE IF NOT EXISTS BLOCKTABLE(ID CHAR(36), ARG TEXT, SIDE BOOLEAN)")

        //the card tag table
        db.run("CREATE TABLE IF NOT EXISTS CARDTAG(ID CHAR(36), TAG TEXT)")
        //card table
        db.run("CREATE TABLE IF NOT EXISTS CARDTABLE(ID CHAR(36), TAGLINE TEXT, CITATION TEXT, CONTENT TEXT, NOTES TEXT)")

        //the flow table
        //db.run("CREATE TABLE IF NOT EXISTS FLOWTABLE(ID CHAR(36), AFF TEXT, NEG TEXT)")

        //speech table
        db.run("CREATE TABLE IF NOT EXISTS SPEECHTABLE(ID CHAR(36), TITLECONTENT TEXT, FRAMEWORK TEXT, CONTENT TEXT, PREFLOW TEXT)")
    });

console.log(app.getPath('userData'))

const cardDb = new loki(app.getPath('userData') + '/mainDatabase.ffdb', {
    autoload: true,
    autoloadCallback: loadHandler,
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

function cardIndex(callback) {
        //tab index will return JSON in the form of a map of sTag:[CardTitles]
        /* example JSON
        {
          Aff: [card1, card2, card3],
          Pro: [card1, card22, card4]
        }
        */
    var dataJSON = {}
    db.each("SELECT TAG, TAGLINE FROM CARDTAG JOIN CARDTABLE USING (ID)", function(err, row) {
        if (dataJSON.hasOwnProperty(row.TAG)){
            dataJSON[row.TAG].push(row.TAGLINE)
        }
        else {
            dataJSON[row.TAG] = [row.TAGLINE]
        }
    }, function (err, numRows) {
        callback(dataJSON)
    })
}

function speechIndex(callback) {
    var dataJSON = {}
    db.each("SELECT SIDE, TITLECONTENT FROM SPEECHTABLE", function(err, row) {
        dataJSON.push([JSON.parse(row.TITLECONTENT).tagLine, row.SIDE])
    }, function (err, numRows) {
        callback(dataJSON)
    })
}

if(process.env.ENVIRONMENT === 'DEV'){
  require('electron-debug')({
      //showDevTools: true
  })
}


crashReporter.start({
  productName: 'FastFlow',
  companyName: 'FastFlowDebate',
  submitURL: 'http://FastFlowDebate.com',
  uploadToServer: false
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

app.on('ready', function () {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 728,
        titleBarStyle: 'hidden'
    })

    mainWindow.loadURL(`file://${__dirname}/app.html`)

    mainWindow.on('closed', function () {
        mainWindow = null
    })

    if (process.platform === 'darwin') {
        template = [{
            label: 'FastFlow',
            submenu: [{
                label: 'About FastFlow',
                selector: 'orderFrontStandardAboutPanel:'
            }, {
                type: 'separator'
            }, {
                label: 'Services',
                submenu: []
            }, {
                type: 'separator'
            }, {
                label: 'Hide FastFlow',
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
            submenu: [{
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
                    shell.openExternal('https://fastflowdebate.com')
                }
            }, {
                label: 'Documentation',
                click() {
                    shell.openExternal('https://github.com/FastFlowDebate/FastFlow/blob/master/README.md')
                }
            }, {
                label: 'Community Discussions',
                click() {
                    shell.openExternal('https://github.com/FastFlowDebate/FastFlow/issues')
                }
            }, {
                label: 'Search Issues',
                click() {
                    shell.openExternal('https://github.com/FastFlowDebate/FastFlow/issues')
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
                click() {
                    mainWindow.close()
                }
            }]
        }, {
            label: '&View',
            submenu: [{
                label: '&Reload',
                accelerator: 'Ctrl+R',
                click() {
                    mainWindow.reload()
                }
            }, {
                label: 'Toggle &Full Screen',
                accelerator: 'F11',
                click() {
                    mainWindow.setFullScreen(!mainWindow.isFullScreen())
                }
            }, {
                label: 'Toggle &Developer Tools',
                accelerator: 'Alt+Ctrl+I',
                click() {
                    mainWindow.toggleDevTools()
                }
            }]
        }, {
            label: 'Help',
            submenu: [{
                label: 'Learn More',
                click() {
                    shell.openExternal('http://fastflowdebate.com')
                }
            }, {
                label: 'Documentation',
                click() {
                    shell.openExternal('https://github.com/atom/electron/tree/master/docs#readme')
                }
            }, {
                label: 'Community Discussions',
                click() {
                    shell.openExternal('https://github.com/FastFlowDebate/FastFlow/issues')
                }
            }, {
                label: 'Search Issues',
                click() {
                    shell.openExternal('https://github.com/FastFlowDebate/FastFlow/issues')
                }
            }]
        }]
        menu = Menu.buildFromTemplate(template)
        mainWindow.setMenu(menu)
    }

    function addCard(cardTagline, cardTags, cardCitation, cardContent, cardNotes) {
        //If you are reading this code and cant figure out what this does, then you need to stop reading this code right now and
        //get a different profession. It legit says "addCard" cuz thats what it does
        /*
        {
            tagLine: cardTagline,
            sTags: cardTags,
            citation: cardCitation,
            content: cardContent,
            notes: cardNotes
        }
        */
        cardTags = JSON.parse(cardTags)
        console.log("cardTags")
        console.log(cardTags)
        var id = uuidV1()
        db.run("INSERT INTO MAINTABLE VALUES(?, ?)", [id, 2])
        db.run("INSERT INTO CARDTABLE VALUES(?, ?, ?, ?, ?)", [id, cardTagline, cardCitation, cardContent, cardNotes])
        for (var i = 0; i < cardTags.length; i++) {
            console.log(cardTags[i])
            db.run("INSERT INTO CARDTAG VALUES(?, ?)", [id, cardTags[i]])
        }
    }

    function addSpeech(speechTitleContent, speechFramework, speechContent, speechPreflow) {
        //If you are reading this code and cant figure out what this does, then you need to stop reading this code right now and
        //get a different profession. It legit says "addSpeech" cuz thats what it does
        db.run("INSERT INTO SPEECHTABLE VALUES(?, ?, ?, ?, ?, ?)", [uuidVi(), JSON.stringify(speechTitleContent), JSON.stringify(speechFramework), JSON.stringify(speechContent), JSON.stringify(speechPreflow)])
    }

    function deleteCard(cardName) {
        //Umm, its pretty obvious, it deletes a card, duh
        console.log(cardName)
        db.serialize(function() {
            var id
            console.log(id)
            db.get("SELECT ID FROM CARDTABLE WHERE TAGLINE = (?)", cardName, function(err, row) {
                id = row.ID
                db.run("DELETE FROM CARDTAG WHERE ID = (?)", id)
                db.run("DELETE FROM CARDTABLE WHERE ID = (?)", id)
            })
        })

    }

    function getCard(searchTerm, callback) {
        //ok, so this should be used to get cards from anything, but as you can see, its not, so maybe we'll integrate that to make it better
        var tags = []
        var card = {}
        db.serialize(function() {
            db.each("SELECT TAG FROM CARDTAG JOIN CARDTABLE USING (ID) WHERE TAGLINE = (?)", [searchTerm], function(err, row) {
                tags.push(row.TAG)
            })
            db.get("SELECT * FROM CARDTABLE WHERE TAGLINE = (?)", [searchTerm], function(err, row) {
            /*{
                tagLine: cardTagline,
                sTags: cardTags,
                citation: cardCitation,
                content: cardContent,
                notes: cardNotes
            }*/
            }, function (err, value) {
                  card["tagLine"] = value.TAGLINE
                  card["sTags"] = tags
                  card["citation"] = value.CITATION
                  card["content"] = value.CONTENT
                  card["notes"] = value.NOTES
                  callback(card)
              })

        })
    }

    function getCardsWithTag(searchTerm, callback) {
      //return name of all cards with tag
        console.log("getCardsWithTag")
        console.log(searchTerm)
        var cards = []
        db.each('SELECT * FROM CARDTAG JOIN CARDTABLE WHERE TAG = (?)', [searchTerm],
        function(err, row) {
            console.log(row)
            cards.push({
                "tagLine" : row.TAGLINE,
                "citation" : row.CITATION,
                "content" : row.CONTENT,
                "notes" : row.NOTES
            })
        }, function (err, value) {
            callback(cards)
        })
    }



    /* The rest of this is IPC stuff */
    ipcMain.on('Version', function(event) {
      event.returnValue = pjson.version
    })

    ipcMain.on('FileOpen', function(event, arg) {
        getCard(arg, function (dataJSON) {
            event.returnValue = dataJSON
        })
    })

    ipcMain.on('OpenCards', function(event, arg) {
        getCardsWithTag(arg, function(dataJSON) {
            event.returnValue = dataJSON
        })
    })

    ipcMain.on('SpeechOpen', function(event, arg) {
        var foundCard = getCard(cardDb, "speech", arg)
        if (foundCard[0]) {
            //console.log('opening: ' + foundCard)
            event.returnValue = JSON.stringify(foundCard[0])
        } else {
            event.returnValue = false
        }
    })

    ipcMain.on('FileRemove', function(event, arg) {
        //removeCard(db, cardName, cardTags, cardContent)
        deleteCard(arg)
    })

    ipcMain.on('SpeechRemove', function(event, arg) {
        var speechDB = cardDb.getCollection("speech");
        var temp = speechDB.where(function(obj) {
            return (obj.$loki == arg)
        })
        if (temp.length !== 0) {
            speechDB.removeWhere(function(obj) {
                return (obj.$loki == arg)
            })
        }
    })

    ipcMain.on('CardManager', function(event, arg) {
          cardIndex(function(dataJSON) {
            event.returnValue = dataJSON
          })
    })

    ipcMain.on('SpeechManager', function(event, arg) {
        speechIndex(function(dataJSON) {
            event.returnValue = dataJSON
        })
    })

    ipcMain.on('search', function(event, arg) {
        //not working right now
        var dataJSON = {
            speeches : speechIndex(cardDb),
            cards : cardIndex(cardDb)
        }
        console.log(dataJSON)
        event.returnValue = dataJSON
    })

    /* card saving */
    ipcMain.on('FileSave', function(event, arg) { // [TitleString, TagString, ContentString]
        var tagLine = arg.tagLine
        var sTags = arg.sTags
        var content = arg.content
        var notes = arg.notes
        var cite = arg.citation

        console.log("Adding card to database")
        addCard(tagLine, sTags, cite, content, notes)
    })

    /* speech saving */
    ipcMain.on('SpeechSave', function(event, arg) { // [TitleString, TagString, ContentString]
        var speechDB = cardDb.getCollection("speech")
        var tagLine = arg.tagLine
        var sTags = arg.sTags
        var content = arg.content
        var preflow = arg.preflow ? arg.preflow : {}
        var id = arg.id
        var temp = speechDB.where(function(obj) {
            return (obj.$loki == id)
        })

        if (temp.length !== 0) {
            speechDB.removeWhere(function(obj) {
                return (obj.$loki == id)
            })
        }
        addSpeech(cardDb, tagLine, sTags, content, preflow)
    })

})
