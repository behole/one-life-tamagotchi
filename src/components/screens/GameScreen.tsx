import React from 'react';
import Pet from '../pet/Pet';
import ControlPanel from '../ui/ControlPanel';
import StatusDisplay from '../ui/StatusDisplay';
import './backgrounds.css';
import { useGame } from '../../game/state/GameContext';
import './GameScreen.css';

const GameScreen: React.FC = () => {
  const { state } = useGame();
  const { pet, isPermanentlyDead } = state;

  // If no pet or permanently dead, render nothing (should be handled by App.tsx)
  if (!pet) {
    return null;
  }

  // Pet is dead - show memorial screen
  if (pet.isDead) {
    return (
      <div className="game-screen death-screen">
        <div className="death-container">
          <h2>Your Pet Has Passed Away</h2>
          <p className="death-cause">{pet.deathCause}</p>
          <div className="memorial-pet">
            <div className="pet-background death-bg"></div>
            <Pet pet={pet} />
          </div>
          <div className="memorial-details">
            <StatusDisplay />
          </div>
          <p className="memorial-message">
            In the One Life Tamagotchi world, there are no second chances.
            Your pet's memory will live on, but you cannot create a new one.
          </p>
        </div>
      </div>
    );
  }

  // Normal game screen for a living pet
  // Choose background based on pet state
  const bgClass = pet.isSleeping ? 'sleeping-bg' : 'default-bg';

  return (
    <div className="game-screen">
      <div className="game-container">
        <div className="pet-container">
          <div className={`pet-background ${bgClass}`}></div>
          <Pet pet={pet} />
        </div>
        
        <StatusDisplay />
        
        <ControlPanel />
      </div>
    </div>
  );
};

export default GameScreen;