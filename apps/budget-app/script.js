// Get elements from the DOM
const incomeValue = document.querySelector('.budget__value.income');
const expensesValue = document.querySelector('.budget__value.expenses');
const totalValue = document.querySelector('.budget__value.total');
const addType = document.querySelector('.add__type');
const addDescription = document.querySelector('.add__description');
const addValue = document.querySelector('.add__value');
const addButton = document.querySelector('.add__btn');
const saveButton = document.querySelector('.save__btn');
const clearButton = document.querySelector('.clear__btn');
const itemList = document.querySelector('.list');

// Initialize budget values
let totalIncome = 0;
let totalExpenses = 0;
let totalBudget = 0;
let items = []; // Array to store items

// Function to calculate and update budget
function updateBudget() {
    totalBudget = totalIncome - totalExpenses;
    totalValue.textContent = totalBudget.toFixed(2);
}

// Function to add a new item
function addItem(type, description, value) {
    // Create new item object
    const newItem = {
        id: generateID(),
        type: type,
        description: description || 'No description', // Default description if empty
        value: value
    };
    
    // Add item to items array
    items.push(newItem);

    // Create HTML for new item
    const newItemHTML = `
        <div class="item clearfix" data-id="${newItem.id}">
            <div class="item__description">${newItem.description}</div>
            <div class="right clearfix">
                <div class="item__value">${(newItem.type === 'income' ? '+ ' : '- ') + newItem.value.toFixed(2)}</div>
                <div class="item__delete">
                    <button class="item__delete--btn">Delete</button>
                </div>
            </div>
        </div>
    `;
    
    // Insert the HTML into the DOM
    itemList.insertAdjacentHTML('beforeend', newItemHTML);

    // Update totals based on type
    if (type === 'income') {
        totalIncome += value;
        incomeValue.textContent = '+ ' + totalIncome.toFixed(2);
    } else if (type === 'expenses') {
        totalExpenses += value;
        expensesValue.textContent = '- ' + totalExpenses.toFixed(2);
    }

    // Update total budget
    updateBudget();
    
    // Save data to localStorage
    saveData();
}

// Function to generate unique ID for items
function generateID() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// Function to save data to localStorage
function saveData() {
    const data = {
        totalIncome,
        totalExpenses,
        totalBudget,
        items
    };
    localStorage.setItem('budgetData', JSON.stringify(data));
}

// Function to load data from localStorage
function loadData() {
    const savedData = JSON.parse(localStorage.getItem('budgetData'));
    if (savedData) {
        totalIncome = savedData.totalIncome || 0;
        totalExpenses = savedData.totalExpenses || 0;
        totalBudget = savedData.totalBudget || 0;
        items = savedData.items || [];

        // Update UI with saved items
        items.forEach(item => {
            const newItemHTML = `
                <div class="item clearfix" data-id="${item.id}">
                    <div class="item__description">${item.description}</div>
                    <div class="right clearfix">
                        <div class="item__value">${(item.type === 'income' ? '+ ' : '- ') + item.value.toFixed(2)}</div>
                        <div class="item__delete">
                            <button class="item__delete--btn">Delete</button>
                        </div>
                    </div>
                </div>
            `;
            itemList.insertAdjacentHTML('beforeend', newItemHTML);
        });

        // Update totals on UI
        incomeValue.textContent = '+ ' + totalIncome.toFixed(2);
        expensesValue.textContent = '- ' + totalExpenses.toFixed(2);
        totalValue.textContent = totalBudget.toFixed(2);
    }
}

// Function to clear all data
function clearData() {
    totalIncome = 0;
    totalExpenses = 0;
    totalBudget = 0;
    items = [];
    incomeValue.textContent = '+ 0.00';
    expensesValue.textContent = '- 0.00';
    totalValue.textContent = '0.00';
    itemList.innerHTML = ''; // Clear item list in the UI
    localStorage.removeItem('budgetData'); // Clear localStorage
}

// Event listener for adding a new item
addButton.addEventListener('click', function() {
    const type = addType.value; // Get the selected value ('income' or 'expenses')
    const description = addDescription.value;
    const value = parseFloat(addValue.value);

    if (value && !isNaN(value)) {
        addItem(type, description, value);
        // Clear input fields after adding
        addDescription.value = '';
        addValue.value = '';
    } else {
        alert('Please enter a valid value.');
    }
});

// Event listener for saving data
saveButton.addEventListener('click', saveData);

// Event listener for clearing all data
clearButton.addEventListener('click', clearData);

// Event listener for deleting an item (use event delegation)
itemList.addEventListener('click', function(event) {
    if (event.target.classList.contains('item__delete--btn')) {
        const selectedItem = event.target.closest('.item');
        const itemId = selectedItem.getAttribute('data-id');
        const selectedItemIndex = items.findIndex(item => item.id === itemId);

        if (selectedItemIndex !== -1) {
            const deletedItem = items[selectedItemIndex];
            items.splice(selectedItemIndex, 1);

            // Update totals based on type
            if (deletedItem.type === 'income') {
                totalIncome -= deletedItem.value;
                incomeValue.textContent = '+ ' + totalIncome.toFixed(2);
            } else if (deletedItem.type === 'expenses') {
                totalExpenses -= deletedItem.value;
                expensesValue.textContent = '- ' + totalExpenses.toFixed(2);
            }

            // Update total budget
            updateBudget();

            // Remove the item from the DOM
            selectedItem.remove();

            // Save data after deleting an item
            saveData();
        }
    }
});

// Load saved data on page load
document.addEventListener('DOMContentLoaded', loadData);
