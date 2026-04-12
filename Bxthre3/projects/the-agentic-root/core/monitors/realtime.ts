// Real-Time Monitors — Sentiment, Tone, Discord
// Feed events into Event Bus for immediate action

import { eventBus, EventTypes } from '../events/bus';

export interface MonitorConfig {
  enabled: boolean;
  sensitivity: 'low' | 'medium' | 'high';
  channels: string[];
  alertThreshold: number;
}

export interface MonitorReading {
  source: string;
  type: 'sentiment' | 'tone' | 'discord' | 'email' | 'calendar';
  value: number; // -100 to 100 for sentiment, 0-100 for others
  confidence: number;
  timestamp: string;
  raw: string;
  context: string;
}

export class RealTimeMonitors {
  private configs: Map<string, MonitorConfig> = new Map();
  private readings: MonitorReading[] = [];
  private readonly MAX_READINGS = 1000;

  constructor() {
    this.setupDefaultConfigs();
  }

  private setupDefaultConfigs(): void {
    // Discord monitoring (Irrig8, Bxthre3 channels)
    this.configs.set('discord', {
      enabled: true,
      sensitivity: 'medium',
      channels: ['irrig8-general', 'bxthre3-internal', 'investor-updates'],
      alertThreshold: 70
    });

    // Sentiment monitoring (for external comms)
    this.configs.set('sentiment', {
      enabled: true,
      sensitivity: 'high',
      channels: ['investor_emails', 'grant_communications', 'partner_outreach'],
      alertThreshold: -50 // Negative sentiment threshold
    });

    // Tone monitoring (for your voice/style consistency)
    this.configs.set('tone', {
      enabled: true,
      sensitivity: 'medium',
      channels: ['brodiblanco_communications'],
      alertThreshold: 80 // High confidence needed for tone shifts
    });
  }

  // Process incoming message/event
  async process(input: {
    source: string;
    content: string;
    channel: string;
    author?: string;
  }): Promise<MonitorReading[]> {
    const readings: MonitorReading[] = [];
    const timestamp = new Date().toISOString();

    // Sentiment analysis
    const sentimentConfig = this.configs.get('sentiment');
    if (sentimentConfig?.enabled && sentimentConfig.channels.includes(input.channel)) {
      const sentiment = await this.analyzeSentiment(input.content);
      const reading: MonitorReading = {
        source: input.source,
        type: 'sentiment',
        value: sentiment.score,
        confidence: sentiment.confidence,
        timestamp,
        raw: input.content.substring(0, 200),
        context: input.channel
      };
      readings.push(reading);
      this.storeReading(reading);

      // Alert on negative sentiment
      if (sentiment.score < sentimentConfig.alertThreshold) {
        eventBus.publish(EventTypes.ALERT_RAISED, {
          severity: sentiment.score < -75 ? 'critical' : 'high',
          source: 'sentiment_monitor',
          message: `Negative sentiment detected in ${input.channel}`,
          reading
        });
      }
    }

    // Tone analysis (if from you)
    const toneConfig = this.configs.get('tone');
    if (toneConfig?.enabled && input.author === 'brodiblanco') {
      const tone = await this.analyzeTone(input.content);
      const reading: MonitorReading = {
        source: input.source,
        type: 'tone',
        value: tone.consistencyScore,
        confidence: tone.confidence,
        timestamp,
        raw: input.content.substring(0, 100),
        context: 'voice_consistency'
      };
      readings.push(reading);
      this.storeReading(reading);

      // Alert on tone drift
      if (tone.consistencyScore < toneConfig.alertThreshold) {
        eventBus.publish(EventTypes.ALERT_RAISED, {
          severity: 'medium',
          source: 'tone_monitor',
          message: 'Tone consistency drift detected',
          reading
        });
      }
    }

    // Discord specific processing
    const discordConfig = this.configs.get('discord');
    if (discordConfig?.enabled && input.source === 'discord') {
      const discordSignals = await this.processDiscord(input.content, input.channel);
      
      for (const signal of discordSignals) {
        const reading: MonitorReading = {
          source: input.source,
          type: 'discord',
          value: signal.urgency,
          confidence: signal.confidence,
          timestamp,
          raw: input.content.substring(0, 150),
          context: input.channel
        };
        readings.push(reading);
        this.storeReading(reading);

        // High urgency Discord = immediate alert
        if (signal.urgency > discordConfig.alertThreshold) {
          eventBus.publish(EventTypes.SPRINT_TRIGGERED, {
            reason: 'discord_urgency',
            channel: input.channel,
            priority: 'immediate',
            reading
          });
        }
      }
    }

    return readings;
  }

