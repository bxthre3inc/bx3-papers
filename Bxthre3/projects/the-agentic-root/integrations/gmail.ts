// Gmail integration — Functional implementation
// Uses googleapis for direct API access

import { google, gmail_v1 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export interface EmailFilter {
  subject?: string;
  from?: string;
  after?: string;
  before?: string;
  label?: string;
  hasAttachment?: boolean;
  isUnread?: boolean;
}

export interface EmailResult {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  snippet: string;
  body?: string;
  labels: string[];
}

export class GmailIntegration {
  private gmail: gmail_v1.Gmail | null = null;
  private auth: OAuth2Client | null = null;
  private initialized = false;

  async initialize(): Promise<boolean> {
    if (this.initialized) return true;

    try {
      // Check for credentials in environment
      const clientId = process.env.GMAIL_CLIENT_ID;
      const clientSecret = process.env.GMAIL_CLIENT_SECRET;
      const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

      if (!clientId || !clientSecret || !refreshToken) {
        console.log('[Gmail] Missing credentials — using Zo tools fallback');
        return false;
      }

      this.auth = new OAuth2Client(clientId, clientSecret);
      this.auth.setCredentials({ refresh_token: refreshToken });

      // Refresh token if needed
      const accessToken = await this.auth.getAccessToken();
      if (!accessToken.token) {
        throw new Error('Failed to get access token');
      }

      this.gmail = google.gmail({ version: 'v1', auth: this.auth });
      this.initialized = true;
      console.log('[Gmail] Initialized successfully');
      return true;
    } catch (err) {
      console.error('[Gmail] Initialization failed:', err);
      return false;
    }
  }

  async findEmails(filter: EmailFilter, maxResults: number = 10): Promise<EmailResult[]> {
    if (!this.initialized) {
      await this.initialize();
    }

    if (!this.gmail) {
      console.log('[Gmail] Not initialized — returning empty');
      return [];
    }

    try {
      // Build query from filter
      const queryParts: string[] = [];
      if (filter.subject) queryParts.push(`subject:${filter.subject}`);
      if (filter.from) queryParts.push(`from:${filter.from}`);
      if (filter.after) queryParts.push(`after:${filter.after}`);
      if (filter.before) queryParts.push(`before:${filter.before}`);
      if (filter.label) queryParts.push(`label:${filter.label}`);
      if (filter.hasAttachment) queryParts.push('has:attachment');
      if (filter.isUnread) queryParts.push('is:unread');

      const query = queryParts.join(' ');

      const response = await this.gmail.users.messages.list({
        userId: 'me',
        q: query,
        maxResults
      });

      const messages = response.data.messages || [];
      const results: EmailResult[] = [];

      for (const msg of messages) {
        if (!msg.id) continue;
        
        const detail = await this.gmail.users.messages.get({
          userId: 'me',
          id: msg.id,
          format: 'metadata',
          metadataHeaders: ['Subject', 'From', 'To', 'Date']
        });

        const headers = detail.data.payload?.headers || [];
        const subject = headers.find(h => h.name === 'Subject')?.value || '(no subject)';
        const from = headers.find(h => h.name === 'From')?.value || '(unknown)';
        const to = headers.find(h => h.name === 'To')?.value || '';
        const date = headers.find(h => h.name === 'Date')?.value || '';

        results.push({
          id: msg.id,
          threadId: msg.threadId || msg.id,
          subject,
          from,
          to,
          date,
          snippet: detail.data.snippet || '',
          labels: detail.data.labelIds || []
        });
      }

      return results;
    } catch (err) {
      console.error('[Gmail] Search failed:', err);
      return [];
    }
  }

  async sendEmail(to: string, subject: string, body: string, fromName?: string): Promise<boolean> {
    if (!this.initialized) {
      await this.initialize();
    }

    if (!this.gmail) {
      console.log('[Gmail] Not initialized — cannot send');
      return false;
    }

    try {
      const from = fromName ? `${fromName} <${process.env.GMAIL_USER}>` : process.env.GMAIL_USER;
      const message = [
        `To: ${to}`,
        `From: ${from}`,
        `Subject: ${subject}`,
        '',
        body
      ].join('\n');

      const encoded = Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');

      await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: { raw: encoded }
      });

      console.log(`[Gmail] Sent email to ${to}: ${subject}`);
      return true;
    } catch (err) {
      console.error('[Gmail] Send failed:', err);
      return false;
    }
  }

  async watchForInvestorEmails(): Promise<EmailResult[]> {
    // Specific filter for investor-related emails
    return this.findEmails({
      subject: 'investor OR funding OR term sheet OR deck OR pitch',
      isUnread: true
    }, 20);
  }
}

export const gmailIntegration = new GmailIntegration();
