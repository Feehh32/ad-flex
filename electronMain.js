const { app, BrowserWindow, Menu, nativeImage } = require("electron");
const localShortcut = require("electron-localshortcut");
const path = require("path");
const serverStart = require("./server/server");

app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors");

app.on("web-contents-created", (event, contents) => {
  contents.on("will-attach-webview", (event, webPreferences, params) => {
    // Desativar a segurança do Electron se a origem da página for diferente
    delete webPreferences.preload;
    webPreferences.nodeIntegration = false;
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
    },
  });

  const iconPath = path.join(__dirname, "icon.ico");
  const image = nativeImage.createFromPath(iconPath);

  mainWindow.setIcon(image);

  mainWindow.on("closed", function () {
    mainWindow = null;
  });

  mainWindow.loadURL(`file://${path.join(__dirname, "index.html")}`);
  Menu.setApplicationMenu(null);
  mainWindow.webContents.once("dom-ready", () => {});

  localShortcut.register(mainWindow, "Ctrl+Shift+I", () => {
    mainWindow.webContents.openDevTools();
  });

  mainWindow.on("closed", function () {
    mainWindow = null;
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
