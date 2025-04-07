import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { GameAction, GameState } from '../types';
import {
  gameReducer,
  initialGameState,
  createNewPet as createNewPetFunc,
  DEV_ACCELERATED_TIME,
  TIME_CONFIG
} from './petReducer';
import { loadGameState, saveGameState } from '../../services/storageService';

// Context type
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  feedPet: () => void;
  cleanPet: () => void;
  toggleSleep: () => void;
  giveMedicine: () => void;
  playWithPet: () => void;
  trainPet: () => void;
  createNewPet: (name: string) => void;
}

// Create the context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load the initial state from storage
  const [state, dispatch] = useReducer(gameReducer, initialGameState, () => {
    return loadGameState();
  });

  // Save state to storage whenever it changes
  useEffect(() => {
    saveGameState(state);
  }, [state]);

  // Simulate time passing (update pet state) at appropriate intervals
  useEffect(() => {
    // Use the centralized timing configuration for consistent timing
    const updateInterval = TIME_CONFIG.UPDATE_INTERVAL;
    
    console.log(`Pet state updating every ${updateInterval/1000} seconds`);
    
    const timerId = setInterval(() => {
      console.log("Checking for evolution and updating state...");
      dispatch({
        type: 'feed', // Type doesn't matter here, just triggering the state update
        value: 0,     // No actual feeding happens
        timestamp: Date.now(),
      });
    }, updateInterval);

    return () => clearInterval(timerId);
  }, []);

  // Convenience functions for actions
  const feedPet = () => {
    dispatch({
      type: 'feed',
      timestamp: Date.now(),
    });
  };

  const cleanPet = () => {
    dispatch({
      type: 'clean',
      timestamp: Date.now(),
    });
  };

  const toggleSleep = () => {
    dispatch({
      type: 'sleep',
      timestamp: Date.now(),
    });
  };

  const giveMedicine = () => {
    dispatch({
      type: 'medicine',
      timestamp: Date.now(),
    });
  };

  const playWithPet = () => {
    dispatch({
      type: 'play',
      timestamp: Date.now(),
    });
  };

  const trainPet = () => {
    dispatch({
      type: 'train',
      timestamp: Date.now(),
    });
  };

  // Function to create a new pet
  const createNewPet = (name: string) => {
    if (state.pet || state.isPermanentlyDead) {
      console.error('Cannot create a new pet. Either you already have a pet or your pet has died permanently.');
      return;
    }
    
    // Create a new pet using the imported function
    const newPet = createNewPetFunc(name);
    console.log("Creating new pet:", newPet);
    
    // Set up the new game state
    const timestamp = Date.now();
    const newState: GameState = {
      ...initialGameState,
      pet: newPet,
      gameStartTime: timestamp,
      lastSavedTime: timestamp
    };
    
    // Save to storage
    saveGameState(newState);
    
    // Force a state update by using one of the valid action types
    // We're just triggering a state update here, not actually feeding
    dispatch({
      type: 'feed',
      timestamp: timestamp
    });
    
    // Force a page reload to make sure the pet is displayed properly
    window.location.reload();
  };

  // Create the context value
  const contextValue: GameContextType = {
    state,
    dispatch,
    feedPet,
    cleanPet,
    toggleSleep,
    giveMedicine,
    playWithPet,
    trainPet,
    createNewPet,
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook for using this context
export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};