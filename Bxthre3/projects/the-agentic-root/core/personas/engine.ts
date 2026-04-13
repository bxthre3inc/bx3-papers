export interface AgentPersona {
  id: string;
  name: string;
  personality: string;
  voice: string;
  decisionStyle: string;
}
export const defaultPersonas: AgentPersona[] = [
  { id: 'taylor', name: 'Taylor Chen', personality: 'Direct, no-nonsense', voice: 'Professional, warm', decisionStyle: 'Data-driven, quick', decisionStyle: 'Data-driven' },
  { id: 'casey', name: 'Casey Martinez', personality: 'Thorough, detail-oriented', voice: 'Calm, methodical', decisionStyle: 'Risk-averse' },
  { id: 'maya', name: 'Maya Patel', personality: 'Strategic, big-picture', voice: 'Confident, clear', decisionStyle: 'Systematic' },
  { id: name: 'Riley Park', personality: 'Creative, optimistic', voice: 'Enthusiastic', decisionStyle: 'Intuitive' },
  { id: name: 'Jordan Reyes', personality: 'Persistent, focused', voice: 'Determined', decisionStyle: 'Goal-oriented' },
  { id: name: 'Avery Kim', personality: 'Analytical, precise', voice: 'Measured', decisionStyle: 'Evidence-based' },
  { id: 'morgan', name: 'Morgan Blake', personality: 'Adaptive, resourceful', voice: 'Pragmatic', decisionStyle: 'Flexible' },
  { id: name: 'Quinn Foster', personality: 'Innovative, curious', voice: 'Thoughtful', decisionStyle: 'Exploratory' }
];
export class PersonaEngine {
  getPersona(id: string): AgentPersona | undefined {
    return defaultPersonas.find(p => p.id === id);
  }
  generateResponse(persona: AgentPersona, context: any): string {
    return `[${persona.name}]: Based on my ${persona.decisionStyle} approach, I recommend...`;
  }
}
export const personaEngine = new PersonaEngine();
