const { addOrUpdate, get } = require("../services/firebaseService");
const sendMail = require("../config/nodemailer");
const { generateToken } = require("../services/jwtService");
const { where } = require("firebase/firestore");

// CRUD EMPLOYEE
const createEmployee = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ status: 'error', message: 'You must login first' });
    }

    if (!req.body) {
      return res.status(400).json({ status: 'error', message: 'Missing request body' });
    }
    const query = [
      where("email", "==", req.body.email), 
      where("role", "==", "employee"), 
      where("ownerId", "==", req.user.id), 
      where("isDeleted", "==", false)
    ];
    const employees = await get("users", null, query);
    const employee = employees?.[0];
    console.log(employee)
    if (employee) {
      return res.status(400).json({ status: 'error', message: 'Employee with this email already exists' });
    }

    const data = { 
      ...employee,
      ...req.body, 
      ownerId: req.user.id, 
      createdAt: new Date().toISOString(), 
      updatedAt: new Date().toISOString(), 
      isDeleted: false, 
      verified: false,
      role: "employee"
    };

    const addedEmployee = await addOrUpdate("users", data, null);
    const { url } = generateSetupUrl(addedEmployee.id, req.user.id, `${req.body.firstName}${req.body.lastName}`);

    sendMail(req.body.email, `Your setup account link: ${url}`);
    res.status(200).json({ status: 'ok', message: 'Create employee successfully', employeeId: addedEmployee.id });
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'Create employee failed', details: error });
  }
}

const readEmployees = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ status: 'error', message: 'You must login first' });
    }
    if(req.user.role !== "owner") {
      return res.status(400).json({ status: 'error', message: 'You do not have permission to read employees' });
    }

    const query = [where("ownerId", "==", req.user.id), where("isDeleted", "==", false), where("role", "==", "employee")];
    const employees = await get("users", null, query);
    res.status(200).json({ status: 'ok', message: 'Read employees successfully', data: employees });
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'Read employees failed', details: error });
  }
}

const readEmployee = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ status: 'error', message: 'You must login first' });
    }
    const { id } = req.params;
    const employee = await get("users", id);
    if (!employee) {
      return res.status(400).json({ status: 'error', message: 'Employee not found' });
    }
    res.status(200).json({ status: 'ok', message: 'Read employee successfully', data: employee });
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'Read employee failed' });
  }
}

const updateEmployee = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ status: 'error', message: 'You must login first' });
    }
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ status: 'error', message: 'Missing employee id' });
    }

    if (!req.body) {
      return res.status(400).json({ status: 'error', message: 'Missing employee information' });
    }
    const employee = await get("users", id);
    if (!employee) {
      return res.status(400).json({ status: 'error', message: 'Employee not found' });
    }

    if(!employee.chatId) {
      req.body.chatId = `${employee.ownerId}-${employee.id}`;
    }

    await addOrUpdate("users", { ...employee, ...req.body, updatedAt: new Date().toISOString() }, id);
    const updatedEmployee = await get("users", id);
    res.status(200).json({ status: 'ok', message: 'Update employee successfully', data: updatedEmployee });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: 'error', message: 'Update employee failed', details: error });
  }
}

const deleteEmployee = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ status: 'error', message: 'You must login first' });
    }
    const { id } = req.params;

    const employee = await get("users", id);
    if (!employee) {
      return res.status(400).json({ status: 'error', message: 'Employee not found' });
    }

    await addOrUpdate("users", { ...employee, isDeleted: true, updatedAt: new Date().toISOString() }, id);
    res.status(200).json({ status: 'ok', message: 'Delete employee successfully' });
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'Delete employee failed' });
  }
}

const generateSetupUrl = (employeeId, ownerId, name) => {
  try {
    const token = generateToken({ employeeId, ownerId, name });
    const url = `${process.env.FRONTEND_URL}/employee-setup-account?name=${(name).split(" ").join("")}&token=${token}&expiresAt=${new Date().getTime() + 24 * 60 * 60 * 1000}`;
    return { url, token };
  } catch (error) {
    console.log(error);
    return { error };
  }
}

module.exports = { createEmployee, readEmployee, updateEmployee, deleteEmployee, readEmployees };
