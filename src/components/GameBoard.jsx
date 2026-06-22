import React, { useState, useEffect } from 'react';

export default function GameBoard({ rows, cols, onRestart }) {
  // 0 means uncut, 1 means Player 1 cut, 2 means Player 2 cut
  const [hCuts, setHCuts] = useState(() => 
    Array.from({ length: rows - 1 }, () => Array(cols).fill(0))
  );
  const [vCuts, setVCuts] = useState(() => 
    Array.from({ length: rows }, () => Array(cols - 1).fill(0))
  );

  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [winner, setWinner] = useState(null);
  const [errorCut, setErrorCut] = useState(null); // { type, lineIndex, start, end }
  const [drag, setDrag] = useState(null); // { type, lineIndex, startCell, currentCell }

  const countComponents = (hState, vState) => {
    const visited = new Set();
    let count = 0;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const id = `${r},${c}`;
        if (!visited.has(id)) {
          count++;
          const queue = [{ r, c }];
          visited.add(id);

          let head = 0;
          while (head < queue.length) {
            const curr = queue[head++];
            
            // Up
            if (curr.r > 0 && hState[curr.r - 1][curr.c] === 0) {
              const nextId = `${curr.r - 1},${curr.c}`;
              if (!visited.has(nextId)) {
                visited.add(nextId);
                queue.push({ r: curr.r - 1, c: curr.c });
              }
            }
            // Down
            if (curr.r < rows - 1 && hState[curr.r][curr.c] === 0) {
              const nextId = `${curr.r + 1},${curr.c}`;
              if (!visited.has(nextId)) {
                visited.add(nextId);
                queue.push({ r: curr.r + 1, c: curr.c });
              }
            }
            // Left
            if (curr.c > 0 && vState[curr.r][curr.c - 1] === 0) {
              const nextId = `${curr.r},${curr.c - 1}`;
              if (!visited.has(nextId)) {
                visited.add(nextId);
                queue.push({ r: curr.r, c: curr.c - 1 });
              }
            }
            // Right
            if (curr.c < cols - 1 && vState[curr.r][curr.c] === 0) {
              const nextId = `${curr.r},${curr.c + 1}`;
              if (!visited.has(nextId)) {
                visited.add(nextId);
                queue.push({ r: curr.r, c: curr.c + 1 });
              }
            }
          }
        }
      }
    }
    return count;
  };

  const getHBoundaries = (r) => {
    const boundaries = [0, cols];
    for (let x = 1; x < cols; x++) {
      if (vCuts[r][x - 1] > 0 && vCuts[r + 1][x - 1] > 0) {
        boundaries.push(x);
      }
    }
    return boundaries.sort((a, b) => a - b);
  };

  const getVBoundaries = (c) => {
    const boundaries = [0, rows];
    for (let y = 1; y < rows; y++) {
      if (hCuts[y - 1][c] > 0 && hCuts[y - 1][c + 1] > 0) {
        boundaries.push(y);
      }
    }
    return boundaries.sort((a, b) => a - b);
  };

  const handlePointerUp = () => {
    if (!drag || winner) {
      setDrag(null);
      return;
    }

    const { type, lineIndex, startCell, currentCell } = drag;
    setDrag(null);

    const minIdx = Math.min(startCell, currentCell);
    const maxIdx = Math.max(startCell, currentCell);

    let startX, endX;

    if (type === 'h') {
      const boundaries = getHBoundaries(lineIndex);
      startX = [...boundaries].reverse().find(b => b <= minIdx);
      endX = boundaries.find(b => b >= maxIdx + 1);
    } else {
      const boundaries = getVBoundaries(lineIndex);
      startX = [...boundaries].reverse().find(b => b <= minIdx);
      endX = boundaries.find(b => b >= maxIdx + 1);
    }

    // Attempt the cut
    const oldComponents = countComponents(hCuts, vCuts);
    let newHCuts = hCuts.map(row => [...row]);
    let newVCuts = vCuts.map(row => [...row]);

    let madeNewCut = false;

    if (type === 'h') {
      for (let i = startX; i < endX; i++) {
        if (newHCuts[lineIndex][i] === 0) {
          newHCuts[lineIndex][i] = currentPlayer;
          madeNewCut = true;
        }
      }
    } else {
      for (let i = startX; i < endX; i++) {
        if (newVCuts[i][lineIndex] === 0) {
          newVCuts[i][lineIndex] = currentPlayer;
          madeNewCut = true;
        }
      }
    }

    if (!madeNewCut) {
      // Trying to cut already cut space entirely
      setErrorCut({ type, lineIndex, start: startX, end: endX });
      setTimeout(() => setErrorCut(null), 400);
      return;
    }

    const newComponents = countComponents(newHCuts, newVCuts);

    if (newComponents > oldComponents) {
      setHCuts(newHCuts);
      setVCuts(newVCuts);
      
      if (newComponents === rows * cols) {
        setWinner(currentPlayer);
      } else {
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
      }
      setErrorCut(null);
    } else {
      setErrorCut({ type, lineIndex, start: startX, end: endX });
      setTimeout(() => setErrorCut(null), 400);
    }
  };

  const getDragPreview = () => {
    if (!drag) return null;
    const { type, lineIndex, startCell, currentCell } = drag;
    const minIdx = Math.min(startCell, currentCell);
    const maxIdx = Math.max(startCell, currentCell);

    let startX, endX;
    if (type === 'h') {
      const boundaries = getHBoundaries(lineIndex);
      startX = [...boundaries].reverse().find(b => b <= minIdx);
      endX = boundaries.find(b => b >= maxIdx + 1);
      return { type, lineIndex, start: startX, end: endX };
    } else {
      const boundaries = getVBoundaries(lineIndex);
      startX = [...boundaries].reverse().find(b => b <= minIdx);
      endX = boundaries.find(b => b >= maxIdx + 1);
      return { type, lineIndex, start: startX, end: endX };
    }
  };

  const dragPreview = getDragPreview();
  const cellSize = 60;
  const boardWidth = cols * cellSize;
  const boardHeight = rows * cellSize;

  return (
    <div 
      className="flex flex-col items-center py-10 animate-pop w-full select-none"
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div className="flex justify-between items-center w-full max-w-2xl mb-8 px-4">
        <h2 className="text-3xl font-bold">
          {winner ? (
            <span className="text-green-400 drop-shadow-md">Player {winner} Wins! 🎉</span>
          ) : (
            <span className={currentPlayer === 1 ? 'text-purple-400 drop-shadow-md' : 'text-pink-400 drop-shadow-md'}>
              Player {currentPlayer}'s Turn
            </span>
          )}
        </h2>
        <button 
          onClick={onRestart}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-medium transition-colors shadow-lg cursor-pointer text-white"
        >
          Restart Game
        </button>
      </div>

      <div className="relative bg-gray-800 p-8 rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-gray-700">
        <svg width={boardWidth} height={boardHeight} className="bg-gray-900 rounded-sm overflow-visible shadow-inner">
          {/* Draw Paper Blocks (Background) */}
          <rect x="0" y="0" width={boardWidth} height={boardHeight} fill="#f8fafc" />

          {/* Draw base grid lines (dotted) */}
          {Array.from({ length: rows - 1 }).map((_, r) => (
            <line
              key={`h-grid-${r}`}
              x1="0" y1={(r + 1) * cellSize}
              x2={boardWidth} y2={(r + 1) * cellSize}
              stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4"
            />
          ))}
          {Array.from({ length: cols - 1 }).map((_, c) => (
            <line
              key={`v-grid-${c}`}
              x1={(c + 1) * cellSize} y1="0"
              x2={(c + 1) * cellSize} y2={boardHeight}
              stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4"
            />
          ))}

          {/* Draw Actual Cuts */}
          {/* Horizontal Cuts */}
          {hCuts.map((rowArr, r) => 
            rowArr.map((val, c) => val > 0 && (
              <line
                key={`hcut-${r}-${c}`}
                x1={c * cellSize} y1={(r + 1) * cellSize}
                x2={(c + 1) * cellSize} y2={(r + 1) * cellSize}
                stroke={val === 1 ? "#ec4899" : "#a855f7"}
                strokeWidth="6"
                strokeLinecap="round"
                className="drop-shadow-lg"
              />
            ))
          )}

          {/* Vertical Cuts */}
          {vCuts.map((rowArr, r) => 
            rowArr.map((val, c) => val > 0 && (
              <line
                key={`vcut-${r}-${c}`}
                x1={(c + 1) * cellSize} y1={r * cellSize}
                x2={(c + 1) * cellSize} y2={(r + 1) * cellSize}
                stroke={val === 1 ? "#ec4899" : "#a855f7"}
                strokeWidth="6"
                strokeLinecap="round"
                className="drop-shadow-lg"
              />
            ))
          )}

          {/* Draw Drag Preview */}
          {dragPreview && (
            <line
              x1={dragPreview.type === 'h' ? dragPreview.start * cellSize : (dragPreview.lineIndex + 1) * cellSize}
              y1={dragPreview.type === 'h' ? (dragPreview.lineIndex + 1) * cellSize : dragPreview.start * cellSize}
              x2={dragPreview.type === 'h' ? dragPreview.end * cellSize : (dragPreview.lineIndex + 1) * cellSize}
              y2={dragPreview.type === 'h' ? (dragPreview.lineIndex + 1) * cellSize : dragPreview.end * cellSize}
              stroke={currentPlayer === 1 ? "#ec4899" : "#a855f7"}
              strokeWidth="10"
              strokeLinecap="round"
              strokeOpacity="0.5"
              className="pointer-events-none drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]"
            />
          )}

          {/* Draw Error Preview */}
          {errorCut && (
            <line
              x1={errorCut.type === 'h' ? errorCut.start * cellSize : (errorCut.lineIndex + 1) * cellSize}
              y1={errorCut.type === 'h' ? (errorCut.lineIndex + 1) * cellSize : errorCut.start * cellSize}
              x2={errorCut.type === 'h' ? errorCut.end * cellSize : (errorCut.lineIndex + 1) * cellSize}
              y2={errorCut.type === 'h' ? (errorCut.lineIndex + 1) * cellSize : errorCut.end * cellSize}
              stroke="red"
              strokeWidth="10"
              strokeLinecap="round"
              strokeOpacity="0.8"
              className="pointer-events-none transition-all duration-300 shadow-[0_0_20px_red]"
            />
          )}

          {/* Interaction Overlays (Cell-level segments) */}
          {!winner && Array.from({ length: rows - 1 }).map((_, r) => 
            Array.from({ length: cols }).map((_, c) => {
              const y = (r + 1) * cellSize;
              const x1 = c * cellSize;
              const x2 = (c + 1) * cellSize;
              return (
                <line
                  key={`h-int-${r}-${c}`}
                  x1={x1} y1={y} x2={x2} y2={y}
                  stroke="transparent"
                  strokeWidth="24"
                  className="cursor-pointer hover:stroke-purple-400 hover:stroke-opacity-40 transition-colors duration-200"
                  onPointerDown={(e) => {
                    e.target.releasePointerCapture(e.pointerId); // Prevent capture so we can swipe
                    setDrag({ type: 'h', lineIndex: r, startCell: c, currentCell: c });
                  }}
                  onPointerEnter={() => {
                    if (drag && drag.type === 'h' && drag.lineIndex === r) {
                      setDrag(prev => ({ ...prev, currentCell: c }));
                    }
                  }}
                />
              );
            })
          )}

          {!winner && Array.from({ length: cols - 1 }).map((_, c) => 
            Array.from({ length: rows }).map((_, r) => {
              const x = (c + 1) * cellSize;
              const y1 = r * cellSize;
              const y2 = (r + 1) * cellSize;
              return (
                <line
                  key={`v-int-${r}-${c}`}
                  x1={x} y1={y1} x2={x} y2={y2}
                  stroke="transparent"
                  strokeWidth="24"
                  className="cursor-pointer hover:stroke-purple-400 hover:stroke-opacity-40 transition-colors duration-200"
                  onPointerDown={(e) => {
                    e.target.releasePointerCapture(e.pointerId);
                    setDrag({ type: 'v', lineIndex: c, startCell: r, currentCell: r });
                  }}
                  onPointerEnter={() => {
                    if (drag && drag.type === 'v' && drag.lineIndex === c) {
                      setDrag(prev => ({ ...prev, currentCell: r }));
                    }
                  }}
                />
              );
            })
          )}
        </svg>
      </div>
    </div>
  );
}
