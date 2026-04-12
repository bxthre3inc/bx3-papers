import { GoogleAuth } from 'google-auth-library';
import { calendar_v3, google } from 'googleapis';

export class DirectCalendarIntegration {
  private calendar: calendar_v3.Calendar | null = null;

  constructor(clientEmail: string, privateKey: string) {
    const auth = new GoogleAuth({
      credentials: { client_email: clientEmail, private_key: privateKey },
      scopes: ['https://www.googleapis.com/auth/calendar.readonly']
    });
    this.calendar = google.calendar({ version: 'v3', auth });
  }

  async getEvents(timeMin: string, timeMax: string): Promise<any[]> {
    if (!this.calendar) throw new Error('Not connected');
    
    const response = await this.calendar.events.list({
      calendarId: 'primary',
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: 'startTime'
    });
    
    return response.data.items || [];
  }
}

export const directCalendar = new DirectCalendarIntegration(
  process.env.GMAIL_CLIENT_EMAIL || '',
  process.env.GMAIL_PRIVATE_KEY || ''
);
