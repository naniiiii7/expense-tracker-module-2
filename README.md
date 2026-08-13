# Expense Tracker

A beginner-friendly personal Expense Tracker built with HTML, CSS, and JavaScript.

## Features

- Add expenses
- Categorize expenses
- Store data in browser localStorage
- View total spending
- View current-month spending
- View transaction count
- Calculate average expense
- Category spending breakdown
- Search expenses
- Filter by category
- Delete individual expenses
- Clear all expenses
- Responsive design

## Technologies

- HTML5
- CSS3
- JavaScript
- Browser localStorage

## Project Structure

```text
expense-tracker/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── README.md
└── .gitignore
```

## How to Run

### VS Code + Live Server

1. Open this folder in VS Code.
2. Install the **Live Server** extension if needed.
3. Right-click `index.html`.
4. Select **Open with Live Server**.
5. The application opens in your browser.

No Python, Node.js, database, or external package is required.

## Data Storage

Expenses are stored in the browser's `localStorage`. Data is specific to the browser/device and is not stored in a server database.

## GitHub

```bash
git init
git add .
git commit -m "Build expense tracker"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/expense-tracker.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username.

## Future Improvements

- Edit expenses
- Monthly reports
- Export to CSV
- Login/authentication
- Cloud database
- Budget limits
- Charts
