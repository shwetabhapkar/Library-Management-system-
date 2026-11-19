/**
 * Library Management System
 * Vanilla JavaScript Implementation using Browser LocalStorage
 */

// ==========================================
// 1. Initial State & Sample Demonstration Data
// ==========================================
const STORAGE_KEYS = {
  BOOKS: 'lms_books_v1',
  ISSUES: 'lms_issues_v1',
  RETURNS: 'lms_returns_v1',
  INITIALIZED: 'lms_initialized_v1'
};

const SAMPLE_BOOKS = [
  { id: 'B101', name: 'Cloud Computing Concepts', author: 'Rajkumar Buyya', totalQty: 5, availableQty: 4 },
  { id: 'B102', name: 'Database System Concepts', author: 'Silberschatz & Korth', totalQty: 4, availableQty: 3 },
  { id: 'B103', name: 'Operating System Principles', author: 'Abraham Silberschatz', totalQty: 3, availableQty: 3 },
  { id: 'B104', name: 'Clean Code: Agile Software', author: 'Robert C. Martin', totalQty: 2, availableQty: 2 },
  { id: 'B105', name: 'Computer Networking: Top Down', author: 'James Kurose', totalQty: 4, availableQty: 3 }
];

const SAMPLE_ISSUES = [
  {
    issueId: 'ISS-1001',
    bookId: 'B101',
    bookName: 'Cloud Computing Concepts',
    studentName: 'Tulsi Ganesh',
    issueDate: '2026-11-10',
    status: 'Issued'
  },
  {
    issueId: 'ISS-1002',
    bookId: 'B102',
    bookName: 'Database System Concepts',
    studentName: 'Aditi Dhokte',
    issueDate: '2026-11-12',
    status: 'Issued'
  },
  {
    issueId: 'ISS-1003',
    bookId: 'B105',
    bookName: 'Computer Networking: Top Down',
    studentName: 'Rohan Sharma',
    issueDate: '2026-11-15',
    status: 'Issued'
  }
];

const SAMPLE_RETURNS = [
  {
    returnId: 'RET-1001',
    issueId: 'ISS-1000',
    bookId: 'B103',
    bookName: 'Operating System Principles',
    studentName: 'Pooja Verma',
    issueDate: '2026-10-25',
    returnDate: '2026-11-05',
    status: 'Returned'
  }
];

// In-Memory State
let books = [];
let issues = [];
let returns = [];

// ==========================================
// 2. Data Persistence (LocalStorage)
// ==========================================
function initStorage() {
  const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);

  if (!isInitialized) {
    // First time setup - populate sample demo data
    books = [...SAMPLE_BOOKS];
    issues = [...SAMPLE_ISSUES];
    returns = [...SAMPLE_RETURNS];
    saveToStorage();
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  } else {
    // Load existing user data from LocalStorage
    try {
      books = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKS)) || [];
      issues = JSON.parse(localStorage.getItem(STORAGE_KEYS.ISSUES)) || [];
      returns = JSON.parse(localStorage.getItem(STORAGE_KEYS.RETURNS)) || [];
    } catch (e) {
      console.error('Error loading data from localStorage:', e);
      books = [...SAMPLE_BOOKS];
      issues = [...SAMPLE_ISSUES];
      returns = [...SAMPLE_RETURNS];
      saveToStorage();
    }
  }
}

function saveToStorage() {
  localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
  localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(issues));
  localStorage.setItem(STORAGE_KEYS.RETURNS, JSON.stringify(returns));
}

function resetToSampleData() {
  if (confirm('Are you sure you want to reset all data back to the default sample records?')) {
    books = [...SAMPLE_BOOKS];
    issues = [...SAMPLE_ISSUES];
    returns = [...SAMPLE_RETURNS];
    saveToStorage();
    showToast('Reset to demo sample data successfully!', 'success');
    renderAll();
  }
}

