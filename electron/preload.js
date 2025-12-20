// Preload script - exposes Electron and Steam APIs to renderer
// With contextIsolation: false, window is shared with renderer

const { ipcRenderer } = require('electron');

// Set immediately
window.electronAudio = {
  isElectron: true,
  setUiScale: (scale) => ipcRenderer.invoke('set-ui-scale', scale)
};

// Steam API wrapper for game code
window.steamAPI = {
  // Check if Steam is available
  isAvailable: async () => {
    try {
      return await ipcRenderer.invoke('steam-available');
    } catch (e) {
      return false;
    }
  },

  // Cloud save functions
  cloudSave: async (key, data) => {
    try {
      return await ipcRenderer.invoke('steam-cloud-save', key, data);
    } catch (e) {
      console.warn('Steam Cloud save error:', e);
      return false;
    }
  },

  cloudLoad: async (key) => {
    try {
      return await ipcRenderer.invoke('steam-cloud-load', key);
    } catch (e) {
      console.warn('Steam Cloud load error:', e);
      return null;
    }
  },

  // Achievement functions
  unlockAchievement: async (achievementId) => {
    try {
      return await ipcRenderer.invoke('steam-unlock-achievement', achievementId);
    } catch (e) {
      console.warn('Steam achievement error:', e);
      return false;
    }
  },

  isAchievementUnlocked: async (achievementId) => {
    try {
      return await ipcRenderer.invoke('steam-is-achievement-unlocked', achievementId);
    } catch (e) {
      return false;
    }
  }
};

// Also set on DOMContentLoaded to be safe
document.addEventListener('DOMContentLoaded', () => {
  window.electronAudio = {
    isElectron: true,
    setUiScale: (scale) => ipcRenderer.invoke('set-ui-scale', scale)
  };
});

console.log('[Preload] electronAudio set:', window.electronAudio);
console.log('[Preload] steamAPI available:', !!window.steamAPI);
