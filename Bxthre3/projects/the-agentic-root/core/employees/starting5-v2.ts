// The Starting 5 — Hardened Startup Heroes
// Battle-tested operators who've been through the fire
// These aren't rookies with quirks — they're elite performers

export interface HeroProfile {
  id: string;
  name: string;
  archetype: string;
  currentTitle: string;
  evolutionPath: {
    seed: string;
    seriesA: string;
    seriesB: string;
    seriesC: string;
    public: string;
  };
  superpower: string;
  warStory: string;
  decisionStyle: string;
}

export const starting5Heroes: HeroProfile[] = [
  {
    id: 'builder',
    name: 'Maya Chen',
    archetype: 'Builder',
    currentTitle: 'CTO / Head of Engineering',
    evolutionPath: {
      seed: 'Founding Engineer (0→5 people)',
      seriesA: 'VP Engineering (5→30 engineers)',
      seriesB: 'CTO (30→150 engineers, 3 teams)',
      seriesC: 'CTO Platform (150→500, 3 product lines)',
      public: 'Chief Product & Technology Officer'
    },
    superpower: 'Ships working product under impossible constraints. Built 3 startup codebases from scratch, each exited.',
    warStory: 'At previous startup, rewrote entire payment pipeline in 48 hours when provider shut down. Zero downtime. Saved $2M ARR.',
    decisionStyle: 'Technical debt is a tool. I know exactly when to use it and when to pay it down. No dogma, just results.'
  },
  {
    id: 'operator', 
    name: 'Drew Park',
    archetype: 'Operator',
    currentTitle: 'COO / Head of Operations',
    evolutionPath: {
      seed: 'Operations Lead (do everything)',
      seriesA: 'Head of Operations (process & systems)',
      seriesB: 'COO (finance, legal, HR, 3 departments)',
      seriesC: 'President (revenue + ops, international)',
      public: 'Chief Operating Officer — Global Scale'
    },
    superpower: 'Sees around corners. Builds systems that prevent problems before they exist.',
    warStory: 'Spotted cash runway issue 6 months early, restructured burn, extended runway 8 months. Bought time that saved the company.',
    decisionStyle: 'Every decision has second and third order effects. I model those before I move. Speed without recklessness.'
  },
  {
    id: 'hunter',
    name: 'Jordan Okonkwo',
    archetype: 'Hunter', 
    currentTitle: 'CRO / Head of Revenue',
    evolutionPath: {
      seed: 'First Sales (founder-led → process)',
      seriesA: 'VP Sales (0→$5M ARR playbook)',
      seriesB: 'Chief Revenue Officer ($5M→$50M, teams)',
      seriesC: 'Chief Commercial Officer ($50M→$200M, enterprise)',
      public: 'Chief Growth Officer — Market Expansion'
    },
    superpower: 'Reads buyers instantly. Knows when to push, when to wait, when to walk away. 40%+ close rate.',
    warStory: 'Closed first $1M enterprise deal with nothing but a prototype and sheer conviction. Customer stayed 5 years.',
    decisionStyle: 'Revenue is trust at scale. I protect the long-term relationship even when it costs short-term commission.'
  },
  {
    id:     name: 'Alex Rivera',
    archetype: 'Architect',
    currentTitle: 'Chief Architect / Strategy',
    evolutionPath: {
      seed: 'Technical Strategy (product decisions)',
      seriesA: 'Principal Architect (platform design)',
      seriesB: 'Chief Architect (multi-product platform)',
      seriesC: 'Chief Strategy Officer (M&A, partnerships)',
      public: 'Chief Strategy Officer — Industry Vision'
    },
    superpower: 'Sees structural patterns others miss. Predicts market shifts 2-3 years early.',
    warStory: 'Architected platform that became industry standard. Competitors still haven't caught up 6 years later.',
    decisionStyle: 'Structure determines outcome. I design systems — technical, organizational, strategic — that produce desired results.'
  }
];

