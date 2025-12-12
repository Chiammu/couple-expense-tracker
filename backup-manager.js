/**
 * Backup Manager - Handles automatic backups and local file storage
 * Stores data in device local storage and creates automatic backups
 */

class BackupManager {
  constructor() {
    this.dbName = 'CoupleExpenseTrackerDB';
    this.storeName = 'expenses';
    this.backupStoreName = 'backups';
    this.settingsStoreName = 'settings';
    this.autoBackupInterval = 10000; // Auto-backup every 10 seconds
    this.backupHistoryLimit = 50; // Keep last 50 backups
    this.db = null;
    this.init();
  }

  // Initialize IndexedDB
  init() {
    const request = indexedDB.open(this.dbName, 1);
    
    request.onerror = () => {
      console.error('Failed to open IndexedDB', request.error);
    };
    
    request.onsuccess = () => {
      this.db = request.result;
      console.log('IndexedDB initialized successfully');
    };
    
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      
      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains(this.storeName)) {
        db.createObjectStore(this.storeName, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(this.backupStoreName)) {
        db.createObjectStore(this.backupStoreName, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(this.settingsStoreName)) {
        db.createObjectStore(this.settingsStoreName, { keyPath: 'key' });
      }
    };
  }

  // Save data to IndexedDB
  async saveData(data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();
      
      request.onsuccess = () => {
        const addRequest = store.add({ id: 'appData', data: data, timestamp: Date.now() });
        addRequest.onsuccess = () => {
          this.createAutoBackup(data);
          resolve(true);
        };
        addRequest.onerror = () => reject(addRequest.error);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Load data from IndexedDB
  async loadData() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get('appData');
      
      request.onsuccess = () => {
        resolve(request.result ? request.result.data : null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Create automatic backup
  async createAutoBackup(data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.backupStoreName], 'readwrite');
      const store = transaction.objectStore(this.backupStoreName);
      
      const backup = {
        data: data,
        timestamp: Date.now(),
        label: new Date().toLocaleString(),
        type: 'auto'
      };
      
      const addRequest = store.add(backup);
      addRequest.onsuccess = () => {
        this.cleanupOldBackups();
        resolve(addRequest.result);
      };
      addRequest.onerror = () => reject(addRequest.error);
    });
  }

  // Create manual backup
  async createManualBackup(data, label) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.backupStoreName], 'readwrite');
      const store = transaction.objectStore(this.backupStoreName);
      
      const backup = {
        data: data,
        timestamp: Date.now(),
        label: label || new Date().toLocaleString(),
        type: 'manual'
      };
      
      const addRequest = store.add(backup);
      addRequest.onsuccess = () => {
        resolve(addRequest.result);
      };
      addRequest.onerror = () => reject(addRequest.error);
    });
  }

  // Get all backups
  async getAllBackups() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.backupStoreName], 'readonly');
      const store = transaction.objectStore(this.backupStoreName);
      const request = store.getAll();
      
      request.onsuccess = () => {
        const backups = request.result.sort((a, b) => b.timestamp - a.timestamp);
        resolve(backups);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Clean up old backups (keep only latest N)
  async cleanupOldBackups() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.backupStoreName], 'readwrite');
      const store = transaction.objectStore(this.backupStoreName);
      const request = store.getAll();
      
      request.onsuccess = () => {
        const backups = request.result.sort((a, b) => b.timestamp - a.timestamp);
        if (backups.length > this.backupHistoryLimit) {
          const toDelete = backups.slice(this.backupHistoryLimit);
          toDelete.forEach(backup => {
            store.delete(backup.id);
          });
        }
        resolve(true);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Download backup as JSON file
  downloadBackup(data, filename) {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `expense-backup-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Create backup file for download
  exportAsFile(data) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `couple-expense-tracker-${timestamp}.json`;
    this.downloadBackup(data, filename);
  }

  // Get device storage info
  async getStorageInfo() {
    if (navigator.storage && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      return {
        usage: estimate.usage,
        quota: estimate.quota,
        percentage: (estimate.usage / estimate.quota * 100).toFixed(2)
      };
    }
    return null;
  }

  // Request persistent storage
  async requestPersistentStorage() {
    if (navigator.storage && navigator.storage.persist) {
      const persistent = await navigator.storage.persist();
      return persistent;
    }
    return false;
  }

  // Restore from backup
  async restoreFromBackup(backupId) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.backupStoreName], 'readonly');
      const store = transaction.objectStore(this.backupStoreName);
      const request = store.get(backupId);
      
      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result.data);
        } else {
          reject(new Error('Backup not found'));
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Delete specific backup
  async deleteBackup(backupId) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.backupStoreName], 'readwrite');
      const store = transaction.objectStore(this.backupStoreName);
      const request = store.delete(backupId);
      
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  // Clear all data
  async clearAllData() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();
      
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }
}

// Initialize global backup manager
const backupManager = new BackupManager();
