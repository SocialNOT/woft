import { GoogleGenAI, Type, Modality, LiveServerMessage } from "@google/genai";
import { KnowledgeItem } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// Comprehensive Neural Database
const GENERATE_PERSONAS = (count: number) => {
  const personas: KnowledgeItem[] = [];
  const roles = ["Architect", "Scholar", "Auditor", "Alchemist", "Strategist", "Designer", "Engineer", "Mentor", "Consultant", "Specialist"];
  const domains = ["AI", "Medical", "Legal", "Business", "Academic", "Code", "Story", "RAG", "Ethics", "Logic"];
  for (let i = 0; i < count; i++) {
    const role = roles[i % roles.length];
    const dom = domains[Math.floor(i / roles.length)];
    personas.push({
      id: `pv_${i}`,
      title: `${dom} ${role}`,
      category: 'Persona',
      description: `Expert in ${dom} logic using ${role} standards.`,
      content: `IDENTITY: ${dom} ${role}. FOCUS: Fidelity, logic, and constraint integrity. REGISTER: Technical.`,
      tags: [dom.toLowerCase(), role.toLowerCase()]
    });
  }
  return personas;
};

const GENERATE_COMPASS = (count: number) => {
  const compass: KnowledgeItem[] = [
    { id: 'tc_temp', title: 'Temperature 0.1', category: 'Architecture', description: 'Deterministic reasoning.', content: 'Use for research and code.', tags: ['precision'] },
    { id: 'tc_top_p', title: 'Top-P 0.9', category: 'Architecture', description: 'Nucleus sampling.', content: 'Balances diversity.', tags: ['randomness'] }
  ];
  for (let i = 2; i < count; i++) {
    compass.push({
      id: `tc_${i}`,
      title: `Compass Param ${i}`,
      category: 'Architecture',
      description: `Technical tuning node ${i}.`,
      content: `Configures neural weight ${i} for performance optimization.`,
      tags: ['technical', 'config']
    });
  }
  return compass;
};

const GENERATE_LINGUISTIC = (count: number) => {
  const controls: KnowledgeItem[] = [
    { id: 'lk_audit', title: 'Operational Verb: Audit', category: 'Linguistic', description: 'Triggers diagnostic reasoning.', content: 'Replace "Explain" with "Audit".', tags: ['precision'] },
    { id: 'lk_anchor', title: 'Meaning Anchoring', category: 'Linguistic', description: 'Semantic grounding technique.', content: 'Define success metrics at session start.', tags: ['logic'] }
  ];
  for (let i = 2; i < count; i++) {
    controls.push({
      id: `lk_${i}`,
      title: `Linguistic Node ${i}`,
      category: 'Linguistic',
      description: `Semantic control technique ${i}.`,
      content: `Linguistic scaffold to enforce constraint layer ${i}.`,
      tags: ['language', 'precision']
    });
  }
  return controls;
};

export const WORLD_OF_TEXTS_KB: KnowledgeItem[] = [
  { id: 'bp_spark', title: 'Phase 1: The Spark', category: 'Phase', description: 'Orientation & Cognitive Activation.', content: 'Establish trust in LLM reasoning.', tags: ['curriculum'] },
  { id: 'bp_swiss', title: 'Phase 2: Swiss Knife', category: 'Phase', description: 'Control systems mastery.', content: 'Master 10 core frameworks.', tags: ['logic'] },
  { id: 'bp_alchemist', title: 'Phase 3: Alchemist', category: 'Phase', description: 'Automation systems.', content: 'Convert logic into workflows.', tags: ['automation'] },
  { id: 'bp_mastery', title: 'Phase 4: Mastery', category: 'Phase', description: 'Certified Architecture.', content: 'Ethical deployment.', tags: ['advanced'] },
  ...GENERATE_PERSONAS(50),
  ...GENERATE_COMPASS(30),
  ...GENERATE_LINGUISTIC(120),
  { id: 'fw_race', title: 'R.A.C.E Framework', category: 'Framework', description: 'Role-Action-Context-Expectation.', content: 'Professional identity standard.', tags: ['core'] },
  { id: 'fw_crispe', title: 'CRISPE Framework', category: 'Framework', description: 'Context-Role-Input-Style-Purpose-Expectation.', content: 'Advanced control.', tags: ['advanced'] },
  { id: 'fw_cot', title: 'CoT Reasoning', category: 'Framework', description: 'Chain of Thought.', content: 'Step-by-step logic.', tags: ['reasoning'] },
  { id: 'tac_multipass', title: 'Multi-Pass Refinement', category: 'Tactic', description: 'Iterative improvement.', content: 'Draft -> Critique -> Improve.', tags: ['optimization'] },
  { id: 'tac_layered', title: 'Layered Prompting', category: 'Tactic', description: 'Isolation strategy.', content: 'Separate Identity from Task.', tags: ['control'] }
];

