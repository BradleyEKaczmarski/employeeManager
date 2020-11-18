const { prompt } = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./db");
require("console.table");

init();

// Display logo text, load main prompts
function init() {
  const logoText = logo({ name: "Employee Manager" }).render();

  console.log(logoText);

  loadMainPrompts();
}

async function loadMainPrompts() {
  const { choice } = await prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        {
          name: "View All Employees",
          value: "VIEW_EMPLOYEES"
        },
        {
          name: "View All Employees By Department",
          value: "VIEW_EMPLOYEES_BY_DEPARTMENT"
        },
        {
          name: "View All Employees By Manager",
          value: "VIEW_EMPLOYEES_BY_MANAGER"
        },
        {
          name: "Add Employee",
          value: "ADD_EMPLOYEE"
        },
        {
          name: "Remove Employee",
          value: "REMOVE_EMPLOYEE"
        },
        //You will need to complete the rest of the switch statement
        // update
        {
          name: "Update Employee Role",
          value: "UPDATE_EMPLOYEE_ROLE"
        }, {
          name: "Update Employee Manager",
          value: "UPDATE_EMPLOYEE_MANAGER"
        },
        // roles
        {
          name: "View All Roles",
          value: "VIEW_ROLES"
        }, {
          name: "Add Role",
          value: "ADD_ROLE"
        }, {
          name: "Remove Role",
          value: "REMOVE_ROLE"
        },
        //departments
        {
          name: "View All Departments",
          value: "VIEW_DEPARTMENTS"
        },
        {
          name: "Add Department",
          value: "ADD_DEPARTMENT"
        },
        {
          name: "Remove Department",
          value: "REMOVE_DEPARTMENT"
        },
        //quit
        {
          name: "Quit",
          value: "QUIT"
        }
      ]
    }
  ]);

  // Call the appropriate function depending on what the user chose
  switch (choice) {
    case "VIEW_EMPLOYEES":
      return viewEmployees();
    case "VIEW_EMPLOYEES_BY_DEPARTMENT":
      return viewEmployeesByDepartment();
    case "VIEW_EMPLOYEES_BY_MANAGER":
      return viewEmployeesByManager();
    case "ADD_EMPLOYEE":
      return addEmployee();
    case "REMOVE_EMPLOYEE":
      return removeEmployee();
    //You will need to complete the rest of the cases 
    case "UPDATE_EMPLOYEE_ROLE":
      return updateEmployeeRole();
    case "UPDATE_EMPLOYEE_MANAGER":
      return updateEmployeeManager();
    case "VIEW_DEPARTMENTS":
      return ViewDepartments();
    case "ADD_DEPARTMENT":
      return addDepartment();
    case "REMOVE_DEPARTMENT":
      return removeDepartment();
    case "VIEW_ROLES":
      return viewRoles();
    case "ADD_ROLE":
      return addRole();
    case "REMOVE_ROLE":
      return removeRole();
    default:
      return quit();
  }
}

async function viewEmployees() {
  const employees = await db.findAllEmployees();

  console.log("\n");
  console.table(employees);
  loadMainPrompts();
}

async function viewEmployeesByDepartment() {
  const departments = await db.findAllDepartments();

  const departmentChoices = departments.map(({ id, name }) => ({
    name: name,
    value: id
  }));

  const { departmentId } = await prompt([
    {
      type: "list",
      name: "departmentId",
      message: "Which department would you like to see employees for?",
      choices: departmentChoices
    }
  ]);

  const employees = await db.findAllEmployeesByDepartment(departmentId);

  console.log("\n");
  console.table(employees);

  loadMainPrompts();
}

async function viewEmployeesByManager() {
  const managers = await db.findAllEmployees();

  const managerChoices = managers.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { managerId } = await prompt([
    {
      type: "list",
      name: "managerId",
      message: "Which employee do you want to see direct reports for?",
      choices: managerChoices
    }
  ]);

  const employees = await db.findAllEmployeesByManager(managerId);

  console.log("\n");

  if (employees.length === 0) {
    console.log("The selected employee has no direct reports");
  } else {
    console.table(employees);
  }

  loadMainPrompts();
}
//remove employee
async function removeEmployee() {
  const employees = await db.findAllEmployees();
  const employeeChoices = employees.map(function ({
    id,
    first_name,
    last_name
  }) {
    return ({
      name: `${first_name} ${last_name}`,
      value: id
    });
  });
  const {
    employeeId
  } = await prompt([{
    type: "list",
    name: "employeeId",
    message: "Which employee do you want to remove?",
    choices: employeeChoices
  }]);
  await db.removeEmployee(employeeId);
  console.log("Removed employee from the database");
  loadMainPrompts();
}
//update 

