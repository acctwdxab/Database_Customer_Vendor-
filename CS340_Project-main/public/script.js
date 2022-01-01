// To DO: Add success indicator when successfully posted, deleted, edited

const baseURL = "http://flip1.engr.oregonstate.edu:XXXX/";
var idGenerator = 0;
const postButton = document.getElementById("post-button");
const updateButton = document.getElementById("update-button");
const resetButton = document.getElementById("reset-button");
var updateForm = document.getElementById("update-form");
var postForm = document.getElementById("post-form");
var successDiv = document.getElementById("success");

postForm.addEventListener("submit", postData);
updateForm.addEventListener("submit", updateData);

function init() {
  // when the page loads, get any data from the database and generate a table from this data
  var req = new XMLHttpRequest();

  req.open("GET", baseURL + "reset", true);
  req.addEventListener("load", function () {
    if (req.status >= 200 && req.status < 400) {
      var response = JSON.parse(req.responseText);
      var data = response.rows;
      generate_table(data);
    } else {
      console.log("Error: " + req.statusText);
    }
  });
  req.send(null);
  // event.preventDefault();
}

function clickTable(event) {
  // track whether user clicked 'Edit' or 'Delete' button in a row in the table
  let target = event.target;

  // user clicked edit button
  if (target.getAttribute("id") == "edit-button") {
    // each row has a class based on the id value; e.g. 'id-5'
    // the split function is used to extract the number (i.e. the id)
    var id = target.parentNode.className.split("-")[1];
    // get all cells in the clicked row
    var toUpdate = document.getElementsByClassName(`id-${id}`);
    var contentToUpdate = [];
    // loop over all cells in the clicked row to get their values
    // '-2' to exclude edit and delete buttons
    for (var i = 0; i < toUpdate.length - 2; i++) {
      contentToUpdate.push(toUpdate[i].textContent);
    }
    editData(contentToUpdate);
  }

  // user clicked delete button
  if (target.getAttribute("id") == "delete-button") {
    // each row has a class based on the id value; e.g. 'id-5'
    var id = target.parentNode.className.split("-")[1];
    deleteData(id);
  }
}

function postData(event) {
  // adds customer info to the database when the user submits the 'Add customer' form
  // Name & Date are required
  var req = new XMLHttpRequest();
  var newcustomer = { name: null, email: null, entityname: null, location: null, date: null };
  newcustomer.name = document.getElementById("name-input").value;
  newcustomer.email = document.getElementById("email-input").value;
  newcustomer.entityname = document.getElementById("entityname-input").value;
  newcustomer.location = document.getElementById("location-input").value;
  newcustomer.date = document.getElementById("date-input").value;
  newcustomer.id = (idGenerator++).toString();

  console.log("newcustomer", newcustomer);
  req.open("POST", baseURL, true);
  req.setRequestHeader("Content-Type", "application/json");
  req.addEventListener("load", function () {
    if (req.status >= 200 && req.status < 400) {
      var response = JSON.parse(req.responseText);
      var data = response.rows;
      // generate table with updated data upon successful post
      generate_table(data);
    } else {
      console.log("Error: " + req.statusText);
    }
  });
  req.send(JSON.stringify(newcustomer));
  event.preventDefault();
}

function deleteData(id) {
  // accepts an ID and deletes the customer associated with that ID in the database
  var req = new XMLHttpRequest();

  req.open("DELETE", baseURL, true);
  req.setRequestHeader("Content-Type", "application/json");
  req.addEventListener("load", function () {
    if (req.status >= 200 && req.status < 400) {
      var response = JSON.parse(req.responseText);
      var data = response.rows;
      // generate table with updated data upon successful delete
      generate_table(data);
    } else {
      console.log("Error: " + req.statusText);
    }
  });
  var rowToDelete = { id: id };
  req.send(JSON.stringify(rowToDelete));
  // event.preventDefault();
}

function updateData(event) {
  // updates a customer in the database when user submits the 'Update customer' form
  var req = new XMLHttpRequest();
  var updatedcustomer = { name: null, email: null, entityname: null, location: null, date: null };
  updatedcustomer.name = document.getElementById("update-name").value;
  updatedcustomer.email = document.getElementById("update-email").value;
  updatedcustomer.entityname = document.getElementById("update-entityname").value;
  updatedcustomer.location = document.getElementById("update-location").value;
  updatedcustomer.date = document.getElementById("update-date").value;
  updatedcustomer.id = (idGenerator++).toString();
  req.open("PUT", baseURL, true);
  req.setRequestHeader("Content-Type", "application/json");
  req.addEventListener("load", function () {
    if (req.status >= 200 && req.status < 400) {
      var response = JSON.parse(req.responseText);
      var data = response.rows;
      // generate table with updated data upon successful put
      generate_table(data);
      // hide the 'Update customer' form
      updateForm.style.display = "none";
    } else {
      console.log("Error: " + req.statusText);
    }
  });
  req.send(JSON.stringify(updatedcustomer));
  event.preventDefault();
}

