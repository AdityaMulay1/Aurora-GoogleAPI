import React, { useState, useEffect, useCallback } from 'react';
import { Page, Task, JournalEntry, Streak, User } from './types';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { Tasks } from './components/Tasks';
import { Journal } from './components/Journal';
import { Chatbot } from './components/Chatbot';
import { INITIAL_TASKS } from './constants';
import * as storage from './services/storageService';
import { Login } from './components/Login';

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const isYesterday = (dateString: string) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return dateString === yesterday.toISOString().split('T')[0];
};

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [page, setPage] = useState<Page>('dashboard');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
    const [streak, setStreak] = useState<Streak>({ count: 0, lastUpdate: '' });

    const updateStreak = useCallback(() => {
        const todayStr = getTodayDateString();
        setStreak(currentStreak => {
            if (currentStreak.lastUpdate === todayStr) {
                return currentStreak; // Already updated today
            }
            const newCount = isYesterday(currentStreak.lastUpdate) ? currentStreak.count + 1 : 1;
            const newStreak = { count: newCount, lastUpdate: todayStr };
            storage.saveStreak(newStreak);
            return newStreak;
        });
    }, []);

    useEffect(() => {
        const loggedInUser = storage.loadUser();
        if (loggedInUser) {
            setUser(loggedInUser);
        }

        const todayStr = getTodayDateString();
        let loadedTasks = storage.loadTasks(todayStr);

        if (loadedTasks.length === 0) {
            loadedTasks = INITIAL_TASKS.map(task => ({ ...task, date: todayStr, id: `${todayStr}-${task.id}`}));
        }
        
        setTasks(loadedTasks);
        setJournalEntries(storage.loadJournalEntries().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        setStreak(storage.loadStreak());
    }, []);
    
    const handleLogin = (name: string) => {
        const newUser = { name };
        setUser(newUser);
        storage.saveUser(newUser);
    }

    const handleToggleTask = (id: string) => {
        const newTasks = tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        setTasks(newTasks);
        storage.saveTasks(newTasks);
        if (newTasks.find(t => t.id === id)?.completed) {
          updateStreak();
        }
    };

    const handleAddTask = (text: string) => {
        const todayStr = getTodayDateString();
        // Prevent duplicate tasks
        if (tasks.some(task => task.text.toLowerCase() === text.toLowerCase())) {
            return;
        }
        const newTask: Task = {
            id: `${todayStr}-${Date.now()}`,
            text,
            completed: false,
            date: todayStr,
        };
        const newTasks = [...tasks, newTask];
        setTasks(newTasks);
        storage.saveTasks(newTasks);
    };
    
    const handleAddJournalEntry = (title: string, content: string) => {
        const newEntry: JournalEntry = {
            id: Date.now().toString(),
            title,
            content,
            date: new Date().toISOString(),
        };
        const newEntries = [newEntry, ...journalEntries];
        setJournalEntries(newEntries);
        storage.saveJournalEntries(newEntries);
        updateStreak();
    };

    if (!user) {
        return <Login onLogin={handleLogin} />;
    }

    const renderPage = () => {
        switch (page) {
            case 'tasks':
                return <Tasks tasks={tasks} onToggleTask={handleToggleTask} onAddTask={handleAddTask} />;
            case 'journal':
                return <Journal entries={journalEntries} onAddEntry={handleAddJournalEntry} />;
            case 'chat':
                return <Chatbot tasks={tasks} journalEntries={journalEntries} onAddTask={handleAddTask} />;
            case 'dashboard':
            default:
                return <Dashboard streak={streak} tasks={tasks} user={user} onPageChange={setPage} />;
        }
    };

    return (
        <div className="font-sans text-gray-200 h-screen flex flex-col md:max-w-md md:mx-auto md:border md:border-slate-700 md:shadow-lg bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
            <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
                {renderPage()}
            </main>
            <Navbar activePage={page} onPageChange={setPage} />
        </div>
    );
};

export default App;