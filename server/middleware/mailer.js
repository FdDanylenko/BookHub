const nodemailer = require("nodemailer");

const sendEmail = async (email, code) => {
  if (!email || !code) console.log("Invalid request");

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "gannibalfdm@gmail.com",
      pass: "jqlxffigjypkqbca",
    },
  });

  const mailOptions = {
    from: "BookHub",
    to: email,
    subject: "Код користувача",
    text: `Вітаємо! Вас було зареєстровано як члена клубу BookHub! Ваш код для входу ${code}. Використовуйте його також в якості прізвища при авторизації допоки ви не заміните своє прізвище на актуальне. Приємних покупок!`,
  };

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
};

module.exports = {
  sendEmail,
};
