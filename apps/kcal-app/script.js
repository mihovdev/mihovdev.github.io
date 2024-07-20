document.getElementById('calorie-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const food = document.getElementById('food').value;
    const calories = document.getElementById('calories').value;

    if (food === '' || calories === '') {
        alert('Моля, попълнете всички полета');
        return;
    }

    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `${food}: ${calories} калории <button class="btn btn-danger btn-sm delete">X</button>`;
    document.getElementById('food-list').appendChild(li);

    updateRemainingCalories(calories, 'subtract');

    document.getElementById('food').value = '';
    document.getElementById('calories').value = '';
});

document.getElementById('goal-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const goal = document.getElementById('goal').value;
    document.getElementById('remaining-calories').textContent = goal;
    document.getElementById('goal-display').textContent = `Зададена цел: ${goal} калории`;
    document.getElementById('goal-display').style.display = 'block';
    document.getElementById('goal-form').style.display = 'none';
    document.getElementById('goal').value = '';

    localStorage.setItem('goal', goal);
    updateRemainingCalories(0, 'reset');
});

document.getElementById('food-list').addEventListener('click', function(e) {
    if (e.target.classList.contains('delete')) {
        const li = e.target.parentElement;
        const calories = li.textContent.match(/\d+/)[0];
        updateRemainingCalories(calories, 'add');
        li.remove();
    }
});

document.getElementById('reset-btn').addEventListener('click', function() {
    document.getElementById('food-list').innerHTML = '';
    document.getElementById('remaining-calories').textContent = '0';
    document.getElementById('goal-display').style.display = 'none';
    document.getElementById('goal-form').style.display = 'block';
    localStorage.removeItem('foodList');
    localStorage.removeItem('remainingCalories');
    localStorage.removeItem('goal');
});

document.getElementById('save-btn').addEventListener('click', saveData);

document.getElementById('modal-save-btn').addEventListener('click', function() {
    saveData();
    $('#exitModal').modal('hide');
});

window.addEventListener('beforeunload', function (e) {
    if (document.getElementById('food-list').childElementCount > 0 || localStorage.getItem('goal')) {
        e.preventDefault();
        e.returnValue = '';
        $('#exitModal').modal('show');
        return '';
    }
});

function saveData() {
    const foodList = [];
    document.querySelectorAll('#food-list li').forEach(li => {
        foodList.push(li.textContent.replace('X', '').trim());
    });
    localStorage.setItem('foodList', JSON.stringify(foodList));
    localStorage.setItem('remainingCalories', document.getElementById('remaining-calories').textContent);
    alert('Данните са запазени локално.');
}

function updateRemainingCalories(calories, operation) {
    const remainingCaloriesElement = document.getElementById('remaining-calories');
    let remainingCalories = parseInt(remainingCaloriesElement.textContent);

    if (operation === 'subtract') {
        remainingCalories -= parseInt(calories);
    } else if (operation === 'add') {
        remainingCalories += parseInt(calories);
    } else if (operation === 'reset') {
        const goal = localStorage.getItem('goal');
        remainingCalories = goal ? parseInt(goal) : 0;
    }

    remainingCaloriesElement.textContent = remainingCalories;
}

function loadSavedData() {
    const savedFoodList = JSON.parse(localStorage.getItem('foodList'));
    const savedRemainingCalories = localStorage.getItem('remainingCalories');
    const savedGoal = localStorage.getItem('goal');

    if (savedFoodList && savedRemainingCalories) {
        document.getElementById('remaining-calories').textContent = savedRemainingCalories;

        savedFoodList.forEach(item => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `${item} <button class="btn btn-danger btn-sm delete">X</button>`;
            document.getElementById('food-list').appendChild(li);
        });
    }

    if (savedGoal) {
        document.getElementById('goal-display').textContent = `Зададена цел: ${savedGoal} калории`;
        document.getElementById('goal-display').style.display = 'block';
        document.getElementById('goal-form').style.display = 'none';
        updateRemainingCalories(0, 'reset');
    }
}

window.onload = loadSavedData;
