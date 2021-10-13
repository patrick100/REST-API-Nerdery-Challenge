import { SENDGRID_API_KEY, URL_BASE } from '../config';
import sgMail from '@sendgrid/mail';
import Email from '../interfaces/email.interface';

export const sendEmail = async (emailData: Email) => {
  sgMail.setApiKey(SENDGRID_API_KEY);

  const msg = {
    to: emailData.email,
    from: 'patricklazo@ravn.co',
    subject: emailData.subject,
    html: emailData.body,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(error);
  }
};

//const body = `Send this request via POST: ${URL_BASE}/verify-email/${1}/${'sdfsdfsd2314fd'}`;
//sendEmailToken('patrickdz96@gmail.com', 'Confirm Email', body);
