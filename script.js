let transactions=[]
let editingId=null;

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
const typeFilter=document.getElementById("typeFilter")

transactionForm.addEventListener("submit",function(event){
    event.preventDefault();
    const type = typeInput.value;
    const amount = amountInput.value;
    const category = categoryInput.value;
    const date = dateInput.value;
    const description = descriptionInput.value;

     const transaction = {
        id: editingId === null ? Date.now() : editingId,
        type: type,
        amount: Number(amount),
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

        transactions[index] = transaction;
        editingId = null;
    }

    renderTransactions();
    updateSummary();
    console.log(transactions);
});

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

    totalIncome.textContent = income;
    totalExpenses.textContent = expenses;
    currentBalance.textContent = balance;
}

typeFilter.addEventListener("change", function() {
    renderTransactions();
});

function deleteTransaction(id) {
        transactions = transactions.filter(function(transaction) {
            return transaction.id !== id;
        });

        renderTransactions();
        updateSummary();
    }

function editTransaction(id) {
    const transaction = transactions.find(function(transaction) {
        return transaction.id === id;
    });
    editingId=id;
    
    typeInput.value = transaction.type;
    amountInput.value = transaction.amount;
    categoryInput.value = transaction.category;
    dateInput.value = transaction.date;
    descriptionInput.value = transaction.description;
}

function renderTransactions() {
    transactionList.innerHTML = "";

    const selectedType = typeFilter.value;

    const filteredTransactions = transactions.filter(function(transaction) {
        return selectedType === "all" || transaction.type === selectedType;
    });

    filteredTransactions.forEach(function(transaction) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${transaction.date}</td>
            <td>${transaction.category}</td>
            <td>${transaction.description}</td>
            <td>${transaction.amount}</td>
            <td>
                <button onclick="editTransaction(${transaction.id})">Edit</button>
                <button onclick="deleteTransaction(${transaction.id})">Delete</button>
        `;

        transactionList.appendChild(row);
    });
}