// Income and expense input fields
let incomeSourceFields = document.getElementsByClassName("income")[0].querySelector("#income-inputs");
let expenseSourceFields = document.getElementsByClassName("expenses")[0].querySelector("#expense-inputs");

// Add income button
let addIncomeBtn = document.getElementById("add-income-btn");

// Add expense button
let addExpenseBtn = document.getElementById("add-expense-btn");

// Calculation fields
let incomeTotal = document.getElementById("income-total");
let expenseTotal = document.getElementById("expense-total");
let budgetTotal = document.getElementById("budget-total");
let calculateBtn = document.getElementById("calculate-btn");

// Counters for input field names
let incomeCount = 2;
let expenseCount = 2;

// Add event listener for add income button
addIncomeBtn.addEventListener("click", function() {
    // Create new input fields for income
    let newInputFields = document.createElement("div");
    newInputFields.classList.add("input-group");
    newInputFields.innerHTML = `
        <label for="income-source-${incomeCount}">Source:</label>
        <input type="text" id="income-source-${incomeCount}" class="source" placeholder="Enter source">
        <label for="income-amount-${incomeCount}">Amount:</label>
        <input type="number" id="income-amount-${incomeCount}" class="amount" placeholder="Enter amount">
    `;
    incomeSourceFields.appendChild(newInputFields);

    // Increment counter
    incomeCount++;
});

// Add event listener for add expense button
addExpenseBtn.addEventListener("click", function() {
    // Create new input fields for expense
    let newInputFields = document.createElement("div");
    newInputFields.classList.add("input-group");
    newInputFields.innerHTML = `
        <label for="expense-source-${expenseCount}">Source:</label>
        <input type="text" id="expense-source-${expenseCount}" class="source" placeholder="Enter source">
        <label for="expense-amount-${expenseCount}">Amount:</label>
        <input type="number" id="expense-amount-${expenseCount}" class="amount" placeholder="Enter amount">
    `;
    expenseSourceFields.appendChild(newInputFields);

    // Increment counter
    expenseCount++;
});

// Add event listener for calculate button
calculateBtn.addEventListener("click", function() {
    let incomeSum = 0;
    let expenseSum = 0;

    // Loop through income input fields and add up amounts
    let incomeAmountFields = document.getElementsByClassName("income")[0].querySelectorAll(".amount");
    for (let i = 0; i < incomeAmountFields.length; i++) {
        incomeSum += parseFloat(incomeAmountFields[i].value);
    }

    // Loop through expense input fields and add up amounts
    let expenseAmountFields = document.getElementsByClassName("expenses")[0].querySelectorAll(".amount");
    for (let i = 0; i < expenseAmountFields.length; i++) {
        expenseSum += parseFloat(expenseAmountFields[i].value);
    }

    // Display totals
    incomeTotal.textContent = "€" + incomeSum.toFixed(2);
    expenseTotal.textContent = "€" + expenseSum.toFixed(2);
    budgetTotal.textContent = "€" + (incomeSum - expenseSum).toFixed(2);
});
