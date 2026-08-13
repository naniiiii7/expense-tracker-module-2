const STORAGE_KEY = "expenseTrackerExpenses";

const form = document.getElementById("expenseForm");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const descriptionInput = document.getElementById("description");
const dateInput = document.getElementById("date");
const tableBody = document.getElementById("expenseTableBody");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const filterCategory = document.getElementById("filterCategory");

let expenses = loadExpenses();

dateInput.value = new Date().toISOString().split("T")[0];

function loadExpenses() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveExpenses() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
  }).format(value);
}

function addExpense(event) {
  event.preventDefault();

  const amount = Number(amountInput.value);
  const category = categoryInput.value;
  const description = descriptionInput.value.trim() || "No description";
  const date = dateInput.value;

  if (!amount || amount <= 0 || !category || !date) {
    alert("Please enter a valid amount, category, and date.");
    return;
  }

  expenses.unshift({
    id: Date.now(),
    amount,
    category,
    description,
    date
  });

  saveExpenses();
  form.reset();
  dateInput.value = new Date().toISOString().split("T")[0];
  render();
}

function deleteExpense(id) {
  expenses = expenses.filter(expense => expense.id !== id);
  saveExpenses();
  render();
}

function clearAll() {
  if (!expenses.length) return;
  if (confirm("Delete all expenses? This cannot be undone.")) {
    expenses = [];
    saveExpenses();
    render();
  }
}

function filteredExpenses() {
  const search = searchInput.value.toLowerCase().trim();
  const category = filterCategory.value;

  return expenses.filter(expense => {
    const matchesSearch =
      expense.description.toLowerCase().includes(search) ||
      expense.category.toLowerCase().includes(search);

    const matchesCategory =
      category === "All" || expense.category === category;

    return matchesSearch && matchesCategory;
  });
}

function renderSummary() {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const now = new Date();
  const monthly = expenses
    .filter(expense => {
      const d = new Date(expense.date + "T00:00:00");
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  const average = expenses.length ? total / expenses.length : 0;

  document.getElementById("totalSpent").textContent = formatCurrency(total);
  document.getElementById("monthlySpent").textContent = formatCurrency(monthly);
  document.getElementById("transactionCount").textContent = expenses.length;
  document.getElementById("averageExpense").textContent = formatCurrency(average);
}

function renderTable() {
  const visible = filteredExpenses();
  tableBody.innerHTML = "";

  emptyState.style.display = visible.length ? "none" : "block";

  visible.forEach(expense => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${escapeHtml(expense.date)}</td>
      <td>${escapeHtml(expense.description)}</td>
      <td>${escapeHtml(expense.category)}</td>
      <td class="amount">${formatCurrency(expense.amount)}</td>
      <td><button class="delete-btn" data-id="${expense.id}">Delete</button></td>
    `;
    tableBody.appendChild(row);
  });
}

function renderBreakdown() {
  const breakdown = document.getElementById("categoryBreakdown");
  breakdown.innerHTML = "";

  if (!expenses.length) {
    breakdown.innerHTML = '<p class="empty-state">Add expenses to see your spending breakdown.</p>';
    return;
  }

  const totals = {};
  expenses.forEach(expense => {
    totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
  });

  const total = Object.values(totals).reduce((a, b) => a + b, 0);

  Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .forEach(([category, amount]) => {
      const percentage = (amount / total) * 100;
      const item = document.createElement("div");
      item.className = "breakdown-item";
      item.innerHTML = `
        <div class="breakdown-row">
          <span>${escapeHtml(category)}</span>
          <strong>${formatCurrency(amount)}</strong>
        </div>
        <div class="bar"><span style="width:${percentage}%"></span></div>
      `;
      breakdown.appendChild(item);
    });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function render() {
  renderSummary();
  renderTable();
  renderBreakdown();
}

form.addEventListener("submit", addExpense);
searchInput.addEventListener("input", renderTable);
filterCategory.addEventListener("change", renderTable);
document.getElementById("clearAllBtn").addEventListener("click", clearAll);

tableBody.addEventListener("click", event => {
  if (event.target.classList.contains("delete-btn")) {
    deleteExpense(Number(event.target.dataset.id));
  }
});

render();
