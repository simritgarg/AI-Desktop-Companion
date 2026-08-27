import { app, BrowserWindow, ipcMain, screen } from 'electron';
import path from 'path';
import { AppTray } from './tray';
import { SystemPowerMonitor } from './powerMonitor';
import { AutoLaunchManager } from './autoLaunch';

let overlayWindow: BrowserWindow | null = null;
let dashboardWindow: BrowserWindow | null = null;
let appTray: AppTray | null = null;
let powerMonitorService: SystemPowerMonitor | null = null;

const isDev = process.env.NODE_ENV !== 'production';

function createOverlayWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  // Window bounds expanded to 650x450px to accommodate full 5-6 step horizontal walking animation
  const windowWidth = 650;
  const windowHeight = 450;

  overlayWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x: width - windowWidth - 10,
    y: height - windowHeight - 10,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    hasShadow: false,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  const overlayUrl = isDev 
    ? 'http://localhost:3000/companion' 
    : `file://${path.join(__dirname, '../../.next/server/app/companion.html')}`;

  overlayWindow.loadURL(overlayUrl);

  overlayWindow.on('closed', () => {
    overlayWindow = null;
  });
}

function createDashboardWindow() {
  dashboardWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    frame: true,
    title: 'AI Desktop Companion Dashboard',
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  const dashboardUrl = isDev 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, '../../.next/server/app/index.html')}`;

  dashboardWindow.loadURL(dashboardUrl);

  dashboardWindow.on('closed', () => {
    dashboardWindow = null;
  });
}

app.whenReady().then(() => {
  createOverlayWindow();
  createDashboardWindow();

  if (overlayWindow && dashboardWindow) {
    appTray = new AppTray(overlayWindow, dashboardWindow);
    appTray.init();

    powerMonitorService = new SystemPowerMonitor(overlayWindow);
    powerMonitorService.init();
  }

  // Register IPC Handlers
  ipcMain.handle('system:idle-time', () => {
    return powerMonitorService ? powerMonitorService.getIdleTimeSeconds() : 0;
  });

  ipcMain.on('window:close', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    win?.hide();
  });

  ipcMain.on('window:always-on-top', (event, flag) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    win?.setAlwaysOnTop(flag);
  });

  ipcMain.on('companion:ignore-mouse-events', (event, ignore, forward) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    win?.setIgnoreMouseEvents(ignore, { forward: forward ?? false });
  });

  AutoLaunchManager.setAutoLaunch(true);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
