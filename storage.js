// Storage Module - Handles all data persistence using IndexedDB

const StorageModule = (() => {
  const DB_NAME = 'ExpenseTrackerDB';
  const STORE_NAME = 'expenses';
  const BACKUPS_STORE = 'backups';
  const DB_VERSION = 1;
  let db = null;

  // Initialize IndexedDB
  const init = async () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        db = request.result;
        resolve(db);
      };

      request.onupgradeneeded = (event) => {
        const database = event.target.result;
        if (!database.objectStoreNames.contains(STORE_NAME)) {
          database.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
        if (!database.objectStoreNames.contains(BACKUPS_STORE)) {
          database.createObjectStore(BACKUPS_STORE, { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  };

  // Add or update expense
  const addExpense = async (expense) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = expense.id ? store.put(expense) : store.add(expense);

    return new Promise((resolve, reject) => {
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    }).then(() => createBackup());
  };

  // Get all expenses
  const getExpenses = async () => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || []);
    });
  };

  // Delete expense
  const deleteExpense = async (id) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    return new Promise((resolve, reject) => {
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    }).then(() => createBackup());
  };

  // Clear all expenses
  const clearExpenses = async () => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    return new Promise((resolve, reject) => {
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    }).then(() => createBackup());
  };

  // Create backup
  const createBackup = async () => {
    const expenses = await getExpenses();
    const backup = {
      timestamp: new Date().toISOString(),
      data: expenses,
      count: expenses.length
    };

    const transaction = db.transaction([BACKUPS_STORE], 'readwrite');
    const store = transaction.objectStore(BACKUPS_STORE);
    const request = store.add(backup);

    return new Promise((resolve, reject) => {
      request.onerror = () => reject(request.error);
      request.onsuccess = async () => {
        // Keep only latest 50 backups
        const allBackups = await getBackups();
        if (allBackups.length > 50) {
          const toDelete = allBackups.slice(0, allBackups.length - 50);
          for (const b of toDelete) {
            await deleteBackup(b.id);
          }
        }
        resolve();
      };
    });
  };

  // Get all backups
  const getBackups = async () => {
    const transaction = db.transaction([BACKUPS_STORE], 'readonly');
    const store = transaction.objectStore(BACKUPS_STORE);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || []);
    });
  };

  // Delete specific backup
  const deleteBackup = async (id) => {
    const transaction = db.transaction([BACKUPS_STORE], 'readwrite');
    const store = transaction.objectStore(BACKUPS_STORE);
    const request = store.delete(id);

    return new Promise((resolve, reject) => {
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  };

  // Restore from backup
  const restoreFromBackup = async (backupId) => {
    const backups = await getBackups();
    const backup = backups.find(b => b.id === backupId);
    if (!backup) throw new Error('Backup not found');

    await clearExpenses();
    for (const expense of backup.data) {
      delete expense.id;
      await addExpense(expense);
    }
  };

  // Export data as JSON
  const exportAsJSON = async () => {
    const expenses = await getExpenses();
    return JSON.stringify(expenses, null, 2);
  };

  // Import data from JSON
  const importFromJSON = async (jsonString) => {
    const expenses = JSON.parse(jsonString);
    await clearExpenses();
    for (const expense of expenses) {
      await addExpense(expense);
    }
  };

  return {
    init,
    addExpense,
    getExpenses,
    deleteExpense,
    clearExpenses,
    createBackup,
    getBackups,
    deleteBackup,
    restoreFromBackup,
    exportAsJSON,
    importFromJSON
  };
})();

// Initialize storage when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => StorageModule.init());
} else {
  StorageModule.init();
}
