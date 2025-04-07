import React from 'react';
import { useGame } from '../../game/state/GameContext';
import './ControlPanel.css';

const ControlPanel: React.FC = () => {
  const { state, feedPet, cleanPet, toggleSleep, giveMedicine, playWithPet, trainPet } = useGame();
  const { pet } = state;

  // If no pet or pet is dead, don't show controls
  if (!pet || pet.isDead) {
    return null;
  }

  // If pet is sleeping, only show the wake up option
  if (pet.isSleeping) {
    return (
      <div className="control-panel sleeping-panel">
        <div className="sleep-status">
          <span className="sleep-icon">💤</span> Your pet is sleeping and recovering energy
        </div>
        <button className="control-button wake-button" onClick={toggleSleep}>
          Wake Up
        </button>
      </div>
    );
  }

  return (
    <div className="control-panel">
      <button className="control-button feed-button" onClick={feedPet}>
        <span className="button-icon">🍔</span>
        <span className="button-text">Feed</span>
      </button>
      
      <button className="control-button clean-button" onClick={cleanPet}>
        <span className="button-icon">🧼</span>
        <span className="button-text">Clean</span>
      </button>
      
      <button
        className="control-button sleep-button"
        onClick={toggleSleep}
        title="Put your pet to sleep to recover energy. Energy increases while sleeping!"
      >
        <span className="button-icon">💤</span>
        <span className="button-text">Sleep</span>
        <span className="button-tooltip">Recover Energy</span>
      </button>
      
      <button 
        className="control-button medicine-button" 
        onClick={giveMedicine}
        disabled={pet.needs.health > 80} // Only enable if pet is sick
      >
        <span className="button-icon">💊</span>
        <span className="button-text">Medicine</span>
      </button>
      
      <button className="control-button play-button" onClick={playWithPet}>
        <span className="button-icon">🎮</span>
        <span className="button-text">Play</span>
      </button>
      
      <button className="control-button train-button" onClick={trainPet}>
        <span className="button-icon">📚</span>
        <span className="button-text">Train</span>
      </button>
    </div>
  );
};

export default ControlPanel;