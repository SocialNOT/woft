
import { CategoryType, RegistryItem } from './types';

export const COMPASS: RegistryItem[] = [
  { id: 'c1', name: 'T: Scientist (0.1)', description: 'Deterministic. Use for grading, coding, and budget facts.', category: CategoryType.COMPASS, group: 'Cognitive' },
  { id: 'c2', name: 'T: Professional (0.5)', description: 'Balanced. Use for standard emails and summaries.', category: CategoryType.COMPASS, group: 'Cognitive' },
  { id: 'c3', name: 'T: Artist (0.8)', description: 'Creative. Use for slogans, hooks, and brainstorming.', category: CategoryType.COMPASS, group: 'Cognitive' },
  { id: 'c4', name: 'Top-P (Nucleus)', description: 'Limits vocabulary to the top probability percentage.', category: CategoryType.COMPASS, group: 'Cognitive' },
  { id: 'c5', name: 'Frequency Penalty', description: 'Bans words like "delve", "tapestry", "unleash".', category: CategoryType.COMPASS, group: 'Linguistic' },
  { id: 'c6', name: 'Presence Penalty', description: 'Forces topic switching in long conversations.', category: CategoryType.COMPASS, group: 'Linguistic' },
  { id: 'c7', name: 'Logit Bias (-100)', description: 'Hard-banning tokens to eliminate robotic cliches.', category: CategoryType.COMPASS, group: 'Control' },
  { id: 'c8', name: 'Seed 12345', description: 'Reproducibility setting for research consistency.', category: CategoryType.COMPASS, group: 'Architecture' },
  { id: 'c9', name: 'Memory Refresh', description: 'Recursive summarization to save context window.', category: CategoryType.COMPASS, group: 'Memory' },
  { id: 'c10', name: 'Logic Density', description: 'Level of thinking tokens allocated per turn.', category: CategoryType.COMPASS, group: 'Reasoning' }
].concat(Array.from({ length: 40 }, (_, i) => ({
  id: `c${i + 11}`,
  name: `Technical Dial ${i + 11}`,
  description: `Precision control for LLM parameter set #${i + 11}.`,
  category: CategoryType.COMPASS,
  group: 'Technical'
})));
