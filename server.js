const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Baxter#828",
  database: "employee_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
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
    type: "input",
    name: "role",
    message: "What is the employee's role?"
  },
  {
    type: "input",
    name: "department",
    message: "What department is the employee in?"
  },
  {
    type: "input",
    name: "salary",
    message: "What is the employee's salary?"
  },
  {
    type: "input",
    name: "manager",
    message: "Who is the employee's manager?",
  }
]

const updateEmp = [
  {
    type: "choice",
    name: "update",
    message: "Which employee role would you like to update?"
  }
]

// Function to see exitsing employee table
function showEmployees() {
  connection.query("SELECT * FROM employee", function(err, res) {
    console.table([{
      id: "SELECT id FROM employee",
      first_name: "SELECT first_name FROM employee",
      last_name: "SELECT last_name FROM employee",
      title: "SELECT title FROM role",
      department: "SELECT name FROM department",
      salary: "SELECT salary FROM role",
      manager: "SELECT manager FROM employee"
    }])
    
    if (err) throw err;
    // Log all results of the SELECT statement
    console.log(res);
    connection.end();
  });
  
  }
  // console.log("Selecting all products...\n");
  // connection.query("SELECT * FROM products", function(err, res) {
  //   if (err) throw err;
  //   // Log all results of the SELECT statement
  //   console.log(res);
  //   connection.end();
  // });


// Function for creating new employee
function createEmployee() {

  inquirer.prompt(addEmp)

  .then(function(response) {
    var query = connection.query(
      {
        first_name: response.first_name,
        last_name: response.last_name,
        title: response.role,
        department: response.department,
        salary: response.salary,
        manager: response.manager
      }
    )
    console.log(query.sql)
  })
  // console.log("Inserting a new product...\n");
  // var query = connection.query(
  //   "INSERT INTO products SET ?",
  //   {
  //     flavor: "Rocky Road",
  //     price: 3.0,
  //     quantity: 50
  //   },
  //   function(err, res) {
  //     if (err) throw err;
  //     console.log(res.affectedRows + " product inserted!\n");
  //     // Call updateProduct AFTER the INSERT completes
  //     updateProduct();
  //   }
  // );

  // // logs the actual query being run
  // console.log(query.sql);
}

// Functiojn to update employee information (department, salary, role, etc.)
function updateEmployee() {
  // console.log("Updating all Rocky Road quantities...\n");
  // var query = connection.query(
  //   "UPDATE products SET ? WHERE ?",
  //   [
  //     {
  //       quantity: 100
  //     },
  //     {
  //       flavor: "Rocky Road"
  //     }
  //   ],
  //   function(err, res) {
  //     if (err) throw err;
  //     console.log(res.affectedRows + " products updated!\n");
  //     // Call deleteProduct AFTER the UPDATE completes
  //     deleteProduct();
  //   }
  // );

  // // logs the actual query being run
  // console.log(query.sql);
}

// Function to delete existing employee
function deleteEmployee() {
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
}

// Function to see exitsing employee table
function readEmployee() {
  // console.log("Selecting all products...\n");
  // connection.query("SELECT * FROM products", function(err, res) {
  //   if (err) throw err;
  //   // Log all results of the SELECT statement
  //   console.log(res);
  //   connection.end();
  // });
}
