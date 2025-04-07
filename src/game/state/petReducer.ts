import { GameAction, GameState, Mood, NeedsState, PetStage, PetState } from '../types';
import { v4 as uuidv4 } from 'uuid'; // We'll need to install this package later

// Initial states
export const initialNeedsState: NeedsState = {
  hunger: 70,
  cleanliness: 100,
  energy: 100,
  health: 100,
  happiness: 70,
  discipline: 50
};

export const createNewPet = (name: string): PetState => ({
  id: uuidv4(),
  name,
  stage: 'egg',
  birthTime: Date.now(),
  lastInteractionTime: Date.now(),
  needs: initialNeedsState,
  personalities: {
    trusting: 50,
    wary: 50,
    playful: 50,
    serious: 50,
    disciplined: 50,
    rebellious: 50
  },
  mood: 'neutral',
  isSleeping: false,
  isDead: false,
  sprite: 'egg_default'
});

export const initialGameState: GameState = {
  pet: null,
  isPermanentlyDead: false,
  actionHistory: [],
  gameStartTime: 0,
  lastSavedTime: 0
};

// Helper functions
// Set this to true for development to speed up evolution (1 minute = 1 hour)
export const DEV_ACCELERATED_TIME = true;

// For testing - configurable time acceleration
const ULTRA_FAST_TESTING = true;

// Time configuration constants
// These define how real time translates to pet time
export const TIME_CONFIG = {
  // In ULTRA_FAST mode: X seconds = 1 hour
  ULTRA_FAST_SECONDS_PER_HOUR: 10, // 10 seconds = 1 hour (more gradual evolution)
  
  // In regular accelerated mode: X minutes = 1 hour
  ACCELERATED_MINUTES_PER_HOUR: 1, // 1 minute = 1 hour
  
  // Update frequency in milliseconds
  UPDATE_INTERVAL: ULTRA_FAST_TESTING ? 2000 : 10000 // 2 sec in ultra-fast, 10 sec in accelerated
};

// Track accumulated time for more accurate evolution
let accumulatedTime = 0;

export const calculateAge = (birthTime: number): number => {
  const now = Date.now();
  const ageInMs = now - birthTime;
  
  // Ultra fast mode (configurable seconds per hour)
  if (ULTRA_FAST_TESTING && DEV_ACCELERATED_TIME) {
    const secondsSinceBirth = ageInMs / 1000;
    const petHours = secondsSinceBirth / TIME_CONFIG.ULTRA_FAST_SECONDS_PER_HOUR;
    accumulatedTime += petHours;
    
    // Only log significant time changes
    if (Math.floor(petHours) > Math.floor(accumulatedTime - petHours)) {
      console.log(`Age: ${Math.floor(accumulatedTime)} hours (${Math.floor(accumulatedTime/24)} days)`);
    }
    
    return Math.floor(accumulatedTime);
  }
  
  if (DEV_ACCELERATED_TIME) {
    const minutesSinceBirth = ageInMs / (1000 * 60);
    const petHours = minutesSinceBirth / TIME_CONFIG.ACCELERATED_MINUTES_PER_HOUR;
    accumulatedTime += petHours;
    return Math.floor(accumulatedTime);
  }
  
  // Normal mode: Age in hours
  const realHours = ageInMs / (1000 * 60 * 60);
  accumulatedTime += realHours;
  return Math.floor(accumulatedTime);
};

export const determineEvolutionStage = (pet: PetState): PetStage => {
  const age = calculateAge(pet.birthTime);
  let newStage: PetStage = 'egg';
  
  // Evolution thresholds in pet hours
  const thresholds = {
    egg: 0,
    baby: 1,    // 1 hour
    child: 6,   // 6 hours
    teen: 24,   // 1 day
    adult: 72,  // 3 days
    elder: 168  // 7 days
  };
  
  // Determine stage based on age
  if (age >= thresholds.elder) {
    newStage = 'elder';
  } else if (age >= thresholds.adult) {
    newStage = 'adult';
  } else if (age >= thresholds.teen) {
    newStage = 'teen';
  } else if (age >= thresholds.child) {
    newStage = 'child';
  } else if (age >= thresholds.baby) {
    newStage = 'baby';
  }
  
  // Enhanced logging for evolution checks
  if (newStage !== pet.stage) {
    console.log(`
🔄 Evolution Check:
- Current Age: ${age.toFixed(1)} hours (${(age/24).toFixed(1)} days)
- Previous Stage: ${pet.stage}
- New Stage: ${newStage}
- Next Evolution: ${getNextEvolutionTime(age, thresholds)} hours
`);
  }
  
  return newStage;
};

// Helper function to calculate time until next evolution
const getNextEvolutionTime = (currentAge: number, thresholds: Record<string, number>): string => {
  const nextThresholds = Object.values(thresholds)
    .filter(threshold => threshold > currentAge)
    .sort((a, b) => a - b);
  
  if (nextThresholds.length === 0) {
    return "Final stage reached";
  }
  
  const nextThreshold = nextThresholds[0];
  return `${(nextThreshold - currentAge).toFixed(1)} hours until ${
    Object.entries(thresholds).find(([_, value]) => value === nextThreshold)?.[0]
  }`;
};

