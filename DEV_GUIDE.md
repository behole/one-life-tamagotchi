# One Life Tamagotchi - Developer Guide

## Evolution Timeline

Your Tamagotchi pet goes through several life stages as it ages:

| Stage | Age Range | Description |
|-------|-----------|-------------|
| Egg   | 0-1 hours | The initial stage after pet creation |
| Baby  | 1-6 hours | After hatching from the egg |
| Child | 6-24 hours | Growing up (1 day) |
| Teen  | 24-72 hours | Adolescent phase (1-3 days) |
| Adult | 72-168 hours | Prime years (3-7 days) |
| Elder | 168+ hours | Older stage (7+ days) |

## Time Cycle Mechanics

- The app checks for state changes and updates every minute
- Needs decay at different rates over time (hunger, energy, etc.)
- The pet's stage is determined by calculating its age (time since birth)

## Development Acceleration

To help with development and testing, we've added two time acceleration features:

```typescript
// In petReducer.ts
export const DEV_ACCELERATED_TIME = true;
const ULTRA_FAST_TESTING = true;
```

### Standard Acceleration Mode

When only `DEV_ACCELERATED_TIME` is set to `true`:
- 1 minute of real time = 1 hour of pet time (60x acceleration)
- Your egg will hatch after just 1 minute
- The baby stage will last 5 minutes
- The child stage will last 18 minutes
- And so on...

### Ultra-Fast Acceleration Mode

For even faster testing, we've added an ULTRA_FAST_TESTING mode:

When both `DEV_ACCELERATED_TIME` and `ULTRA_FAST_TESTING` are set to `true`:
- 1 second of real time = 1 hour of pet time (3600x acceleration!)
- Your egg will hatch after just 1 second
- The baby stage will last 5 seconds
- The child stage will last 18 seconds
- And so on...

This ultra-fast mode is perfect for quickly verifying evolution stages and other time-dependent features during development.

This allows you to test all life stages and features without waiting hours or days.

### Evolution Timeline with Acceleration

| Stage | Regular Time | With Acceleration |
|-------|--------------|-------------------|
| Egg   | 1 hour | 1 minute |
| Baby  | 5 hours | 5 minutes |
| Child | 18 hours | 18 minutes |
| Teen  | 48 hours | 48 minutes |
| Adult | 96 hours | 96 minutes |
| Elder | 168+ hours | 168+ minutes |

## To Disable Time Acceleration

For production or to test the actual timing:

1. Change `DEV_ACCELERATED_TIME` to `false` in `petReducer.ts`
2. Rebuild the application

## Notes on State Changes

- The pet's state (needs, mood, etc.) updates every minute regardless of acceleration setting
- When the pet evolves to a new stage, its sprite will automatically update
- Health effects are calculated based on the pet's needs, so neglect will cause health problems faster in accelerated mode