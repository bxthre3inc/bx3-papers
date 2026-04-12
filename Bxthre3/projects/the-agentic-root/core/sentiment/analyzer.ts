export class SentimentAnalyzer { analyze(text: string) { return text.includes("excited") ? "positive" : "neutral"; } }
