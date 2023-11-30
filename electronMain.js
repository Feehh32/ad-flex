const { app, BrowserWindow, Menu, nativeImage } = require("electron");
const localShortcut = require("electron-localshortcut");
const path = require("path");
const serverStart = require("./server/server.js");

app.on("web-contents-created", (event, contents) => {
  contents.on("will-attach-webview", (event, webPreferences, params) => {
    delete webPreferences.preload;
    webPreferences.nodeIntegration = true;
    webPreferences.worldSafeExecuteJavaScript = true;
    webPreferences.contextIsolation = true;
  });
});

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 870,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const iconPath = path.join(__dirname, "icon.ico");
  const image = nativeImage.createFromPath(iconPath);

  mainWindow.setIcon(image);

  mainWindow.on("closed", function () {
    mainWindow = null;
  });

  const indexPath = path.join(__dirname, "/pages", "/index.html");
  mainWindow.loadFile(indexPath);
  Menu.setApplicationMenu(null);

  localShortcut.register(mainWindow, "Ctrl+Shift+I", () => {
    mainWindow.webContents.openDevTools();
  });

  process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
  });

  serverStart(app);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  if (mainWindow === null) createWindow();
});
