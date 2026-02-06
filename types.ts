
export enum View {
  HOME = 'HOME',
  VAULT = 'VAULT',
  JOURNEY = 'JOURNEY',
  CONSOLE = 'CONSOLE',
  WORKFLOW = 'WORKFLOW',
  ENGINE = 'ENGINE',
  CHAT = 'CHAT',
  LAB = 'LAB',
  FORGE = 'FORGE',
  PROFILE = 'PROFILE'
}

export enum LearningPhase {
  SPARK = 'Spark',
  SWISS_KNIFE = 'Swiss Knife',
  ALCHEMIST = 'Alchemist',
  MASTERY = 'Mastery'
}

export interface UserProgress {
  // Added userId to fix property does not exist error
  userId?: string;
  level: number;
  phase: LearningPhase;
  points: number;
  streak: number;
  completedLessons: string[];
  skills: {
    logic: number;
    clarity: number;
    efficiency: number;
    control: number;
  };
}

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  text: string;
  sources?: { title: string; uri: string }[];
  intent?: string;
  timestamp?: number;
}

export interface LabFramework {
  id: string;
  name: string;
  description: string;
  fields: {
    key: string;
    label: string;
    placeholder: string;
  }[];
}

export interface KnowledgeItem {
  id: string;
  title: string;
  category: string;
  description: string;
  content: string;
  tags: string[];
}
