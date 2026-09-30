let transactions = [];
alert("THIS IS MY CURRENT SCRIPT");
let editingId = null;

const transactionForm = document.getElementById("transactionForm");

const typeInput = document.getElementById("type");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const descriptionInput = document.getElementById("description");

const transactionList = document.getElementById("transactionList");

const totalIncome = document.getElementById("totalIncome");
const totalExpenses = document.getElementById("totalExpenses");
const currentBalance = document.getElementById("currentBalance");

const typeFilter = document.getElementById("typeFilter");
const categoryFilter = document.getElementById("categoryFilter");

const monthlySummary = document.getElementById("monthlySummary");

const submitButton = transactionForm.querySelector(".add");

const savedTransactions = localStorage.getItem("transactions");

if (savedTransactions) {
    transactions = JSON.parse(savedTransactions);
}

transactionForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const type = typeInput.value;
    const amount = Number(amountInput.value);
    const category = categoryInput.value.trim();
    const date = dateInput.value;
    const description = descriptionInput.value.trim();

    if (amount <= 0) {
        alert("Please enter an amount greater than 0.");
        return;
    }

    if (category === "") {
        alert("Please enter a category.");
        return;
    }

    if (date === "") {
        alert("Please select a date.");
        return;
    }

    if (description === "") {
        alert("Please enter a description.");
        return;
    }

    const transaction = {
        id: editingId === null ? Date.now() : editingId,
        type: type,
        amount: amount,
        category: category,
        date: date,
        description: description
    };

    if (editingId === null) {
        transactions.push(transaction);
    } else {

        const index = transactions.findIndex(function(transaction) {
            return transaction.id === editingId;
        });

        if (index !== -1) {
            transactions[index] = transaction;
        }

        editingId = null;
    }

    saveTransactions();

    renderTransactions();
    updateSummary();
    updateMonthlySummary();
    updateCategoryFilter();
    updateCategoryChart();

    transactionForm.reset();

    submitButton.textContent = "Add Transaction";
});

function saveTransactions() {
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}

function updateSummary() {

    let income = 0;
    let expenses = 0;

    transactions.forEach(function(transaction) {

        if (transaction.type === "income") {
            income += transaction.amount;
        } else if (transaction.type === "expense") {
            expenses += transaction.amount;
        }

    });

    const balance = income - expenses;

    totalIncome.textContent = income.toFixed(2);
    totalExpenses.textContent = expenses.toFixed(2);
    currentBalance.textContent = balance.toFixed(2);
}

function updateMonthlySummary() {

    const monthlyExpenses = {};

    transactions.forEach(function(transaction) {

        if (transaction.type === "expense") {

            const month = transaction.date.substring(0, 7);

            if (!monthlyExpenses[month]) {
                monthlyExpenses[month] = 0;
            }

            monthlyExpenses[month] += transaction.amount;
        }

    });

    monthlySummary.innerHTML = "";

    const months = Object.keys(monthlyExpenses)
        .sort()
        .reverse();

    if (months.length === 0) {

        monthlySummary.textContent =
            "No expense data available.";

        return;
    }

    months.forEach(function(month) {

        const monthItem = document.createElement("div");

        monthItem.className = "month-item";

        monthItem.innerHTML = `
            <span class="month-name">
                ${month}
            </span>

            <span class="month-amount">
                ${monthlyExpenses[month].toFixed(2)}
            </span>
        `;

        monthlySummary.appendChild(monthItem);
    });
}

function updateCategoryChart() {
    console.log(transactions);
    const categoryExpenses = {};

    transactions.forEach(function(transaction) {

        if (transaction.type === "expense") {

            if (!categoryExpenses[transaction.category]) {
                categoryExpenses[transaction.category] = 0;
            }

            categoryExpenses[transaction.category] += transaction.amount;
        }
    });

    const categoryChart = document.getElementById("categoryChart");

    categoryChart.innerHTML = "";

    const categories = Object.keys(categoryExpenses);

    if (categories.length === 0) {
        categoryChart.textContent = "No expense data available.";
        return;
    }

    let maxExpense = 0;

    categories.forEach(function(category) {

        if (categoryExpenses[category] > maxExpense) {
            maxExpense = categoryExpenses[category];
        }

    });

    categories.sort(function(a, b) {
        return categoryExpenses[b] - categoryExpenses[a];
    });

    categories.forEach(function(category) {

        const categoryItem = document.createElement("div");

        categoryItem.className = "category-item";

        const percentage =
            (categoryExpenses[category] / maxExpense) * 100;

        categoryItem.innerHTML = `

            <span class="category-name">
                ${category}
            </span>

            <div class="category-bar-container">

                <div
                    class="category-bar"
                    style="width: ${percentage}%">
                </div>

            </div>

            <span class="category-amount">
                ${categoryExpenses[category].toFixed(2)}
            </span>

        `;

        categoryChart.appendChild(categoryItem);

    });
}

function deleteTransaction(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this transaction?"
    );

    if (!confirmDelete) {
        return;
    }

    transactions = transactions.filter(function(transaction) {
        return transaction.id !== id;
    });

    saveTransactions();

    renderTransactions();
    updateSummary();
    updateMonthlySummary();
    updateCategoryFilter();
    updateCategoryChart();
}

function editTransaction(id) {

    const transaction = transactions.find(function(transaction) {
        return transaction.id === id;
    });

    if (!transaction) {
        return;
    }

    editingId = id;

    typeInput.value = transaction.type;
    amountInput.value = transaction.amount;
    categoryInput.value = transaction.category;
    dateInput.value = transaction.date;
    descriptionInput.value = transaction.description;

    submitButton.textContent = "Update Transaction";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function renderTransactions() {

    transactionList.innerHTML = "";

    const selectedType = typeFilter.value;
    const selectedCategory = categoryFilter.value;

    const filteredTransactions = transactions.filter(
        function(transaction) {

            const typeMatches =
                selectedType === "all" ||
                transaction.type === selectedType;

            const categoryMatches =
                selectedCategory === "all" ||
                transaction.category === selectedCategory;

            return typeMatches && categoryMatches;
        }
    );

    if (filteredTransactions.length === 0) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td colspan="5">
                No transactions found.
            </td>
        `;

        transactionList.appendChild(row);

        return;
    }

    filteredTransactions.forEach(function(transaction) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${transaction.date}</td>

            <td>${transaction.category}</td>

            <td>${transaction.description}</td>

            <td>${transaction.amount.toFixed(2)}</td>

            <td>
                <button onclick="editTransaction(${transaction.id})">
                    Edit
                </button>

                <button onclick="deleteTransaction(${transaction.id})">
                    Delete
                </button>
            </td>
        `;

        transactionList.appendChild(row);
    });
}

function updateCategoryFilter() {

    const currentCategory = categoryFilter.value;

    const categories = [];

    transactions.forEach(function(transaction) {

        if (!categories.includes(transaction.category)) {
            categories.push(transaction.category);
        }

    });

    categories.sort();

    categoryFilter.innerHTML = `
        <option value="all">
            All Categories
        </option>
    `;

    categories.forEach(function(category) {

        const option = document.createElement("option");

        option.value = category;
        option.textContent = category;

        categoryFilter.appendChild(option);
    });

    if (categories.includes(currentCategory)) {
        categoryFilter.value = currentCategory;
    }
}

typeFilter.addEventListener("change", function() {
    renderTransactions();
});

categoryFilter.addEventListener("change", function() {
    renderTransactions();
});

updateCategoryFilter();
renderTransactions();
updateSummary();
updateMonthlySummary();
updateCategoryChart();
