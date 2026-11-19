# Library Management System

A simple, modern, and responsive **Library Management System** web application developed for academic evaluation and demonstration. Built using pure **HTML5, CSS3, and JavaScript**, this application manages book inventories, tracks student book issues and returns, and provides real-time dashboard analytics using browser **LocalStorage** without requiring any backend server or external database.

---

## 📌 Project Overview

Traditional library record-keeping using paper registers or spreadsheets is prone to data discrepancies, calculation errors, and delays in locating records. This project provides a fast, digital, and intuitive interface designed for educational institutions.

### ✨ Key Features
1. **Interactive Dashboard**:
   - Real-time stat cards: **Total Books**, **Available Books**, **Currently Issued Books**, and **Returned Books**.
   - Overview tables showing books in library and active student issues.
   - Automatically synchronizes across all operations.

2. **Book Inventory Management**:
   - Add new books with Book ID, Book Name, Author, and Total Quantity.
   - Live availability tracking (Calculates *Total Quantity* vs *Available Copies*).
   - Validation checks to prevent duplicate Book IDs.
   - Delete book protection (prevents deleting books that are currently issued to students).

3. **Issue Book Module**:
   - Issue books to students with Student Name, Book Selection, and Issue Date.
   - Auto-checks inventory stock; prevents issuing if quantity is zero.
   - Decreases available book quantity automatically upon issue.

4. **Return Book Module**:
   - Lists all actively issued books.
   - One-click **Return Book** action that automatically restores the book quantity to available inventory.
   - Archives completed return transactions with return timestamps.
   - Prevents returning the same book twice.

5. **Search and Records Filter**:
   - Instant search across Book ID, Book Title, Author Name, and Student Name.
   - Filter tabs: **All Books**, **Available Books**, **Currently Issued**, and **Returned History**.

6. **Local Storage Persistence**:
   - Retains all records upon browser refresh or tab restart.
   - Ships with sample pre-loaded demonstration data for immediate presentation.
   - Includes a *Reset Sample Data* button for testing.

---

## 🛠️ Technologies Used

| Technology | Purpose |
| :--- | :--- |
| **HTML5** | Semantic structure, forms, data tables, and modal elements. |
| **CSS3** | Modern blue-and-white theme, CSS Grid & Flexbox, responsive sidebar layout, and badge indicators. |
| **JavaScript (ES6+)** | State management, DOM manipulation, form validation, date handling, and calculations. |
| **LocalStorage API** | Browser-native client-side persistent data storage (JSON format). |
| **Git & GitHub** | Version control, branch management, and repository hosting. |
| **GitHub Pages** | Cloud hosting for static web deployment. |

---

## 📂 Project File Structure

```text
Library-Management-System/
├── index.html       # Main application markup & dashboard views
├── style.css        # Professional styling, responsive layouts, color theme
├── script.js        # Business logic, state management, LocalStorage CRUD
└── README.md        # Project documentation and deployment guide
```

---

## 🚀 How to Run the Application Locally

1. **Clone or Download the Repository**:
   ```bash
   git clone https://github.com/shwetabhapkar/Library-Management-system-.git
   cd Library-Management-system-
   ```

2. **Open in Browser**:
   - Double-click `index.html` to open it in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).
   - *OR* use a live server extension (like VS Code Live Server) to view at `http://127.0.0.1:5500`.

---

## 🌐 Deployment to GitHub Pages

Because this application is 100% static with no backend dependencies, it can be deployed to GitHub Pages in seconds:

1. Push the code to GitHub:
   ```bash
   git add .
   git commit -m "Add Library Management System application"
   git push -u origin main
   ```
2. In your GitHub repository:
   - Navigate to **Settings** > **Pages** (under Code and automation).
   - Under **Build and deployment** > **Branch**, select `main` and `/ (root)`.
   - Click **Save**.
3. GitHub Pages will generate your live public URL within 1-2 minutes:
   ```text
   https://<your-username>.github.io/<repository-name>/
   ```

---

## 🧪 Testing Checklist

- [x] **Add Book**: Added new book with unique ID, verified it shows in table and updates Total Books count.
- [x] **Duplicate Prevention**: Attempted to add existing Book ID, verified error toast notification.
- [x] **Issue Book**: Issued book to student, verified available quantity decreased by 1 and issued counter increased.
- [x] **Out of Stock Check**: Stock depletion verified; disabled from issue selection when available copies hit 0.
- [x] **Return Book**: Returned issued book, verified available quantity restored and returned counter incremented.
- [x] **Delete Protection**: Prevented deleting a book with active student issues.
- [x] **Search & Filter**: Verified real-time search across inventory, active issues, and return logs.
- [x] **LocalStorage Persistence**: Refreshed browser; verified all user changes and data remain intact.
