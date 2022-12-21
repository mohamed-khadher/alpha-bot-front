const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
    // Invoke Methods
    goSuiveur: (args) => ipcRenderer.invoke('suiveur', args),
    // Send Methods
    goEviteur: (args) => ipcRenderer.invoke('eviteur', args),
    // Receive Methods
    goRemoteControl: (args) => ipcRenderer.invoke('remote-control', args),

    goRGB: (args) => ipcRenderer.invoke('RGB', args),

    modifyStudent: (args) => ipcRenderer.invoke('modify-student', args),

    getIp: (args) => ipcRenderer.invoke('get-ip', args),

    close: (args) => ipcRenderer.send('close-signal', args),

    testConnection: (args) => ipcRenderer.invoke('connect-and-test-connection', args),

    fetchCurrentScriptConfig: (args) => ipcRenderer.invoke('current-script-settings', args),

    updateScriptsSettings: (args) => ipcRenderer.invoke('update-script-settings', args),

    executeCustomCommand: (args) => ipcRenderer.invoke('execute-custom-command', args),

    getLocalMachines: (args) => ipcRenderer.invoke('get-local-machines', args),

    killScripts: (args) => ipcRenderer.invoke('kill', args),

    openPicker: (args) => ipcRenderer.send('open-picker', args)
});