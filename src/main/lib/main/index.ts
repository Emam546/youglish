import './ipc'
import { shell, BrowserWindowConstructorOptions, globalShortcut, WebContentsView } from 'electron'
import path, { join } from 'path'
import { convertFunc } from '@utils/app'
import { Context } from '@shared/renderer/main'
import { MainWindow } from './window'
import fetch from 'cross-fetch'
import { ElectronBlocker, fullLists } from '@cliqz/adblocker-electron'
import { isDev } from '@app/main/utils'
export async function createMainWindow(
  options: BrowserWindowConstructorOptions,
  preloadData?: Context
) {
  const blocker = await ElectronBlocker.fromLists(fetch, fullLists)
  // Create the browser window.
  const win = new MainWindow({
    show: false,
    autoHideMenuBar: true,
    icon: 'build/icon.ico',
    frame: false,
    ...options,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,

      additionalArguments: [
        convertFunc(encodeURIComponent(JSON.stringify(preloadData || null)), 'data')
      ],
      ...options.webPreferences
    }
  })
  blocker.enableBlockingInSession(win.webContents.session)
  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  // Create titlebar view
  // Create titlebar view

  const titlebarView = new WebContentsView({
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'), // optional
      sandbox: false,
      additionalArguments: [
        convertFunc(encodeURIComponent(JSON.stringify(preloadData || null)), 'data')
      ]
    }
  })
  win.contentView.addChildView(titlebarView)
  titlebarView.setBounds({ x: 0, y: 0, width: 1200, height: 30 })

  // Create web content view for external site
  const webView = new WebContentsView()
  win.contentView.addChildView(webView)
  webView.setBounds({ x: 0, y: titlebarView.getBounds().height, width: 1200, height: 760 })

  // webView.setAutoResize({ width: true, height: true })
  await webView.webContents.loadURL('https://youglish.com/')
  webView.webContents.on('did-fail-load', async () => {
    if (isDev) {
      await webView.webContents.loadURL(
        `${process.env['ELECTRON_RENDERER_URL'] as string}/404.html`
      )
    } else await webView.webContents.loadFile(path.join(__dirname, '../windows/404.html'))
  })
  win.on('resize', () => {
    const bounds = win.getContentBounds()
    webView.setBounds({
      x: 0,
      y: titlebarView.getBounds().height,
      width: bounds.width,
      height: bounds.height - titlebarView.getBounds().height
    })
    titlebarView.setBounds({
      x: 0,
      y: 0,
      width: bounds.width,
      height: titlebarView.getBounds().height
    })
  })
  if (isDev) {
    await titlebarView.webContents.loadURL(
      `${process.env['ELECTRON_RENDERER_URL'] as string}/index.html`
    )
    globalShortcut.register('Ctrl+Shift+I', () => {
      if (webView.webContents.isDevToolsOpened()) {
        webView.webContents.closeDevTools()
      } else {
        webView.webContents.openDevTools()
      }
    })
  } else await titlebarView.webContents.loadFile(path.join(__dirname, '../windows/index.html'))

  win.show()
  win.maximize()
}