export const synthesizeNeuralBlueprint = async (framework: string, persona: string, input: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `SYSTEM REQUEST: FRAMEWORK: ${framework}, PERSONA: ${persona}, INPUT: ${input}. TASK: Synthesize blueprint.`,
    config: { thinkingConfig: { thinkingBudget: 4000 } }
  });
  return response.text || "Synthesis failed.";
};

export const chatMentorStream = async function* (history: any[], currentInput: string) {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    history: history,
    config: { systemInstruction: "You are the TEXTSCRIBE Architect Mentor. Refer to the KB.", tools: [{ googleSearch: {} }], thinkingConfig: { thinkingBudget: 2000 } }
  });
  const stream = await chat.sendMessageStream({ message: currentInput });
  for await (const chunk of stream) { yield chunk; }
};

export const getPromptEngineeringTrends = async () => {
  const ai = getAI();
  const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: "Prompt trends Late 2024.", config: { tools: [{ googleSearch: {} }] } });
  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({ title: chunk.web?.title || 'Node', uri: chunk.web?.uri || '' })).filter((s: any) => s.uri) || [];
  return { text: response.text || "Scanning...", sources };
};

export const scorePrompt = async (framework: string, formData: Record<string, string>) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Score for ${framework}: ${JSON.stringify(formData)}`,
    config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, feedback: { type: Type.STRING }, suggestion: { type: Type.STRING } }, required: ["score", "feedback"] } }
  });
  return JSON.parse(response.text || "{}");
};

export const applyAdvancedTactic = async (tacticId: string, input: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Apply tactic ${tacticId} to ${input}`,
    config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { refactored: { type: Type.STRING }, impactScore: { type: Type.NUMBER }, explanation: { type: Type.STRING } }, required: ["refactored", "impactScore", "explanation"] } }
  });
  return JSON.parse(response.text || "{}");
};

export const debugPrompt = async (input: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: `Fix: ${input}` });
  return response.text || "Neural audit offline.";
};

export const runLexicalAudit = async (input: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Lexical audit: ${input}`,
    config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, issues: { type: Type.ARRAY, items: { type: Type.STRING } }, suggestedRevision: { type: Type.STRING } }, required: ["score", "issues", "suggestedRevision"] } }
  });
  return JSON.parse(response.text || "{}");
};

export const architectTotalRefactor = async (input: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Refactor: ${input}`,
    config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { refactored: { type: Type.STRING }, fidelityScore: { type: Type.NUMBER }, changesMade: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["refactored", "fidelityScore", "changesMade"] } }
  });
  return JSON.parse(response.text || "{}");
};

export const simulateMultiAgent = async (role1: string, role2: string, task: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Simulate ${role1} vs ${role2} on ${task}.`,
    config: { thinkingConfig: { thinkingBudget: 4000 } }
  });
  return response.text || "Simulation offline.";
};

export const connectLiveNeuralLink = (callbacks: any) => {
  const ai = getAI();
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
    callbacks: {
      onopen: () => console.log('[LIVE] Linked'),
      onmessage: async (message: LiveServerMessage) => {
        const data = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
        if (data) callbacks.onAudioChunk(data);
      }
    },
    config: { responseModalities: [Modality.AUDIO], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } }, systemInstruction: 'You are the Architect Voice.' }
  });
};

export const neuralVaultSearch = async (query: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Search vault for ${query}.`,
    config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { matches: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, relevance: { type: Type.NUMBER } }, required: ["id", "relevance"] } } }, required: ["matches"] } }
  });
  return JSON.parse(response.text || "{\"matches\":[]}");
};

export const executeWorkflowStep = async (persona: string, task: string, prev?: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: `Node: ${persona}. Task: ${task}. Context: ${prev}` });
  return response.text || "";
};

export const runDefenseAssessment = async (question: string, answer: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Assess defense: ${question} -> ${answer}`,
    config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, feedback: { type: Type.STRING }, pass: { type: Type.BOOLEAN }, nextQuestion: { type: Type.STRING } }, required: ["score", "feedback", "pass"] } }
  });
  return JSON.parse(response.text || "{}");
};

export const generateMarketplaceBlueprints = async (level: number) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Gen 5 blueprints for lvl ${level}`,
    config: { responseMimeType: "application/json", responseSchema: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, title: { type: Type.STRING }, description: { type: Type.STRING }, category: { type: Type.STRING }, fidelity: { type: Type.NUMBER }, price: { type: Type.NUMBER } }, required: ["id", "title", "description", "category", "fidelity", "price"] } } }
  });
  return JSON.parse(response.text || "[]");
};

export const verifyForgeBlueprint = async (bp: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Integrity check: ${bp}`,
    config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { integrity: { type: Type.NUMBER }, weakness: { type: Type.STRING }, fix: { type: Type.STRING } }, required: ["integrity", "weakness", "fix"] } }
  });
  return JSON.parse(response.text || "{}");
};