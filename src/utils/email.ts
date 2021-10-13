import { SENDGRID_API_KEY, URL_BASE } from '../config';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(SENDGRID_API_KEY);

async function sendEmailToken(email: string, subject: string, body: string) {
  const msg = {
    to: email,
    from: 'patricklazo@ravn.co',
    subject: subject,
    html: body,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(error);
  }
}

//const body = `Send this request via POST: ${URL_BASE}/verify-email/${1}/${'sdfsdfsd2314fd'}`;
//sendEmailToken('patrickdz96@gmail.com', 'Confirm Email', body);
export default sendEmailToken;
