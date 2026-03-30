const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let pythonProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    backgroundColor: '#0a0b10',
    titleBarStyle: 'hiddenInset', // Adds a native feel on macOS
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: path.join(__dirname, 'public/vite.svg') // Generic icon for now
  });

  // Load the Vite dev server URL in development
  mainWindow.loadURL('http://localhost:5173');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

function startBackend() {
  // Spawns the uvicorn backend
  // Assumes a virtualenv or global python with dependencies
  const apiPath = path.join(__dirname, '../nexus-x-api/main.py');
  
  // Note: On production/packaged apps, you'd use a child process with a bundled exe.
  // For dev, we point to the installed python.
  pythonProcess = spawn('python', [apiPath], {
    stdio: 'inherit'
  });

  pythonProcess.on('error', (err) => {
    console.error('Failed to start python backend:', err);
  });
}

app.on('ready', () => {
    // startBackend(); // Uncomment if you want electron to manage the backend lifecycle
    createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
  if (pythonProcess) pythonProcess.kill();
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
