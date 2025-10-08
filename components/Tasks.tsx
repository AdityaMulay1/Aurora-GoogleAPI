import React from 'react';
import { Task } from '../types';
import { Card } from './common/Card';

interface TasksProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onAddTask: (text: string) => void;
}

const TaskItem: React.FC<{ task: Task; onToggle: () => void }> = ({ task, onToggle }) => (
  <div 
    onClick={onToggle}
    className="flex items-center p-4 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors"
  >
    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${task.completed ? 'bg-primary border-primary' : 'border-gray-500'}`}>
      {task.completed && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
    </div>
    <span className={`flex-1 ${task.completed ? 'line-through text-gray-400' : 'text-gray-100'}`}>
      {task.text}
    </span>
  </div>
);

export const Tasks: React.FC<TasksProps> = ({ tasks, onToggleTask, onAddTask }) => {
  const [newTaskText, setNewTaskText] = React.useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      onAddTask(newTaskText.trim());
      setNewTaskText('');
    }
  };

  return (
    <div className="p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-white">Your Daily Tasks</h1>
        <p className="text-gray-300">Small steps lead to big changes.</p>
      </header>
      <Card>
        <div className="space-y-3">
          {tasks.map(task => (
            <TaskItem key={task.id} task={task} onToggle={() => onToggleTask(task.id)} />
          ))}
        </div>

        <form onSubmit={handleAddTask} className="mt-6 flex gap-2">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Add a new daily goal..."
            className="flex-grow p-2 bg-slate-800 border border-slate-600 text-white placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button type="submit" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus transition-colors">
            Add
          </button>
        </form>
      </Card>
    </div>
  );
};