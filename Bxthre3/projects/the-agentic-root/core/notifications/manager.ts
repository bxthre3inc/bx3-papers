export interface Notification {
  id: string;
  priority: 'urgent' | 'important' | ' FYI';
  title: string;
  message: string;
  context: string;
  action?: string;
  deadline?: string;
  estimatedTime: string;
}

export class NotificationManager {
  private queue: Notification[] = [];

  notify(priority: Notification['priority'], title: string, message: string, context: string): void {
    const note: Notification = {
      id: `note-${Date.now()}`,
      priority,
      title,
      message,
      context,
      estimatedTime: this.estimateReadingTime(message)
    };
    this.queue.push(note);
    this.deliver(note);
  }

  private estimateReadingTime(text: string): string {
    const words = text.split(' ').length;
    const seconds = Math.ceil(words / 3);
    return seconds < 60 ? `${seconds}s read` : `${Math.ceil(seconds/60)}m read`;
  }

  private deliver(note: Notification): void {
    const emoji = { urgent: '🚨', important: '⚠️', ' FYI': 'ℹ️' }[note.priority];
    console.log(`${emoji} [${note.priority.toUpperCase()}] ${note.title}`);
    console.log(`   ${note.message}`);
    console.log(`   Context: ${note.context} (${note.estimatedTime})`);
  }

  getUrgent(): Notification[] {
    return this.queue.filter(n => n.priority === 'urgent');
  }
}

export const notifications = new NotificationManager();
