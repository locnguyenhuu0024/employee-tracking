const smsApp = require("../config/sms");
const { isValidPhoneNumber } = require("libphonenumber-js");
const { readOwnerByPhone, addEmployee, addOrUpdate, get } = require("../services/firebaseService");
const { generateToken } = require("../services/jwtService");
const { updateEmployee } = require("./employeeController");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const { where, limit } = require("firebase/firestore");

dotenv.config();

const generateSms = (code) => `Your  code is ${code}`;
const createNewAccessCode = async (req, res) => {
  const { phone } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000);

  if (!isValidPhoneNumber(phone)) {
    return res.status(400).json({ status: 'error', message: 'Invalid phone number' });
  }

  const owners = await get("users", null, [where("phone", "==", phone), limit(1)]);
  const owner = owners[0];
  if (owner && owner.verified === false && owner.retry >= 3) {
    return res.status(400).json({ status: 'error', message: 'You have sent too many requests. Please try again later' });
  }

  const data = owner ? {
    ...owner,
    code,
    verified: false,
    retry: owner.retry + 1,
    updatedAt: new Date().toISOString()
  } : {
    phone,
    code,
    verified: false,
    retry: 0,
    information: null,
    firstName: "",
    lastName: "",
    role: "owner",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  const smsResult = await smsApp.sendSMS(phone, generateSms(code));
  if (smsResult.ok) {
    await addOrUpdate("users", data, owner ? owner.id : null);
    res.status(200).json({ status: 'ok', message: 'Send access code successfully' });
  } else {
    res.status(400).json({ status: 'error', message: 'Send access code failed' });
  }
}

const validateAccessCode = async (req, res) => {
  const { phone, code } = req.body;
  const owners = await get("users", null, [where("phone", "==", phone), limit(1)]);
  const owner = owners[0];
  console.log(owner)
  if (!owner) {
    return res.status(400).json({ status: 'error', message: 'Wrong phone number or Invalid code' });
  }

  if (owner.verified) {
    return res.status(400).json({ status: 'error', message: 'You have already verified' });
  }

  if (typeof owner.code !== 'number') {
    return res.status(400).json({ status: 'error', message: 'Invalid code', details: owner.code });
  }

  if (owner.code !== code) {
    return res.status(400).json({ status: 'error', message: 'Invalid code', details: owner.code });
  }

  owner.verified = true;
  owner.retry = -1;
  if (owner.accessToken) {
    delete owner.accessToken;
  }
  owner.accessToken = generateToken({ ...owner, role: 'owner' });
  await addOrUpdate("users", owner, owner.id);
  res.status(200).json({ status: 'ok', message: 'Verify code successfully', data: owner });
}

const setupEmployee = async (req, res) => {
  try {

    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ status: 'error', message: 'Missing username or password' });
    }

    const query = [where("username", "==", username), limit(1)];
    const employees = await get("users", null, query);
    const employee = employees[0];
    if (employee) {
      return res.status(400).json({ status: 'error', message: 'Username already exists, please choose another username' });
    }
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
    const hash = await bcrypt.hash(password, salt);
    req.body.password = hash;
    req.body.verified = true;
    await updateEmployee(req, res);
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: 'error', message: 'Setup employee failed' });
  }
}

const employeeSignIn = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ status: 'error', message: 'Missing username or password' });
    }
    const query = [where("username", "==", username), where("role", "==", 'employee'), limit(1)];
    const employees = await get("users", null, query);
    const employee = employees[0];
    if (!employee) {
      return res.status(400).json({ status: 'error', message: 'Employee not found' });
    }
    if (!employee.verified) {
      return res.status(400).json({ status: 'error', message: 'Employee not verified' });
    }
    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(400).json({ status: 'error', message: 'Incorrect password' });
    }
    employee.accessToken = generateToken({ ...employee, role: 'employee' });
    await addOrUpdate("users", employee, employee.id);
    res.status(200).json({ status: 'ok', message: 'Sign in successfully', data: employee });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: 'error', message: 'Sign in failed' });
  }
}

module.exports = { createNewAccessCode, validateAccessCode, setupEmployee, employeeSignIn };