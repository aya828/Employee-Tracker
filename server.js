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
  inquirer.prompt(questions).then(function(resp) {
    switch (resp.choice) {
      case "View all employees":
        showEmployees();
        break;
      case "View all departments":
        showDepartments();
        break;
      case "View all roles":
        showRoles();
        break;
      case "Add employee":
        createEmployee();
        break;
      case "Add department":
        createDepartment();
        break;
      case "Add role":
        createRole();
        break;
      case "Update employee":
        updateEmployee();
        break;
      case "Delete employee":
        deleteEmployee();
        break;
      case "Delete department":
        deleteDepartment();
        break;
      case "Delete role":
        deleteRole();
        break;
    }
  });
};

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  startQuestions();
});

const questions = [
  {
    type: "list",
    name: "choice",
    message: "What would you like to do?",
    choices: [
      "View all employees",
      "View all departments",
      "View all roles",
      "Add department",
      "Add role",
      "Add employee",
      "Update employee",
      "Delete employee",
      "Delete department",
      "Delete role"
    ]
  }
];

// Function to see exitsing employee table
function showEmployees() {
  connection.query(
    "SELECT e.first_name, e.last_name, r.title, r.salary, d.name, r.manager FROM employee e INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id",
    function(err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.table(res);
      startQuestions();
    }
  );
}

function showDepartments() {
  connection.query("SELECT d.name FROM department d", function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.table(res);
    startQuestions();
  });
}

function showRoles() {
  connection.query(
    "SELECT r.id, r.title, r.salary, r.manager FROM role r",
    function(err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.table(res)
      startQuestions();
    }
  );
}

// Function for creating new employee
function createEmployee() {
  let query = connection.query("SELECT r.id, r.title FROM role r", function(
    err,
    results
  ) {
    inquirer
      .prompt([
        {
          name: "role",
          type: "rawlist",
          choices: function() {
            const choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              let data = results[i].title;
              choiceArray.push(data);
            }
            return choiceArray;
          },
          message: "Choose role of new employee."
        },
        {
          type: "input",
          name: "first_name",
          message: "What is the employee's first name?"
        },
        {
          type: "input",
          name: "last_name",
          message: "What is the employee's last name?"
        }
      ])
      .then(function(response) {
        const role = results.find(element => element.title === response.role);
        let role_id = role.id;
        query = connection.query(
          "INSERT INTO employee SET ?",
          {
            role_id: role_id,
            first_name: response.first_name,
            last_name: response.last_name
          },
          function(err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " employee inserted!\n");
          }
        );
        console.log(query.sql);
        startQuestions();
      });
  });
}

// Function to create new department
function createDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message: "What department would you like to add?"
      }
    ])
    .then(function(answer) {
      query = connection.query(
        "INSERT INTO department SET ?",
        {
          name: answer.department
        },
        function(err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " department updated!\n");
          startQuestions();
        }
      );
    });
}

// Function to create new role
function createRole() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "role",
        message: "What role would you like to add?"
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary?"
      },
      {
        type: "input",
        name: "manager",
        message: "Who is their manager?"
      }
    ])
    .then(function(answer) {
      query = connection.query(
        // Inserts new role data into DB
        "INSERT INTO role SET ?",
        {
          title: answer.role,
          salary: answer.salary,
          manager: answer.manager
        },
        function(err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " role updated!\n");
          startQuestions();
        }
      );
    });
}

// Function to update employee information (department, salary, role, etc.)
function updateEmployee() {
  var roles = [];
  connection.query("SELECT r.id, r.title FROM role r", function(err, results) {
    roles = results;
  });
  let query = connection.query(
    "SELECT e.id, e.first_name, e.last_name FROM employee e",
    function(err, results) {
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
            type: "rawlist",
            name: "newRole",
            message: "What is their new role:",
            choices: function() {
              const titles = [];
              for (var i = 0; i < roles.length; i++) {
                let data = roles[i].title;
                titles.push(data);
              }
              return titles;
            }
          }
        ])
        .then(function(answer) {
          const newRole = roles.find(
            element => element.title === answer.newRole
          );
          let role_id = newRole.id;
          let answerFirstName = answer.update.split(" ")[0];
          let answerLastName = answer.update.split(" ")[1];
          const employee = results.find(
            element =>
              element.first_name === answerFirstName &&
              element.last_name === answerLastName
          );
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
        });
    }
  );
}

// Function to delete existing employee
function deleteEmployee() {
  let query = connection.query(
    "SELECT e.id, e.first_name, e.last_name FROM employee e",
    function(err, results) {
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
          // Finds name of employee in DB that matches with choice
          const removeEmployee = results.find(
            element =>
              element.first_name === answerFirstName &&
              element.last_name === answerLastName
          );
          connection.query(
            "DELETE FROM employee WHERE id = ?",
            [removeEmployee.id],
            function(err, res) {
              if (err) throw err;
              console.log(res.affectedRows + " employee deleted!\n");
              startQuestions();
            }
          );
        });
    }
  );
}

// Function to delete departments
function deleteDepartment() {
  let query = connection.query("SELECT d.name FROM department d", function(err, results) {
    if (err) throw err;
    // Prompt user to select department
    inquirer
      .prompt([
        {
          name: "depRemove",
          type: "rawlist",
          choices: function() {
            const choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              let data = results[i].name;
              choiceArray.push(data);
            }
            return choiceArray;
          },
          message: "What department would you like to remove?"
        }
      ])
      .then(function(answer) {
        // Finds name of department in DB that matches with choice
        const removeDepartment = results.find(
          element => element.name === answer.depRemove
        );
        connection.query(
          "DELETE FROM department WHERE name = ?",
          [removeDepartment.name],
          function(err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " department deleted!\n");
            startQuestions();
          }
        );
      });
  });
}

// Function to delete existing role
function deleteRole() {
  let query = connection.query("SELECT r.id, r.title FROM role r", function(err, results) {
    if (err) throw err;
    // Prompt user to select role
    inquirer
      .prompt([
        {
          name: "roleRemove",
          type: "rawlist",
          choices: function() {
            const choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              let data = results[i].title;
              choiceArray.push(data);
            }
            return choiceArray;
          },
          message: "What role would you like to remove?"
        }
      ])
      .then(function(answer) {
        // Finds name of role in DB that matches with choice
        const removeRole = results.find(
          element => element.title === answer.roleRemove
        );
        connection.query(
          "DELETE FROM role WHERE title = ?",
          [removeRole.title],
          function(err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " role deleted!\n");
            startQuestions();
          }
        );
      });
  });
}
