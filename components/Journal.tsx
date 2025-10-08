import React, { useState, useMemo } from 'react';
import { JournalEntry } from '../types';
import { Card } from './common/Card';
import { Calendar } from './common/Calendar';

interface JournalProps {
  entries: JournalEntry[];
  onAddEntry: (title: string, content: string) => void;
}

export const Journal: React.FC<JournalProps> = ({ entries, onAddEntry }) => {
  const [isWriting, setIsWriting] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const entryDates = useMemo(() => {
    return entries.map(entry => new Date(entry.date).toISOString().split('T')[0]);
  }, [entries]);

  const filteredEntries = useMemo(() => {
      const selectedDateStr = selectedDate.toISOString().split('T')[0];
      return entries.filter(entry => entry.date.startsWith(selectedDateStr));
  }, [entries, selectedDate]);


  const handleSave = () => {
    if (title.trim() && content.trim()) {
      onAddEntry(title.trim(), content.trim());
      setTitle('');
      setContent('');
      setIsWriting(false);
    }
  };

  if (selectedEntry) {
    return (
      <div className="p-4">
        <button onClick={() => setSelectedEntry(null)} className="text-purple-400 font-semibold mb-4">&larr; Back to all entries</button>
        <Card>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">{selectedEntry.title}</h2>
          <p className="text-sm text-gray-400 mb-4">{new Date(selectedEntry.date).toLocaleString()}</p>
          <p className="text-gray-200 whitespace-pre-wrap">{selectedEntry.content}</p>
        </Card>
      </div>
    );
  }

  if (isWriting) {
    return (
      <div className="p-4">
        <Card>
          <h2 className="text-2xl font-bold text-gray-100 mb-4">New Entry</h2>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full p-2 bg-slate-800 border border-slate-700 text-white placeholder:text-gray-400 rounded-lg mb-4 text-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Let it all out..."
            rows={10}
            className="w-full p-2 bg-slate-800 border border-slate-700 text-white placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setIsWriting(false)} className="bg-slate-700 text-gray-200 font-semibold py-2 px-4 rounded-lg hover:bg-slate-600 transition-colors">Cancel</button>
            <button onClick={handleSave} className="bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-focus transition-colors">Save Entry</button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Your Journal</h1>
          <p className="text-gray-300">A space for your thoughts.</p>
        </div>
        <button onClick={() => setIsWriting(true)} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus transition-colors text-2xl">+</button>
      </header>
      
      <Card className="mb-6">
        <Calendar 
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            highlightedDates={entryDates}
        />
      </Card>

      <h2 className="text-xl font-semibold text-gray-100 mb-3">Entries for {selectedDate.toLocaleDateString()}</h2>
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <Card>
            <p className="text-gray-400 text-center">No entries for this day. Write one now!</p>
          </Card>
        ) : (
          filteredEntries.map(entry => (
            <Card key={entry.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedEntry(entry)}>
              <h3 className="font-semibold text-gray-200 truncate">{entry.title}</h3>
              <p className="text-sm text-gray-400">{new Date(entry.date).toLocaleTimeString()}</p>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};