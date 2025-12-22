# Performance Notes - Wordy Weapon

## Platform Observations (Dec 22, 2025)

### Mac (M4 Pro 20-core)
- **Crate Reel Animation**: Sluggish compared to Windows
  - Location: `script.js:showCrateReelAnimation()` (~line 21011)
  - Creates 20 DOM elements per reel with CSS `translateY` transforms
  - Spinning animation uses continuous transform updates
  - May be GPU compositing differences between platforms

### Windows (RTX 3070)
- **First Word Slot Placement**: Initial lag
  - Location: `script.js` warmup section (~line 8470-8610)
  - Pre-warming includes audio buffer decoding and Web Audio node creation
  - Audio JIT compilation may still cause first-use lag
  - Workaround: Hidden forge simulation runs during load

## Potential Investigations

1. **Crate Reels (Mac)**:
   - Consider `will-change: transform` on reel strips
   - Could batch DOM creation before animation
   - GPU layer promotion with `transform: translateZ(0)`

2. **First Word Slot (Windows)**:
   - Audio buffer decode is async but may not complete before first interaction
   - Web Audio StereoPanner nodes JIT-compiled on first use
   - Could extend warmup delay or add loading indicator

## Architecture Context

Both animations rely on:
- FLIP (First, Last, Invert, Play) animation pattern
- Web Audio API for sound effects
- Canvas particle effects (ember/spark bursts)

The game pre-warms these systems during initial load (`initLoadingSequence()`), but platform differences in GPU scheduling and audio driver latency cause varying results.