// ==========================================
// 3. UI Navigation & Tab Switching
// ==========================================
function switchTab(tabId) {
  // Update sidebar active buttons
  const navButtons = document.querySelectorAll('.nav-item');
  navButtons.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
  });

  // Update tab sections
  const sections = document.querySelectorAll('.tab-section');
  sections.forEach(sec => {
    sec.classList.toggle('active', sec.id === `tab-${tabId}`);
  });

  // Update page header title
  const titles = {
    dashboard: 'Library Dashboard',
    books: 'Manage Book Inventory',
    issue: 'Issue Books to Students',
    return: 'Return Issued Books',
    records: 'Search & View Records'
  };
  const pageTitle = document.getElementById('pageTitle');
  if (pageTitle && titles[tabId]) {
    pageTitle.textContent = titles[tabId];
  }

  // Close mobile sidebar if open
  const sidebar = document.getElementById('sidebar');
  if (sidebar && sidebar.classList.contains('open')) {
    sidebar.classList.remove('open');
  }

  // Refresh dynamic contents
  renderAll();
}

// ==========================================
// 4. Toast Notifications
// ==========================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  } else if (type === 'error') {
    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
  } else {
    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  }

  toast.innerHTML = `${iconSvg}<span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    toast.addEventListener('animationend', () => toast.remove());
  }, 3200);
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ==========================================
// 5. Dashboard Calculations & Rendering
// ==========================================
function updateDashboard() {
  const totalBooksCount = books.reduce((sum, b) => sum + (parseInt(b.totalQty) || 0), 0);
  const availBooksCount = books.reduce((sum, b) => sum + (parseInt(b.availableQty) || 0), 0);
  const issuedBooksCount = issues.length;
  const returnedBooksCount = returns.length;

  // Stat numbers
  const dashTotal = document.getElementById('dashTotalBooks');
  const dashTitles = document.getElementById('dashTotalTitles');
  const dashAvail = document.getElementById('dashAvailBooks');
  const dashIssued = document.getElementById('dashIssuedBooks');
  const dashReturned = document.getElementById('dashReturnedBooks');

  if (dashTotal) dashTotal.textContent = totalBooksCount;
  if (dashTitles) dashTitles.textContent = `${books.length} Unique Titles`;
  if (dashAvail) dashAvail.textContent = availBooksCount;
  if (dashIssued) dashIssued.textContent = issuedBooksCount;
  if (dashReturned) dashReturned.textContent = returnedBooksCount;

  // Dashboard preview tables
  renderDashboardTables();
}

function renderDashboardTables() {
  // Books In Library (first 5)
  const booksTbody = document.getElementById('dashBooksTableBody');
  if (booksTbody) {
    if (books.length === 0) {
      booksTbody.innerHTML = `<tr><td colspan="4" class="empty-state">No books in catalog yet.</td></tr>`;
    } else {
      booksTbody.innerHTML = books.slice(0, 5).map(b => `
        <tr>
          <td><strong>${escapeHtml(b.id)}</strong></td>
          <td>${escapeHtml(b.name)}</td>
          <td>${escapeHtml(b.author)}</td>
          <td>
            <span class="badge ${b.availableQty > 0 ? 'badge-available' : 'badge-out-of-stock'}">
              ${b.availableQty} / ${b.totalQty} Available
            </span>
          </td>
        </tr>
      `).join('');
    }
  }

  // Currently Issued Books (first 5)
  const issuedTbody = document.getElementById('dashIssuedTableBody');
  if (issuedTbody) {
    if (issues.length === 0) {
      issuedTbody.innerHTML = `<tr><td colspan="4" class="empty-state">No active issued books.</td></tr>`;
    } else {
      issuedTbody.innerHTML = issues.slice(0, 5).map(iss => `
        <tr>
          <td><strong>${escapeHtml(iss.bookName)}</strong><br><small class="helper-text">${escapeHtml(iss.bookId)}</small></td>
          <td>${escapeHtml(iss.studentName)}</td>
          <td>${escapeHtml(iss.issueDate)}</td>
          <td><span class="badge badge-issued">Issued</span></td>
        </tr>
      `).join('');
    }
  }
}

// ==========================================
// 6. Feature 1: Book Management
// ==========================================
function renderBooksTable(filterText = '') {
  const tbody = document.getElementById('booksTableBody');
  if (!tbody) return;

  const search = filterText.toLowerCase().trim();
  const filtered = books.filter(b => 
    b.id.toLowerCase().includes(search) ||
    b.name.toLowerCase().includes(search) ||
    b.author.toLowerCase().includes(search)
  );

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-state">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          No matching books found in inventory.
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(b => {
    const isAvail = b.availableQty > 0;
    const statusBadge = isAvail
      ? `<span class="badge badge-available">In Stock</span>`
      : `<span class="badge badge-out-of-stock">Out of Stock</span>`;

    return `
      <tr>
        <td><strong>${escapeHtml(b.id)}</strong></td>
        <td>${escapeHtml(b.name)}</td>
        <td>${escapeHtml(b.author)}</td>
        <td>${b.totalQty}</td>
        <td><strong>${b.availableQty}</strong></td>
        <td>${statusBadge}</td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="deleteBook('${escapeHtml(b.id)}')">
            Delete
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function handleAddBook(e) {
  e.preventDefault();

  const idInput = document.getElementById('bookId');
  const nameInput = document.getElementById('bookName');
  const authorInput = document.getElementById('authorName');
  const qtyInput = document.getElementById('quantity');

  const id = idInput.value.trim().toUpperCase();
  const name = nameInput.value.trim();
  const author = authorInput.value.trim();
  const qty = parseInt(qtyInput.value);

  // Validations
  if (!id || !name || !author || isNaN(qty) || qty < 1) {
    showToast('Please fill all required fields properly.', 'error');
    return;
  }

  // Duplicate Book ID Check
  const exists = books.some(b => b.id.toUpperCase() === id);
  if (exists) {
    showToast(`Book ID "${id}" already exists. Please use a unique ID.`, 'error');
    idInput.focus();
    return;
  }

  // Add book to state
  const newBook = {
    id: id,
    name: name,
    author: author,
    totalQty: qty,
    availableQty: qty
  };

  books.unshift(newBook);
  saveToStorage();
  showToast(`Book "${name}" added successfully!`, 'success');

  // Reset form
  document.getElementById('addBookForm').reset();
  document.getElementById('quantity').value = 1;

  renderAll();
}

