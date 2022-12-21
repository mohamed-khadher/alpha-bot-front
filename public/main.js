const find = require('local-devices');
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path')
const { Client } = require('ssh2');
const conn = new Client();



var ip = "192.168.138.128"
var port = 22
var user = ""
var pwd = ""

var script1 = 'cd ~/AlphaBot2/python ;sudo python Line_Follow.py'
var script2 = 'cd ~/AlphaBot2/python ;sudo python Infrared_Obstacle_Avoidance.py'
var script3 = 'cd ~/AlphaBot2/Web-Control/ ;sudo python main.py'
var script4 = 'cd ~/AlphaBot2/Web-RGB/ ;sudo python aze.py'
var customCommand = ''
var eventNames = ['eviteur', 'suiveur', 'rc', 'RGB']

conn.on('error', (msg) => {
    console.log(msg)
})

let loadingScreen;
var pickerWin;
var win;

const createLoadingScreen = () => {
    loadingScreen = new BrowserWindow(
        Object.assign({
            width: 450,
            height: 640,
            frame: false,
        })
    );
    loadingScreen.setResizable(false);
    loadingScreen.loadFile('loading.html')
    loadingScreen.on('closed', () => (loadingScreen = null));
    loadingScreen.webContents.on('did-finish-load', () => {
        loadingScreen.show();
    });
};

function createWindow() {
    win = new BrowserWindow({
        width: 450,
        height: 640,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
        },
        frame: false,
        show: false,
    })
    win.setResizable(false)
    win.loadURL('http://localhost:3000/settings')
    win.webContents.on('did-finish-load', () => {
        if (loadingScreen) loadingScreen.close();
        win.show();
    })
}

function createPickerWindow() {
    pickerWin = new BrowserWindow({
        width: 260,
        height: 280,
        frame: false,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
        },
    })
    pickerWin.setResizable(false)
    pickerWin.loadURL('http://localhost:3000/rgb')
}


app.whenReady().then(() => {
    createLoadingScreen()
    createPickerWindow()
    setTimeout(() => {
        createWindow()
    }, 2000);
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        conn.end()
        app.quit()
    }
})

const createEvent = (eventName, command) => {
    conn.on(eventName, () => {
        conn.exec(command, (err, stream) => {
            if (err) throw err
            stream.on('data', (data) => {
                console.log('STDOUT: ' + data);
            }).stderr.on('data', (data) => {
                console.log('STDERR: ' + data);
            });
        })
    })
}
const createDynamicEvent = (eventName) => {
    conn.on(eventName, () => {
        conn.exec('sudo pkill -SIGINT python;' + customCommand, (err, stream) => {
            if (err) throw err
            stream.on('data', (data) => {
                console.log('STDOUT: ' + data);
            }).stderr.on('data', (data) => {
                console.log('STDERR: ' + data);
            });
        })
    })
}


const createKillEvent = (eventName) => {
    conn.on(eventName, () => {
        conn.exec('sudo pkill -SIGINT python', (err, stream) => {
            if (err) throw err;
            stream.on('data', (data) => {
                console.log('STDOUT: ' + data);
            }).stderr.on('data', (data) => {
                console.log('STDERR: ' + data);
            });
        });
    })
}

createDynamicEvent('execute-custom-command')

createKillEvent('kill')

ipcMain.handle('suiveur', async(event, args) => {
    createEvent('suiveur', 'sudo pkill -SIGINT python;' + script1)
    conn.emit("suiveur")
})

ipcMain.handle('eviteur', async(event, args) => {
    createEvent('eviteur', 'sudo pkill -SIGINT python;' + script2)
    conn.emit("eviteur")
})

ipcMain.handle('remote-control', async(event, args) => {
    createEvent('rc', 'sudo pkill -SIGINT python;' + script3)
    conn.emit("rc")
})
ipcMain.handle('RGB', async(event, args) => {
    createEvent('RGB', 'sudo pkill -SIGINT python;' + script4)
    conn.emit("RGB")
})

ipcMain.handle('kill', async(event, args) => {
    conn.emit("kill")
})

ipcMain.handle('execute-custom-command', (event, args) => {
    customCommand = args.command
    conn.emit('execute-custom-command')
})

ipcMain.handle('get-ip', async(event, args) => {
    return { ip: ip };
})

ipcMain.handle('connect-and-test-connection', async(event, args) => {
    console.log(args)
    return new Promise((resolve, reject) => {
        conn.on('ready', () => {
            conn.exec('uptime', (err, stream) => {
                if (err) resolve("Connection not ready ..")
                stream.on('data', (data) => {
                    resolve("Connection ready !")
                }).stderr.on('data', (data) => {
                    console.log('STDERR: ' + data);
                });
            });
        }).connect({
            host: args.ip,
            port: args.port,
            username: args.user,
            password: args.pwd,
        });
        conn.on('error', (msg) => {
            resolve('Connection not ready');
        })
    })
})

ipcMain.handle('current-script-settings', (event, args) => {
    return { script1: script1, script2: script2, script3: script3, script4: script4 }
})

ipcMain.handle('update-script-settings', (event, args) => {
    script1 = args.script1
    script2 = args.script2
    script3 = args.script3
    script4 = args.script4
    eventNames.forEach((e, i) => { conn.removeAllListeners(e) })
    return { msg: 'Mise à jour réussie', severity: 'success' }
})


ipcMain.on('close-signal', (event, args) => {
    switch (args.window) {
        case 'picker':
            pickerWin.hide()
            break;
        case 'mainWindow':
            app.quit()
            break;
        default:
            pickerWin.hide();
    }
})

ipcMain.handle('get-local-machines', async(event, args) => {
    let foundDevices;
    await find().then(async(devices) => {
        foundDevices = devices;
    })
    return foundDevices;
})

ipcMain.on('open-picker', async(event, args) => {
    pickerWin.show()
})