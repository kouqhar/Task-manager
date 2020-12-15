const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_APP_EMAIL, // Your email address
    pass: process.env.MAIL_APP_PASSWORD, // Your password (or special app password)
  },
});

async function sendWelcomeEmail(user) {
  const { email, name } = user;
  try {
    return await transporter.sendMail({
      from: "Task Manager API <m****@gmail.com>",
      to: email,
      subject: "Thanks for joining!",
      text: `Welcome to our service, ${name}!`,
      html: `<b>Welcome to our service, ${name}!</b>`,
    });
  } catch (error) {
    return error;
  }
}

async function sendCancellationEmail(user) {
  const { email, name } = user;
  try {
    return await transporter.sendMail({
      from: "Task Manager API <m****@gmail.com>",
      to: email,
      subject: "We're sorry to see you leave",
      text: `We hope to see you back again someday, ${name}!`,
      html: `<b>We hope to see you back again someday, ${name}!</b>`,
    });
  } catch (error) {
    return error;
  }
}

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail,
};