function deleteBook(bookId) {
  const book = books.find(b => b.id === bookId);
  if (!book) return;

  // Prevent deleting books that are currently issued
  const activeIssues = issues.filter(iss => iss.bookId === bookId);
  if (activeIssues.length > 0) {
    showToast(`Cannot delete "${book.name}". There are ${activeIssues.length} active issue(s) for this book.`, 'error');
    return;
  }

  if (confirm(`Are you sure you want to delete "${book.name}" (ID: ${book.id}) from the library?`)) {
    books = books.filter(b => b.id !== bookId);
    saveToStorage();
    showToast(`Book "${book.name}" deleted.`, 'success');
    renderAll();
  }
}

// ==========================================
// 7. Feature 2: Issue Books
// ==========================================
function populateIssueBookSelect() {
  const select = document.getElementById('issueBookSelect');
  if (!select) return;

  const currentVal = select.value;
  select.innerHTML = `<option value="">-- Choose an available book --</option>`;

  books.forEach(b => {
    const isAvail = b.availableQty > 0;
    const option = document.createElement('option');
    option.value = b.id;
    option.textContent = `${b.name} (${b.id}) — ${b.availableQty} Available`;
    if (!isAvail) {
      option.disabled = true;
      option.textContent += ' [Out of Stock]';
    }
    select.appendChild(option);
  });

  if (currentVal && books.some(b => b.id === currentVal && b.availableQty > 0)) {
    select.value = currentVal;
  }
}

