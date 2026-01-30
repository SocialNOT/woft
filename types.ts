
export enum CategoryType {
  FRAMEWORK = 'FRAMEWORK',
  PERSONA = 'PERSONA',
  COMPASS = 'COMPASS',
  MODULE = 'MODULE'
}

export interface RegistryItem {
  id: string;
  name: string;
  description: string;
  category: CategoryType;
  group: string;
  systemPrompt?: string;
  starterPrompt?: string;
  isCustom?: boolean;
}

export interface CompassState {
  temperature: number;
  topP: number;
  topK: number;
  seed: number;
  thinkingBudget: number;
  aspectRatio: "1:1" | "16:9" | "9:16" | "4:3";
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  thought?: string;
  isStarred?: boolean;
  isPinned?: boolean;
  parentId?: string;
  branchId?: string;
  imageUrl?: string;
  attachedFile?: AttachedFile;
  meta?: {
    framework?: string;
    persona?: string;
    sources?: GroundingChunk[];
    promptDNA?: string;
    dnaBreakdown?: DNABreakdown;
    symposium?: SymposiumResponse[];
    critique?: string;
    imagePrompt?: string;
  };
}

export interface SymposiumResponse {
  persona: string;
  personaId: string;
  content: string;
  dnaBreakdown: DNABreakdown;
}

export interface DNABreakdown {
  logicPath: string;
  semanticWeight: string;
  structuralDensity: string;
  metrics: {
    logicScore: number;
    entropyLevel: number;
    clarityIndex: number;
  };
}

export interface AttachedFile {
  name: string;
  mimeType: string;
  data: string; // base64
}

export interface GroundingChunk {
  web?: { uri: string; title: string };
  maps?: { uri: string; title: string };
}