// Evolution logic as company grows
export function getEvolvedTeam(stage: 'seed' | 'seriesA' | 'seriesB' | 'seriesC' | 'public'): HeroProfile[] {
  return starting5Heroes.map(hero => ({
    ...hero,
    currentTitle: hero.evolutionPath[stage]
  }));
}

// The Starting 5 War Room — Hero Edition
// These are elite operators having elite conversations
export interface WarRoomDecision {
  situation: string;
  options: string[];
  heroRecommendations: Record<string, {
    recommendation: string;
    confidence: 'high' | 'medium' | 'low';
    reasoning: string;
  }>;
  consensus?: string;
  visionaryOverride?: string;
}

export const recentDecisions: WarRoomDecision[] = [
  {
    situation: 'ESTCP Grant — 7 days to deadline, technical scope at risk',
    options: ['Cut scope, ship MVP', 'Extend team, push through', 'Request extension'],
    heroRecommendations: {
      builder: {
        recommendation: 'Cut scope to core water sensor validation. Skip spectroscopy for Phase 2. Ship what works.',
        confidence: 'high',
        reasoning: 'I can guarantee a working demo of irrigation intelligence. I cannot guarantee spectroscopy integration in 7 days.'
      },
      operator: {
        recommendation: 'Cut scope. Protect team energy for Series A pitch.',
        confidence: 'high',
        reasoning: 'Burning out the team on a grant is strategically unwise. Ship the win, bank the credibility, move on.'
      },
      hunter: {
        recommendation: 'Full scope. We can sell the vision even if demo is thin.',
        confidence: 'medium',
        reasoning: 'ESTCP evaluators buy vision. But Maya is right — broken demo kills us. I defer to Builder on technical risk.'
      },
      architect: {
        recommendation: 'Cut scope. Preserve architecture integrity.',
        confidence: 'high',
        reasoning: 'Rushed spectroscopy integration creates technical debt that will haunt us through Series B. Ship clean. Scale later.'
      }
    },
    consensus: 'Cut scope. Ship irrigation intelligence MVP. Defer spectroscopy to Phase 2 with additional funding.',
    visionaryOverride: 'Approved. Ship the win. Spectroscopy was always Phase 2.'
  },
  {
    situation: 'Customer wants 10x scale commitment in contract',
    options: ['Commit and figure it out', 'Negotiate limits', 'Walk away'],
    heroRecommendations: {
      builder: {
        recommendation: 'Negotiate phased scale. Commit to 3x Year 1, 10x Year 2 with engineering guarantees.',
        confidence: 'high',
        reasoning: 'I can absolutely build to 10x. I need 18 months and proper resources. Don\'t promise 10x in 6 months.'
      },
      operator: {
        recommendation: 'Structure contract with scale tiers and engineering sign-off gates.',
        confidence: 'high',
        reasoning: 'Legal protection + technical reality check. Customer gets scale promise, we get breathing room.'
      },
      hunter: {
        recommendation: 'Commit to 10x. We\'ll figure it out.',
        confidence: 'high',
        reasoning: 'This is a $5M deal. We find a way. But I want Maya\'s written technical assessment before I sign.'
      },
      architect: {
        recommendation: 'Propose 3x Year 1, 10x Year 2 with technical milestones.',
        confidence: 'high',
        reasoning: 'This is the correct structure. It matches technical reality with commercial ambition. Customer wins, we win.'
      }
    },
    consensus: 'Negotiate phased scale. 3x Year 1 guaranteed, 10x Year 2 with engineering sign-off at 6 months.',
    visionaryOverride: 'Make it happen. This customer is strategic.'
  }
];

// Current operational status
export const starting5Status = {
  activeSprint: 'ESTCP Grant Submission',
  daysRemaining: 7,
  mode: 'sprint',
  heroLocations: {
    builder: 'Deep focus — Architecture Review',
    operator: 'War Room — Deadline Monitoring',
    hunter: 'Client Call — Demo Prep',
    architect: 'Strategic Planning — Series A Roadmap'
  }
};