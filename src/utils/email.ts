import { SENDGRID_API_KEY } from '../config';
import sgMail from '@sendgrid/mail';
import Email from '../interfaces/email.interface';

export const sendEmail = async (emailData: Email): Promise<void> => {
  sgMail.setApiKey(SENDGRID_API_KEY);

  const msg = {
    to: emailData.email,
    from: 'patricklazo@ravn.co',
    subject: emailData.subject,
    html: emailData.body,
  };

  sgMail.send(msg);
};
