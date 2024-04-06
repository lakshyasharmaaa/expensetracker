// Define expenses object to store category-wise expenses
let expenses = {};

// Define chart variable to store the reference to the chart
let chart;

// Function to draw or update pie chart
function drawPieChart(expenses) {
    var ctx = document.getElementById('chart').getContext('2d');
    var labels = Object.keys(expenses);
    var data = Object.values(expenses);
    var colors = ['red', 'blue', 'green', 'orange']; // Add more colors if you have more categories

    if (chart) {
        chart.destroy(); // Destroy existing chart if any
    }

    chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Expenses Breakdown'
                }
            }
        },
    });
}

// Initialize transactions array
let transactions = [];

// Function to add new income or expense transaction
function addItem() {
    let itemType = document.getElementById('itemType').value;
    let name = document.getElementById('name').value;
    let amount = parseFloat(document.getElementById('amount').value);
    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    let category = '';
    if (itemType === '0') { // Expense
        category = document.getElementById('expenseType').value;
    }

    let transaction = {
        type: itemType == '1' ? 'Income' : 'Expense',
        name: name,
        amount: itemType == '1' ? amount : -amount, // Negate amount for expense
        category: category,
        date: new Date().toLocaleDateString() // Add current date
    };

    // Update expenses object
    if (transaction.type === 'Expense') {
        if (expenses[category]) {
            expenses[category] += Math.abs(amount); // Add to existing category
        } else {
            expenses[category] = Math.abs(amount); // Create new category
        }
    }

    transactions.push(transaction);
    updateTransactions();
    drawPieChart(expenses); // Update pie chart
}

// Function to update transactions list and display total income, total expenses, and balance
function updateTransactions() {
    let totalIncome = 0;
    let totalExpense = 0;

    let transactionList = document.getElementById('transactionList');
    transactionList.innerHTML = '';

    transactions.forEach((transaction, index) => {
        let listItem = document.createElement('li');
        listItem.textContent = `${transaction.date} - ${transaction.type}: ${transaction.name} (${transaction.category})  ₹${transaction.amount.toLocaleString('en-IN')}`; // Display amount in INR format
        listItem.classList.add('transactionItem'); // Add transactionItem class

        if (transaction.type === 'Expense') {
            listItem.style.color = 'red';
        } else {
            listItem.style.color = 'green';
        }

        // Add delete button
        let deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'deleteButton'; // Add CSS class
        deleteButton.onclick = function () {
            if (transaction.type === 'Expense') {
                expenses[transaction.category] -= Math.abs(transaction.amount); // Subtract from category
            }
            transactions.splice(index, 1);
            updateTransactions();
            drawPieChart(expenses); // Update pie chart
        };
        listItem.appendChild(deleteButton);

        transactionList.appendChild(listItem);

        if (transaction.amount > 0) {
            totalIncome += transaction.amount;
        } else {
            totalExpense += Math.abs(transaction.amount);
        }
    });

    let totalIncomeElement = document.getElementById('totalIncome');
    let totalExpenseElement = document.getElementById('totalExpense');
    let balanceElement = document.getElementById('balance');

    // Display total income, total expenses, and balance in INR format
    totalIncomeElement.textContent = `₹${totalIncome.toLocaleString('en-IN')}`;
    totalExpenseElement.textContent = `₹${totalExpense.toLocaleString('en-IN')}`;
    balanceElement.textContent = `₹${(totalIncome - totalExpense).toLocaleString('en-IN')}`;
}