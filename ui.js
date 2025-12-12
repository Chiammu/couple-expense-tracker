// UI Module - Handles DOM manipulation and theme management

const UIModule = (() => {
  let currentTheme = localStorage.getItem('theme') || 'light-theme';

  // Initialize UI
  const init = () => {
    applyTheme(currentTheme);
    setupTabNavigation();
  };

  // Apply theme
  const applyTheme = (theme) => {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(theme);
    localStorage.setItem('theme', theme);
    currentTheme = theme;
  };

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = currentTheme === 'light-theme' ? 'dark-theme' : 'light-theme';
    applyTheme(newTheme);
  };

  // Get current theme
  const getTheme = () => currentTheme;

  // Setup tab navigation
  const setupTabNavigation = () => {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
              e.preventDefault();
        const tabName = btn.getAttribute('data-tab');
        switchTab(tabName, tabButtons, tabContents);
      });
    });
  };

  // Switch tab
  const switchTab = (tabName, tabButtons, tabContents) => {
    tabButtons.forEach((btn) => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-tab') === tabName) {
        btn.classList.add('active');
      }
    });

    tabContents.forEach((content) => {
      content.classList.remove('active');
      if (content.getAttribute('data-tab-content') === tabName) {
        content.classList.add('active');
      }
    });
  };

  // Render expense list
  const renderExpenses = (expenses, containerId, deleteCallback, editCallback) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (expenses.length === 0) {
      container.innerHTML = '<p class="text-center" style="padding: 20px; opacity: 0.6;">No expenses yet. Add one to get started!</p>';
      return;
    }

    const html = expenses.map((expense) => `
      <li class="expense-item">
        <div class="expense-info">
          <strong>${expense.description}</strong>
          <div class="expense-category">${expense.category} • ${new Date(expense.date).toLocaleDateString()}</div>
        </div>
        <div class="expense-amount">₹${expense.amount.toFixed(2)}</div>
        <div class="expense-actions">
          <button class="btn btn-small" onclick="UIModule.handleEditExpense(${expense.id})">Edit</button>
          <button class="btn btn-small btn-danger" onclick="UIModule.handleDeleteExpense(${expense.id})">Delete</button>
        </div>
      </li>
    `).join('');

    container.innerHTML = `<ul class="expense-list">${html}</ul>`;
  };

  // Update summary
  const updateSummary = (total, spent, remaining) => {
    const summaryContainer = document.getElementById('summaryContainer');
    if (!summaryContainer) return;

    summaryContainer.innerHTML = `
      <div class="summary-grid">
        <div class="summary-box">
          <div class="summary-label">Total Budget</div>
          <div class="summary-value">₹${total.toFixed(2)}</div>
        </div>
        <div class="summary-box">
          <div class="summary-label">Total Spent</div>
          <div class="summary-value">₹${spent.toFixed(2)}</div>
        </div>
        <div class="summary-box">
          <div class="summary-label">Remaining</div>
          <div class="summary-value" style="color: ${remaining >= 0 ? '#27ae60' : '#e74c3c'};">₹${remaining.toFixed(2)}</div>
        </div>
        <div class="summary-box">
          <div class="summary-label">Spent %</div>
          <div class="summary-value">${total > 0 ? ((spent / total) * 100).toFixed(1) : 0}%</div>
        </div>
      </div>
    `;
  };

  // Show notification
  const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = 'position: fixed; top: 20px; right: 20px; padding: 15px 20px; background: ' + (type === 'success' ? '#27ae60' : '#e74c3c') + '; color: white; border-radius: 4px; z-index: 1000;';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  // Get form values
  const getFormValues = (formId) => {
    const form = document.getElementById(formId);
    if (!form) return null;

    const formData = new FormData(form);
    return Object.fromEntries(formData);
  };

  // Clear form
  const clearForm = (formId) => {
    const form = document.getElementById(formId);
    if (form) form.reset();
  };

  // Show/hide element
  const toggleElement = (elementId, show) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.style.display = show ? 'block' : 'none';
    }
  };

  return {
    init,
    applyTheme,
    toggleTheme,
    getTheme,
    setupTabNavigation,
    switchTab,
    renderExpenses,
    updateSummary,
    showNotification,
    getFormValues,
    clearForm,
    toggleElement
  };
})();

// Initialize UI when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => UIModule.init());
} else {
  UIModule.init();
}
