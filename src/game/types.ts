export type PetStage = 'egg' | 'baby' | 'child' | 'teen' | 'adult' | 'elder';

export type PersonalityTrait = 'trusting' | 'wary' | 'playful' | 'serious' | 'disciplined' | 'rebellious';

export type Mood = 'happy' | 'sad' | 'neutral' | 'excited' | 'tired' | 'sick' | 'hungry' | 'angry';

export interface NeedsState {
  hunger: number;      // 0-100, 0 = starving, 100 = full
  cleanliness: number; // 0-100, 0 = dirty, 100 = clean
  energy: number;      // 0-100, 0 = exhausted, 100 = well-rested
  health: number;      // 0-100, 0 = sick, 100 = healthy
  happiness: number;   // 0-100, 0 = sad, 100 = happy
  discipline: number;  // 0-100, 0 = disobedient, 100 = disciplined
}

export interface PetEvolutionPath {
  path: 'balanced' | 'intellectual' | 'athletic' | 'social';
  requirements: Partial<NeedsState> & {
    age: number;
    dominantPersonality?: PersonalityTrait;
  };
}

export interface PetState {
  id: string;
  name: string;
  stage: PetStage;
  evolutionPath?: PetEvolutionPath['path'];
  birthTime: number; // timestamp
  lastInteractionTime: number; // timestamp
  needs: NeedsState;
  personalities: Record<PersonalityTrait, number>; // 0-100 values for each trait
  mood: Mood;
  isSleeping: boolean;
  isDead: boolean;
  deathCause?: string;
  deathTime?: number;
  sprite: string; // Reference to current sprite
}

export interface GameAction {
  type: 'feed' | 'clean' | 'sleep' | 'medicine' | 'play' | 'train';
  value?: number;
  timestamp: number;
}

export interface GameState {
  pet: PetState | null;
  isPermanentlyDead: boolean;
  actionHistory: GameAction[];
  gameStartTime: number;
  lastSavedTime: number;
}