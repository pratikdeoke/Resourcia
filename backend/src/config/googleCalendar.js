import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

const CREDENTIALS_PATH = path.resolve(
  'credentials/google-service-account.json'
);

let calendar = null;

if (fs.existsSync(CREDENTIALS_PATH)) {
  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });

  calendar = google.calendar({
    version: 'v3',
    auth,
  });

  console.log('Google Calendar connected');
} else {
  console.warn(
    'Google Calendar credentials not found — calendar sync disabled'
  );
}

export { calendar };