async function updateEmployeeRole() {
  const employees = await db.findAllEmployees()
  const employeeChoices = employees.map(function ({
    id,
    first_name,
    last_name
  }) {
    return ({
      name: `${first_name} ${last_name}`,
      value: id
    });
  });
  const {
    employeeId
  } = await prompt([{
    type: "list",
    name: "employeeId",
    message: "Which employee's role do you want to update?",
    choices: employeeChoices
  }]);
  const roles = await db.findAllRoles();
  const roleChoices = roles.map(({
    id,
    title
  }) => ({
    name: title,
    value: id
  }));
  const {
    roleId
  } = await prompt([{
    type: "list",
    name: "roleId",
    message: "which role do you want to assign to selected employee?",
    choices: roleChoices
  }]);
  await db.updateEmployeeRole(employeeId, roleId);
  console.log("Updated employee's role");
  loadMainPrompts();
};
/*===============================================================================

                          UPDATE EMPLOYEE MANAGER
                            
================================================================================*/
async function updateEmployeeManager() {
  const employees = await db.findAllEmployees();
  const employeeChoices = employees.map(({
    id,
    first_name,
    last_name
  }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));
  const {
    employeeId
  } = await prompt([{
    type: "list",
    name: "employeeId",
    message: "which employee's manager do you want to update?",
    choices: employeeChoices
  }]);
  const managers = await db.findAllPossibleManagers(employeeId);
  const managerChoices = managers.map(({
    id,
    first_name,
    last_name
  }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));
  const {
    managerId
  } = await prompt([{
    type: "list",
    name: "managerId",
    message: "which employee do you want to set as manager for the sleeted employee?",
    choices: managerChoices
  }]);
  await db.updateEmployeeManager(employeeId, managerId);
  console.log("Updated employee's manager");
  loadMainPrompts();
}

//view roles

async function viewRoles() {
  const roles = await db.findAllRoles();
  console.log("\n");
  console.table(roles);
  loadMainPrompts();
}

//add roles

async function addRole() {
  const departments = await db.findAllDepartments();
  const departmentChoices = departments.map(({
    id,
    name
  }) => ({
    name: name,
    value: id,
  }));
  const role = await prompt([{
      name: "title",
      message: "what is the name of the role?"
    },
    {
      name: "salary",
      message: "what is the salary of the role?"
    },
    {
      type: "list",
      name: "department_id",
      message: "which department does the role belong to?",
      choices: departmentChoices
    }
  ]);

  await db.createRole(role);
  console.log(`Added ${role.title} to the database`);
  loadMainPrompts();
}
//remove role

async function removeRole() {
  const roles = await db.findAllRoles();
  const roleChoices = roles.map(({
    id,
    title
  }) => ({
    name: title,
    value: id,
  }));
  const {
    roleId
  } = await prompt([{
    type: "list",
    name: "roleId",
    message: "Which role do you want to remove? (Warning: This will also remove employees",
    choices: roleChoices
  }]);
  await db.removeRole(roleId);
  console.log("Removed role from the database");
  loadMainPrompts();
}
//view departments

async function ViewDepartments() {
  const departments = await db.findAllDepartments();
  console.log("\n");
  console.table(departments);
  loadMainPrompts();
}
//add department

async function addDepartment() {
  const department = await prompt([{
    name: "name",
    message: "What is the name of the department?"
  }]);
  await db.createDepartment(department);
  console.log(`Added ${department.name} to the database`);
  loadMainPrompts();
}
//remove department

async function removeDepartment() {
  const departments = await db.findAllDepartments();
  const departmentChoices = departments.map(({
    id,
    name
  }) => ({
    name: name,
    value: id
  }));
  const {
    departmentId
  } = await prompt({
    type: "list",
    name: "departmentId",
    message: "Which department would you like to remove?(Warning: This will also remove associated roles and employees)",
    choices: departmentChoices
  });
  await db.removeDepartment(departmentId);
  console.log(`Remove department from the database`);
  loadMainPrompts();
}
//add employeee

async function addEmployee() {
  const roles = await db.findAllRoles();
  const employees = await db.findAllEmployees();

  const employee = await prompt([
    {
      name: "first_name",
      message: "What is the employee's first name?"
    },
    {
      name: "last_name",
      message: "What is the employee's last name?"
    }
  ]);
//role choices

  const roleChoices = roles.map(({
    id,
    title
  }) => ({
    name: title,
    value: id
  }));

  const {
    roleId
  } = await prompt({
    type: "list",
    name: "roleId",
    message: "what is the employee's role?",
    choices: roleChoices
  });

  employee.role_id = roleId;
//manager choices

  const managerChoices = employees.map(({
    id,
    first_name,
    last_name
  }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));
  managerChoices.unshift({
    name: "None",
    value: null
  });

  const {
    managerId
  } = await prompt({
    type: "list",
    name: "manager",
    message: "Who is the employee's manager?",
    choices: managerChoices
  });
  employee.manager_id = managerId;
  await db.createEmployee(employee);
  console.log(`Added ${employee.first_name} ${employee.last_name} to the database`);
  loadMainPrompts();
}

//quit
function quit() {
  console.log("Goodbye!");
  process.exit();
}
