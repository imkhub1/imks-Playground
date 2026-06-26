# Game Backlog — imk's Playground

Persistent memory for the **game-planner** agent and the single source of truth for
every game idea considered. The agent reads this file before proposing anything and
updates it after every decision.

## Status legend

- **Proposed** — on the table, not yet decided.
- **Approved** — green-lit to build (next: `/spec` → `/spec-impl`).
- **Rejected** — declined; keep the reason so it is not re-proposed.
- **Implemented** — live in the platform.

## Backlog

| Game                     | Category | Glyph           | Core mechanic                                  | Scoring model                          | Effort | Status      | Updated | Notes                                              |
| ------------------------ | -------- | --------------- | ---------------------------------------------- | -------------------------------------- | ------ | ----------- | ------- | -------------------------------------------------- |
| Asteroids                | SHOOTER  | rocks           | Fly a ship, shoot and dodge drifting asteroids | Points per asteroid destroyed          | —      | Implemented | —       | Reference game                                     |
| Tetris                   | PUZZLE   | block / cascade | Stack falling tetrominoes, clear lines         | Points per line clear, scaled by level | —      | Implemented | —       | Reference game                                     |
| Snake                    | ARCADE   | serpent         | Grow by eating; avoid walls and self           | Points per food; longer = more         | low    | Proposed    | —       | Reserved glyph `serpent`; classic score-chaser     |
| Space Invaders           | SHOOTER  | invaders        | Shoot descending alien waves                   | Points per alien; wave bonuses         | medium | Proposed    | —       | Reserved glyph `invaders`                          |
| Crossing (Frogger-like)  | ARCADE   | crosshop        | Hop across lanes of hazards                    | Points per crossing / distance         | medium | Proposed    | —       | Reserved glyph `crosshop`                          |
| (glutton — needs design) | ARCADE   | glutton         | TBD eating/maze mechanic                       | TBD                                    | —      | Proposed    | —       | Reserved glyph `glutton`; concrete design pending  |
| (versus — needs design)  | VERSUS   | duel            | Head-to-head score duel                        | TBD                                    | high   | Proposed    | —       | Reserved glyph `duel`; fills empty VERSUS category |
