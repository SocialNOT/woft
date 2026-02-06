import { PHASES } from './phases';
import { FRAMEWORKS } from './frameworks';
import { PERSONAS } from './personas';
import { COMPASS } from './compass';
import { LINGUISTIC } from './linguistic';
import { KnowledgeItem } from '../types';

export const MASTER_KNOWLEDGE: Record<string, KnowledgeItem[]> = {
  "Roadmap": PHASES,
  "Frameworks": FRAMEWORKS,
  "Personas": PERSONAS,
  "Linguistic Kit": LINGUISTIC,
  "Tech Compass": COMPASS,
  "Tactical Directory": [
    { id: 'tac_1', title: 'Multi-Pass Refinement', category: 'Tactic', description: 'Iterative quality loop.', content: 'Draft -> Critique -> Improve -> Finalize.', tags: ['refinement'] },
    { id: 'tac_2', title: 'Guardrail Stacking', category: 'Tactic', description: 'Preventing drift.', content: 'Layering "No" constraints to block failure modes.', tags: ['security'] }
  ]
};

export const ALL_KNOWLEDGE_FLAT = Object.values(MASTER_KNOWLEDGE).flat();