import { Tray, Menu, app, BrowserWindow } from 'electron';
import path from 'path';

export class AppTray {
  private tray: Tray | null = null;

  constructor(
    private overlayWindow: BrowserWindow,
    private dashboardWindow: BrowserWindow
  ) {}

  public init() {
    // Generate simple tray icon or load default
    const iconPath = path.join(__dirname, '../../resources/icon.png');
    
    try {
      this.tray = new Tray(iconPath);
    } catch {
      // Fallback if icon image file does not exist yet
      return;
    }

    const contextMenu = Menu.buildFromTemplate([
      {
        label: '👧 AI Companion Overlay',
        click: () => {
          this.overlayWindow.show();
          this.overlayWindow.focus();
        }
      },
      {
        label: '📊 Open Dashboard',
        click: () => {
          this.dashboardWindow.show();
          this.dashboardWindow.focus();
        }
      },
      { type: 'separator' },
      {
        label: 'Accountability Mode',
        submenu: [
          { label: 'Friendly', type: 'radio', checked: false },
          { label: 'Balanced', type: 'radio', checked: true },
          { label: 'Strict', type: 'radio', checked: false },
          { label: 'No Excuses', type: 'radio', checked: false }
        ]
      },
      {
        label: 'Always on Top',
        type: 'checkbox',
        checked: true,
        click: (menuItem) => {
          this.overlayWindow.setAlwaysOnTop(menuItem.checked);
        }
      },
      { type: 'separator' },
      {
        label: 'Exit AI Companion',
        click: () => {
          app.quit();
        }
      }
    ]);

    this.tray.setToolTip('AI Desktop Companion');
    this.tray.setContextMenu(contextMenu);
  }
}
