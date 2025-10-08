import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Task, JournalEntry } from '../types';
import { getChatbotResponse, getTaskSuggestions } from '../services/geminiService';
import * as storage from '../services/storageService';

interface ChatbotProps {
  tasks: Task[];
  journalEntries: JournalEntry[];
  onAddTask: (text: string) => void;
}

const MessageBubble: React.FC<{ message: ChatMessage; onAddTask: (text: string) => void }> = ({ message, onAddTask }) => {
  const isUser = message.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${isUser ? 'bg-primary text-white rounded-br-none' : 'bg-slate-700 text-gray-200 rounded-bl-none'}`}>
        <p>{message.text}</p>
        {message.suggestions && (
          <div className="mt-2 border-t border-slate-600 pt-2">
            {message.suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onAddTask(suggestion)}
                className="w-full text-left bg-primary/10 text-primary font-semibold p-2 rounded-md hover:bg-primary/20 transition-colors mb-1 text-sm"
              >
                + Add: "{suggestion}"
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


export const Chatbot: React.FC<ChatbotProps> = ({ tasks, journalEntries, onAddTask }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const history = storage.loadChatHistory();
    if (history.length > 0) {
        setMessages(history);
    } else {
        setMessages([{ role: 'model', text: "Hey there! I'm Aurora. How are you feeling today?" }]);
    }
  }, []);

  useEffect(() => {
    storage.saveChatHistory(messages);
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;
    
    const userMessage: ChatMessage = { role: 'user', text: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await getChatbotResponse(newMessages, input.trim(), tasks, journalEntries);
      const modelMessage: ChatMessage = { role: 'model', text: responseText };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
        const errorMessage: ChatMessage = { role: 'model', text: "Sorry, something went wrong. Please try again." };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleSuggestTasks = async () => {
      setIsLoading(true);
      setMessages(prev => [...prev, { role: 'model', text: "Let me think of some ideas for you..."}]);
      try {
        const suggestions = await getTaskSuggestions();
        if(suggestions.length > 0) {
            const modelMessage: ChatMessage = { role: 'model', text: "Here are a few simple things you could try:", suggestions };
            setMessages(prev => [...prev, modelMessage]);
        } else {
            const errorMessage: ChatMessage = { role: 'model', text: "I couldn't think of anything right now. Maybe we can try again later?" };
            setMessages(prev => [...prev, errorMessage]);
        }
      } catch (error) {
        const errorMessage: ChatMessage = { role: 'model', text: "Sorry, something went wrong while getting suggestions." };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
          setIsLoading(false);
      }
  }

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <header className="p-4 border-b border-slate-700 bg-slate-900/90 backdrop-blur-sm sticky top-0">
        <h1 className="text-xl font-bold text-center text-white">Chat with Aurora</h1>
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <MessageBubble key={index} message={msg} onAddTask={onAddTask} />
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="px-4 py-2 rounded-2xl bg-slate-700 text-gray-200 rounded-bl-none">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-slate-900 border-t border-slate-700">
        <div className="flex items-center gap-2 mb-2">
            <button onClick={handleSuggestTasks} disabled={isLoading} className="text-sm text-primary font-semibold border border-primary rounded-full px-3 py-1 hover:bg-primary/10 transition-colors disabled:opacity-50">
                ✨ Suggest Activities
            </button>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-grow p-3 bg-slate-800 border border-slate-700 text-white placeholder:text-gray-400 rounded-full focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            disabled={isLoading}
          />
          <button onClick={handleSend} disabled={isLoading} className="bg-primary text-white rounded-full p-3 hover:bg-primary-focus disabled:bg-primary/50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform -rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};