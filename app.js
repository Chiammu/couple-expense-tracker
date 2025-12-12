// Main Application Logic - Orchestrates expense tracking functionality

const App = (() => {
  const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping', 'Other'];

  // Initialize app
  const init = async () => {
        // Wait for storage to be ready
    await new Promise(resolve => setTimeout(resolve, 500));
    setupEventListeners();
    await loadExpenses();
  };

  // Setup all event listeners
  const setupEventListeners = () => {
    // Add Expense form
    const addExpenseForm = document.getElementById('addExpenseForm');
    if (addExpenseForm) {
      addExpenseForm.addEventListener('submit', handleAddExpense);
    }

    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        UIModule.toggleTheme();
      });
    }

    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', handleExport);
    }

    // Import file input
    const importFile = document.getElementById('importFile');
    if (importFile) {
      importFile.addEventListener('change', handleImport);
    }

    // Clear all button
    const clearAllBtn = document.getElementById('clearAllBtn');
    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', handleClearAll);
    }
  };

  // Load and display expenses
  const loadExpenses = async () => {
    try {
      const expenses = await StorageModule.getExpenses();
      displayExpenses(expenses);
      updateDashboard(expenses);
    } catch (error) {
      UIModule.showNotification('Error loading expenses', 'error');
      console.error(error);
    }
  };

  // Handle add expense
  const handleAddExpense = async (e) => {
    e.preventDefault();
    
    const formData = UIModule.getFormValues('addExpenseForm');
    if (!formData || !formData.description || !formData.amount || !formData.category || !formData.date) {
      UIModule.showNotification('Please fill all fields', 'error');
      return;
    }

    const expense = {
      id: Date.now(),
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date
    };

    try {
      await StorageModule.addExpense(expense);
      UIModule.clearForm('addExpenseForm');
      UIModule.showNotification('Expense added successfully');
      await loadExpenses();
    } catch (error) {
      UIModule.showNotification('Error adding expense', 'error');
      console.error(error);
    }
  };

  // Handle delete expense
  const handleDeleteExpense = async (id) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
      await StorageModule.deleteExpense(id);
      UIModule.showNotification('Expense deleted successfully');
      await loadExpenses();
    } catch (error) {
      UIModule.showNotification('Error deleting expense', 'error');
      console.error(error);
    }
  };

  // Handle export
  const handleExport = async () => {
    try {
      const jsonData = await StorageModule.exportAsJSON();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `expenses-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      UIModule.showNotification('Expenses exported successfully');
    } catch (error) {
      UIModule.showNotification('Error exporting expenses', 'error');
      console.error(error);
    }
  };

  // Handle import
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const jsonData = event.target.result;
        await StorageModule.importFromJSON(jsonData);
        UIModule.showNotification('Expenses imported successfully');
        await loadExpenses();
        e.target.value = '';
      } catch (error) {
        UIModule.showNotification('Error importing expenses', 'error');
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  // Handle clear all
  const handleClearAll = async () => {
    if (!confirm('Are you sure? This will delete all expenses.')) return;

    try {
      await StorageModule.clearExpenses();
      UIModule.showNotification('All expenses cleared');
      await loadExpenses();
    } catch (error) {
      UIModule.showNotification('Error clearing expenses', 'error');
      console.error(error);
    }
  };

  // Display expenses
  const displayExpenses = (expenses) => {
    UIModule.renderExpenses(expenses, 'expensesList');
  };

  // Update dashboard
  const updateDashboard = (expenses) => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remaining = 50000 - total; // Assuming monthly budget of 50000
        console.log('Updating dashboard:', {total: 50000, spent: total, remaining});
    UIModule.updateSummary(50000, total, remaining);
  };

  // Make delete accessible from UI
  window.handleDeleteExpense = handleDeleteExpense;
  window.handleEditExpense = (id) => {
    UIModule.showNotification('Edit feature coming soon', 'error');
  };

  return {
    init,
    loadExpenses
  };
})();

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();

  // Expose for debugging
window.AppDebug = {
  App,
  StorageModule,
  UIModule,
  checkStatus: async () => {
    const expenses = await StorageModule.getExpenses();
    console.log('Expenses:', expenses);
    console.log('Storage ready:', !!StorageModule);
    console.log('UI ready:', !!UIModule);
  }
};
}
