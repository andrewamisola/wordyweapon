# Wordy Weapon - Dialogue Overhaul Plan

## Current State Summary

### Existing Dialogue Locations
| Location | Content | Line Numbers |
|----------|---------|--------------|
| Hero Battle Intro | 2 lines per hero | 1598-1739 |
| Hero Victory | 1 line per hero | in HEROES array |
| Enemy Dialogue | 2 lines per enemy (14) | 1798-1930 |
| Boss Dialogue | 2 lines per boss (5+1) | 1956-2043 |
| Hero-Enemy Specific | Unique lines per matchup | 2147-2299 |
| Onboarding | 7 tutorial steps | 7734-7857 |

### Missing Dialogue Opportunities
1. **Defeat Screen** - Currently just shows stats, no hero reaction
2. **Shop Beats** - No dialogue between rounds
3. **Chapter Celebration** - Just "CHAPTER X COMPLETE", no commentary
4. **Miniboss Victories** - No special acknowledgment
5. **Boss Victories** - No unique victory dialogue per boss
6. **Hero Unlock Moments** - Silent unlocks
7. **Run Start** - No "let's go" moment

---

## Dialogue Overhaul Plan

### Phase 1: Core Dialogue Polish (Existing Systems)

#### 1A. Hero Battle Dialogue
Update to match Worldbuilding.md speech styles:

**Graham Moor** (Short. Declarative. Corrects grammar.)
- Current: "Wordsmith. You know the drill." / "Sloppy grammar gets soldiers killed."
- Proposed: Keep - already fits character

**Quivera** (Rhythmic, measured, musical. Counting references.)
- Current: "Just like old times, Wordsmith." / "Every battle has a tempo. Find it."
- Proposed: Keep - already fits character

**Belle Lettres** (Elegant, detached, meta-textual. References drafts, revisions.)
- Current: "No more reading about battles. Time to write one." / "For my kingdom. For my family."
- Proposed:
  - "Reality is a rough draft. Let's make revisions."
  - "I've read this story before. Time to edit the ending."

**Alexandria Constanza** (Archival, oath-bound, poetic.)
- Current: "Training's over. By The Word, I'm ready." / "All shall be preserved."
- Proposed:
  - "By The Word, this entry shall be preserved."
  - "My oath binds me. My conviction drives me."

**Caesura** (Minimal. Elliptical. Significant pauses.)
- Current: "..." / "...So you're the Wordsmith."
- Proposed: Keep - already fits character

**Reed** (Naturalistic, patient, growth metaphors.)
- Current: "The roots remember, old friend." / "Etymos calls us once more."
- Proposed: Keep - already fits character

#### 1B. Hero Victory Dialogue
Update to reflect arcs and themes:

**Graham**: "Job's done. Same as always. Reliable."
- Proposed: "Duty fulfilled. ...That's what matters. Right?"

**Quivera**: "Still got it. Glad our paths crossed again."
- Proposed: "One more verse in the song. The rhythm holds."

**Belle**: "We won this chapter, Wordsmith. But the story isn't over. Not until I know."
- Proposed: Keep - already perfect for her arc (parents missing)

**Alexandria**: "The Academy prepared me. You armed me. The Word guided us."
- Proposed: "Another page preserved. The lexicon endures."

**Caesura**: "... Prosa feared your name. ... Perhaps they were wrong to."
- Proposed: Keep - already fits character

**Reed**: "Another cycle together, Wordsmith. Our roots hold strong."
- Proposed: Keep - already fits character

---

### Phase 2: New Dialogue Systems

#### 2A. Defeat Dialogue (NEW)
Add `defeatDialogue` property to each hero:

**Graham**: "I failed them. I failed... everyone."
**Quivera**: "The song ends here. But the melody... it continues without me."
**Belle**: "Another draft... discarded. Mother... Father..."
**Alexandria**: "My oath... I couldn't keep it. Forgive me, Word."
**Caesura**: "...Prosa warned them. ...They didn't listen."
**Reed**: "The roots... wither. But new growth... will come."

#### 2B. Shop Dialogue (NEW)
Hero commentary between rounds. Triggered randomly (30% chance) on shop open.

**System**: Add `shopDialogue` array to each hero (4-6 lines each)
**Trigger**: `showShop()` function, random selection

**Graham**:
- "Restock. Regroup. We move at dawn."
- "Gold well spent is lives saved."
- "Don't waste my time. Or the kingdom's coin."

**Quivera**:
- "A brief rest. One, two, three... ready."
- "The merchants here still know my name. Good."
- "Every arrow counts. Choose wisely."

**Belle**:
- "So this is what commerce looks like outside the Library..."
- "Fascinating inventory. I've only read about half of these."
- "Shopping! Like a normal person! ...Is this normal?"

**Alexandria**:
- "The Word provides. We must be worthy of it."
- "Even templars require tools. No shame in preparation."
- "Let us make haste. The Erratum do not rest."

**Caesura**:
- "..."
- "...Choose."
- "...Time is short."

**Reed**:
- "The land provides what we need, if we listen."
- "Gold is a strange root. But it grows things."
- "Rest now. The next storm approaches."

