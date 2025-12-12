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
        setDefaultDate();
    };

    // Setup all event listeners
    const setupEventListeners = () => {
        // Add Expense form
        const addExpenseForm = document.querySelector('#addExpenseForm');
        if (addExpenseForm) {
            addExpenseForm.addEventListener('submit', handleAddExpense);
        }
    };

    // Set default date to today
    const setDefaultDate = () => {
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('expenseDate');
        if (dateInput) dateInput.value = today;
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

    // Load person names from localStorage
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
        document.getElementById('expenseAmount').value = '';
        document.getElementById('expenseCategory').value = '';
        document.getElementById('expensePaymentMode').value = '';
        document.getElementById('expenseType').value = 'Personal';
        document.getElementById('expenseNote').value = '';
        setDefaultDate();
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

    // Date filter functions
    const setDateFilter = (range) => {
        dateFilter = range;
        customDateRange = null;
        document.getElementById('customDateFilter').style.display = 'none';
        
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
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
        
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        
        updateSummaries();
    };

    // Update summaries
    const updateSummaries = async () => {
        const expenses = await StorageModule.getExpenses();
        
        // Filter by date range
        const now = new Date();
        let startDate, endDate;

        if (dateFilter === 'today') {
            startDate = new Date(now);
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(now);
            endDate.setHours(23, 59, 59, 999);
        } else if (dateFilter === 'week') {
            startDate = new Date(now);
            startDate.setDate(now.getDate() - now.getDay());
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(now);
            endDate.setHours(23, 59, 59, 999);
        } else if (dateFilter === 'month') {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        } else if (dateFilter === 'custom' && customDateRange) {
            startDate = new Date(customDateRange.from);
            endDate = new Date(customDateRange.to);
            endDate.setHours(23, 59, 59, 999);
        }

        const filtered = expenses.filter(exp => {
            const expDate = new Date(exp.date);
            return expDate >= startDate && expDate <= endDate;
        });

        let person1Total = 0, person2Total = 0, sharedTotal = 0;

        filtered.forEach(exp => {
            if (exp.person === 'Person1') {
                person1Total += exp.amount;
            } else if (exp.person === 'Person2') {
                person2Total += exp.amount;
            } else if (exp.person === 'Both') {
                sharedTotal += exp.amount;
            }
        });

        const person1WithShared = person1Total + (sharedTotal / 2);
        const person2WithShared = person2Total + (sharedTotal / 2);
        const grandTotal = person1Total + person2Total + sharedTotal;

        // Update summary cards
        const person1SpendElem = document.getElementById('person1Spend');
        const person2SpendElem = document.getElementById('person2Spend');
        const sharedExpenseElem = document.getElementById('sharedExpense');
        const grandTotalElem = document.getElementById('grandTotal');

        if (person1SpendElem) person1SpendElem.textContent = formatCurrency(person1WithShared);
        if (person2SpendElem) person2SpendElem.textContent = formatCurrency(person2WithShared);
        if (sharedExpenseElem) sharedExpenseElem.textContent = formatCurrency(sharedTotal);
        if (grandTotalElem) grandTotalElem.textContent = formatCurrency(grandTotal);

        // Category breakdown
        const categoryMap = {};
        filtered.forEach(exp => {
            if (!categoryMap[exp.category]) {
                categoryMap[exp.category] = { amount: 0, count: 0 };
            }
            categoryMap[exp.category].amount += exp.amount;
            categoryMap[exp.category].count += 1;
        });

        const categoryTableBody = document.getElementById('categoryTableBody');
        if (categoryTableBody) {
            categoryTableBody.innerHTML = '';
            Object.entries(categoryMap).forEach(([cat, data]) => {
                const percent = grandTotal > 0 ? (data.amount / grandTotal * 100).toFixed(1) : 0;
                const row = `<tr>
                    <td>${cat}</td>
                    <td>${formatCurrency(data.amount)}</td>
                    <td>${data.count}</td>
                    <td>${percent}%</td>
                </tr>`;
                categoryTableBody.innerHTML += row;
            });
        }

        // Recent expenses
        const expenseList = document.getElementById('expenseList');
        if (expenseList) {
            expenseList.innerHTML = '';
            const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

            sorted.forEach(exp => {
                const effectivePerson = exp.person === 'Both' ? 'Shared' : exp.person;
                const item = `<div class="expense-item">
                    <div class="expense-item-left">
                        <div class="expense-date">${new Date(exp.date).toLocaleDateString('en-IN')}</div>
                        <div class="expense-description">${exp.note || 'No description'}</div>
                        <span class="expense-category">${exp.category}</span>
                    </div>
                    <div>
                        <div class="expense-amount">${formatCurrency(exp.amount)}</div>
                        <div class="expense-person">${effectivePerson}</div>
                    </div>
                </div>`;
                expenseList.innerHTML += item;
            });
        }

        // Update overview
        updateOverview(expenses);
    };

    // Update overview tab
    const updateOverview = (expenses) => {
        const monthlyTotalExpensesElem = document.getElementById('monthlyTotalExpenses');

        if (monthlyTotalExpensesElem) {
            const now = new Date();
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

            const monthExpenses = expenses.filter(exp => {
                const expDate = new Date(exp.date);
                return expDate >= monthStart && expDate <= monthEnd;
            });

            const total = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
            monthlyTotalExpensesElem.textContent = formatCurrency(total);

            // Update combined income (placeholder - would be from settings)
            const combinedIncomeElem = document.getElementById('combinedIncome');
            const moneyLeftElem = document.getElementById('moneyLeft');
            const leftPercentElem = document.getElementById('leftPercent');

            const income = 0; // This would come from saved settings
            if (combinedIncomeElem) combinedIncomeElem.textContent = formatCurrency(income);
            if (moneyLeftElem) moneyLeftElem.textContent = formatCurrency(income - total);
            if (leftPercentElem) {
                const percent = income > 0 ? ((income - total) / income * 100).toFixed(0) : 0;
                leftPercentElem.textContent = percent + '%';
            }
        }
    };

    // Format currency
    const formatCurrency = (amount) => {
        return '₹' + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    // Export to CSV
    const exportToCSV = async () => {
        const expenses = await StorageModule.getExpenses();
        let csv = 'Date,Person,Category,Amount,Payment Mode,Type,Note\n';

        expenses.forEach(exp => {
            const row = [
                exp.date,
                exp.person,
                exp.category,
                exp.amount,
                exp.paymentMode || '',
                exp.type || '',
                exp.note || ''
            ].join(',');
            csv += row + '\n';
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `expense-tracker-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        
        UIModule.showNotification('CSV exported successfully!');
    };

    // Export data
    const exportData = async () => {
        try {
            const jsonData = await StorageModule.exportAsJSON();
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `couple-expense-backup-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            UIModule.showNotification('Data exported successfully!');
        } catch (error) {
            UIModule.showNotification('Error exporting data', 'error');
            console.error(error);
        }
    };

    // Import data
    const importData = () => {
        document.getElementById('importInput').click();
    };

    // Handle import
    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const jsonData = event.target.result;
                await StorageModule.importFromJSON(jsonData);
                UIModule.showNotification('Data imported successfully!');
                await loadExpenses();
                e.target.value = '';
            } catch (error) {
                UIModule.showNotification('Error importing data', 'error');
                console.error(error);
            }
        };
        reader.readAsText(file);
    };

    // Clear all data
    const clearAllData = async () => {
        if (!confirm('This will delete ALL expenses and settings. Are you sure?')) return;

        try {
            await StorageModule.clearExpenses();
            localStorage.removeItem('person1Name');
            localStorage.removeItem('person2Name');
            UIModule.showNotification('All data cleared');
            await loadExpenses();
            loadPersonNames();
        } catch (error) {
            UIModule.showNotification('Error clearing data', 'error');
            console.error(error);
        }
    };

    // Update person names
    const updatePersonNames = () => {
        const person1Name = document.getElementById('person1Name').value || 'Person 1';
        const person2Name = document.getElementById('person2Name').value || 'Person 2';
        
        localStorage.setItem('person1Name', person1Name);
        localStorage.setItem('person2Name', person2Name);
        
        UIModule.showNotification('Person names updated');
    };

    // Switch sections (for navigation)
    const switchSection = (sectionId) => {
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById(sectionId).classList.add('active');
        
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        if (event && event.target) {
            event.target.classList.add('active');
        }
        
        document.querySelectorAll('.bottom-nav-btn').forEach(btn => btn.classList.remove('active'));
        
        if (sectionId === 'summaries') {
            updateSummaries();
        } else if (sectionId === 'overview') {
            loadExpenses();
        }
    };

    // Make delete accessible from UI
    window.handleDeleteExpense = handleDeleteExpense;
    window.handleEditExpense = (id) => {
        UIModule.showNotification('Edit feature coming soon', 'error');
    };

    // Expose functions globally
    window.switchSection = switchSection;
    window.updatePersonNames = updatePersonNames;
    window.exportToCSV = exportToCSV;
    window.exportData = exportData;
    window.importData = importData;
    window.handleImport = handleImport;
    window.clearAllData = clearAllData;
    window.setDateFilter = setDateFilter;
    window.toggleDatePickerFilter = toggleDatePickerFilter;
    window.applyCustomDateFilter = applyCustomDateFilter;
    window.resetExpenseForm = resetExpenseForm;

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
