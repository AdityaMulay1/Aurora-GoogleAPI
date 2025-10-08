import React, { useState } from 'react';
import { Card } from './common/Card';

interface LoginProps {
    onLogin: (name: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onLogin(name.trim());
        }
    };

    return (
        <div className="h-full flex items-center justify-center p-4 bg-gradient-to-br from-primary to-pink-400">
            <Card className="w-full max-w-sm bg-slate-800/80 backdrop-blur-sm border border-slate-600">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white">Welcome to Aurora</h1>
                    <p className="text-gray-300 mt-2">Your personal space for self-care. Let's start by getting your name.</p>
                </div>
                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                    <div>
                        <label htmlFor="name" className="text-sm font-medium text-gray-200">What should I call you?</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            className="mt-1 w-full p-3 bg-slate-700 border border-slate-600 text-white placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-focus transition-colors">
                        Continue
                    </button>
                </form>
            </Card>
        </div>
    );
};