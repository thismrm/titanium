// install express with `npm install express`
require("dotenv").config();
const express = require("express");
var cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

app.use(
  cors({
    origin: "*",
  })
);

// implement verify route on your app server
app.get("/verify/:token", (req, res) => {
  const token = req.params.token;
  const decoded = jwt.verify(token, "jwt super secret key");
  res.send(decoded);
});

app.get("/login/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const token = jwt.sign({ email }, "jwt super secret key");

    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    let info = await transporter.sendMail({
      from: `"Titanium link" <${process.env.EMAIL}>`,
      to: email,
      subject: "Login link",
      text: "Login Link",
      html: `<a href="https://titanium-auth.onrender.com/verify/${token}" target="_blank">Click me to login</a>`,
    });

    res.json({
      status: "success",
      message: "check your email for auto login link",
    });
  } catch (error) {
    res.status(501).json({ status: "error", message: error });
  }
});

// export 'app'
module.exports = app;
