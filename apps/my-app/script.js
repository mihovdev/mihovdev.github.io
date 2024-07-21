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
            const dailyLimit = document.getElementById('dailyLimit');
            const remainingDays = document.getElementById('remainingDays');

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

            let editIndex = null; // To track which expense is being edited

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

                updateDailyLimit(remaining);
            }

            function updateDailyLimit(remainingBalance) {
                const today = new Date();
                const endDate = new Date(today.getFullYear(), today.getMonth(), 29); // 29th of the current month
                const timeDiff = endDate - today;
                const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

                remainingDays.textContent = `Remaining days until 29th: ${daysLeft}`;
                
                const dailyLimitValue = daysLeft > 0 ? remainingBalance / daysLeft : 0;
                dailyLimit.textContent = `Daily limit: €${dailyLimitValue.toFixed(2)}`;
            }

            function addExpense(description, amount) {
                const selectedCard = cardSelect.value;
                if (editIndex !== null) {
                    // Update existing expense
                    expenses[selectedCard][editIndex] = { description, amount: parseFloat(amount) };
                    editIndex = null; // Reset edit index
                    addExpenseBtn.textContent = 'Add Expense'; // Reset button text
                } else {
                    // Add new expense
                    expenses[selectedCard].push({ description, amount: parseFloat(amount) });
                }
                saveToLocalStorage();
                renderExpenses();
                calculateRemainingBalance();
            }

            function editExpense(index) {
                const selectedCard = cardSelect.value;
                const expense = expenses[selectedCard][index];
                expenseDesc.value = expense.description;
                expenseAmount.value = expense.amount;
                editIndex = index; // Set the index of the expense to be edited
                addExpenseBtn.textContent = 'Update Expense'; // Change button text to indicate update
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
                    li.innerHTML = `${expense.description} - €${expense.amount.toFixed(2)}
                    <div class="button-container">
                        <button class="btn btn-warning" onclick="editExpense(${index})">Edit</button>    
                        <button class="btn btn-danger" onclick="deleteExpense(${index})">Delete</button>
                    </div>`;
                    expenseList.appendChild(li);
                });
            }
            
            

            function updateVisibility() {
                const incomeCard1Div = document.getElementById('incomeCard1');
                const incomeCard2Div = document.getElementById('incomeCard2');
                const limitCard3Div = document.getElementById('limitCard3');

                incomeCard1Div.style.display = cardSelect.value === 'card1' ? 'block' : 'none';
                incomeCard2Div.style.display = cardSelect.value === 'card2' ? 'block' : 'none';
                limitCard3Div.style.display = cardSelect.value === 'card3' ? 'block' : 'none';

                calculateRemainingBalance(); // Update balance and daily limit for selected card
            }

            function resetExpenseForm() {
                expenseDesc.value = '';
                expenseAmount.value = '';
                editIndex = null; // Reset edit index
                addExpenseBtn.textContent = 'Add Expense'; // Reset button text
            }

            cardSelect.addEventListener('change', () => {
                updateVisibility();
                renderExpenses();
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
                    resetExpenseForm(); // Reset form after adding or updating an expense
                }
            });

            window.editExpense = editExpense;
            window.deleteExpense = deleteExpense;

            updateIncomeAndLimitFields();
            updateVisibility();
            renderExpenses();
        });
