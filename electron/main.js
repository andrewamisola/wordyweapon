const { app, BrowserWindow, shell, Menu, ipcMain } = require('electron');
const path = require('path');
const http = require('http');
const fs = require('fs');

// Chromium flags for audio stability
app.commandLine.appendSwitch('disable-features', 'AudioServiceOutOfProcess');
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

// No custom GPU flags - let Electron use defaults for best compatibility

// Base game dimensions (16:10 aspect ratio for wider default view)
const BASE_WIDTH = 1280;
const BASE_HEIGHT = 800;
const MAX_SCALE = 1.5;
const SERVER_PORT = 45678; // Local server port for serving game files

let mainWindow;
let localServer;
let steamClient = null;

// === STEAMWORKS INTEGRATION ===
// Initialize Steam client - only works when launched through Steam
function initSteam() {
  try {
    const steamworks = require('steamworks.js');
    // Replace with your actual Steam App ID (use 480 for testing with Spacewar)
    // For production, create steam_appid.txt with your app ID
    steamClient = steamworks.init();
    console.log('Steam initialized successfully');
    console.log('Steam user:', steamClient.localplayer.getName());
    return true;
  } catch (e) {
    console.log('Steam not available (running outside Steam?):', e.message);
    steamClient = null;
    return false;
  }
}

// Steam Cloud save/load functions
function steamCloudSave(key, data) {
  if (!steamClient) return false;
  try {
    const filename = `${key}.json`;
    return steamClient.cloud.writeFile(filename, JSON.stringify(data));
  } catch (e) {
    console.warn('Steam Cloud save failed:', e);
    return false;
  }
}

function steamCloudLoad(key) {
  if (!steamClient) return null;
  try {
    const filename = `${key}.json`;
    if (steamClient.cloud.fileExists(filename)) {
      const content = steamClient.cloud.readFile(filename);
      return JSON.parse(content);
    }
  } catch (e) {
    console.warn('Steam Cloud load failed:', e);
  }
  return null;
}

// Steam Achievement functions
function unlockSteamAchievement(achievementId) {
  if (!steamClient) return false;
  try {
    if (!steamClient.achievement.isActivated(achievementId)) {
      steamClient.achievement.activate(achievementId);
      console.log(`Steam achievement unlocked: ${achievementId}`);
      return true;
    }
  } catch (e) {
    console.warn('Steam achievement unlock failed:', e);
  }
  return false;
}

function isSteamAchievementUnlocked(achievementId) {
  if (!steamClient) return false;
  try {
    return steamClient.achievement.isActivated(achievementId);
  } catch (e) {
    return false;
  }
}

// IPC handlers for renderer process communication
ipcMain.handle('steam-available', () => !!steamClient);
ipcMain.handle('steam-cloud-save', (event, key, data) => steamCloudSave(key, data));
ipcMain.handle('steam-cloud-load', (event, key) => steamCloudLoad(key));
ipcMain.handle('steam-unlock-achievement', (event, id) => unlockSteamAchievement(id));
ipcMain.handle('steam-is-achievement-unlocked', (event, id) => isSteamAchievementUnlocked(id));

// Update content scaling when window size changes (especially for fullscreen on 4K)
// NOTE: resizeFxCanvas is already called by script.js via window resize listener - no need to call it here
function updateContentScale() {
  if (!mainWindow || mainWindow.isDestroyed()) return;

  // Inject CSS to ensure content is centered and no scrollbars appear
  mainWindow.webContents.executeJavaScript(`
    (function() {
      // Reset any zoom and ensure proper centering
      document.body.style.zoom = '';
      document.body.style.overflow = 'hidden';
    })();
  `).catch(() => {}); // Ignore errors if page not ready
}

// MIME types for serving files
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.mp3': 'audio/mpeg',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

// Start local HTTP server to serve game files (enables Tone.js fetch)
function startLocalServer(callback) {
  const gameDir = path.join(__dirname, 'game');

  localServer = http.createServer((req, res) => {
    // Remove query strings and decode URI
    let filePath = decodeURIComponent(req.url.split('?')[0]);
    if (filePath === '/') filePath = '/index.html';

    const fullPath = path.join(gameDir, filePath);
    const ext = path.extname(fullPath).toLowerCase();
    const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

    // Security: ensure path is within game directory
    if (!fullPath.startsWith(gameDir)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    fs.readFile(fullPath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not Found');
        return;
      }
      res.writeHead(200, {
        'Content-Type': mimeType,
        'Access-Control-Allow-Origin': '*'
      });
      res.end(data);
    });
  });

  localServer.listen(SERVER_PORT, '127.0.0.1', () => {
    console.log(`Local server running at http://127.0.0.1:${SERVER_PORT}`);
    if (callback) callback();
  });
}

function createWindow() {
  // Get primary display dimensions
  const { screen } = require('electron');
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

  // Calculate optimal scale factor
  const scaleX = screenWidth / BASE_WIDTH;
  const scaleY = screenHeight / BASE_HEIGHT;
  const scale = Math.min(scaleX, scaleY, MAX_SCALE);

  const windowWidth = Math.floor(BASE_WIDTH * scale);
  const windowHeight = Math.floor(BASE_HEIGHT * scale);

  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    minWidth: 1000,
    minHeight: 625,  // Maintains 16:10 aspect at minimum size
    backgroundColor: '#0a0a0a',
    icon: path.join(__dirname, 'game', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,  // Required for preload to use require('electron')
      contextIsolation: false,  // WORKAROUND: Electron 28 bug crashes decodeAudioData with contextIsolation:true
      backgroundThrottling: false,  // Keep animations smooth when window loses focus
      enableBlinkFeatures: 'CSSBackdropFilter'  // Explicitly enable backdrop-filter
    },
    show: false
  });

  // Lock aspect ratio to 16:10 (1.6)
  mainWindow.setAspectRatio(16 / 10);

  // Load from local server instead of file://
  mainWindow.loadURL(`http://127.0.0.1:${SERVER_PORT}/index.html`);

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    updateContentScale();
  });

  // Handle window resize/fullscreen - scale content to fit while maintaining aspect ratio
  mainWindow.on('resize', updateContentScale);
  mainWindow.on('enter-full-screen', updateContentScale);
  mainWindow.on('leave-full-screen', updateContentScale);

  // Open external links in default browser (for Steam wishlist button)
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://') || url.startsWith('http://')) {
      // Don't open our local server URLs externally
      if (url.includes('127.0.0.1:' + SERVER_PORT)) {
        return { action: 'allow' };
      }
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  // Also handle link clicks with target="_blank"
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (url !== mainWindow.webContents.getURL() && !url.includes('127.0.0.1:' + SERVER_PORT)) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  // Remove menu bar on Windows/Linux (Mac uses system menu)
  if (process.platform !== 'darwin') {
    Menu.setApplicationMenu(null);
  }

  // Initialize Steam (commented out for local testing)
  // initSteam();

  // Start server and wait for it to be ready before creating window
  startLocalServer(() => {
    createWindow();

    // Enable Steam overlay (commented out for local testing)
    // try {
    //   const steamworks = require('steamworks.js');
    //   steamworks.electronEnableSteamOverlay();
    // } catch (e) {
    //   // Ignore if steamworks not available
    // }
  });
});

app.on('window-all-closed', () => {
  if (localServer) {
    localServer.close();
  }
  app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
