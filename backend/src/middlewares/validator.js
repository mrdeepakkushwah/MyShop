const isValid = (value) => typeof value === "string" && value.trim() !== "";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPassword = (password) => {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);
};

module.exports = { isValid, isValidEmail, isValidPassword };
