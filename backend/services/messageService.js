
const generateSms = () => {
  const code = Math.floor(100000 + Math.random() * 900000);
  return `Your verification code is ${code}`;
}

module.exports = { generateSms };
