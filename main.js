/* eslint strict: 0 */
'use strict'

var path = require('path')
var fs = require('fs')

var PythonShell = require('python-shell')
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
});

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
    var FileArray = fs.readFileSync(path.join(__dirname, arg)).toString().split('\n');
    console.log(FileArray)
    console.log("BREAK BREAK BREAK")

    if (FileArray[0].substring(0, 4) == "<!--"){
      var Title = path.basename(arg)
      console.log(Title)
      console.log("BREAK BREAK BREAK")

      var Tags = FileArray[0].slice(4,FileArray[0].length - 3)
      console.log(Tags)
      console.log("BREAK BREAK BREAK")

      var Content = FileArray[1]
      console.log(Content)
      console.log("BREAK BREAK BREAK")

      var TheArray = [Title, Tags, Content]
      console.log(TheArray)
      console.log("BREAK BREAK BREAK")

      event.returnValue = TheArray;
    }

  })

  ipcMain.on('FileManager', function (event, arg) {
    var unparseddataJSON =  fs.readFileSync(path.join(__dirname, 'testfolder', 'data.json'))
    var dataJSON = JSON.parse(unparseddataJSON)

    console.log(arg)
    console.log(dataJSON)

    event.returnValue = dataJSON

  })

  /*saving*/
  ipcMain.on('FileSave', function (event, arg) {

    if (fs.existsSync('./backend')) {
      var fileDirectory = './backend/filesave.py'
      var indexFolder = './backend/tagindex.py'
      var TestFolder = './testfolder'
    } else if (fs.existsSync('./resources/app/backend')) {
      var fileDirectory = './resources/app/backend/filesave.py'
      var indexFolder = './resources/app/backend/tagindex.py'
      var TestFolder = './resources/app/testfolder'
    } else {
      var fileDirectory = './Contents/Resources/app/backend/filesave.py'
      var indexFolder = './Contents/Resources/app/backend/tagindex.py'
      var TestFolder = './Contents/Resources/app/testfolder'
    }

    console.log(arg)

    var filesavepy = new PythonShell(fileDirectory)
    console.log(fileDirectory)

    console.log('BREAK BREAK BREAK')

    var indexShell = new PythonShell(indexFolder)
    console.log(indexFolder)

    console.log('BREAK BREAK BREAK')


    var tags
    var content
    var location
    var filename

    function filesave (tags, content, location, filename) {
      filesavepy.send(tags)
      console.log(tags)
      // content
      filesavepy.send(content)
      console.log(content)
      // folder location
      filesavepy.send(location)
      console.log(location)
      // filename
      filesavepy.send(filename)
      console.log(filename)

      indexShell.send(location)
      console.log(location)

      indexShell.send(location)
      console.log(location)
      // indexShell.send(location);
    }

    filesave(arg[1], arg[2], TestFolder, arg[0])

    filesavepy.end(function (err) {
      if (err) throw err
      console.log('finished')
    })
    indexShell.end(function (err) {
      if (err) throw err
      console.log('finished')
    })

    // end the input stream and allow the process to exit
  })
})
