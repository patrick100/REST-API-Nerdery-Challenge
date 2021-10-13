import sgMail from '@sendgrid/mail';
import Email from '../interfaces/email.interface';
require('dotenv').config();

export const sendEmail = async (emailData: Email) => {
  //const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

  const apiKey = `${process.env.SENDGRID_API_KEY}`;
  console.log('SendGrid key ', apiKey);

  sgMail.setApiKey('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');

  const msg = {
    to: emailData.email,
    from: 'patricklazo@ravn.co',
    subject: emailData.subject,
    html: emailData.body,
  };

  try {
    sgMail.send(msg);
  } catch (error) {
    console.error(error);
  }
};
