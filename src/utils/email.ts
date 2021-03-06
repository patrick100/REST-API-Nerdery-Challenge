import sgMail from '@sendgrid/mail';
import Email from '../interfaces/email.interface';
import { SENDGRID_API_KEY, SENDER_EMAIL } from '../config';

export const sendEmail = async (emailData: Email) => {
  sgMail.setApiKey(SENDGRID_API_KEY);

  const msg = {
    to: emailData.email,
    from: SENDER_EMAIL,
    subject: emailData.subject,
    html: emailData.body,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    //console.error(error);
    throw error;
  }
};
