export enum Difficulty {
  BASICS = 'Basics',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
  EXPERT = 'Expert'
}

export interface Topic {
  id: string;
  title: string;
  difficulty: Difficulty;
  prompt: string;
}

export interface CurriculumModule {
  difficulty: Difficulty;
  topics: Topic[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type GenerateContentStatus = 'idle' | 'loading' | 'success' | 'error';