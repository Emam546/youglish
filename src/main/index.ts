import './pre-start'
import './helpers/ipcMain'
import './updater'
import { app } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { createMainWindow } from './lib/main'
import { lunchArgs } from './helpers/launchHelpers'
import path from 'path'
import { MainWindow } from './lib/main/window'
import autoUpdater from './updater'

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('youtglish', process.execPath, [
      path.resolve(process.argv[1])
    ])
  }
} else app.setAsDefaultProtocolClient('youtglish')
async function createWindow(args: string[]) {
  const data = lunchArgs(args)
  return await createMainWindow({}, data ? data : undefined)
}
if (!app.isPackaged) {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  await createWindow(process.argv)
})
const gotSingleInstanceLock = app.requestSingleInstanceLock()
if (!gotSingleInstanceLock) app.quit()
else
  app.on('second-instance', (_, argv) => {
    //User requested a second instance of the app.
    //argv has the process.argv arguments of the second instance.
    if (!app.hasSingleInstanceLock()) return
    if (MainWindow.Window) {
      if (MainWindow.Window.isMinimized()) MainWindow.Window.restore()
      MainWindow.Window.focus()
      console.log(argv)
      if (process.platform.startsWith('win') && argv.length >= 2) {
        const data = lunchArgs(argv)
        if (data) MainWindow.Window.webContents.send('open-file', data)
      }
    } else if (!autoUpdater.hasUpdate) createWindow(argv)
  })
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
export default app
