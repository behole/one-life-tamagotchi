import React, { useState } from 'react';
import { useGame } from '../../game/state/GameContext';
import { isPermanentlyDead } from '../../services/storageService';
import './WelcomeScreen.css';

const WelcomeScreen: React.FC<{ onStartGame: () => void }> = ({ onStartGame }) => {
  const [name, setName] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const { createNewPet } = useGame();
  
  // Check if user is permanently banned from creating a new pet
  const isPermaDead = isPermanentlyDead();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name.trim() === '') {
      return; // Don't allow empty names
    }
    
    if (!showWarning) {
      // First time clicking - show warning
      setShowWarning(true);
      return;
    }
    
    // Create new pet and start game
    createNewPet(name);
    onStartGame();
  };
  
  if (isPermaDead) {
    return (
      <div className="welcome-screen permanent-death">
        <h1>Your Pet Has Passed Away</h1>
        <div className="death-message">
          <p>In this world, each person gets only one chance to care for a virtual pet.</p>
          <p>Your pet has passed away, and you cannot create another one.</p>
          <p>This is the premise of our one-life-only Tamagotchi experience.</p>
          <p>Thank you for playing. Your pet's memory lives on.</p>
        </div>
        <div className="memorial">
          {/* We could add a memorial image or animation here */}
          <div className="memorial-icon">🕯️</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="welcome-screen">
      <h1>One Life Tamagotchi</h1>
      
      <div className="intro-text">
        <p>Welcome to a unique Tamagotchi experience.</p>
        <p>You will raise a virtual pet that evolves based on how you care for it.</p>
        <p className="warning-text">But beware: if your pet dies, it's gone forever. No second chances.</p>
      </div>
      
      {showWarning ? (
        <div className="warning-box">
          <h2>Final Warning</h2>
          <p>Are you sure you want to proceed?</p>
          <p>If your pet dies, you can NEVER create another one.</p>
          <p>This is a lifetime commitment to this single digital pet.</p>
        </div>
      ) : null}
      
      <form onSubmit={handleSubmit} className="pet-form">
        <div className="form-group">
          <label htmlFor="pet-name">Name your pet:</label>
          <input
            type="text"
            id="pet-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={12}
            required
            placeholder="Enter name"
          />
        </div>
        
        <button type="submit" className={showWarning ? 'confirm-button' : ''}>
          {showWarning ? 'I Understand - Create My Pet' : 'Create Pet'}
        </button>
      </form>
    </div>
  );
};

export default WelcomeScreen;