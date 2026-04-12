import { GoogleAuth } from 'google-auth-library';
import { gmail_v1, google } from 'googleapis';

export class DirectGmailIntegration {
  private gmail: gmail_v1.Gmail | null = null;
  private clientEmail: string;
  private privateKey: string;

  constructor(clientEmail: string, privateKey: string) {
    this.clientEmail = clientEmail;
    this.privateKey = privateKey;
  }

  async connect(): Promise<void> {
    const auth = new GoogleAuth({
      credentials: {
        client_email: this.clientEmail,
        private_key: this.privateKey
      },
      scopes: ['https://www.googleapis.com/auth/gmail.readonly']
    });
    this.gmail = google.gmail({ version: 'v1', auth });
  }

  async findEmails(query: string, maxResults: number = 10): Promise<any[]> {
    if (!this.gmail) throw new Error('Not connected');
    
    const response = await this.gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults
    });
    
    return response.data.messages || [];
  }
}

export const directGmail = new DirectGmailIntegration(
  process.env.GMAIL_CLIENT_EMAIL || '',
  process.env.GMAIL_PRIVATE_KEY || ''
);
