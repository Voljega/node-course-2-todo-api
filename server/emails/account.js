const sgMail = require('@sendgrid/mail');
const sendgridAPIKey = process.env.SENDGRID_API_KEY;

// function logKey() {
// console.log('sendgridAPIKey ' + sendgridAPIKey);
// };
// logKey();

sgMail.setApiKey(sendgridAPIKey);

// sgMail.send({
//   to: 't.viutti@gmail.com', from: 't.viutti@gmail.com',
//   subject: 'First one',
//   text: 'zeajhljklzdasfqhklzjklda'
// });

const sendWelcomeEmail = (email) => {
  sgMail.send({
    to: email,
    from: 't.viutti@gmail.com',
    subject: "Thanks for joining in!",
    text: `Welcome to the app, ${email}. Let me know how we can help you.`,
  });
};

const sendGoodbyeEmail = (email) => {
  sgMail.send({
    to: email,
    from: 't.viutti@gmail.com',
    subject: "Goodbye !",
    text: `Goodbye ${email}, worry we didn't match !`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendGoodbyeEmail
}
