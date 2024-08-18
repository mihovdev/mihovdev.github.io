document.addEventListener("DOMContentLoaded", function() {
    loadFromLocalStorage();
});

function updateBalance(id, amount) {
    const balanceSpan = document.getElementById(id + '-balance');
    let currentBalance = parseFloat(balanceSpan.textContent);
    currentBalance += amount;
    balanceSpan.textContent = currentBalance.toFixed(2);

    // Update the remaining balance in the navbar
    document.getElementById(id + '-remaining').textContent = currentBalance.toFixed(2);

    saveToLocalStorage();
}

function addAmount(id) {
    const amount = parseFloat(document.getElementById(id + '-amount').value);
    const description = document.getElementById(id + '-description').value.trim();
    if (!isNaN(amount) && amount > 0) {
        updateBalance(id, amount);
        addEntry(id, amount, description, 'income');
    }
}

function subtractAmount(id) {
    const amount = parseFloat(document.getElementById(id + '-amount').value);
    const description = document.getElementById(id + '-description').value.trim();
    if (!isNaN(amount) && amount > 0) {
        updateBalance(id, -amount);
        addEntry(id, -amount, description, 'expense');
    }
}

function addEntry(id, amount, description, type) {
    const entryList = document.getElementById(id + '-entries');
    const entryItem = document.createElement('li');
    entryItem.classList.add(type);
    entryItem.innerHTML = `€${amount.toFixed(2)} <small>${description ? '- ' + description : ''}</small>`;
    const deleteButton = document.createElement('span');
    deleteButton.textContent = 'X';
    deleteButton.classList.add('entry-delete');
    deleteButton.onclick = function() {
        entryList.removeChild(entryItem);
        updateBalance(id, -amount);
        saveToLocalStorage();
    };
    entryItem.appendChild(deleteButton);
    entryList.appendChild(entryItem);

    saveToLocalStorage();
}

function resetCard(id) {
    // Reset balance to 0
    document.getElementById(id + '-balance').textContent = '0.00';
    document.getElementById(id + '-remaining').textContent = '0.00';
    
    // Clear entry list
    const entryList = document.getElementById(id + '-entries');
    while (entryList.firstChild) {
        entryList.removeChild(entryList.firstChild);
    }

    saveToLocalStorage();
}

function showCard(cardId) {
    const cards = document.querySelectorAll('.card-container');
    cards.forEach(card => {
        card.classList.remove('active');
    });
    document.getElementById(cardId + '-card').classList.add('active');
}

function saveToLocalStorage() {
    const banks = ['bw-bank', 'db-bank', 'klarna'];
    banks.forEach(bank => {
        const balance = document.getElementById(bank + '-balance').textContent;
        const entries = Array.from(document.getElementById(bank + '-entries').children).map(entry => ({
            amount: entry.textContent.split(' ')[0].substring(1),
            description: entry.querySelector('small') ? entry.querySelector('small').textContent.substring(2) : '',
            type: entry.classList.contains('income') ? 'income' : 'expense'
        }));
        localStorage.setItem(bank + '-balance', balance);
        localStorage.setItem(bank + '-entries', JSON.stringify(entries));
    });
}

function loadFromLocalStorage() {
    const banks = ['bw-bank', 'db-bank', 'klarna'];
    banks.forEach(bank => {
        const balance = localStorage.getItem(bank + '-balance');
        const entries = JSON.parse(localStorage.getItem(bank + '-entries') || '[]');
        if (balance !== null) {
            document.getElementById(bank + '-balance').textContent = balance;
            document.getElementById(bank + '-remaining').textContent = balance;
        }
        const entryList = document.getElementById(bank + '-entries');
        entries.forEach(entry => {
            const entryItem = document.createElement('li');
            entryItem.classList.add(entry.type);
            entryItem.innerHTML = `€${parseFloat(entry.amount).toFixed(2)} <small>${entry.description ? '- ' + entry.description : ''}</small>`;
            const deleteButton = document.createElement('span');
            deleteButton.textContent = 'X';
            deleteButton.classList.add('entry-delete');
            deleteButton.onclick = function() {
                entryList.removeChild(entryItem);
                updateBalance(bank, -parseFloat(entry.amount));
                saveToLocalStorage();
            };
            entryItem.appendChild(deleteButton);
            entryList.appendChild(entryItem);
        });
    });
}