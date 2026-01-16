# Wordy Weapon - AI Context

## What is this?
Word-crafting roguelike RPG where players forge weapons from words to defeat enemies. Electron desktop game with Steam integration.

## Stack
- Pure HTML/CSS/JavaScript (no frameworks)
- Electron for desktop wrapper
- Tone.js for procedural music
- Steamworks.js for achievements/cloud saves

## Key Files
```
game/script.js     # ALL game logic (21K+ lines, 1MB)
game/styles.css    # Styling (150KB)
game/index.html    # HTML structure
electron/main.js   # Desktop wrapper
electron/preload.js # Steam bridge
```

## Commands
| Command | What it does |
|---------|--------------|
| `cd electron && npm start` | Run dev build |
| `npm run build-steam` | Build Mac + Win |
| `npm run build-itch` | Web build |
| `npm run build-mac` | Mac only |
| `npm run build-win` | Windows only |

## Build Output Paths
```
electron/dist/mac-universal/     # Mac build output
electron/dist/win-unpacked/      # Windows build output (DO NOT use "win-unpacked" in zip names)
electron/dist/WordyWeapon-Mac.zip   # Zipped Mac build
electron/dist/WordyWeapon-Win.zip   # Zipped Windows build
```

When copying to external drive (T7), use a consistent folder name like:
- `/Volumes/T7/WordyWeapon-Patch-YYYY-MM-DD/`

## Domain Contexts
When working on specific areas, load the relevant context:
- `cat .claude/domains/calc.md` - Combat/damage calculation
- `cat .claude/domains/ui.md` - User interface components
- `cat .claude/domains/audio.md` - Music engine & sound effects
- `cat .claude/domains/persistence.md` - Save/load & Steam Cloud
- `cat .claude/domains/build.md` - Build pipeline & deployment

## Architecture Rules
1. **Single source of truth**: `game/` folder is authoritative. Electron dev mode uses `../game/`
2. **Global state**: `S` object for run state, `PStats` for persistent stats
3. **No frameworks**: Keep it vanilla JS. Don't add React/Vue/etc.
4. **Fixed resolution**: Game renders at 1920x1080, scaled via Electron zoom

## Code Style
- Functions use camelCase
- Constants use UPPER_SNAKE_CASE
- DOM elements cached as `el` prefix (e.g., `elWordBank`)
- Use `requestAnimationFrame` for animations, never `setInterval`
- Use `transform: translate3d()` for animations, avoid `top/left`

## Important Constants
```javascript
IS_DEMO = false          // Toggle for demo build restrictions
GAME_WIDTH = 1920
GAME_HEIGHT = 1080
BPM = 136               // Music tempo (UI animations sync to beats)
```

## Current Status
**VERSION 1.0 RELEASED** (January 6, 2026)
- Live on Steam - full game and demo available
- All 6 heroes, 6 bosses, 8 elements, 3 difficulties
- Steam achievements and cloud saves working

### Launch Stats (as of Jan 6, 2026)
- 3 purchases
- ~125 wishlists
- Keys distributed to select players

---

## Changelog

### Next Patch (TBD)
_Tracking changes for next release. See `.claude/TASKS.md` for bug audit._

---

### Day One Patch (2026-01-08)
**New:**
- Shop tools now usable directly in shop (auto-apply on single word selection)

**Balance:**
- Talents use triangular scaling for upgrades (×1 → ×2 → ×4 → ×7 → ×11...)
- Overflow buffed: ×1.25 → ×1.5 per level
- Adjective talents split value among adjectives (synergizes with REREAD)
- Residual reworked: +10 AP per ×1 Multiplier
- Tool prices reset each shop visit
- Tool reroll increases prices (capped at 999g)

**QoL:**
- Large numbers in combat breakdown show commas
- Improved REREAD badge display
- Reduced floating badge clutter during tally

---

### Post-Launch Strategy
1. **Stabilization phase** - Let players find bugs/issues
2. **Week 1 patch** - Batch fixes based on player feedback
3. **Roadmap** - New features once foundation is stable

### Potential Future Features
- _To be determined based on player feedback_
- _Add roadmap items here as they're planned_

## Session Management

**Before clearing/compacting**, update the handoff file:
- Edit `.claude/HANDOFF.md` with current task state
- Update `SESSION_STATE.md` with what was implemented
- **Update the Changelog above** with timestamped entries of what was done

### Handoff Checklist
1. Add timestamped entries to **Changelog** section above (include date: YYYY-MM-DD)
2. Update `.claude/HANDOFF.md` with:
   - What was being worked on
   - Current state (completed/in-progress)
   - Key decisions made
   - Files modified with timestamps
3. List any pending tasks or known issues

### Timestamp Format
Always use: `YYYY-MM-DD HH:MM` (24hr) for logging, e.g., `2026-01-08 21:15`

Helper scripts (optional):
```bash
# Unix/Mac
.claude/hooks/session-save.sh

# Windows
.claude\hooks\session-save.bat
```

The next session should read `HANDOFF.md` and `SESSION_STATE.md` to resume.

**After completing a handoff task**, clear the handoff:
```bash
# Unix/Mac
rm .claude/HANDOFF.md

# Windows
del .claude\HANDOFF.md
```

## Response Format

When completing a task or investigating an issue, always explain:

1. **Mission** - What was I asked to do?
2. **Found** - What did I discover/investigate?
3. **Did** - What actions did I take?
4. **Diff** - How does it differ from before? What changed?

Example:
> **Mission:** Fix the damage calculation bug
> **Found:** The multiplier was being applied before the base damage instead of after
> **Did:** Moved the multiplier calculation to line 14950, after base damage is summed
> **Diff:** Damage now correctly shows 150 instead of 75 for the same word combo

## Bug Tracking Protocol

When a bug is identified, add it to `.claude/TASKS.md` under **Bug Audit** with this format:

```markdown
### BUG-XXX: [Short Description]
- **Identified:** YYYY-MM-DD HH:MM
- **Reporter:** [who found it]
- **Current Behavior:** [what happens now]
- **Expected Behavior:** [what should happen]
- **Status:** open | investigating | fixed
- **Resolution:** [blank until fixed]
- **Fixed:** [timestamp when fixed]
- **Changes:** [explicit "changed X from Y to Z" notes]
```

**Status definitions:**
- `open` - Bug confirmed, not yet investigated
- `investigating` - Actively looking into root cause
- `fixed` - Code changed and verified working

When fixing a bug, ALWAYS document:
1. The exact values/behavior before the change
2. The exact values/behavior after the change
3. Which file(s) and line(s) were modified

## Git Safety
- **NEVER push or pull unless explicitly instructed**
- **ALWAYS make a backup copy before any revert, reset, or destructive git operation**
- When in doubt, ask first

## Notes
- script.js is monolithic (tech debt) - be careful with large edits
- Steam errors are expected in local dev (no Steam client)
- Check TECH.md for performance optimization patterns
- All edits are logged to `.claude/SESSION_LOG.md`
- Tasks tracked in `.claude/TASKS.md`
