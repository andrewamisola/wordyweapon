# ART - Wordy Weapon

> **Owner**: Art Subagent
> **Last Updated**: 2024-12-20
> **Status**: Stable

## Document Purpose
Visual effects, CSS styling, hero/enemy portraits, talent icons, audio direction, and UI/UX patterns. This is the authoritative reference for all art and audio direction.

---

## Quick Reference

### Element Colors
| Element | Hex | Usage |
|---------|-----|-------|
| Physical | #94a3b8 | Slate gray |
| Poison | #84cc16 | Lime green |
| Fire | #f97316 | Orange |
| Water | #3b82f6 | Blue |
| Light | #fbbf24 | Amber/gold |
| Dark | #6b21a8 | Purple |
| Earth | #78716c | Stone gray |
| Lightning | #facc15 | Yellow |

### Rarity Glow Colors
| Tier | Color | Effect |
|------|-------|--------|
| T1 Common | #d4af37 (gold) | Minimal glow |
| T2 Uncommon | #06b6d4 (cyan) | Medium glow |
| T3 Rare | #9333ea (purple) | Strong glow + particles |

### Standard SVG ViewBox
- Weapons & Talents: `100×130`
- Portraits: Various (inline in PORTRAITS object)

---

## Visual Direction

### Art Style: 1980s-90s Choose Your Own Adventure
**Key Characteristics:**
- Pen and ink crosshatching
- Limited, dramatic color palettes
- Slightly rough, hand-drawn quality
- Nostalgic fantasy book art feel
- High contrast lighting
- Detailed linework on textures

### Base Prompt Template
> "In the style of 1980s-1990s Choose Your Own Adventure book illustrations, pen and ink crosshatching with limited color palette, dramatic lighting, slightly rough hand-drawn quality, nostalgic fantasy book art"

---

## Hero Portraits

### Graham Moor
> "A weathered middle-aged warrior in battered plate armor, broad-shouldered and resolute, holding a notched longsword, earth-toned palette with rust and bronze accents, stoic expression showing years of duty, crosshatched shadows on armor plates, 1980s fantasy book illustration style"

### Quivera
> "A lithe elven ranger with sharp features and alert eyes, leather armor with lightning bolt motifs, holding a recurve bow, windswept hair, standing in a dramatic pose against stormy sky, blue and silver color palette, detailed crosshatching on leather textures, vintage fantasy illustration"

### Belle Lettres
> "A young noblewoman scholar in flowing robes adorned with book and quill motifs, surrounded by floating arcane tomes, large curious eyes, sheltered but eager expression, warm candlelight colors with purple and gold accents, intricate pen work on fabric folds, 80s fantasy art style"

### Alexandria Constanza
> "A stern holy knight in gleaming white and gold armor, wielding a heavy mace wreathed in divine light, strong jawline, righteous determination in her eyes, radiant halo effect, high contrast lighting, dramatic ink crosshatching, classic Choose Your Own Adventure illustration"

### Caesura
> "A shadowy figure in dark leather, face half-obscured by hood, twin daggers dripping with poison, one visible eye glinting with deadly intent, emerging from darkness, deep purple and black palette with green poison accents, heavy shadows and fine crosshatching, 1990s dark fantasy style"

### Reed
> "An androgynous nature mystic with bark-like skin patterns, moss in their wild hair, wooden staff wrapped in living vines, serene earth-mother expression, surrounded by leaves and water droplets, green and brown palette, organic flowing linework, vintage fantasy illustration"

---

## Backdrop Prompts

### The Kingdom of Verbia
> "A grand medieval kingdom built from giant books and scrolls, towers made of stacked tomes, flags bearing quill and inkwell heraldry, cobblestone streets lined with bookshops, scholars and knights walking together, warm golden afternoon light, detailed architectural crosshatching, panoramic fantasy cityscape"

### The Great Library
> "An impossibly vast library interior stretching into infinity, towering shelves reaching into darkness above, rolling ladders and spiral staircases, floating candles providing warm light, dust motes in light beams, cathedral-like scale, intricate pen and ink detail on book spines, dramatic perspective"

### Prosa (The Wilds)
> "A twisted enchanted forest where trees grow in the shape of letters, glowing runes carved into bark, mist rolling between gnarled trunks, bioluminescent fungi, ancient stone monuments covered in illegible script, eerie green and purple twilight, dense crosshatched foliage"

