var mysql = require("mysql");

var connection = mysql.createConnection({
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
  // createEmployee();
});

// Function for creating new employee
function createEmployee() {
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
