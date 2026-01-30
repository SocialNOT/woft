
export interface HackGroup {
  group: string;
  items: string[];
}

export const HACKS_REGISTRY: HackGroup[] = [
  {
    group: 'Formatting & Structure (30)',
    items: [
      'Table-View Request', 'JSON-only Mode', 'Markdown Hierarchy', 'Bullet Ceiling', 'CSV Conversion', 
      'Nested Lists', 'Code-Block Wrapping', 'Bold Keywords', 'Mermaid Logic', 'White-Space Control',
      'Numbered Sequencing', 'Emoji Anchors', 'Side-by-Side Table', 'LaTeX Math', 'Fixed Char Limit',
      'Task Table', 'Callout Boxes', 'TOC Generation', 'Standard Headers', 'Key Takeaway Box',
      'Column Width Control', 'Alphabetical Sort', 'Gap Highlight [MISSING]', 'Multi-Tab Layout', 'Data Legend',
      'Sentence Case Headers', 'Link Formatting', 'Footnote Notation', 'TL;DR Summary', 'Checklist Conversion'
    ]
  },
  {
    group: 'Logic & Reasoning (30)',
    items: [
      'Step-by-Step Trigger', 'Show Your Work', 'Least-to-Most Logic', 'Self-Correction Loop', 'Socratic Scaffolding',
      'Analogical Logic', 'First-Principles', 'Counter-Argument', 'Fact-Anchor', 'Pre-Mortem Protocol',
      'Divergent-to-Convergent', 'Probabilistic Rating', 'Assumptions Audit', 'Variable Isolation', 'Recursive Synthesis',
      'Explicit C.O.T.', 'Root Cause (5 Whys)', 'SWOT Analysis', 'Scenario Branching', 'Logic Gate Check',
      'Expert Consensus', 'Bottom-Up Logic', 'Top-Down Vision', 'Interdisciplinary Bridge', 'Inversion Principle',
      'Decision Matrix', 'Time-Horizon Impact', 'Red Team Critique', 'Bayesian Update', 'Final Logic Seal'
    ]
  },
  {
    group: 'Clarity & Communication (30)',
    items: [
      'Negative Constraints', 'Target Audience Sync', 'Active Voice Only', 'Grade-Level Lock', 'No-Jargon Shield',
      'Acronym Expander', 'Sentence Length < 15', 'Directness (No Fluff)', 'Clarity Priority', 'Metaphor Anchor',
      'Ambiguity Check', 'Action-Verb Starts', 'Tone Sync', 'Verifiable Citations', 'The Mom Test',
      'Concise Summary', 'Pronoun Clarity', 'Visual Language', 'One-Idea Bullets', 'Standard Vocab Only',
      'Filler Removal', 'Highlight The Why', 'Context Reminders', 'Plain English', 'Simple Clauses',
      'Skim Formatting', 'Objective Tone', 'Instructional Precision', 'Answer-First', 'Refinement Request'
    ]
  },
  {
    group: 'Efficiency & Speed (30)',
    items: [
      'Prompt Chaining', 'Delimiter Stacking', 'Context Injection', 'Recursive Prompting', 'System Priming',
      'Template Filling', 'Variable Assignment', 'Batch Processing', 'Output Pre-Filling', 'Token Saving',
      'Ref Tagging', 'Multi-Persona Discussion', 'Instruction Anchor', 'Separator Rule', 'Few-Shot Seeding',
      'Code Wrapping', 'Freq Penalty Manual', 'Role Filtering', 'Summary-for-Focus', 'Constraint Stacking',
      'Dynamic Formatting', 'Versioning (V2)', 'Keyword First', 'Reverse Engineering', 'Temp Sliding',
      'Wait Command', 'Hierarchy Priority', 'Pattern Matching', 'Code-Switching Logic', 'Final Gate Review'
    ]
  }
];
