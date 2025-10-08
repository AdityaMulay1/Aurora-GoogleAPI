
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  date: string; // YYYY-MM-DD
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string; // YYYY-MM-DD HH:mm:ss
}

export interface Streak {
  count: number;
  lastUpdate: string; // YYYY-MM-DD
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  suggestions?: string[];
}

export interface User {
  name: string;
}

export type Page = 'dashboard' | 'tasks' | 'journal' | 'chat';