import { KnowledgeItem } from "../types";

const list = [
  { title: "R.A.C.E", desc: "Role, Action, Context, Expectation." },
  { title: "CRISPE", desc: "Context, Role, Input, Style, Purpose, Expectation." },
  { title: "Chain-of-Thought", desc: "Forcing step-by-step logic." },
  { title: "Tree-of-Thought", desc: "Decision branching architecture." },
  { title: "Socratic Interview", desc: "Clarification through questions." },
  { title: "Few-Shot", desc: "Stylistic cloning via examples." },
  { title: "Reverse Prompting", desc: "DNA extraction from outputs." },
  { title: "D.F.C", desc: "Delimiter Format Control." },
  { title: "Simulation Pattern", desc: "Roleplay stress testing." },
  { title: "Negative Prompting", desc: "Constraint exclusion logic." }
];

export const FRAMEWORKS: KnowledgeItem[] = Array.from({ length: 50 }).map((_, i) => ({
  id: `fw_${i}`,
  title: list[i] ? list[i].title : `Framework Node ${i + 1}`,
  category: "Framework",
  description: list[i] ? list[i].desc : `Advanced structural scaffold for level ${i} complexity.`,
  content: `This framework is engineered to anchor AI behavior in ${i % 2 === 0 ? 'deductive' : 'inductive'} reasoning paths. It ensures fidelity to domain-specific registers.`,
  tags: ["logic", "engineering"]
}));