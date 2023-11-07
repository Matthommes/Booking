import nodemailer from "nodemailer";

const sendMail = async (to, html, subject) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD, 
    },
  });

  const mailOptions = {
    from: "alexislordqtest@gmail.com",
    to,
    subject,
    html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("error", error);
    } else {
      console.log("Mail Sent");
    }
  });
};


export  { sendMail };
