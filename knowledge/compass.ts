import { KnowledgeItem } from "../types";

export const COMPASS: KnowledgeItem[] = Array.from({ length: 30 }).map((_, i) => ({
  id: `cmp_${i}`,
  title: i === 0 ? "Temp: 0.1" : i === 1 ? "Top-P: 0.9" : `Parameter Node ${i + 1}`,
  category: "Architecture",
  description: `Hardware-level tuning anchor for neural stability.`,
  content: `Setting ${i}: Controls the stochastic density of the output layer. Essential for balancing predictability and novelty.`,
  tags: ["config", "optimization"]
}));