### The Erratum Wastes
> "A corrupted landscape where reality breaks down into scattered letters and broken words, floating fragments of destroyed pages, ink-black sky with torn paper clouds, skeletal remains of civilization, ominous red and black palette, chaotic yet detailed linework, apocalyptic fantasy scene"

---

## Talent Icons

### Design Principles
1. **Clear silhouette**: Recognizable at small sizes
2. **Central focal point**: Main element in center
3. **Thematic connection**: Visual relates to talent name/effect
4. **Rarity indication**: T3 elaborate, T1 simpler

### Color Palette by Category
| Category | Colors |
|----------|--------|
| Generators (+W) | Gold/Amber (#d4af37, #c9a227, #8b6914) |
| Multipliers (×M) | Purple/Violet (#9333ea, #7c3aed, #581c87) |
| Retriggers (REREAD) | Cyan/Teal (#06b6d4, #0891b2, #0e7490) |
| Converters | Green (#22c55e, #16a34a, #15803d) |
| Thresholds | Orange/Red (#f97316, #ea580c, #c2410c) |
| Effects | Pink/Magenta (#ec4899, #db2777, #be185d) |

### SVG Template
```svg
<svg viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="talent-main" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="MAIN_COLOR"/>
      <stop offset="100%" stop-color="SHADOW_COLOR"/>
    </linearGradient>
    <radialGradient id="talent-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="GLOW_COLOR" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="GLOW_COLOR" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <!-- Background glow -->
  <ellipse cx="50" cy="65" rx="45" ry="55" fill="url(#talent-glow)" opacity="0.3"/>
  <!-- Main shape -->
  <g id="talent-main-shape">...</g>
  <!-- Details -->
  <g id="talent-details">...</g>
</svg>
```

### Implementation Order
1. T3 talents (12) - Most visible
2. New T1 talents (11) - Need icons first
3. Renamed talents
4. Remaining T2/T1

---

## VFX System

### Particle Categories
- **Orbiting**: Circle around target
- **Swarm**: Cluster movement
- **Sparks**: Burst outward
- **Embers**: Float upward

### CSS Animation Patterns
- Paper grain overlay (SVG turbulence)
- Ink vignette (radial gradient)
- Flame background (dynamic mouse tracking)
- God rays (CSS blend modes)

### Performance Guidelines
- Use `transform: translate3d()` for GPU acceleration
- Set `will-change: transform, opacity` on particles
- Avoid `.style.left/.top` per frame
- Low FX mode toggle for accessibility

---

## Audio Direction

### Music Engine (Tone.js)
- Dynamic layering based on forge elements
- Shop mode: Jazzy drums + low-pass filter
- Battle mode: Layer switching
- Victory: All instruments enabled
- Lose: Pitch bend + slow down

### SFX Categories
| Type | Examples |
|------|----------|
| UI | Click, hover, select |
| Combat | Element hits, damage, victory |
| Ambient | Shop, forge |

### Spatial Audio
- Hero babble: Pan left (-0.7)
- Enemy babble: Pan right (+0.7)
- Master/Music/SFX separate volume controls

---

## UI/UX

### Screen Layouts
- **Main Menu**: Hero carousel, difficulty picker
- **Battle**: Portrait containers, health bars, forge button
- **Forge**: 6 word slots, inventory, AP preview
- **Shop**: Crate cards, word bank, consumables

### Graphics Settings
- Brightness slider: 80-150% (HDR support)
- Low FX toggle
- Volume controls (Master/Music/SFX)

### Toast Notification System - "Ember Notice"

**Design Concept**: Modern, clean toast notifications with subtle dark fantasy forge accents. Focused on readability and unobtrusive communication.

**Visual Philosophy**:
- Clean elevated card design with glassmorphic backdrop
- Minimal ornamentation - let content speak
- Subtle forge theme through golden accents and glows
- High readability with excellent contrast
- Modern rounded corners (12px) instead of medieval aesthetic
- Refined, polished appearance

**Visual Features**:
- Clean gradient background (darker grey tones)
- Enhanced backdrop blur (16px) with saturation boost
- Subtle inset highlight for depth
- Minimal 1px border with low opacity
- 3px colored left border for type indication
- Modern rounded icon badge (8px border-radius) instead of circular seal
- Thin 2px progress bar (down from 3px)
- Subtle radial glow on hover (top-right origin)

**Animation System**:
1. **Entrance** (1.5 beats):
   - Smooth slide from right with slight upward motion
   - No scale change - just translate
   - Smooth cubic-bezier easing for polished feel
   - Icon pops in with gentle bounce (delayed 0.25 beat)
   - Less dramatic than previous "stamp" effect

2. **Hover**:
   - Lifts up 2px
   - Border brightens slightly
   - Subtle inner glow fades in
   - Icon scales 1.05x (minimal, refined)

3. **Exit** (0.5 beat):
   - Quick slide right with slight upward motion
   - Fast fade out
   - Clean, efficient dismissal

**Typography**:
- Title: EB Garamond, 15px (down from 16px), bold (700), subtle shadow
- Message: Gill Sans, 12.5px (down from 13px), lighter color (#cbd5e1)
- Button: Gill Sans, 11.5px (down from 12px), bold (700), uppercase, 0.6px letter spacing
- All text shadows reduced for cleaner appearance

**Color System**:
- **Base Border**: rgba(255,255,255,0.1) - neutral white with low opacity
- **Success**: #4ade80 (green) with 3px left border
- **Error**: #f87171 (red) with 3px left border
- **Warning**: #fbbf24 (amber) with 3px left border
- **Info**: #60a5fa (blue) with 3px left border
- **Icon backgrounds**: 12% opacity of type color
- **Icon borders**: 20-25% opacity of type color

**Progress Bars**:
- Default: Gold gradient (#fbbf24 → #f59e0b) - simplified from 3-color
- Success: Green gradient (#4ade80 → #22c55e)
- Error: Red gradient (#f87171 → #ef4444)
- Info: Blue gradient (#60a5fa → #3b82f6)
- Reduced glow intensity for subtlety

**Button Design** - Clean modern style:
- Single gradient background (simplified)
- 1px border (down from 1.5px)
- Minimal shadows with subtle inset highlight
- Reduced text shadow
- Hover: Lifts 1px (down from 2px), border intensifies
- Active: Pressed effect with inset shadow

**Icon Design** - Modern badge:
- 32px square badge with 8px border-radius (was 28px circle)
- 18px SVG icon (up from 16px for better visibility)
- Rounded square feels more modern and UI-friendly
- Type-specific background colors at 12% opacity
- Subtle border at 20% opacity

**Layout**:
- Position: Top-right (80px from top, 24px from right)
- Max width: 380px (down from 400px)
- Stacking gap: 10px (down from 12px for tighter stack)
- Internal padding: 14px × 16px (slightly reduced)
- Icon size: 32px square with 8px radius, 18px SVG
- Content gap: 12px (down from 14px)
- Body uses flex-column with 4px gap for tighter spacing

**Rhythm-Based Timing**:
- Entrance: 1.5 beats (662ms) - slower, more refined
- Icon pop delay: 0.25 beat (110ms) - quicker
- Icon pop duration: 1.2 beats (529ms)
- Exit: 0.5 beat (221ms)
- Hover transitions: 0.25 beat (110ms)

**Accessibility**:
- Excellent contrast ratios for WCAG AA compliance
- Clear visual hierarchy with proper spacing
- Clickable anywhere to dismiss
- Auto-dismiss with visible progress indicator
- Positioned away from combat UI
- Readable at a glance without visual clutter

**Design Improvements Over Previous Version**:
- Removed ornate "forge scroll" decorations
- Cleaner, more modern aesthetic
- Better readability with improved typography
- Faster visual comprehension
- Less visual weight and distraction
- More professional, polished appearance
- Easier to scan multiple toasts

---

## Implementation Status

| Asset | Status | Notes |
|-------|--------|-------|
| Hero Portraits | Done | Inline SVGs |
| Enemy Portraits | Done | 15 common + 5 bosses |
| Talent Icons | Planned | 50+ needed |
| VFX | Done | Particle systems working |
| Audio | Done | Tone.js + samples |
| Toast Notifications | Done | "Ember Notice" v2 - stacking, progress bar, auto-dismiss |

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-12-20 | Implemented "Ember Notice" v2 toast system in game/styles.css and game/script.js | Manager |
| 2025-12-20 | Complete redesign of toast notification system - "Ember Notice" v2 (clean, modern, readable) | Art Subagent |
| 2024-12-20 | Complete redesign of toast notification system - "Forge Scroll" aesthetic | Art Subagent |
| 2024-12-20 | Initial creation from docs restructure | Documentation Team |
