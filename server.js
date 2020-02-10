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
    } else if(response.role === "Sales") {
      role_id = 3;
      manager_id = 3;
    } else if(response.role === "Engineer") {
      role_id = 2;
      manager_id = 2;
    } else if(response.role === "Manager") {
      role_id = 4;
      manager_id = 4;
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
  let query = connection.query("SELECT e.id, e.first_name, e.last_name FROM employee e", function(err, results) {
    if (err) throw err;
    // Prompt user to select employee by ID
    inquirer
      .prompt([
        {
          name: "update",
          type: "rawlist",
          choices: function() {
            const choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              let data = results[i].first_name + " " + results[i].last_name;
              choiceArray.push(data);
            }
            return choiceArray;
          },
          message: "Who's role would you like to update?"
        },
        {
          type: "list",
          name: "newRole",
          message: "What is their new role:",
          choices: ['Sales Specialist', 'Sales', 'Engineer', 'Manager']
        }
      ])
      .then(function(answer) {
        let role_id;
        if(answer.newRole === "Sales Specialist") {
          role_id = 1;
        } else if(answer.newRole === "Sales") {
          role_id = 3;
        } else if(answer.newRole === "Engineer") {
          role_id = 2;
        } else if(answer.newRole === "Manager") {
          role_id = 4;
        }
        let answerFirstName = answer.update.split(" ")[0];
        let answerLastName = answer.update.split(" ")[1];
        const employee = results.find(element => element.first_name === answerFirstName && element.last_name === answerLastName);
        // get the information of the chosen item1
        query = connection.query(
          "UPDATE employee SET role_id = ? WHERE id = ?",
          [role_id, employee.id],
          function(err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " employee role updated!\n");
            startQuestions(); 
          }
        );
      })
    })
  }
    
// Function to delete existing employee
function deleteEmployee() {
  let query = connection.query("SELECT e.id, e.first_name, e.last_name FROM employee e", function(err, results) {
    if (err) throw err;
    // Prompt user to select employee by ID
    inquirer
      .prompt([
        {
          name: "update",
          type: "rawlist",
          choices: function() {
            const choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              let data = results[i].first_name + " " + results[i].last_name;
              choiceArray.push(data);
            }
            return choiceArray;
          },
          message: "Who would you like to remove?"
        }
      ])
      .then(function(answer) {
        let answerFirstName = answer.update.split(" ")[0];
        let answerLastName = answer.update.split(" ")[1];
        const removeEmployee = results.find(element => element.first_name === answerFirstName && element.last_name === answerLastName);
        connection.query(
          "DELETE FROM employee WHERE id = ?",
            [removeEmployee.id],
          function(err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " employee deleted!\n");
            startQuestions();
          }
        );
      })
    })
  }
