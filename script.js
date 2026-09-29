let transactions=[]
const transactionForm = document.getElementById("transactionForm");

const typeInput = document.getElementById("type");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const descriptionInput = document.getElementById("description");

const transactionList = document.getElementById("transactionList");

transactionForm.addEventListener("submit",function(event){
    event.preventDefault();
    const type = typeInput.value;
    const amount = amountInput.value;
    const category = categoryInput.value;
    const date = dateInput.value;
    const description = descriptionInput.value;

     const transaction = {
        id: Date.now(),
        type: type,
        amount: Number(amount),
        category: category,
        date: date,
        description: description
    };

    transactions.push(transaction);
    renderTransactions();
    console.log(transactions);
});

function deleteTransaction(id) {
        transactions = transactions.filter(function(transaction) {
            return transaction.id !== id;
        });

        renderTransactions();
    }

function renderTransactions() {
    transactionList.innerHTML = "";

    transactions.forEach(function(transaction) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${transaction.date}</td>
            <td>${transaction.category}</td>
            <td>${transaction.description}</td>
            <td>${transaction.amount}</td>
            <td>
                <button>Edit</button>
                <button onclick="deleteTransaction(${transaction.id})">Delete</button>
        `;

        transactionList.appendChild(row);
    });
}