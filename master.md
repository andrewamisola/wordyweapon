# Wordy Weapon - Documentation Master Index

> **Version**: 1.0 Release Candidate
> **Last Updated**: 2024-12-20
> **Game**: Roguelite Word-Crafting RPG | Electron/Steam + Browser

---

## Quick Stats

| Heroes | Enemies | Talents | Words | Platforms |
|--------|---------|---------|-------|-----------|
| 6 playable | 15 common + 5 bosses | 50+ abilities | 60+ collectible | Steam (Win/Mac), itch.io |

---

## Department Documents

### [DESIGN.md](./DESIGN.md)
**Owner**: Design Subagent
Combat mechanics, hero balance, talent system, word database, enemy design, economy tuning, difficulty scaling.

### [ART.md](./ART.md)
**Owner**: Art Subagent
Visual effects, CSS styling, hero/enemy portraits, talent icons, audio direction, UI/UX patterns.

### [TECH.md](./TECH.md)
**Owner**: Tech Subagent
Build pipeline, performance optimization, architecture overview, persistence/save system, platform differences.

### [WRITING.md](./WRITING.md)
**Owner**: Writing Subagent
Worldbuilding lore, dialogue system, character voice guidelines, narrative arcs, enemy personalities.

---

## Cross-References

| Topic | Primary Doc | Also See |
|-------|-------------|----------|
| Heroes | DESIGN.md | WRITING.md (voice/personality), ART.md (portraits) |
| Talents | DESIGN.md | ART.md (icons) |
| Enemies | DESIGN.md | WRITING.md (personality/dialogue), ART.md (portraits) |
| Dialogue | WRITING.md | DESIGN.md (triggers/conditions) |
| VFX | ART.md | TECH.md (performance constraints) |
| Audio | ART.md | TECH.md (Tone.js implementation) |

---

## 1.0 Release Checklist

- [ ] Design review complete
- [ ] Art assets finalized
- [ ] Tech optimization pass
- [ ] Writing polish done
- [ ] Build tested: Steam Windows
- [ ] Build tested: Steam Mac
- [ ] Build tested: itch.io Web
- [ ] Demo vs Full build flags verified

---

## Subagent Coordination Protocol

1. **Ownership**: Each subagent owns ONE document - edit only your assigned doc
2. **Reading**: All subagents can read all docs for context
3. **Cross-department changes**: Tag other subagents when changes affect their domain
4. **master.md**: Updated by coordinator only
5. **Change tracking**: Each doc has a Change Log section at the bottom

### When Making Changes

```
1. Update "Last Updated" date at top
2. Make your changes in appropriate section
3. Update "Implementation Status" table if feature-related
4. Add entry to Change Log at bottom
5. If cross-department: note which other docs may need updates
```

---

## File Structure

```
wordyweapon/
├── master.md       <- You are here (coordinator manages)
├── DESIGN.md       <- Design Subagent
├── ART.md          <- Art Subagent
├── TECH.md         <- Tech Subagent
├── WRITING.md      <- Writing Subagent
├── archive/        <- Superseded documentation
│   └── [old .md files preserved for reference]
├── game/           <- Game source files
└── electron/       <- Desktop wrapper
```
