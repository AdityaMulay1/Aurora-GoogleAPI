import React from 'react';
import { Streak, Task, Page, User } from '../types';
import { Card } from './common/Card';

interface DashboardProps {
  streak: Streak;
  tasks: Task[];
  user: User | null;
  onPageChange: (page: Page) => void;
}

const greetings = [
  "What wonderful things will you do today?",
  "Ready to make today amazing?",
  "Let's start this day with a positive step.",
  "Your journey of self-care continues today.",
];

const HeaderImage = () => (
    <div className="rounded-xl overflow-hidden">
        <svg viewBox="0 0 350 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{stopColor: '#A78BFA', stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor: '#F472B6', stopOpacity:1}} />
                </linearGradient>
                 <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"></feGaussianBlur>
                    <feMerge>
                        <feMergeNode in="coloredBlur"></feMergeNode>
                        <feMergeNode in="SourceGraphic"></feMergeNode>
                    </feMerge>
                </filter>
            </defs>
            <rect width="100%" height="100%" fill="transparent"/>
            <path d="M0,50 Q87.5,20 175,50 T350,50" stroke="url(#grad1)" fill="none" strokeWidth="5" strokeLinecap="round" filter="url(#soft-glow)" />
            <path d="M0,60 Q87.5,90 175,60 T350,60" stroke="url(#grad1)" fill="none" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 10" opacity="0.6" filter="url(#soft-glow)" />
        </svg>
    </div>
);


export const Dashboard: React.FC<DashboardProps> = ({ streak, tasks, user, onPageChange }) => {
  const [greeting] = React.useState(greetings[Math.floor(Math.random() * greetings.length)]);
  const completedTasks = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <div className="p-4 space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-white">Hello, {user?.name || 'there'}!</h1>
        <p className="text-gray-300">{greeting}</p>
      </header>

      <HeaderImage />

      <Card className="bg-gradient-to-br from-primary to-purple-500 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-medium">Your Current Streak</p>
            <p className="text-5xl font-bold">{streak.count}</p>
            <p className="text-sm opacity-80">{streak.count === 1 ? 'Day' : 'Days'} of consistency!</p>
          </div>
          <div className="text-6xl">🔥</div>
        </div>
      </Card>
      
      <Card>
        <h2 className="text-xl font-semibold text-gray-100 mb-3">Today's Progress</h2>
        <div className="w-full bg-slate-700 rounded-full h-2.5 mb-2">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="text-gray-300 text-sm">{completedTasks} of {tasks.length} tasks completed.</p>
        <button 
          onClick={() => onPageChange('tasks')}
          className="mt-4 w-full bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-focus transition-colors"
        >
          View Your Tasks
        </button>
      </Card>

      <Card className="bg-gradient-to-r from-pink-500/20 to-transparent border border-pink-500/30">
        <div className="flex items-center space-x-4">
            <div className="text-3xl">💬</div>
            <div>
                <h3 className="font-semibold text-pink-200">Feeling like a chat?</h3>
                <p className="text-sm text-pink-300">Aurora is here to listen and offer a little encouragement.</p>
                 <button 
                    onClick={() => onPageChange('chat')}
                    className="mt-3 text-sm bg-secondary text-white font-semibold py-1 px-3 rounded-full hover:bg-pink-600 transition-colors"
                    >
                    Chat Now
                </button>
            </div>
        </div>
      </Card>
    </div>
  );
};