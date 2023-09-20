const nodemailer = require('nodemailer');
const { google } = require('googleapis');

// These id's and secrets should come from .env file.
const CLIENT_ID = '419345942277-oqdje9qr0stje8aqoafiq39ecdhohnt4.apps.googleusercontent.com';
const CLEINT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = 'ya29.a0AfB_byDo6GFmOXFO2hJPnmnOGOavXGTpuUseiWufe682_AP87fAsh76rxEjdb5XOHnWPP_26rrnmEZeSPoNCE7tdyZoxBAJ_bL7C0UiES69JyUnHI_dBc4XCSnYIwcj1c-yqwEkfv_Gge7FHAFwYpjY58kM85tLOOZQqaCgYKAVgSARMSFQGOcNnCyPoUcTmp2-2UN8uDr7ZSBQ0171';

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLEINT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail() {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'rakheebahmad1905@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLEINT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: 'Rakheeb <rakheebahmad1905@gmail.com>',
      to: 'rakheeb1905@gmail.com',
      subject: 'Hello from gmail using API',
      text: 'Hello from gmail email using API',
      html: '<h1>Hello from gmail email using API</h1>',
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
}

sendMail()
  .then((result) => console.log('Email sent...', result))
  .catch((error) => console.log(error.message));