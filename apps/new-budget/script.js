// Define storage keys and pinned entries for each card
const storageKeys = {
    'bw-bank': 'bw-bank-data',
    'db-bank': 'db-bank-data',
    'klarna': 'klarna-data'
};
const pinnedEntries = {
    'bw-bank': new Set(),
    'db-bank': new Set(),
    'klarna': new Set()
};

// Load data when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    loadData('bw-bank');
    loadData('db-bank');
    loadData('klarna');
});

// Update balance by adding or subtracting amount
function updateBalance(id, amount) {
    const balanceSpan = document.getElementById(id + '-balance');
    let currentBalance = parseFloat(balanceSpan.textContent);
    currentBalance += amount;
    balanceSpan.textContent = currentBalance.toFixed(2);
    document.getElementById(id + '-remaining').textContent = currentBalance.toFixed(2);
    saveData(id);
}

// Add amount as income
function addAmount(id) {
    const amount = parseFloat(document.getElementById(id + '-amount').value);
    const description = document.getElementById(id + '-description').value.trim().toUpperCase();
    if (!isNaN(amount) && amount > 0) {
        updateBalance(id, amount);
        addEntry(id, amount, description, 'income');
    }
}

// Subtract amount as expense
function subtractAmount(id) {
    const amount = parseFloat(document.getElementById(id + '-amount').value);
    const description = document.getElementById(id + '-description').value.trim().toUpperCase();
    if (!isNaN(amount) && amount > 0) {
        updateBalance(id, -amount);
        addEntry(id, -amount, description, 'expense');
    }
}

// Add an entry to the list
function addEntry(id, amount, description, type) {
    const entryList = document.getElementById(id + '-entries');
    const entryItem = document.createElement('li');
    entryItem.classList.add(type, 'entry-item');
    entryItem.innerHTML = `€${amount.toFixed(2)} <small>${description ? '- ' + description : ''}</small>
        <span class="entry-pin ${pinnedEntries[id].has(entryItem) ? 'pinned' : ''}" onclick="togglePin('${id}', this)">
            <i class="fa ${pinnedEntries[id].has(entryItem) ? 'fa-thumbtack pinned' : 'fa-thumbtack'}"></i>
        </span>
        <span class="entry-delete" onclick="deleteEntry('${id}', this)">
            <i class="fa fa-times"></i>
        </span>`;
    entryList.appendChild(entryItem);
    if (pinnedEntries[id].has(entryItem)) {
        pinnedEntries[id].add(entryItem);
    }
    saveData(id);
}

// Delete an entry
function deleteEntry(id, element) {
    const entryList = document.getElementById(id + '-entries');
    const entryItem = element.parentElement;
    if (pinnedEntries[id].has(entryItem)) {
        pinnedEntries[id].delete(entryItem);
    }
    entryList.removeChild(entryItem);
    saveData(id);
}

// Toggle pin status
function togglePin(id, element) {
    const entryItem = element.parentElement;
    const icon = element.querySelector('i');
    if (pinnedEntries[id].has(entryItem)) {
        pinnedEntries[id].delete(entryItem);
        icon.classList.remove('pinned');
    } else {
        pinnedEntries[id].add(entryItem);
        icon.classList.add('pinned');
    }
    saveData(id);
}

// Reset card entries
function resetCard(id) {
    const balanceSpan = document.getElementById(id + '-balance');
    const entryList = document.getElementById(id + '-entries');

    // Separate totals for incomes and expenses
    let totalIncome = 0;
    let totalExpense = 0;

    // Calculate total income and expenses
    entryList.querySelectorAll('li').forEach(entryItem => {
        const amount = parseFloat(entryItem.textContent.split('€')[1].split(' ')[0]);
        if (entryItem.classList.contains('income')) {
            totalIncome += amount;
        } else if (entryItem.classList.contains('expense')) {
            totalExpense += amount;
        }
    });

    // Calculate new balance
    const newBalance = totalIncome - totalExpense;

    // Update balance and remaining balance display
    balanceSpan.textContent = newBalance.toFixed(2);
    document.getElementById(id + '-remaining').textContent = newBalance.toFixed(2);

    // Clear unpinned entries only
    entryList.querySelectorAll('li').forEach(entryItem => {
        if (!pinnedEntries[id].has(entryItem)) {
            entryList.removeChild(entryItem);
        }
    });

    // Update localStorage with the current state, including pinned entries
    saveData(id);
}

// Save data to localStorage
function saveData(id) {
    const balance = parseFloat(document.getElementById(id + '-balance').textContent);
    const entries = [];
    document.getElementById(id + '-entries').querySelectorAll('li').forEach(entryItem => {
        const amount = parseFloat(entryItem.textContent.split('€')[1].split(' ')[0]);
        const description = entryItem.querySelector('small') ? entryItem.querySelector('small').textContent.trim().replace('- ', '') : '';
        const type = entryItem.classList.contains('income') ? 'income' : 'expense';
        entries.push({ amount, description, type, pinned: pinnedEntries[id].has(entryItem) });
    });

    localStorage.setItem(storageKeys[id], JSON.stringify({ balance, entries }));
}

// Load data from localStorage
function loadData(id) {
    const data = localStorage.getItem(storageKeys[id]);
    if (data) {
        const { balance, entries } = JSON.parse(data);
        document.getElementById(id + '-balance').textContent = balance.toFixed(2);
        document.getElementById(id + '-remaining').textContent = balance.toFixed(2);
        
        const entryList = document.getElementById(id + '-entries');
        entries.forEach(({ amount, description, type, pinned }) => {
            const entryItem = document.createElement('li');
            entryItem.classList.add(type, 'entry-item');
            entryItem.innerHTML = `€${amount.toFixed(2)} <small>${description ? '- ' + description : ''}</small>
                <span class="entry-pin ${pinned ? 'pinned' : ''}" onclick="togglePin('${id}', this)">
                    <i class="fa ${pinned ? 'fa-thumbtack pinned' : 'fa-thumbtack'}"></i>
                </span>
                <span class="entry-delete" onclick="deleteEntry('${id}', this)">
                    <i class="fa fa-times"></i>
                </span>`;
            entryList.appendChild(entryItem);
            if (pinned) {
                pinnedEntries[id].add(entryItem);
            }
        });
    }
}
