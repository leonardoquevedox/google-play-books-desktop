const path = require('path')
const _ = require('lodash')
const electron = require('electron')
const config = require('./config')

// Module to control application lifecycle.
const { app } = electron
// Module to create native browser window.
const { BrowserWindow } = electron

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

const createWindow = () => {
  const windowState = config.get('windowState')
  // Create the browser window.
  mainWindow = new BrowserWindow({
    x: windowState.x,
    y: windowState.y,
    width: windowState.width,
    height: windowState.height,
    minWidth: 890,
    minHeight: 600,
    icon: path.join(__dirname, '..', '..', 'play-books.png'),
  })

  mainWindow.setTitle('Bandlab')
  const initialUrl = config.get('lastUrl')
  console.log(`initial url: ${initialUrl}`)
  mainWindow.loadURL(initialUrl)

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  mainWindow.on(
    'resize',
    _.debounce(() => {
      if (!mainWindow.isFullScreen()) {
        config.set('windowState', mainWindow.getBounds())
      }
    }, 200),
  )
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