  // Analyze sentiment of text
  private async analyzeSentiment(text: string): Promise<{ score: number; confidence: number }> {
    // Placeholder: In production, this uses NLP model
    // Score: -100 (very negative) to +100 (very positive)
    
    const negativeWords = ['concern', 'worried', 'problem', 'issue', 'delay', 'failed', 'reject'];
    const positiveWords = ['excited', 'great', 'excellent', 'approve', 'funded', 'success', 'milestone'];
    
    let score = 0;
    const words = text.toLowerCase().split(/\s+/);
    
    for (const word of words) {
      if (negativeWords.some(nw => word.includes(nw))) score -= 15;
      if (positiveWords.some(pw => word.includes(pw))) score += 15;
    }

    // Clamp to -100/+100
    score = Math.max(-100, Math.min(100, score));
    
    // Confidence based on text length and keyword density
    const confidence = Math.min(95, 50 + (words.length / 10));

    return { score, confidence };
  }

  // Analyze tone consistency (your voice/style)
  private async analyzeTone(text: string): Promise<{ consistencyScore: number; confidence: number }> {
    // Placeholder: Compare against your established voice profile
    // Your voice: direct, competent, strategic, no filler
    
    const fillerWords = ['actually', 'basically', 'honestly', 'literally', 'um', 'uh'];
    const strongWords = ['proceed', 'execute', 'deploy', 'assess', 'verify', 'implement'];
    
    const words = text.toLowerCase().split(/\s+/);
    const fillerCount = words.filter(w => fillerWords.includes(w)).length;
    const strongCount = words.filter(w => strongWords.some(sw => w.includes(sw))).length;
    
    // Higher score = more consistent with your voice
    let consistencyScore = 100;
    consistencyScore -= fillerCount * 10;
    consistencyScore += strongCount * 5;
    
    consistencyScore = Math.max(0, Math.min(100, consistencyScore));
    
    return { consistencyScore, confidence: 75 };
  }

  // Process Discord-specific signals
  private async processDiscord(content: string, channel: string): Promise<Array<{ urgency: number; confidence: number }>> {
    const signals: Array<{ urgency: number; confidence: number }> = [];
    
    // Urgency indicators
    const urgentPatterns = [
      /urgent|asap|immediately|emergency/i,
      /@everyone|@here/i,
      /\b(today|now|within 1 hour)\b/i,
      /critical|blocking|down|outage/i
    ];
    
    let urgency = 0;
    for (const pattern of urgentPatterns) {
      if (pattern.test(content)) urgency += 25;
    }
    
    // Specific channel urgency multipliers
    if (channel === 'investor-updates') urgency *= 1.2;
    if (channel === 'irrig8-general' && /grant|estcp/i.test(content)) urgency *= 1.5;

    if (urgency > 0) {
      signals.push({ urgency: Math.min(100, urgency), confidence: 80 });
    }

    return signals;
  }

  // Store reading with LRU
  private storeReading(reading: MonitorReading): void {
    this.readings.push(reading);
    if (this.readings.length > this.MAX_READINGS) {
      this.readings.shift(); // Remove oldest
    }
  }

  // Get recent readings
  getRecent(minutes: number = 60): MonitorReading[] {
    const cutoff = Date.now() - (minutes * 60 * 1000);
    return this.readings.filter(r => new Date(r.timestamp).getTime() > cutoff);
  }

  // Get alerts (high sentiment or urgency)
  getAlerts(): MonitorReading[] {
    return this.readings.filter(r => 
      (r.type === 'sentiment' && r.value < -50) ||
      (r.type === 'discord' && r.value > 70)
    );
  }

  // Configure a monitor
  configure(type: string, config: Partial<MonitorConfig>): void {
    const existing = this.configs.get(type);
    if (existing) {
      this.configs.set(type, { ...existing, ...config });
    }
  }
}

export const monitors = new RealTimeMonitors();
