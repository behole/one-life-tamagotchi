import React from 'react';
import { PetState } from '../../game/types';
import './Pet.css';

interface PetProps {
  pet: PetState;
}

const Pet: React.FC<PetProps> = ({ pet }) => {
  const { stage, mood, isSleeping, sprite } = pet;
  
  // Determine the CSS classes for animations and styling
  const petClasses = [
    'pet',
    `pet-${stage}`,
    `pet-${mood}`,
    isSleeping ? 'pet-sleeping' : '',
  ].filter(Boolean).join(' ');
  
  if (stage === 'egg') {
    return (
      <div className="pet-container">
        <div className={petClasses}>
          <div className="pet-sprite egg-sprite" data-sprite={sprite}>
            {isSleeping && <div className="pet-zzz">💤</div>}
          </div>
        </div>
      </div>
    );
  }

  // For other stages, use placeholder for now
  return (
    <div className="pet-container">
      <div className={petClasses}>
        <div className="pet-sprite" data-sprite={sprite}>
          <div className="pet-placeholder">
            <div className="pet-stage">{stage}</div>
            <div className="pet-mood">{mood}</div>
            {isSleeping && <div className="pet-zzz">💤</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pet;