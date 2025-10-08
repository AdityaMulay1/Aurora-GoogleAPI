
import { Task, JournalEntry, Streak, ChatMessage, User } from '../types';

const TASKS_KEY = 'aurora_tasks';
const JOURNAL_KEY = 'aurora_journal';
const STREAK_KEY = 'aurora_streak';
const CHAT_HISTORY_KEY = 'aurora_chat_history';
const USER_KEY = 'aurora_user';


export const saveTasks = (tasks: Task[]): void => {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

export const loadTasks = (date: string): Task[] => {
  const storedTasks = localStorage.getItem(TASKS_KEY);
  if (storedTasks) {
    const allTasks: Task[] = JSON.parse(storedTasks);
    return allTasks.filter(task => task.date === date);
  }
  return [];
};

export const saveJournalEntries = (entries: JournalEntry[]): void => {
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
};

export const loadJournalEntries = (): JournalEntry[] => {
  const storedEntries = localStorage.getItem(JOURNAL_KEY);
  return storedEntries ? JSON.parse(storedEntries) : [];
};

export const saveStreak = (streak: Streak): void => {
  localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
};

export const loadStreak = (): Streak => {
  const storedStreak = localStorage.getItem(STREAK_KEY);
  return storedStreak ? JSON.parse(storedStreak) : { count: 0, lastUpdate: '' };
};

export const saveChatHistory = (messages: ChatMessage[]): void => {
  localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
};

export const loadChatHistory = (): ChatMessage[] => {
    const storedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
    return storedHistory ? JSON.parse(storedHistory) : [];
}

export const saveUser = (user: User): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export const loadUser = (): User | null => {
    const storedUser = localStorage.getItem(USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
}
