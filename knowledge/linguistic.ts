import { KnowledgeItem } from "../types";

export const LINGUISTIC: KnowledgeItem[] = Array.from({ length: 120 }).map((_, i) => ({
  id: `ling_${i}`,
  title: i === 0 ? "Operational Verbs" : i === 1 ? "Meaning Anchoring" : `Syntactic Control ${i + 1}`,
  category: "Linguistic",
  description: `Control mechanism for reducing lexical ambiguity.`,
  content: `Command Set ${i}: Triggers deeper reasoning by replacing vague verbs with operational directives.`,
  tags: ["precision", "lexicon"]
}));