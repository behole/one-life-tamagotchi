import React from 'react';
import { useGame } from '../../game/state/GameContext';
import { calculateAge } from '../../game/state/petReducer';
import './StatusDisplay.css';

const StatusDisplay: React.FC = () => {
  const { state } = useGame();
  const { pet } = state;

  if (!pet) {
    return null;
  }

  const { needs, stage, personalities, mood } = pet;
  const age = calculateAge(pet.birthTime);
  const isDead = pet.isDead;

  // Calculate dominant personality
  const dominantPersonality = Object.entries(personalities)
    .sort((a, b) => b[1] - a[1])[0][0];

  return (
    <div className={`status-display ${isDead ? 'dead' : ''}`}>
      <div className="status-header">
        <h2 className="pet-name">{pet.name}</h2>
        <div className="pet-info">
          <span className="pet-age">Age: {age}h</span>
          <span className="pet-stage">Stage: {stage}</span>
        </div>
      </div>

      {isDead ? (
        <div className="death-notice">
          <h3>Rest in Peace</h3>
          <p>Cause: {pet.deathCause}</p>
          <p>Lived for: {age} hours</p>
        </div>
      ) : (
        <>
          <div className="needs-bars">
            <div className="need-bar">
              <label>Hunger</label>
              <div className="bar-container">
                <div 
                  className="bar-fill" 
                  style={{ width: `${needs.hunger}%` }}
                  data-value={Math.round(needs.hunger)}
                ></div>
              </div>
            </div>
            
            <div className="need-bar">
              <label>Energy</label>
              <div className="bar-container">
                <div 
                  className="bar-fill" 
                  style={{ width: `${needs.energy}%` }}
                  data-value={Math.round(needs.energy)}
                ></div>
              </div>
            </div>
            
            <div className="need-bar">
              <label>Happiness</label>
              <div className="bar-container">
                <div 
                  className="bar-fill" 
                  style={{ width: `${needs.happiness}%` }}
                  data-value={Math.round(needs.happiness)}
                ></div>
              </div>
            </div>
            
            <div className="need-bar">
              <label>Health</label>
              <div className="bar-container">
                <div 
                  className="bar-fill health-bar" 
                  style={{ width: `${needs.health}%` }}
                  data-value={Math.round(needs.health)}
                ></div>
              </div>
            </div>
            
            <div className="need-bar">
              <label>Cleanliness</label>
              <div className="bar-container">
                <div 
                  className="bar-fill" 
                  style={{ width: `${needs.cleanliness}%` }}
                  data-value={Math.round(needs.cleanliness)}
                ></div>
              </div>
            </div>
            
            <div className="need-bar">
              <label>Discipline</label>
              <div className="bar-container">
                <div 
                  className="bar-fill" 
                  style={{ width: `${needs.discipline}%` }}
                  data-value={Math.round(needs.discipline)}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="pet-status">
            <div className="status-item">
              <span className="status-label">Mood:</span>
              <span className="status-value">{mood}</span>
            </div>
            
            <div className="status-item">
              <span className="status-label">Personality:</span>
              <span className="status-value">{dominantPersonality}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StatusDisplay;