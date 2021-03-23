let transactions = [];
let myChart;

fetch("/api/transaction")
// body contains all of the data and isn't accessible directly from the response object, you have to convert it to json, this also returns a promist, hence the second .then
// fetching data from api/transaction 
  .then(response => {
    return response.json();
  })
  .then(data => {
    // save db data on global variable
    transactions = data;

    populateTotal();
    populateTable();
    populateChart();
  });




function populateTotal() {
  // reduce transaction amounts to a single total value
  // just adding up all the transactions 
  let total = transactions.reduce((total, t) => {
    return total + parseInt(t.value);
  }, 0);

  // #Total = "Your total is: " section 
  let totalEl = document.querySelector("#total");
  totalEl.textContent = total;
}



// appends the transaction name and amount
function populateTable() {
  // User's name of transaction and amount goes in this table id tbody
  let tbody = document.querySelector("#tbody");
  // empties the html
  tbody.innerHTML = "";

  // loops through transactions
  transactions.forEach(transaction => {
    // create and populate a table row
    let tr = document.createElement("tr");
    // name and value come from model
    // tr = table row, putting name and value in data cell (td)
    tr.innerHTML = `
      <td>${transaction.name}</td>
      <td>${transaction.value}</td>
    `;

    tbody.appendChild(tr);
  });
}


// creating chart fam
function populateChart() {
  // copy array and reverse it
  // The slice() method returns the selected elements in an array, as a new array object
  // Why reverse them? 
  let reversed = transactions.slice().reverse();
  let sum = 0;

  // create date labels for chart
  let labels = reversed.map(t => {
    let date = new Date(t.date);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  });

  // create incremental values for chart
  let data = reversed.map(t => {
    sum += parseInt(t.value);
    return sum;
  });

  // remove old chart if it exists
  if (myChart) {
    myChart.destroy();
  }

  let ctx = document.getElementById("myChart").getContext("2d");

  myChart = new Chart(ctx, {
    type: 'line',
      data: {
        labels,
        datasets: [{
            label: "Total Over Time",
            fill: true,
            backgroundColor: "#6666ff",
            data
        }]
    }
  });
}


function sendTransaction(isAdding) {
  // name of transaction
  let nameEl = document.querySelector("#t-name");
  // amount 
  let amountEl = document.querySelector("#t-amount");
  // for if they haven't entered anything yet
  let errorEl = document.querySelector(".form .error");

  // validate form
  if (nameEl.value === "" || amountEl.value === "") {
    errorEl.textContent = "Missing Information";
    return;
  }
  else {
    errorEl.textContent = "";
  }

  // create record
  let transaction = {
    name: nameEl.value,
    value: amountEl.value,
    date: new Date().toISOString()
  };

  // if subtracting funds, convert amount to negative number
  if (!isAdding) {
    transaction.value *= -1;
  }

  // add to beginning of current array of data
  transactions.unshift(transaction);

  // re-run logic to populate ui with new record
  populateChart();
  populateTable();
  populateTotal();
  
  // also send to server
  // fetching data from api/transaction then making a post request
  // making a post request here, the get for this is in api.js
  fetch("/api/transaction", {
    method: "POST",
    body: JSON.stringify(transaction),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  })
  .then(response => {    
    return response.json();
  })
  .then(data => {
    if (data.errors) {
      errorEl.textContent = "Missing Information";
    }
    else {
      // clear form
      nameEl.value = "";
      amountEl.value = "";
    }
  })
  .catch(err => {
    // fetch failed, so save in indexed db
    saveRecord(transaction);

    // clear form
    nameEl.value = "";
    amountEl.value = "";
  });
}

document.querySelector("#add-btn").onclick = function() {
  sendTransaction(true);
};

document.querySelector("#sub-btn").onclick = function() {
  sendTransaction(false);
};
