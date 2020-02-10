const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",

  // Port
  port: 3306,

  // Username
  user: "root",

  // Password
  password: "Baxter#828",
  database: "employee_db",

  multipleStatements: true
});

const startQuestions = () => {
  inquirer.prompt(questions)
  .then (function(resp) {
    switch (resp.choice) {
      case 'View all employees':
        showEmployees();
        break;
      case 'Add employee':
        createEmployee();
        break;
      case 'Update employee':
        updateEmployee();
        break;
      case 'Delete employee':
        deleteEmployee();
        break;
    }
  });
} 

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  startQuestions();
});

const questions = [
  {
    type: 'list',
    name: 'choice',
    message: 'What would you like to do?',
    choices: ['View all employees', 'Add employee', 'Update employee', 'Delete employee']
  }
]

const addEmp = [
  {
    type: "input",
    name: "first_name",
    message: "What is the employee's first name?"
  },
  {
    type: "input",
    name: "last_name",
    message: "What is the employee's last name?"
  },
  {
    type: "list",
    name: "role",
    message: "Choose a role:",
    choices: ['Sales Specialist', 'Sales', 'Engineer', 'Manager']
  }
]

// Function to see exitsing employee table
function showEmployees() {
  connection.query(
    "SELECT e.first_name, e.last_name, r.title, r.salary, d.name, r.manager FROM employee e INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id", 
    function(err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.table(res),
      console.log(res);
      // connection.end();
      startQuestions();
  });
}

// Function for creating new employee
function createEmployee() {

  inquirer.prompt(addEmp)

  .then(function(response) {
    let role_id;
    let manager_id;
    if(response.role === "Sales Specialist") {
      role_id = 1;
      manager_id = 1;
      department_id = 1;
    } else if(response.role === "Sales") {
      role_id = 2;
      manager_id = 2;
      department_id = 2;
    } else if(response.role === "Engineer") {
      role_id = 3;
      manager_id = 3;
      department_id = 3;
    } else if(response.role === "Manager") {
      role_id = 4;
      manager_id = 4;
      department_id = 4;
    }
    let query = connection.query(
      "INSERT INTO employee SET ?",
      {
        role_id: role_id,
        manager_id: manager_id,
        first_name: response.first_name,
        last_name: response.last_name,          
      },
      function(err, res) {
        if (err) throw err;
        console.log(res.affectedRows + " employee inserted!\n");
      })
    console.log(query.sql);
    startQuestions();
  })
}

// Function to update employee information (department, salary, role, etc.)
function updateEmployee() {
  connection.query("SELECT id, first_name, last_name FROM employee", function(err, results) {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].id, results[i].first_name, results[i].last_name);
            }
            return console.table(results.id, results.first_name, results.last_name);
          },
          message: "Who's role would you like to update?"
        }
      ])
      .then(function(answer) {
        // get the information of the chosen item
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].item_name === answer.choice) {
            chosenItem = results[i];
          }
        }
      })    
    })
  }
    
// Function to delete existing employee
// function deleteEmployee() {
  // console.log("Deleting all strawberry icecream...\n");
  // connection.query(
  //   "DELETE FROM products WHERE ?",
  //   {
  //     flavor: "strawberry"
  //   },
  //   function(err, res) {
  //     if (err) throw err;
  //     console.log(res.affectedRows + " products deleted!\n");
  //     // Call readProducts AFTER the DELETE completes
  //     readProducts();
  //   }
  // );
// }
