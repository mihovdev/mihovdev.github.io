// script.js
document.addEventListener('DOMContentLoaded', () => {
    const cardSelect = document.getElementById('cardSelect');
    const income1 = document.getElementById('income1');
    const income2 = document.getElementById('income2');
    const limit3 = document.getElementById('limit3');
    const expenseDesc = document.getElementById('expenseDesc');
    const expenseAmount = document.getElementById('expenseAmount');
    const addExpenseBtn = document.getElementById('addExpenseBtn');
    const expenseList = document.getElementById('expenseList');
    const remainingBalance = document.getElementById('remainingBalance');

    let incomes = {
        card1: parseFloat(localStorage.getItem('incomeCard1')) || 0,
        card2: parseFloat(localStorage.getItem('incomeCard2')) || 0
    };

    let limits = {
        card3: parseFloat(localStorage.getItem('limitCard3')) || 0
    };

    let expenses = {
        card1: JSON.parse(localStorage.getItem('expensesCard1')) || [],
        card2: JSON.parse(localStorage.getItem('expensesCard2')) || [],
        card3: JSON.parse(localStorage.getItem('expensesCard3')) || []
    };

    function updateIncomeAndLimitFields() {
        income1.value = incomes.card1;
        income2.value = incomes.card2;
        limit3.value = limits.card3;
    }

    function saveToLocalStorage() {
        localStorage.setItem('incomeCard1', incomes.card1);
        localStorage.setItem('incomeCard2', incomes.card2);
        localStorage.setItem('limitCard3', limits.card3);
        localStorage.setItem('expensesCard1', JSON.stringify(expenses.card1));
        localStorage.setItem('expensesCard2', JSON.stringify(expenses.card2));
        localStorage.setItem('expensesCard3', JSON.stringify(expenses.card3));
    }

    function calculateRemainingBalance() {
        const selectedCard = cardSelect.value;
        let totalIncomeOrLimit = 0;

        if (selectedCard === 'card1') {
            totalIncomeOrLimit = incomes.card1;
        } else if (selectedCard === 'card2') {
            totalIncomeOrLimit = incomes.card2;
        } else if (selectedCard === 'card3') {
            totalIncomeOrLimit = limits.card3;
        }

        const totalExpenses = expenses[selectedCard].reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
        const remaining = totalIncomeOrLimit - totalExpenses;
        remainingBalance.textContent = `€${remaining.toFixed(2)}`;
    }

    function addExpense(description, amount) {
        const selectedCard = cardSelect.value;
        expenses[selectedCard].push({ description, amount: parseFloat(amount) });
        saveToLocalStorage();
        renderExpenses();
        calculateRemainingBalance();
    }

    function deleteExpense(index) {
        const selectedCard = cardSelect.value;
        expenses[selectedCard].splice(index, 1);
        saveToLocalStorage();
        renderExpenses();
        calculateRemainingBalance();
    }

    function renderExpenses() {
        const selectedCard = cardSelect.value;
        expenseList.innerHTML = '';
        expenses[selectedCard].forEach((expense, index) => {
            const li = document.createElement('li');
            li.innerHTML = `${expense.description} - €${expense.amount.toFixed(2)} <button class="btn btn-danger btn-sm" onclick="deleteExpense(${index})">Delete</button>`;
            expenseList.appendChild(li);
        });
    }

    function updateVisibility() {
        const incomeCard1Div = document.getElementById('incomeCard1');
        const incomeCard2Div = document.getElementById('incomeCard2');
        const limitCard3Div = document.getElementById('limitCard3');
        switch (cardSelect.value) {
            case 'card1':
                incomeCard1Div.style.display = 'block';
                incomeCard2Div.style.display = 'none';
                limitCard3Div.style.display = 'none';
                break;
            case 'card2':
                incomeCard1Div.style.display = 'none';
                incomeCard2Div.style.display = 'block';
                limitCard3Div.style.display = 'none';
                break;
            case 'card3':
                incomeCard1Div.style.display = 'none';
                incomeCard2Div.style.display = 'none';
                limitCard3Div.style.display = 'block';
                break;
        }
    }

    cardSelect.addEventListener('change', () => {
        updateVisibility();
        renderExpenses();
        calculateRemainingBalance();
    });

    income1.addEventListener('input', () => {
        incomes.card1 = parseFloat(income1.value) || 0;
        saveToLocalStorage();
        calculateRemainingBalance();
    });

    income2.addEventListener('input', () => {
        incomes.card2 = parseFloat(income2.value) || 0;
        saveToLocalStorage();
        calculateRemainingBalance();
    });

    limit3.addEventListener('input', () => {
        limits.card3 = parseFloat(limit3.value) || 0;
        saveToLocalStorage();
        calculateRemainingBalance();
    });

    addExpenseBtn.addEventListener('click', () => {
        const description = expenseDesc.value;
        const amount = expenseAmount.value;
        if (description && amount) {
            addExpense(description, amount);
            expenseDesc.value = '';
            expenseAmount.value = '';
        }
    });

    window.deleteExpense = deleteExpense;

    updateIncomeAndLimitFields();
    updateVisibility();
    renderExpenses();
    calculateRemainingBalance();
});
