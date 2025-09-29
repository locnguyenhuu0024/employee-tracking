const textflow = require("textflow.js");
const dotenv = require("dotenv");
dotenv.config();

const smsApp = textflow.useKey(process.env.TEXTFLOW_APIKEY);

module.exports = smsApp;
