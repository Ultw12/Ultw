const { app, BrowserWindow, ipcMain, shell, dialog } = require("electron");
const { autoUpdater } = require('electron-updater');

let mainWindow;

const ClickSchema = {
  date: Date,
  count: Number
};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1020,
    height: 700,
    frame: false,
    resizable: false,
    webPreferences: {
      devTools: false,
      nodeIntegration: true,
      contextIsolation: false,
      contentSecurityPolicy:
        "default-src 'self' https://cdnjs.cloudflare.com https://fonts.googleapis.com https://cdn.jsdelivr.net; script-src 'self' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net",
    },
  });

  mainWindow.loadFile("./index.html");

  ipcMain.on("close", () => {
    mainWindow.close();
  });

  ipcMain.on('minimize', (event) => {
    event.preventDefault();
    mainWindow.minimize();
  });

  // Check for updates after the window is created
  autoUpdater.checkForUpdatesAndNotify();
}

// Auto-updater event listeners
autoUpdater.on('update-available', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Update available',
    message: 'A new version of the application is available. It will be downloaded in the background.',
  });
});

autoUpdater.on('update-downloaded', (info) => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Update ready',
    message: 'A new version has been downloaded. Restart the application to apply the updates.',
  }).then(() => {
    autoUpdater.quitAndInstall();
  });
});

autoUpdater.on('error', (err) => {
  dialog.showErrorBox('Error', err == null ? "unknown" : (err.stack || err).toString());
});

function openDiscord() {
  shell.openExternal("https://discord.com/invite/ultw");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
