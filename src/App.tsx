import React, { useState, useEffect } from 'react';
import { GameProvider } from './game/state/GameContext';
import WelcomeScreen from './components/screens/WelcomeScreen';
import GameScreen from './components/screens/GameScreen';
import { hasExistingGame, isPermanentlyDead, clearGameData } from './services/storageService';
import ErrorBoundary from './components/ErrorBoundary';
import Debug from './components/Debug';
import './App.css';

const App: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);
  
  useEffect(() => {
    // Check if there's an existing game on mount
    const hasGame = hasExistingGame();
    if (hasGame) {
      setGameStarted(true);
    }
  }, []);
  
  const handleStartGame = () => {
    setGameStarted(true);
  };
  // Wrap everything in an ErrorBoundary and GameProvider to share state
  return (
    <ErrorBoundary>
      <GameProvider>
        <div className="app">
          {!gameStarted ? (
            <WelcomeScreen onStartGame={handleStartGame} />
          ) : (
            <GameScreen />
          )}
          {/* Add debug component in development environment */}
          <Debug />
        </div>
      </GameProvider>
    </ErrorBoundary>
  );
};

export default App;