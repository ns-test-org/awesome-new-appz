'use client';

import { useState } from 'react';

type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
type PieceColor = 'white' | 'black';

interface Piece {
  type: PieceType;
  color: PieceColor;
}

type Board = (Piece | null)[][];

const pieceSymbols: Record<PieceColor, Record<PieceType, string>> = {
  white: {
    king: '♔',
    queen: '♕',
    rook: '♖',
    bishop: '♗',
    knight: '♘',
    pawn: '♙'
  },
  black: {
    king: '♚',
    queen: '♛',
    rook: '♜',
    bishop: '♝',
    knight: '♞',
    pawn: '♟'
  }
};

function createInitialBoard(): Board {
  const board: Board = Array(8).fill(null).map(() => Array(8).fill(null));
  
  // Black pieces
  board[0] = [
    { type: 'rook', color: 'black' },
    { type: 'knight', color: 'black' },
    { type: 'bishop', color: 'black' },
    { type: 'queen', color: 'black' },
    { type: 'king', color: 'black' },
    { type: 'bishop', color: 'black' },
    { type: 'knight', color: 'black' },
    { type: 'rook', color: 'black' }
  ];
  board[1] = Array(8).fill({ type: 'pawn', color: 'black' });
  
  // White pieces
  board[6] = Array(8).fill({ type: 'pawn', color: 'white' });
  board[7] = [
    { type: 'rook', color: 'white' },
    { type: 'knight', color: 'white' },
    { type: 'bishop', color: 'white' },
    { type: 'queen', color: 'white' },
    { type: 'king', color: 'white' },
    { type: 'bishop', color: 'white' },
    { type: 'knight', color: 'white' },
    { type: 'rook', color: 'white' }
  ];
  
  return board;
}

export default function ChessGame() {
  const [board, setBoard] = useState<Board>(createInitialBoard());
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null);
  const [currentTurn, setCurrentTurn] = useState<PieceColor>('white');

  const handleSquareClick = (row: number, col: number) => {
    if (selectedSquare) {
      const [selectedRow, selectedCol] = selectedSquare;
      const piece = board[selectedRow][selectedCol];
      
      if (piece && piece.color === currentTurn) {
        // Move piece
        const newBoard = board.map(r => [...r]);
        newBoard[row][col] = piece;
        newBoard[selectedRow][selectedCol] = null;
        setBoard(newBoard);
        setCurrentTurn(currentTurn === 'white' ? 'black' : 'white');
      }
      
      setSelectedSquare(null);
    } else {
      const piece = board[row][col];
      if (piece && piece.color === currentTurn) {
        setSelectedSquare([row, col]);
      }
    }
  };

  const resetGame = () => {
    setBoard(createInitialBoard());
    setSelectedSquare(null);
    setCurrentTurn('white');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-2">Chess</h1>
        <p className="text-xl text-white/80 mb-6">
          {currentTurn === 'white' ? 'White' : 'Black'}&apos;s Turn
        </p>
        
        <div className="inline-block bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-2xl">
          <div className="grid grid-cols-8 gap-0 border-4 border-amber-900">
            {board.map((row, rowIndex) =>
              row.map((piece, colIndex) => {
                const isLight = (rowIndex + colIndex) % 2 === 0;
                const isSelected = selectedSquare?.[0] === rowIndex && selectedSquare?.[1] === colIndex;
                
                return (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleSquareClick(rowIndex, colIndex)}
                    className={`
                      w-16 h-16 md:w-20 md:h-20 flex items-center justify-center text-5xl md:text-6xl
                      transition-all duration-200 hover:scale-105
                      ${isLight ? 'bg-amber-100' : 'bg-amber-800'}
                      ${isSelected ? 'ring-4 ring-yellow-400 ring-inset' : ''}
                    `}
                  >
                    {piece && pieceSymbols[piece.color][piece.type]}
                  </button>
                );
              })
            )}
          </div>
        </div>
        
        <button
          onClick={resetGame}
          className="mt-6 px-8 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg transition-all duration-200 backdrop-blur-sm"
        >
          Reset Game
        </button>
      </div>
    </div>
  );
}

