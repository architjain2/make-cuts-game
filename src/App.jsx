import React, { useState } from 'react';
import GameSetup from './components/GameSetup';
import GameBoard from './components/GameBoard';

export default function App() {
  const [phase, setPhase] = useState('setup'); // 'setup' | 'playing'
  const [boardSize, setBoardSize] = useState({ rows: 4, cols: 4 });

  const startGame = (rows, cols) => {
    setBoardSize({ rows, cols });
    setPhase('playing');
  };

  const restartGame = () => {
    setPhase('setup');
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-dark)] text-white font-sans flex flex-col items-center selection:bg-purple-500 selection:text-white">
      <header className="w-full py-6 bg-[var(--color-bg-panel)] shadow-md flex justify-center border-b border-gray-800 z-10">
        <h1 className="text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 drop-shadow-sm">
          ✂️ Make Cuts ✂️
        </h1>
      </header>
      
      <main className="flex-1 w-full flex justify-center items-center p-4 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="z-10 w-full flex justify-center h-full">
          {phase === 'setup' && <GameSetup onStart={startGame} />}
          {phase === 'playing' && (
            <GameBoard 
              rows={boardSize.rows} 
              cols={boardSize.cols} 
              onRestart={restartGame} 
            />
          )}
        </div>
      </main>
    </div>
  );
}