function renderActiveIssuesTable() {
  const tbody = document.getElementById('activeIssuesTableBody');
  if (!tbody) return;

  if (issues.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty-state">No books currently issued.</td></tr>`;
    return;
  }

  tbody.innerHTML = issues.map(iss => `
    <tr>
      <td><strong>${escapeHtml(iss.issueId)}</strong></td>
      <td>${escapeHtml(iss.bookId)}</td>
      <td>${escapeHtml(iss.bookName)}</td>
      <td>${escapeHtml(iss.studentName)}</td>
      <td>${escapeHtml(iss.issueDate)}</td>
      <td><span class="badge badge-issued">Issued</span></td>
    </tr>
  `).join('');
}

// Helper to generate unique, collision-free Issue IDs
function generateNextIssueId() {
  const existingIds = new Set([
    ...issues.map(i => i.issueId),
    ...returns.map(r => r.issueId)
  ]);

  let maxNum = 1000;
  existingIds.forEach(id => {
    if (typeof id === 'string') {
      const match = id.match(/ISS-(\d+)/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) {
          maxNum = num;
        }
      }
    }
  });

  let nextNum = maxNum + 1;
  while (existingIds.has('ISS-' + nextNum)) {
    nextNum++;
  }

  return 'ISS-' + nextNum;
}

function handleIssueBook(e) {
  e.preventDefault();

  const studentInput = document.getElementById('studentName');
  const bookSelect = document.getElementById('issueBookSelect');
  const dateInput = document.getElementById('issueDate');

  const studentName = studentInput.value.trim();
  const bookId = bookSelect.value;
  const issueDate = dateInput.value;

  if (!studentName || !bookId || !issueDate) {
    showToast('Please fill all issue details.', 'error');
    return;
  }

  // Find book and verify stock
  const bookIndex = books.findIndex(b => b.id === bookId);
  if (bookIndex === -1) {
    showToast('Selected book not found.', 'error');
    return;
  }

  const book = books[bookIndex];
  if (book.availableQty <= 0) {
    showToast(`Sorry, "${book.name}" is currently out of stock.`, 'error');
    return;
  }

  // Generate Collision-Free Issue ID
  const issueId = generateNextIssueId();

  // Create issue record
  const newIssue = {
    issueId: issueId,
    bookId: book.id,
    bookName: book.name,
    studentName: studentName,
    issueDate: issueDate,
    status: 'Issued'
  };

  // Decrement available stock
  book.availableQty -= 1;
  issues.unshift(newIssue);

  saveToStorage();
  showToast(`Book "${book.name}" issued to ${studentName}!`, 'success');

  // Reset form
  studentInput.value = '';
  bookSelect.value = '';
  setDefaultIssueDate();

  renderAll();
}

// ==========================================
// 8. Feature 3: Return Books
// ==========================================
function renderReturnTable(filterText = '') {
  const tbody = document.getElementById('returnTableBody');
  if (!tbody) return;

  const search = filterText.toLowerCase().trim();
  const filtered = issues.filter(iss =>
    iss.issueId.toLowerCase().includes(search) ||
    iss.bookId.toLowerCase().includes(search) ||
    iss.bookName.toLowerCase().includes(search) ||
    iss.studentName.toLowerCase().includes(search)
  );

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="empty-state">No matching issued books found for return.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(iss => `
    <tr>
      <td><strong>${escapeHtml(iss.issueId)}</strong></td>
      <td>${escapeHtml(iss.bookId)}</td>
      <td>${escapeHtml(iss.bookName)}</td>
      <td>${escapeHtml(iss.studentName)}</td>
      <td>${escapeHtml(iss.issueDate)}</td>
      <td><span class="badge badge-issued">Issued</span></td>
      <td>
        <button class="btn btn-sm btn-success" onclick="returnBook('${escapeHtml(iss.issueId)}')">
          Return Book
        </button>
      </td>
    </tr>
  `).join('');
}

