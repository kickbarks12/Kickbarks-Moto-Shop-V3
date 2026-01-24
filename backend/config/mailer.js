const nodemailer = require("nodemailer");

/**
 * Mail transporter
 * Safe to keep even if unused
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

module.exports = transporter;
