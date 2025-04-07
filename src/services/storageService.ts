import { GameState } from '../game/types';
import { initialGameState } from '../game/state/petReducer';

const STORAGE_KEY = 'one-life-tamagotchi-state';

/**
 * Saves the current game state to local storage
 */
export const saveGameState = (state: GameState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (error) {
    console.error('Error saving game state:', error);
  }
};

/**
 * Loads the game state from local storage
 * Returns the initialized state if nothing is found
 */
export const loadGameState = (): GameState => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (!serializedState) {
      return { 
        ...initialGameState,
        gameStartTime: Date.now(),
        lastSavedTime: Date.now()
      };
    }
    
    const parsedState = JSON.parse(serializedState) as GameState;
    
    // Ensure the state has all required fields
    return {
      ...initialGameState,
      ...parsedState,
      // Always update lastSavedTime to now when loading
      lastSavedTime: Date.now()
    };
  } catch (error) {
    console.error('Error loading game state:', error);
    return { 
      ...initialGameState,
      gameStartTime: Date.now(),
      lastSavedTime: Date.now()
    };
  }
};

/**
 * Checks if a permanent death record exists
 * This is the "one-life-only" feature before blockchain integration
 */
export const isPermanentlyDead = (): boolean => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (!serializedState) {
      return false;
    }
    
    const parsedState = JSON.parse(serializedState) as GameState;
    return parsedState.isPermanentlyDead === true;
  } catch (error) {
    console.error('Error checking permanent death status:', error);
    return false;
  }
};

/**
 * Checks if a game has been started with a valid pet
 */
export const hasExistingGame = (): boolean => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (!serializedState) {
      return false;
    }
    
    const parsedState = JSON.parse(serializedState) as GameState;
    return parsedState.pet !== null;
  } catch (error) {
    console.error('Error checking existing game:', error);
    return false;
  }
};

/**
 * Removes all game data (only for development/testing)
 * In the final version, this would never be called if pet is dead
 */
export const clearGameData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing game data:', error);
  }
};