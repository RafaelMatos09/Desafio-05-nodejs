const nodemailer = require("nodemailer");

const enviarEmail = async (clienteEmail, pedido) => {
  // Configure o transporte de email
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Conteúdo do email
  const emailOptions = {
    from: process.env.EMAIL_FROM,
    to: clienteEmail,
    subject: "Confirmação de Pedido",
    text: `Obrigado por fazer o pedido. Detalhes do pedido: ${JSON.stringify(
      pedido
    )}`,
  };

  // Envie o email
  await transporter.sendMail(emailOptions);
};

module.exports = enviarEmail;
