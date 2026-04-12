// Gmail Sync Layer
// Agentic Inbox owns truth. Gmail = optional reflection only.

export class GmailSync {
  async pull(): Promise<void> {
    // Fetch from Gmail, add to Agentic inbox
    // If Gmail down: no-op, Agentic continues
  }

  async push(): Promise<void> {
    // Send queued replies via Gmail
    // If Gmail down: queue remains, retry later
  }
}
