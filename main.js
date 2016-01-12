/* eslint strict: 0 */
'use strict'
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'Pranav100'
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});


var path = require('path')
var fs = require('fs')

// var PythonShell = require('python-shell')
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

  // calls tagindex on start
  // we might have to work on this function a little bit so that it does not
  //take too long to index all of this stuff

  tagindex()


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
        click () {
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
        click () {
          mainWindow.restart()
        }
      }, {
        label: 'Toggle Full Screen',
        accelerator: 'Ctrl+Command+F',
        click () {
          mainWindow.setFullScreen(!mainWindow.isFullScreen())
        }
      }, {
        label: 'Toggle Developer Tools',
        accelerator: 'Alt+Command+I',
        click () {
          mainWindow.toggleDevTools()
        }
      }] : [{
        label: 'Toggle Full Screen',
        accelerator: 'Ctrl+Command+F',
        click () {
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
          mainWindow.restart()
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

  ipcMain.on('FileOpen', function (event, arg) {
    var FileArray = fs.readFileSync(arg).toString().split('\n')
    console.log(FileArray)

    if (FileArray[0].substring(0, 4) === '<!--') {
      var Title = path.basename(arg)
      console.log(Title)

      var Tags = FileArray[0].slice(4, FileArray[0].length - 3)
      console.log(Tags)

      var Content = FileArray[1]
      console.log(Content)

      var TheArray = [Title, Tags, Content]
      console.log(TheArray)

      event.returnValue = TheArray
    }
  })

  function tagindex () {
    /* tagindexing */
    var tagFilePath = path.join(__dirname, 'documents')

    var TagArray = {}

    var DocumentArray = fs.readdirSync(tagFilePath)

    for (var i = 0; i < DocumentArray.length; i++) {
      if (DocumentArray[i] !== 'data.json') {
        var Lines = fs.readFileSync(path.join(tagFilePath, DocumentArray[i])).toString().split('\n')

        if (Lines[0].substring(0, 4) === '<!--') {
          var TheTag = Lines[0].slice(4, Lines[0].length - 3)
          console.log('TAG: ' + TheTag)
        }

        var TagList = TheTag.split(', ')

        for (var j = 0; j < TagList.length; j++) {
          if (TagList[j] in TagArray) {
            console.log('THEPART: ' + TagList[j])
            console.log(TagArray[TagList[j]])
            TagArray[TagList[j]].push(path.join(tagFilePath, DocumentArray[i]))
          }
          else {
            console.log('TAGLIST:' + TagList[j])
            TagArray[TagList[j]] = [path.join(tagFilePath, DocumentArray[i])]
            console.log('THETHING: ' + TagArray[TagList[j]]) }
        }
      }
    }

    console.log(TagArray)
    var keys = Object.keys(TagArray)

    var values = []

    for (var i = 0; i < keys.length; i++) {
      values.push(TagArray[keys[i]])
    }

    var ReturnValue = [keys, values]
    console.log('BREAK BREAK BREAK')
    console.log(ReturnValue)


    if (fs.existsSync(path.join(tagFilePath, 'data.json')) === true) {
      fs.unlinkSync(path.join(tagFilePath, 'data.json'))
    }
    var tagstream = fs.createWriteStream(path.join(tagFilePath, 'data.json'))
      tagstream.once('open', function (fd) {
      tagstream.write(JSON.stringify(ReturnValue))
      tagstream.end()
    })
  }

  ipcMain.on('FileManager', function (event, arg) {
    var unparseddataJSON =  fs.readFileSync(path.join(__dirname, 'documents', 'data.json'))
    var dataJSON = JSON.parse(unparseddataJSON)

    console.log(arg)
    console.log(dataJSON)

    event.returnValue = dataJSON

  })


  /*saving*/
  ipcMain.on('FileSave', function (event, arg) {
    console.log(arg)
    //[TitleString, TagString, ContentString]
    var TitleString = arg[0]
    var TagString = arg[1]
    var ContentString = arg[2]

    var FilePath = path.join(__dirname, 'documents', TitleString)

    var stream = fs.createWriteStream(FilePath)

    if (FilePath.existsSync === true) {
      fs.unlinkSync(FilePath)
    }

    stream.once('open', function (fd) {
      stream.write('<!--' + TagString + '-->\n')
      stream.write(ContentString)
      stream.end()

      tagindex()
    })

  })

})
