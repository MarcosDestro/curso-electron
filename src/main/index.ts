import { app, shell, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { createFileRoute, createURLRoute } from 'electron-router-dom'

import "./ipc";
import "./store";

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    backgroundColor: "#17141f",
    width: 1120,
    height: 800,
    show: false,
    titleBarStyle: "hidden",
    autoHideMenuBar: true,
    icon: path.resolve(__dirname, "../../resources/icon.png"),
    ...(process.platform === 'linux' ? { icon: path.join(__dirname, '../../build/icon.png'), } : {}),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  const devServerURL = createURLRoute(
    process.env.ELECTRON_RENDERER_URL!,
    "main"
  )

  const fileRoute = createFileRoute(
    path.join(__dirname, '../renderer/index.html'),
    "main"
  )

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(devServerURL)
  } else {
    mainWindow.loadFile(...fileRoute)
  }

  // Minimizar App
  ipcMain.on('minimizeApp', () => {
    mainWindow?.minimize();
  })

  // Maximizar ou Restaurar App 
  ipcMain.on('maximizeApp', () => {
    if (mainWindow?.isMaximized()) {
        mainWindow.restore();
    } else {
        mainWindow?.maximize();
    }
  })

  // Fechar App
  ipcMain.on('closeApp', () => {
    mainWindow?.close();
  })
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
