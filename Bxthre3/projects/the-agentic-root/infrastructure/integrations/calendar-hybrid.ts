import { directCalendar } from './direct-calendar.js';

export class CalendarHybridIntegration {
  private useDirect = true;

  async getEvents(timeMin: string, timeMax: string): Promise<any[]> {
    try {
      if (this.useDirect) {
        return await directCalendar.getEvents(timeMin, timeMax);
      }
    } catch (err) {
      console.log(`[CALENDAR] Direct failed: ${err}`);
      return [];
    }
    return [];
  }
}

export const hybridCalendar = new CalendarHybridIntegration();
