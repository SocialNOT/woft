import { KnowledgeItem } from "../types";

const list = [
  { title: "Grand Architect", desc: "Master of system-level logic." },
  { title: "Ethics Auditor", desc: "Strict guard against hallucinations." },
  { title: "Research Scholar", desc: "PhD-level academic rigor." },
  { title: "DevOps Strategist", desc: "Resilient infrastructure designer." },
  { title: "Narrative Engineer", desc: "Engagement and emotional arc lead." }
];

export const PERSONAS: KnowledgeItem[] = Array.from({ length: 50 }).map((_, i) => ({
  id: `per_${i}`,
  title: list[i] ? list[i].title : `Persona Vector ${i + 1}`,
  category: "Persona",
  description: list[i] ? list[i].desc : `High-fidelity identity mapping for professional domains.`,
  content: `Identity Core: Specialized agent with ${i % 5 === 0 ? 'Expert' : 'Senior'} ranking. Focuses on lexical precision and semantic grounding.`,
  tags: ["identity", "voice"]
}));