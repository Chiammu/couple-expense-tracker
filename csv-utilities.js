/**
 * CSV Utilities - Import and Export CSV files
 * Handles conversion between CSV files and expense data
 */

class CSVUtilities {
  /**
   * Export expenses to CSV format
   * @param {Array} expenses - Array of expense objects
   * @returns {string} CSV formatted data
   */
  static exportToCSV(expenses) {
    if (!expenses || expenses.length === 0) {
      return 'Date,Person,Amount,Category,Payment Mode,Description\n';
    }

    const headers = ['Date', 'Person', 'Amount', 'Category', 'Payment Mode', 'Description'];
    const csvContent = [
      headers.join(','),
      ...expenses.map(exp => {
        const escapeCSV = (val) => {
          if (val === null || val === undefined) return '';
          const str = String(val);
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        };

        return [
          escapeCSV(exp.date),
          escapeCSV(exp.person),
          escapeCSV(exp.amount),
          escapeCSV(exp.category),
          escapeCSV(exp.mode),
          escapeCSV(exp.note)
        ].join(',');
      })
    ];

    return csvContent.join('\n');
  }

  /**
   * Download CSV file
   * @param {string} csvContent - CSV formatted content
   * @param {string} filename - Output filename
   */
  static downloadCSV(csvContent, filename = 'expenses.csv') {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Parse CSV file content
   * @param {string} csvContent - Raw CSV content
   * @returns {Array} Array of parsed expense objects
   */
  static parseCSV(csvContent) {
    const lines = csvContent.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length < 2) {
      throw new Error('CSV file is empty or invalid');
    }

    const headers = this.parseCSVLine(lines[0]);
    const expenses = [];

    // Map column indices
    const dateIdx = headers.findIndex(h => h.toLowerCase().includes('date'));
    const personIdx = headers.findIndex(h => h.toLowerCase().includes('person'));
    const amountIdx = headers.findIndex(h => h.toLowerCase().includes('amount'));
    const categoryIdx = headers.findIndex(h => h.toLowerCase().includes('category'));
    const modeIdx = headers.findIndex(h => h.toLowerCase().includes('mode') || h.toLowerCase().includes('payment'));
    const noteIdx = headers.findIndex(h => h.toLowerCase().includes('description') || h.toLowerCase().includes('note'));

    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i]);
      if (values.length === 0) continue;

      const expense = {
        id: 'exp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        date: dateIdx >= 0 ? values[dateIdx] : new Date().toISOString().split('T')[0],
        person: personIdx >= 0 ? values[personIdx] : 'Person1',
        amount: parseFloat(amountIdx >= 0 ? values[amountIdx] : 0),
        category: categoryIdx >= 0 ? values[categoryIdx] : 'Other',
        mode: modeIdx >= 0 ? values[modeIdx] : 'Cash',
        note: noteIdx >= 0 ? values[noteIdx] : ''
      };

      // Validate expense data
      if (isNaN(expense.amount)) {
        console.warn(`Invalid amount in row ${i + 1}, skipping...`);
        continue;
      }

      expenses.push(expense);
    }

    return expenses;
  }

  /**
   * Parse a single CSV line (handles quoted values)
   * @param {string} line - CSV line
   * @returns {Array} Parsed values
   */
  static parseCSVLine(line) {
    const result = [];
    let current = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        if (insideQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result;
  }

  /**
   * Import CSV file from file input
   * @param {File} file - File object
   * @returns {Promise<Array>} Promise resolving to array of expenses
   */
  static importFromFile(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No file selected'));
        return;
      }

      if (!file.name.toLowerCase().endsWith('.csv')) {
        reject(new Error('Please select a CSV file'));
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const content = e.target.result;
          const expenses = this.parseCSV(content);
          resolve(expenses);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsText(file);
    });
  }

  /**
   * Merge imported CSV expenses with existing expenses
   * @param {Array} newExpenses - Expenses from CSV
   * @param {Array} existingExpenses - Current expenses
   * @param {boolean} replace - Whether to replace existing data
   * @returns {Array} Merged expenses
   */
  static mergeExpenses(newExpenses, existingExpenses = [], replace = false) {
    if (replace) {
      return newExpenses;
    }

    // Merge: combine both arrays
    return [...existingExpenses, ...newExpenses];
  }
}

// Export for use in HTML
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CSVUtilities;
}
