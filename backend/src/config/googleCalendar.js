import { google } from 'googleapis';

let calendar = null;

if (process.env.GOOGLE_CALENDAR_JSON) {
  const credentials = JSON.parse(
    Buffer.from(process.env.GOOGLE_CALENDAR_JSON, 'base64').toString('utf-8')
  );

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });

  calendar = google.calendar({ version: 'v3', auth });
  console.log('Google Calendar connected');
} else {
  console.warn('Google Calendar credentials not found — calendar sync disabled');
}

export { calendar };
