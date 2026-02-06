import { KnowledgeItem } from "../types";

export const PHASES: KnowledgeItem[] = [
  { id: 'bp_1', title: 'Phase 1: Spark', category: 'Phase', description: 'Cognitive activation and orientation to AI reasoning.', content: 'Goal: Establish intellectual trust. Focus on LLM as a predictive mirror and bridge academic excellence with prompt potential.', tags: ['orientation', 'basics'] },
  { id: 'bp_2', title: 'Phase 2: Swiss Knife', category: 'Phase', description: 'Control systems mastery of 10 linguistic frameworks.', content: 'Frameworks: RACE, CRISPE, CoT, ToT, DFC, Negative Prompting, Simulation, etc. Transform into a prompt engineer.', tags: ['logic', 'control'] },
  { id: 'bp_3', title: 'Phase 3: Alchemist', category: 'Phase', description: 'Converting skill into time-saving automation systems.', content: 'Modules: Academic Engine, Professional Pipeline, Literature Summarization. Focus on scaling knowledge work.', tags: ['automation', 'productivity'] },
  { id: 'bp_4', title: 'Phase 4: Mastery', category: 'Phase', description: 'Ethical deployment and official certification.', content: 'Final lab and defense. Certification as an Ethical AI Architect.', tags: ['certification', 'ethics'] }
];

export const FRAMEWORKS: KnowledgeItem[] = Array.from({ length: 50 }).map((_, i) => ({
  id: `fw_${i}`,
  title: ["R.A.C.E", "CRISPE", "CoT", "ToT", "Socratic", "Few-Shot", "Reverse", "D.F.C", "Negative", "Simulation"][i] || `Framework Module ${i + 1}`,
  category: "Framework",
  description: `High-fidelity logical scaffold for architectural engineering level ${i + 1}.`,
  content: `Technical Payload: This framework enforces structural integrity on token prediction by anchoring the model in ${i % 2 === 0 ? 'deductive' : 'inductive'} reasoning paths.`,
  tags: ["logic", "structure"]
}));

export const PERSONAS: KnowledgeItem[] = Array.from({ length: 50 }).map((_, i) => ({
  id: `per_${i}`,
  title: ["Grand Architect", "Ethics Auditor", "Scholar", "DevOps Strategist", "Narrative Lead"][i] || `Persona Vector ${i + 1}`,
  category: "Persona",
  description: `Specialized identity mapping for professional domains.`,
  content: `Identity Core: Agent maintaining strict fidelity to technical registers and domain-specific terminology. Focus: precision and semantic grounding.`,
  tags: ["identity", "voice"]
}));

export const COMPASS: KnowledgeItem[] = Array.from({ length: 30 }).map((_, i) => ({
  id: `cmp_${i}`,
  title: i === 0 ? "Temp: 0.1" : i === 1 ? "Top-P: 0.9" : `Tech Anchor ${i + 1}`,
  category: "Architecture",
  description: `Hardware-level tuning parameter for neural output stability.`,
  content: `Configuration: Node ${i}. Prevents semantic drift and controls the stochastic randomness of the transformer's latent space.`,
  tags: ["config", "optimization"]
}));

export const LINGUISTIC: KnowledgeItem[] = Array.from({ length: 120 }).map((_, i) => ({
  id: `ling_${i}`,
  title: i === 0 ? "Operational Verbs" : i === 1 ? "Meaning Anchoring" : `Control Vector ${i + 1}`,
  category: "Linguistic",
  description: `Syntactic mechanism for reducing lexical ambiguity in prompts.`,
  content: `Command Set: ${i}. Enforces high-fidelity output by replacing vague directives with operational verbs that trigger deeper reasoning.`,
  tags: ["precision", "lexicon"]
}));

export const FULL_KNOWLEDGE_BASE = [
  ...PHASES,
  ...FRAMEWORKS,
  ...PERSONAS,
  ...COMPASS,
  ...LINGUISTIC
];