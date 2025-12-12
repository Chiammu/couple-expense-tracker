// Main Application Logic - Orchestrates expense tracking functionality
const App = (() => {
    const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping', 'Other'];
    
    // State for date filtering
    let dateFilter = 'month';
    let customDateRange = null;

    // Initialize app
    const init = async () => {
        // Wait for storage to be ready
        await new Promise(resolve => setTimeout(resolve, 500));
        setupEventListeners();
        await loadExpenses();
        loadPersonNames();
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
            updateSummaries();
        } catch (error) {
            UIModule.showNotification('Error loading expenses', 'error');
            console.error(error);
        }
    };

    // Load person names from settings
    const loadPersonNames = () => {
        const person1Name = localStorage.getItem('person1Name') || 'Person 1';
        const person2Name = localStorage.getItem('person2Name') || 'Person 2';
        
        const person1Input = document.getElementById('person1Name');
        const person2Input = document.getElementById('person2Name');
        
        if (person1Input) person1Input.value = person1Name;
        if (person2Input) person2Input.value = person2Name;
    };

    // Handle add expense
    const handleAddExpense = async (e) => {
        e.preventDefault();
        
        const person = document.getElementById('expensePerson').value;
        const date = document.getElementById('expenseDate').value;
        const amount = parseFloat(document.getElementById('expenseAmount').value);
        const category = document.getElementById('expenseCategory').value;
        const paymentMode = document.getElementById('expensePaymentMode').value;
        const type = document.getElementById('expenseType').value;
        const note = document.getElementById('expenseNote').value;

        if (!person || !date || !amount || !category || !paymentMode) {
            UIModule.showNotification('Please fill all required fields', 'error');
            return;
        }

        const expense = {
            id: Date.now(),
            person,
            date,
            amount,
            category,
            paymentMode,
            type,
            note
        };

        try {
            await StorageModule.addExpense(expense);
            resetExpenseForm();
            UIModule.showNotification('Expense added successfully!');
            await loadExpenses();
        } catch (error) {
            UIModule.showNotification('Error adding expense', 'error');
            console.error(error);
        }
    };

    // Reset expense form
    const resetExpenseForm = () => {
        document.getElementById('expensePerson').value = '';
        document.getElementById('expenseDate').value = new Date().toISOString().split('T')[0];
        document.getElementById('expenseAmount').value = '';
        document.getElementById('expenseCategory').value = '';
        document.getElementById('expensePaymentMode').value = '';
        document.getElementById('expenseType').value = 'Personal';
        document.getElementById('expenseNote').value = '';
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

    // Date filtering functions
    const setDateFilter = (filter) => {
        dateFilter = filter;
        customDateRange = null;
        document.getElementById('customDateFilter').style.display = 'none';
        updateSummaries();
    };

    const toggleDatePickerFilter = () => {
        const elem = document.getElementById('customDateFilter');
        elem.style.display = elem.style.display === 'none' ? 'block' : 'none';
    };

    const applyCustomDateFilter = () => {
        const from = document.getElementById('filterFromDate').value;
        const to = document.getElementById('filterToDate').value;

        if (!from || !to) {
            UIModule.showNotification('Please select both dates', 'error');
            return;
        }

        dateFilter = 'custom';
        customDateRange = { from, to };
        updateSummaries();
    };

    // Get filtered expenses based on date range
    const getFilteredExpenses