#### 2C. Chapter Celebration Dialogue (NEW)
Hero commentary on chapter completion. Add `chapterDialogue` property.

**Graham**: "One chapter down. But the book isn't finished."
**Quivera**: "The tempo shifts. A new movement begins."
**Belle**: "We've turned the page. What comes next... I've read it. It gets worse."
**Alexandria**: "A chapter preserved! By The Word, we advance!"
**Caesura**: "...One step closer. ...To the truth."
**Reed**: "The seasons turn. Growth continues."

#### 2D. Boss Victory Dialogue (NEW)
Unique lines per hero-boss combination. Add to HERO_ENEMY_DIALOGUE object.

**Format**: `heroId_bossId_victory`

Examples:
- **Graham vs Cinna & Antony**: "Two against one. Poor odds... for them."
- **Belle vs Red Aktins**: "You can't censor the truth forever. I've read the original texts."
- **Caesura vs Plague Doctor**: "...You stole our style. ...You never understood it."
- **Reed vs Oxy**: "Contradiction cannot stand where roots grow deep."

#### 2E. Run Start Dialogue (NEW)
Quick line when starting a new run. Add `runStartDialogue` property.

**Graham**: "Wordsmith. Let's write some wrongs."
**Quivera**: "The stage is set. One, two, three... begin."
**Belle**: "A new chapter begins. Let's hope for a better ending this time."
**Alexandria**: "By The Word, I am ready. Forge me a weapon, Wordsmith."
**Caesura**: "..." *nods*
**Reed**: "The roots call. Let us answer."

---

### Phase 3: Enemy Dialogue Polish

#### 3A. Regular Enemies
Review against Worldbuilding.md personalities. Most are already good!

**Ghost** - Add existential dread:
- Current: "Dord... dord..." / "I was real once... wasn't I?"
- Add: "The dictionary deleted me... but I'm still here..."

**Passive Voice** - Lean into evasion:
- Current: "Your defeat has been predetermined." / "Damage will be received by you."
- Add: "Mistakes were made. By you."

#### 3B. Boss Dialogue
Enhance to reflect their nature:

**Red Aktins** - More authoritarian:
- Current: "[REDACTED] will be your [REDACTED]!" / "Some words are better left... unwritten."
- Add: "This conversation has been flagged for review."

**Dotdotdot** - More trailing off:
- Current: "Ah, the famous Wordsmith! I've heard so much about..." / "This is the part where I..."
- Add: "Wait, I had something for this..."

---

## Implementation Priority

### High Priority (Do First)
1. [ ] Defeat dialogue (currently empty)
2. [ ] Shop dialogue (adds life between rounds)
3. [ ] Chapter celebration dialogue

### Medium Priority
4. [ ] Run start dialogue
5. [ ] Boss victory dialogue
6. [ ] Hero battle dialogue polish (Belle, Alexandria)

### Low Priority (Polish)
7. [ ] Enemy dialogue tweaks
8. [ ] Additional shop lines
9. [ ] Loading screen tips

---

## Technical Implementation

### New Properties to Add to HEROES Array
```javascript
{
  // Existing
  dialogue: [...],
  victoryDialogue: "...",

  // NEW
  defeatDialogue: "...",
  shopDialogue: [...],
  chapterDialogue: "...",
  runStartDialogue: "..."
}
```

### New Functions to Create/Modify

1. **showLossScreen()** - Add hero defeat dialogue display
2. **showShop()** - Add random shop dialogue trigger
3. **showChapterCelebration()** - Add hero chapter dialogue
4. **startRun() or newEnc() for round 1** - Add run start dialogue

### Hero-Boss Victory Dialogue
Add to HERO_ENEMY_DIALOGUE object with `_victory` suffix keys.

---

## Codex/Gemini Task Distribution

### For Codex (Code Implementation)
- Add new dialogue properties to HEROES array
- Modify showLossScreen() to display defeat dialogue
- Add shop dialogue trigger system
- Add chapter celebration dialogue display
- Add run start dialogue display

### For Gemini (Dialogue Writing)
- Write full shop dialogue arrays (6 lines per hero = 36 lines)
- Write boss victory dialogue (6 heroes × 6 bosses = 36 lines)
- Polish existing enemy dialogue
- Write loading screen tips

---

## Sample Dialogue Guidelines

### Tone Reminders
- **Punny but fleshed out** (Terry Pratchett style)
- **Tragic Erratum** - They want to be corrected, not destroyed
- **Climate change parallel** - Systemic failure, not a villain
- **Dissonance theme** - Communication failures, working together

### Speech Style Reference
| Hero | Style | Keywords |
|------|-------|----------|
| Graham | Short, declarative | Duty, orders, correct |
| Quivera | Rhythmic, counting | Tempo, beat, rhythm |
| Belle | Meta-textual, literary | Draft, revision, chapter |
| Alexandria | Poetic, oath-bound | Preserve, Word, oath |
| Caesura | Minimal, pauses | "...", silence, remember |
| Reed | Growth metaphors | Roots, growth, land |
