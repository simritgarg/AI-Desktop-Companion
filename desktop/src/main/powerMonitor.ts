import { powerMonitor, BrowserWindow } from 'electron';

export class SystemPowerMonitor {
  constructor(private overlayWindow: BrowserWindow) {}

  public init() {
    powerMonitor.on('lock-screen', () => {
      this.overlayWindow.webContents.send('power:state', 'LOCK_SCREEN');
      this.overlayWindow.webContents.send('companion:state-change', 'SLEEPING');
    });

    powerMonitor.on('unlock-screen', () => {
      this.overlayWindow.webContents.send('power:state', 'UNLOCK_SCREEN');
      this.overlayWindow.webContents.send('companion:state-change', 'GREETING');
    });

    powerMonitor.on('suspend', () => {
      this.overlayWindow.webContents.send('power:state', 'SUSPEND');
    });

    powerMonitor.on('resume', () => {
      this.overlayWindow.webContents.send('power:state', 'RESUME');
      this.overlayWindow.webContents.send('companion:state-change', 'GREETING');
    });
  }

  public getIdleTimeSeconds(): number {
    return powerMonitor.getSystemIdleTime();
  }
}