function editData(contentToUpdate) {
  // show the 'Update customer' form
  updateForm.style.display = "block";
  // populate the 'Update customer' form with the values of the customer that the user wanted to edit
  console.log("contentToUpdate", contentToUpdate);
  document.getElementById("update-name").value = contentToUpdate[0];
  document.getElementById("update-email").value = contentToUpdate[1];
  document.getElementById("update-entityname").value = contentToUpdate[2];
  document.getElementById("update-location").value = contentToUpdate[3];
  document.getElementById("update-date").value = contentToUpdate[4];

}

function generate_table(data) {
  var table = document.getElementById("customer-table");

  // if a table already exists, remove its event listener and remove it from the DOM
  if (table) {
    table.removeEventListener("click", clickTable);
    table.parentNode.removeChild(table);
  }

  var container = document.getElementById("container-div");

  // create a table element and its thead and tbody
  var table = document.createElement("table");
  table.setAttribute("id", "customer-table");
  table.setAttribute("class", "table w-auto");
  var tableBody = document.createElement("tbody");
  var tableHead = document.createElement("thead");

  // create the header
  var columns = ["ID", "Name", "Reps", "Weight", "Unit", "Date", "Edit", "Delete"];
  var headerRow = document.createElement("tr");
  for (var c = 0; c < columns.length; c++) {
    var headerCell = document.createElement("th");
    var cellText = document.createTextNode(columns[c]);
    headerCell.appendChild(cellText);
    // hide the ID column
    if (c == 0) {
      headerCell.setAttribute("class", "hidden");
    }
    headerRow.appendChild(headerCell);
  }
  tableHead.appendChild(headerRow);
  table.appendChild(tableHead);

  if (data) {
    // create all cells in the tbody based on the stored data
    for (var i = 0; i < data.length; i++) {
      var row = document.createElement("tr");
      // get the ID of the current row in the database and give the row an id based on the database ID
      var id = data[i]["id"];
      row.setAttribute("id", `id-${id}`);

      // create a cell for each column in the database: id, name, reps, weight, unit, date
      for (const property in data[i]) {
        var cell = document.createElement("td");
        // give each cell in the row an id based on the database ID
        // e.g. if current customer has ID = 4, all td will have class 'id-4'
        // this makes it easy to extract all values associated with a customer from the table
        cell.setAttribute("class", `id-${id}`);
        // convert SQL date to date that JavaScript input can interpret
        if (property == "date" && data[i][property] != "0000-00-00") {
          var text = new Date(data[i][property]);
          text = text.toISOString().substring(0, 10);
          // units are stored as booleans in database => convert to text to display in table
        } else if (property == "unit") {
          if (data[i][property] == 0) {
            text = "lbs";
          } else {
            text = "kg";
          }
        } else {
          var text = data[i][property];
        }
        // hide the ID column
        if (property == "id") {
          cell.classList.add("hidden");
        }
        var cellText = document.createTextNode(text);
        cell.appendChild(cellText);
        row.appendChild(cell);
      }

      // create edit button for each row
      var cell = document.createElement("td");
      cell.setAttribute("class", `id-${id}`);
      var cellText = document.createTextNode("Edit");
      var editButton = document.createElement("button");
      editButton.setAttribute("id", "edit-button");
      editButton.appendChild(cellText);
      editButton.setAttribute("class", "btn btn-primary");
      cell.appendChild(editButton);
      row.appendChild(cell);

      // create delete button for each row
      var cell = document.createElement("td");
      cell.setAttribute("class", `id-${id}`);
      var cellText = document.createTextNode("Delete");
      var deleteButton = document.createElement("button");
      deleteButton.setAttribute("id", "delete-button");
      deleteButton.appendChild(cellText);
      deleteButton.setAttribute("class", "btn btn-danger");
      cell.appendChild(deleteButton);
      row.appendChild(cell);

      // add the row to the end of the table body
      tableBody.appendChild(row);
    }
  }
  // put the <tbody> in the <table>
  table.appendChild(tableBody);
  // appends <table> into <div class="container">
  container.appendChild(table);

  table.addEventListener("click", clickTable);
}

init();