function renderReturnedHistoryTable() {
  const tbody = document.getElementById('returnedHistoryTableBody');
  if (!tbody) return;

  if (returns.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty-state">No returned books in history yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = returns.map(ret => `
    <tr>
      <td><strong>${escapeHtml(ret.issueId)}</strong></td>
      <td>${escapeHtml(ret.bookName)}</td>
      <td>${escapeHtml(ret.studentName)}</td>
      <td>${escapeHtml(ret.issueDate)}</td>
      <td>${escapeHtml(ret.returnDate)}</td>
      <td><span class="badge badge-returned">Returned</span></td>
    </tr>
  `).join('');
}

function returnBook(issueId) {
  const issueIndex = issues.findIndex(iss => iss.issueId === issueId);
  if (issueIndex === -1) {
    showToast('Issue record not found or already returned.', 'error');
    return;
  }

  const issue = issues[issueIndex];
  const returnDate = new Date().toISOString().split('T')[0];

  if (!confirm(`Confirm return for "${issue.bookName}" borrowed by ${issue.studentName}?`)) {
    return;
  }

  // Increase book's available stock
  const bookIndex = books.findIndex(b => b.id === issue.bookId);
  if (bookIndex !== -1) {
    if (books[bookIndex].availableQty < books[bookIndex].totalQty) {
      books[bookIndex].availableQty += 1;
    }
  }

  // Archive in returns list
  const returnRecord = {
    returnId: 'RET-' + (1000 + returns.length + 1),
    issueId: issue.issueId,
    bookId: issue.bookId,
    bookName: issue.bookName,
    studentName: issue.studentName,
    issueDate: issue.issueDate,
    returnDate: returnDate,
    status: 'Returned'
  };

  returns.unshift(returnRecord);
  // Remove from active issues
  issues.splice(issueIndex, 1);

  saveToStorage();
  showToast(`Book "${issue.bookName}" returned successfully! Available stock updated.`, 'success');

  renderAll();
}

// ==========================================
// 9. Feature 4: Search & View Records
// ==========================================
let currentFilter = 'all';

function renderRecordsTable() {
  const thead = document.getElementById('recordsTableHeader');
  const tbody = document.getElementById('recordsTableBody');
  const searchInput = document.getElementById('globalSearchInput');
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

  if (!thead || !tbody) return;

  if (currentFilter === 'all' || currentFilter === 'available') {
    thead.innerHTML = `
      <tr>
        <th>Book ID</th>
        <th>Book Name</th>
        <th>Author</th>
        <th>Total Qty</th>
        <th>Available Qty</th>
        <th>Status</th>
      </tr>
    `;

    let list = books;
    if (currentFilter === 'available') {
      list = list.filter(b => b.availableQty > 0);
    }
    if (query) {
      list = list.filter(b =>
        b.id.toLowerCase().includes(query) ||
        b.name.toLowerCase().includes(query) ||
        b.author.toLowerCase().includes(query)
      );
    }

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="empty-state">No matching books found.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(b => `
      <tr>
        <td><strong>${escapeHtml(b.id)}</strong></td>
        <td>${escapeHtml(b.name)}</td>
        <td>${escapeHtml(b.author)}</td>
        <td>${b.totalQty}</td>
        <td><strong>${b.availableQty}</strong></td>
        <td>
          <span class="badge ${b.availableQty > 0 ? 'badge-available' : 'badge-out-of-stock'}">
            ${b.availableQty > 0 ? 'Available' : 'Out of Stock'}
          </span>
        </td>
      </tr>
    `).join('');

  } else if (currentFilter === 'issued') {
    thead.innerHTML = `
      <tr>
        <th>Issue ID</th>
        <th>Book ID</th>
        <th>Book Name</th>
        <th>Student Name</th>
        <th>Issue Date</th>
        <th>Status</th>
      </tr>
    `;

    let list = issues;
    if (query) {
      list = list.filter(iss =>
        iss.issueId.toLowerCase().includes(query) ||
        iss.bookId.toLowerCase().includes(query) ||
        iss.bookName.toLowerCase().includes(query) ||
        iss.studentName.toLowerCase().includes(query)
      );
    }

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="empty-state">No matching issued records found.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(iss => `
      <tr>
        <td><strong>${escapeHtml(iss.issueId)}</strong></td>
        <td>${escapeHtml(iss.bookId)}</td>
        <td>${escapeHtml(iss.bookName)}</td>
        <td>${escapeHtml(iss.studentName)}</td>
        <td>${escapeHtml(iss.issueDate)}</td>
        <td><span class="badge badge-issued">Currently Issued</span></td>
      </tr>
    `).join('');

  } else if (currentFilter === 'returned') {
    thead.innerHTML = `
      <tr>
        <th>Return ID</th>
        <th>Book Name</th>
        <th>Student Name</th>
        <th>Issue Date</th>
        <th>Return Date</th>
        <th>Status</th>
      </tr>
    `;

    let list = returns;
    if (query) {
      list = list.filter(ret =>
        ret.returnId.toLowerCase().includes(query) ||
        ret.bookName.toLowerCase().includes(query) ||
        ret.studentName.toLowerCase().includes(query) ||
        ret.bookId.toLowerCase().includes(query)
      );
    }

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="empty-state">No matching returned records found.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(ret => `
      <tr>
        <td><strong>${escapeHtml(ret.returnId)}</strong></td>
        <td>${escapeHtml(ret.bookName)}</td>
        <td>${escapeHtml(ret.studentName)}</td>
        <td>${escapeHtml(ret.issueDate)}</td>
        <td>${escapeHtml(ret.returnDate)}</td>
        <td><span class="badge badge-returned">Returned</span></td>
      </tr>
    `).join('');
  }
}

// ==========================================
// 10. Global Refresh Helper
// ==========================================
function renderAll() {
  updateDashboard();
  renderBooksTable(document.getElementById('booksSearchInput')?.value || '');
  populateIssueBookSelect();
  renderActiveIssuesTable();
  renderReturnTable(document.getElementById('returnSearchInput')?.value || '');
  renderReturnedHistoryTable();
  renderRecordsTable();
}

function setDefaultIssueDate() {
  const issueDateInput = document.getElementById('issueDate');
  if (issueDateInput && !issueDateInput.value) {
    const today = new Date().toISOString().split('T')[0];
    issueDateInput.value = today;
  }
}

// ==========================================
// 11. Event Listeners & Initialization
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize storage
  initStorage();

  // Set today's date in Issue Form
  setDefaultIssueDate();

  // Navigation tab click handlers
  document.querySelectorAll('.nav-item').forEach(button => {
    button.addEventListener('click', () => {
      const tab = button.getAttribute('data-tab');
      switchTab(tab);
    });
  });

  // Mobile sidebar toggle
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
  const sidebar = document.getElementById('sidebar');

  if (menuToggleBtn && sidebar) {
    menuToggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  if (sidebarCloseBtn && sidebar) {
    sidebarCloseBtn.addEventListener('click', () => {
      sidebar.classList.remove('open');
    });
  }

  // Reset sample data button
  const resetBtn = document.getElementById('resetDataBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetToSampleData);
  }

  // Form Submissions
  const addBookForm = document.getElementById('addBookForm');
  if (addBookForm) {
    addBookForm.addEventListener('submit', handleAddBook);
  }

  const issueBookForm = document.getElementById('issueBookForm');
  if (issueBookForm) {
    issueBookForm.addEventListener('submit', handleIssueBook);
  }

  // Live Search Filters
  const booksSearch = document.getElementById('booksSearchInput');
  if (booksSearch) {
    booksSearch.addEventListener('input', (e) => {
      renderBooksTable(e.target.value);
    });
  }

  const returnSearch = document.getElementById('returnSearchInput');
  if (returnSearch) {
    returnSearch.addEventListener('input', (e) => {
      renderReturnTable(e.target.value);
    });
  }

  const globalSearch = document.getElementById('globalSearchInput');
  if (globalSearch) {
    globalSearch.addEventListener('input', () => {
      renderRecordsTable();
    });
  }

  // Record Filter Tab Buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      renderRecordsTable();
    });
  });

  // Initial Full Render
  renderAll();
});

