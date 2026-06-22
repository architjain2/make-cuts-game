import React, { useState } from 'react';

export default function GameSetup({ onStart }) {
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(4);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rows >= 2 && cols >= 2) {
      onStart(rows, cols);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full animate-pop">
      <h1 className="text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        Game Setup
      </h1>
      <form onSubmit={handleSubmit} className="bg-[var(--color-bg-panel)] p-8 rounded-2xl shadow-2xl flex flex-col gap-6 w-80 border border-gray-700">
        
        <div className="flex flex-col gap-2">
          <label className="text-gray-300 font-medium">Rows (N)</label>
          <input 
            type="number" 
            min="2" max="10" 
            value={rows} 
            onChange={(e) => setRows(Number(e.target.value))}
            className="p-3 rounded-lg bg-gray-800 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition-all text-white"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-gray-300 font-medium">Columns (M)</label>
          <input 
            type="number" 
            min="2" max="10" 
            value={cols} 
            onChange={(e) => setCols(Number(e.target.value))}
            className="p-3 rounded-lg bg-gray-800 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition-all text-white"
          />
        </div>

        <button 
          type="submit"
          className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 active:scale-95 shadow-lg cursor-pointer"
        >
          Start Game
        </button>
      </form>
    </div>
  );
}
