import React, { useEffect, useState } from 'react';
import { clearGameData } from '../services/storageService';
// Import the constant from petReducer to show acceleration status
// In a real app you might want to move this to a shared config file
import { DEV_ACCELERATED_TIME } from '../game/state/petReducer';

const Debug: React.FC = () => {
  const [storage, setStorage] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the current localStorage state
    const data = localStorage.getItem('one-life-tamagotchi-state');
    setStorage(data);
  }, []);

  const handleClearStorage = () => {
    clearGameData();
    window.location.reload();
  };

  const debugStyles = {
    container: {
      position: 'fixed' as const,
      bottom: '10px',
      right: '10px',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '400px',
      overflow: 'auto',
      maxHeight: '300px'
    },
    button: {
      backgroundColor: 'red',
      color: 'white',
      border: 'none',
      padding: '5px 10px',
      borderRadius: '3px',
      cursor: 'pointer',
      marginTop: '10px'
    },
    timeinfo: {
      backgroundColor: DEV_ACCELERATED_TIME ? 'rgba(255, 165, 0, 0.3)' : 'rgba(0, 128, 0, 0.3)',
      padding: '5px',
      marginTop: '10px',
      borderRadius: '3px',
      fontSize: '11px'
    },
    pre: {
      whiteSpace: 'pre-wrap' as const,
      wordBreak: 'break-all' as const
    }
  };

  // Force a refresh of the pet's evolution
  const forceRefresh = () => {
    // This will trigger a state update and force the pet's evolution check
    window.location.reload();
  };
  
  // Force evolution by setting the birthTime to an earlier time
  const forceEvolution = () => {
    if (!storage) return;
    
    try {
      const data = JSON.parse(storage);
      if (!data.pet) return;
      
      // Set birthTime to one hour ago (or 1 second ago in ultra-fast mode)
      const newBirthTime = Date.now() - (1000 * 60 * 60); // 1 hour ago
      
      data.pet.birthTime = newBirthTime;
      localStorage.setItem('tamagotchi-game-state', JSON.stringify(data));
      
      // Reload to see changes
      window.location.reload();
    } catch (e) {
      console.error("Could not force evolution:", e);
    }
  };

  // Calculate time to next evolution based on pet data
  const calculateTimeToNextStage = (): string => {
    if (!storage) return "N/A";
    
    try {
      const data = JSON.parse(storage);
      if (!data.pet || !data.pet.birthTime) return "No pet data";
      
      const birthTime = data.pet.birthTime;
      const currentAge = DEV_ACCELERATED_TIME
        ? Math.floor((Date.now() - birthTime) / (1000 * 60))
        : Math.floor((Date.now() - birthTime) / (1000 * 60 * 60));
      
      // Evolution thresholds from reducer
      const stages = [
        { name: "egg", threshold: 0 },
        { name: "baby", threshold: 1 },
        { name: "child", threshold: 6 },
        { name: "teen", threshold: 24 },
        { name: "adult", threshold: 72 },
        { name: "elder", threshold: 168 }
      ];
      
      // Find current and next stage
      let currentStage = stages[0];
      let nextStage = stages[1];
      
      for (let i = 0; i < stages.length - 1; i++) {
        if (currentAge >= stages[i].threshold && currentAge < stages[i+1].threshold) {
          currentStage = stages[i];
          nextStage = stages[i+1];
          break;
        }
      }
      
      if (currentAge >= stages[stages.length-1].threshold) {
        return "Final stage reached (elder)";
      }
      
      const timeUntilNextStage = nextStage.threshold - currentAge;
      return `${currentStage.name} → ${nextStage.name} in ${timeUntilNextStage} ${DEV_ACCELERATED_TIME ? 'minutes' : 'hours'}`;
    } catch (e) {
      return "Error calculating";
    }
  };

  return (
    <div style={debugStyles.container}>
      <h3>Debug Info</h3>
      
      <div style={debugStyles.timeinfo}>
        <strong>Time Mode: {DEV_ACCELERATED_TIME ? 'ACCELERATED (60x)' : 'NORMAL'}</strong>
        <p>1 {DEV_ACCELERATED_TIME ? 'minute' : 'hour'} real time = 1 hour pet time</p>
        {storage && storage.includes('"pet"') && (
          <p>Evolution: {calculateTimeToNextStage()}</p>
        )}
        <div style={{display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap'}}>
          <button
            style={{...debugStyles.button, backgroundColor: 'orange', padding: '3px 6px', fontSize: '11px'}}
            onClick={forceRefresh}
          >
            Force Refresh/Check Evolution
          </button>
          
          {storage && storage.includes('"pet"') && (
            <button
              style={{...debugStyles.button, backgroundColor: 'purple', padding: '3px 6px', fontSize: '11px'}}
              onClick={forceEvolution}
            >
              Force Evolution to Baby
            </button>
          )}
        </div>
      </div>
      
      <p>Storage Status: {storage ? 'Exists' : 'Empty'}</p>
      {storage && (
        <>
          <pre style={debugStyles.pre}>
            {JSON.stringify(JSON.parse(storage), null, 2)}
          </pre>
          <button style={debugStyles.button} onClick={handleClearStorage}>
            Clear Storage & Reload
          </button>
        </>
      )}
      {!storage && (
        <p>No storage data found. App should show welcome screen.</p>
      )}
    </div>
  );
};

export default Debug;