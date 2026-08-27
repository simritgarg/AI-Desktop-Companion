import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // Window control
  closeWindow: () => ipcRenderer.send('window:close'),
  minimizeWindow: () => ipcRenderer.send('window:minimize'),
  toggleAlwaysOnTop: (flag: boolean) => ipcRenderer.send('window:always-on-top', flag),
  setWindowSize: (width: number, height: number) => ipcRenderer.send('window:resize', { width, height }),
  
  // Companion Overlay Control
  setIgnoreMouseEvents: (ignore: boolean, forward?: boolean) => 
    ipcRenderer.send('companion:ignore-mouse-events', ignore, forward),
  
  // Power & System
  getSystemIdleTime: () => ipcRenderer.invoke('system:idle-time'),
  
  // IPC Listeners
  onCompanionStateChange: (callback: (state: string) => void) => 
    ipcRenderer.on('companion:state-change', (_event, state) => callback(state)),
  onTriggerReminder: (callback: (reminder: any) => void) => 
    ipcRenderer.on('reminder:trigger', (_event, reminder) => callback(reminder)),
  onPowerStateChange: (callback: (event: string) => void) => 
    ipcRenderer.on('power:state', (_event, evt) => callback(evt))
});
