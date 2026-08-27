import { app } from 'electron';

export class AutoLaunchManager {
  public static setAutoLaunch(enabled: boolean) {
    if (process.platform === 'win32' || process.platform === 'darwin') {
      app.setLoginItemSettings({
        openAtLogin: enabled,
        openAsHidden: true
      });
    }
  }

  public static isAutoLaunchEnabled(): boolean {
    const settings = app.getLoginItemSettings();
    return settings.openAtLogin;
  }
}
