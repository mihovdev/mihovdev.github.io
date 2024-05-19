let expenses = 0;
let limit = 0;
let savedAmount = 0;
let transactionCount = 0;

// Load data from local storage
window.onload = function() {
    if(localStorage.getItem('expenses')) {
        expenses = parseFloat(localStorage.getItem('expenses'));
        document.getElementById('totalExpenses').textContent = expenses.toFixed(2);
    }
    if(localStorage.getItem('limit')) {
        limit = parseFloat(localStorage.getItem('limit'));
        document.getElementById('remainingLimit').textContent = (limit - expenses).toFixed(2);
        document.getElementById('currentLimit').textContent = limit.toFixed(2);
    }
    if(localStorage.getItem('savedAmount')) {
        savedAmount = parseFloat(localStorage.getItem('savedAmount'));
        document.getElementById('savedAmount').textContent = savedAmount.toFixed(2);
    }
    if(localStorage.getItem('transactions')) {
        const transactions = JSON.parse(localStorage.getItem('transactions'));
        transactions.forEach(transaction => {
            addTransactionToList(transaction.description, transaction.amount, transaction.dueDate);
        });
    }
    updateSaveAmount(); // Update the save amount display
}

function addTransaction() {
    const transactionInput = document.getElementById("transaction");
    const descriptionInput = document.getElementById("description");
    const amount = parseFloat(transactionInput.value);
    const description = descriptionInput.value.toUpperCase();
    if (!isNaN(amount) && amount >= 0) {
        expenses += amount;
        const transactionDescription = description ? description : `TRANSACTION ${++transactionCount}`;
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + 1);
        addTransactionToList(transactionDescription, amount.toFixed(2), dueDate.toLocaleDateString());
        updateExpenses();
        saveDataToLocalStorage();
    }
    transactionInput.value = "";
    descriptionInput.value = "";
}

function addTransactionToList(description, amount, dueDate) {
    const transactionList = document.getElementById("transactionList");
    const listItem = document.createElement("li");
    listItem.className = 'list-group-item';
    listItem.innerHTML = `<span class="transaction-description">${description}</span><span>${amount} EUR</span><span class="transaction-date">Due Date: ${dueDate}</span><button class="delete-button btn btn-sm btn-danger" onclick="removeTransaction(this)">Delete</button>`;
    transactionList.appendChild(listItem);
}

function setLimit() {
    const limitInput = document.getElementById("limit");
    const newLimit = parseFloat(limitInput.value);
    if (!isNaN(newLimit) && newLimit >= 0) {
        limit = newLimit;
        document.getElementById('currentLimit').textContent = limit.toFixed(2);
        updateRemainingLimit();
        saveDataToLocalStorage();
    }
    limitInput.value = "";
}

function updateExpenses() {
    const totalExpensesElement = document.getElementById("totalExpenses");
    totalExpensesElement.textContent = expenses.toFixed(2);
    updateRemainingLimit();
}

function updateRemainingLimit() {
    const remainingLimitElement = document.getElementById("remainingLimit");
    const remaining = limit - expenses;
    remainingLimitElement.textContent = remaining >= 0 ? remaining.toFixed(2) : "Exceeded";
}

function removeTransaction(button) {
    const listItem = button.parentNode;
    const amount = parseFloat(listItem.children[1].textContent);
    expenses -= amount;
    listItem.remove();
    updateExpenses();
    saveDataToLocalStorage();
}

function updateSaveAmount() {
    const saveInput = document.getElementById("save");
    const saveAmount = parseFloat(saveInput.value);
    document.getElementById("saveAmount").textContent = !isNaN(saveAmount) && saveAmount >= 0 ? saveAmount.toFixed(2) : "0.00";
}

// Reset all data
function resetTransactions() {
    const transactionList = document.getElementById("transactionList");
    while (transactionList.firstChild) {
        transactionList.removeChild(transactionList.firstChild);
    }
    expenses = 0; // Reset expenses to zero
    savedAmount = 0; // Reset saved amount to zero
    document.getElementById("savedAmount").textContent = savedAmount.toFixed(2);
    updateExpenses();
    saveDataToLocalStorage();
}

// Save data to local storage
function saveDataToLocalStorage() {
    localStorage.setItem('expenses', expenses);
    localStorage.setItem('limit', limit);
    localStorage.setItem('savedAmount', savedAmount);
    const transactions = [];
    const transactionList = document.getElementById("transactionList").getElementsByTagName("li");
    for (let i = 0; i < transactionList.length; i++) {
        const description = transactionList[i].children[0].textContent;
        const amount = transactionList[i].children[1].textContent;
        const dueDate = transactionList[i].children[2].textContent.replace('Due Date: ', '');
        transactions.push({ description, amount, dueDate });
    }
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function saveMoney() {
    const saveInput = document.getElementById("save");
    const amount = parseFloat(saveInput.value);
    if (!isNaN(amount) && amount >= 0) {
        limit -= amount; // Deduct the saved amount from the limit
        savedAmount += amount; // Add the saved amount to the saved total
        document.getElementById("savedAmount").textContent = savedAmount.toFixed(2);
        updateRemainingLimit(); // Update the remaining limit
        saveDataToLocalStorage();
    }
    saveInput.value = "";
    updateSaveAmount(); // Reset the save amount display
}