export const determineMood = (needs: NeedsState): Mood => {
  if (needs.health < 30) return 'sick';
  if (needs.hunger < 20) return 'hungry';
  if (needs.energy < 20) return 'tired';
  if (needs.happiness < 20) return 'sad';
  if (needs.happiness > 80) return 'happy';
  if (needs.happiness > 90) return 'excited';
  if (needs.cleanliness < 20) return 'angry';
  return 'neutral';
};

export const calculatePersonalityShift = (
  action: GameAction,
  currentPersonalities: PetState['personalities']
): PetState['personalities'] => {
  const newPersonalities = { ...currentPersonalities };
  
  switch (action.type) {
    case 'feed':
      newPersonalities.trusting = Math.min(100, newPersonalities.trusting + 1);
      newPersonalities.wary = Math.max(0, newPersonalities.wary - 0.5);
      break;
    case 'clean':
      newPersonalities.disciplined = Math.min(100, newPersonalities.disciplined + 0.5);
      break;
    case 'play':
      newPersonalities.playful = Math.min(100, newPersonalities.playful + 1);
      newPersonalities.serious = Math.max(0, newPersonalities.serious - 0.5);
      break;
    case 'train':
      newPersonalities.disciplined = Math.min(100, newPersonalities.disciplined + 1);
      newPersonalities.rebellious = Math.max(0, newPersonalities.rebellious - 0.5);
      break;
    case 'medicine':
      // No personality changes
      break;
    case 'sleep':
      // No personality changes
      break;
  }
  
  return newPersonalities;
};

// Life simulation - needs decay over time
export const simulateTimePassing = (state: GameState, currentTime: number): GameState => {
  if (!state.pet || state.pet.isDead) return state;
  
  const { pet } = state;
  
  // Calculate time passed since last interaction
  const timeSinceLastInteraction = currentTime - pet.lastInteractionTime;
  let hoursPassed;
  
  // Calculate hours passed based on mode
  if (ULTRA_FAST_TESTING && DEV_ACCELERATED_TIME) {
    const secondsPassed = timeSinceLastInteraction / 1000;
    hoursPassed = secondsPassed / TIME_CONFIG.ULTRA_FAST_SECONDS_PER_HOUR;
    
    // Minimal time logging
    if (Math.floor(hoursPassed) > 0) {
      console.log(`Time passed: ${Math.floor(hoursPassed)}h`);
    }
  } else if (DEV_ACCELERATED_TIME) {
    const minutesPassed = timeSinceLastInteraction / (1000 * 60);
    hoursPassed = minutesPassed / TIME_CONFIG.ACCELERATED_MINUTES_PER_HOUR;
  } else {
    hoursPassed = timeSinceLastInteraction / (1000 * 60 * 60);
  }
  
  // Don't decay needs if very little time has passed
  // In accelerated mode, this is a very short time
  const minimumTimeCheck = DEV_ACCELERATED_TIME ? 0.001 : 0.01; // Much shorter threshold in dev mode
  if (hoursPassed < minimumTimeCheck) return state;
  
  const newNeeds = { ...pet.needs };
  
  // Decay rates (already adjusted via hoursPassed calculation)
  const multiplier = 1;
  
  const decayRates: NeedsState = {
    hunger: 5 * hoursPassed * multiplier,
    cleanliness: 3 * hoursPassed * multiplier,
    energy: pet.isSleeping ? -20 * hoursPassed * multiplier : 4 * hoursPassed * multiplier, // Increased energy gain when sleeping
    health: 0, // Health doesn't naturally decay
    happiness: 2 * hoursPassed * multiplier,
    discipline: 1 * hoursPassed * multiplier
  };
  
  // Apply decay
  newNeeds.hunger = Math.max(0, newNeeds.hunger - decayRates.hunger);
  newNeeds.cleanliness = Math.max(0, newNeeds.cleanliness - decayRates.cleanliness);
  newNeeds.energy = Math.max(0, Math.min(100, newNeeds.energy - decayRates.energy));
  newNeeds.happiness = Math.max(0, newNeeds.happiness - decayRates.happiness);
  newNeeds.discipline = Math.max(0, newNeeds.discipline - decayRates.discipline);
  
  // Health effects from needs
  if (newNeeds.hunger < 20 || newNeeds.cleanliness < 20) {
    newNeeds.health = Math.max(0, newNeeds.health - 5 * hoursPassed);
  }
  
  // Check if pet has died and handle evolution
  let isDead = pet.isDead;
  let deathCause;
  let deathTime;
  
  // Calculate age and determine evolution stage
  const petAge = calculateAge(pet.birthTime);
  const tempPet = { ...pet, birthTime: pet.birthTime };
  const newStage = determineEvolutionStage(tempPet);
  const mood = determineMood(newNeeds);
  
  // Death conditions
  if (newNeeds.health <= 0) {
    isDead = true;
    deathCause = 'Died from illness';
    deathTime = currentTime;
  } else if (newNeeds.hunger <= 0 && hoursPassed > 24) {
    isDead = true;
    deathCause = 'Died from starvation';
    deathTime = currentTime;
  } else if (pet.stage === 'elder') {
    // Elder mortality system
    const elderAgeInDays = petAge / 24;
    const daysAsElder = elderAgeInDays - 7; // Elder stage starts at 7 days
    
    // Mortality increases with age
    const baseMortalityRate = 0.005; // 0.5% chance per hour
    const ageMultiplier = Math.max(1, daysAsElder / 2); // Doubles every 2 days as elder
    const mortalityChance = baseMortalityRate * ageMultiplier * hoursPassed;
    
    if (Math.random() < mortalityChance) {
      isDead = true;
      deathCause = 'Died peacefully of old age';
      deathTime = currentTime;
      console.log(`Elder passed away at ${Math.floor(petAge/24)} days old`);
    }
  }
  
  // Only log stage changes
  if (newStage !== pet.stage) {
    console.log(`Evolution: ${pet.stage} → ${newStage} (Age: ${petAge}h)`);
  }
  
  // Update pet state
  const updatedPet: PetState = {
    ...pet,
    stage: newStage,
    needs: newNeeds,
    mood,
    lastInteractionTime: currentTime,
    isDead,
    deathCause,
    deathTime
  };
  
  // Update pet sprite if stage changed
  if (newStage !== pet.stage) {
    // Basic sprite mapping based on stage and evolution path (or default)
    updatedPet.sprite = pet.evolutionPath 
      ? `${newStage}_${pet.evolutionPath}` 
      : `${newStage}_default`;
  }
  
  return {
    ...state,
    pet: updatedPet,
    isPermanentlyDead: isDead, // Once dead, always dead in this game
    lastSavedTime: currentTime
  };
};

