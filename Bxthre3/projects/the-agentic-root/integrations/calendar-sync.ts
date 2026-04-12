// Calendar Sync Layer
// Agentic owns scheduling truth. Google Calendar = view only.

export class CalendarSync {
  async pull(): Promise<void> {
    // Import external meetings → Agentic deadlines
    // If Calendar down: Agentic schedule continues
  }

  async push(): Promise<void> {
    // Publish Agentic deadlines → external calendar
    // If Calendar down: internal schedule valid
  }
}