// Reducer for handling pet actions
export const gameReducer = (state: GameState, action: GameAction): GameState => {
  if (!state.pet || state.pet.isDead) return state;
  
  const { pet } = state;
  const updatedNeeds = { ...pet.needs };
  const currentTime = action.timestamp || Date.now();
  
  // First simulate time passing
  const timePassedState = simulateTimePassing(state, currentTime);
  if (timePassedState.pet?.isDead) return timePassedState;
  
  // Then apply the specific action
  switch (action.type) {
    case 'feed':
      updatedNeeds.hunger = Math.min(100, updatedNeeds.hunger + 30);
      updatedNeeds.happiness = Math.min(100, updatedNeeds.happiness + 5);
      break;
      
    case 'clean':
      updatedNeeds.cleanliness = 100;
      updatedNeeds.happiness = Math.min(100, updatedNeeds.happiness + 5);
      break;
      
    case 'sleep':
      // Toggle sleep state
      const isSleeping = !timePassedState.pet?.isSleeping;
      if (isSleeping) {
        // Bigger initial boost when going to sleep
        updatedNeeds.energy = Math.min(100, updatedNeeds.energy + 15);
        console.log(isSleeping ? "Sleeping" : "Awake");
      }
      return {
        ...timePassedState,
        pet: {
          ...timePassedState.pet!,
          isSleeping,
          lastInteractionTime: currentTime
        },
        actionHistory: [
          ...timePassedState.actionHistory,
          action
        ],
        lastSavedTime: currentTime
      };
      
    case 'medicine':
      if (updatedNeeds.health < 80) {
        updatedNeeds.health = Math.min(100, updatedNeeds.health + 20);
      }
      break;
      
    case 'play':
      updatedNeeds.happiness = Math.min(100, updatedNeeds.happiness + 20);
      updatedNeeds.energy = Math.max(0, updatedNeeds.energy - 10);
      updatedNeeds.hunger = Math.max(0, updatedNeeds.hunger - 5);
      break;
      
    case 'train':
      updatedNeeds.discipline = Math.min(100, updatedNeeds.discipline + 15);
      updatedNeeds.energy = Math.max(0, updatedNeeds.energy - 10);
      updatedNeeds.happiness = Math.max(0, updatedNeeds.happiness - 5); // Training is work!
      break;
  }
  
  // Update personalities based on action
  const updatedPersonalities = calculatePersonalityShift(
    action,
    timePassedState.pet!.personalities
  );
  
  // Update mood based on new needs
  const mood = determineMood(updatedNeeds);
  
  return {
    ...timePassedState,
    pet: {
      ...timePassedState.pet!,
      needs: updatedNeeds,
      personalities: updatedPersonalities,
      mood,
      lastInteractionTime: currentTime
    },
    actionHistory: [
      ...timePassedState.actionHistory,
      action
    ],
    lastSavedTime: currentTime
  };
};