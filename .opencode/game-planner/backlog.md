# Game Backlog — imk's Playground

Persistent memory for the **game-planner** agent and the single source of truth for
every game idea considered. The agent reads this file before proposing anything and
updates it after every decision.

## Status legend

- **Proposed** — on the table, not yet decided.
- **Recommended** — current top pick to build next; awaiting user go-ahead to Approve.
- **Approved** — green-lit to build (next: `/spec` → `/spec-impl`).
- **Rejected** — declined; keep the reason so it is not re-proposed.
- **Implemented** — live in the platform.

## Backlog

| Game                     | Category | Glyph           | Core mechanic                                               | Scoring model                                             | Effort   | Status      | Updated    | Notes                                                                  |
| ------------------------ | -------- | --------------- | ----------------------------------------------------------- | --------------------------------------------------------- | -------- | ----------- | ---------- | ---------------------------------------------------------------------- |
| Asteroids                | SHOOTER  | rocks           | Fly a ship, shoot and dodge drifting asteroids              | Points per asteroid destroyed                             | —        | Implemented | —          | Reference game                                                         |
| Tetris                   | PUZZLE   | block / cascade | Stack falling tetrominoes, clear lines                      | Points per line clear, scaled by level                    | —        | Implemented | —          | Reference game                                                         |
| Snake                    | ARCADE   | serpent         | Grow by eating; avoid walls and self                        | Food + speed-tier multiplier + combos                     | low      | Recommended | 2026-06-26 | Top pick: fills empty ARCADE, reserved glyph, lowest effort            |
| Space Invaders           | SHOOTER  | invaders        | Shoot descending alien waves                                | Points per alien; wave bonuses                            | medium   | Proposed    | —          | Reserved glyph `invaders`                                              |
| Crossing (Frogger-like)  | ARCADE   | crosshop        | Hop across lanes of hazards                                 | Points per crossing / distance                            | medium   | Proposed    | —          | Reserved glyph `crosshop`                                              |
| (glutton — needs design) | ARCADE   | glutton         | TBD eating/maze mechanic                                    | TBD                                                       | —        | Proposed    | —          | Reserved glyph `glutton`; concrete design pending                      |
| (versus — needs design)  | VERSUS   | duel            | Head-to-head score duel                                     | TBD                                                       | high     | Proposed    | —          | Reserved glyph `duel`; fills empty VERSUS category                     |
| Quickdraw                | VERSUS   | duel (reserved) | Reflex draw on the real signal; feints punish early presses | Exchanges won × reaction-speed bonus + win streak         | low      | Proposed    | 2026-06-26 | Batch #1 — claims reserved `duel`, seeds empty VERSUS, lowest effort   |
| Tower Stacker            | ARCADE   | stacker (new)   | Time SPACE to drop a sliding block; overhang trims width    | Perfect-drop streak multiplier + height milestones        | low      | Proposed    | 2026-06-26 | Batch #2 — space-only; deepest score-chase for the effort              |
| Merge Rush               | PUZZLE   | merge (new)     | 2048 slide-merge with timed tile spawns that ramp           | Merge value × in-move combo + milestone jackpots          | low      | Proposed    | 2026-06-26 | Batch #3 — tiny grid; arcade twist turns 2048 into a score chase       |
| Thrust Caverns           | ARCADE   | thrust (new)    | Hold SPACE to thrust through a narrowing scrolling cave     | Distance × speed tier × wall-graze multiplier             | low-med  | Proposed    | 2026-06-26 | Batch #4 — analog momentum flight; novel control feel                  |
| Slapshot                 | VERSUS   | puck (new)      | Top-down air hockey vs AI; dash-slap the puck into the goal | Goals + rally multiplier + clean-sheet streak             | medium   | Proposed    | 2026-06-26 | Batch #5 — instant-familiar VERSUS anchor                              |
| Tin Star Alley           | SHOOTER  | reticle (new)   | Move a reticle, shoot gallery targets, avoid decoys         | Target value × accuracy combo + reaction-speed bonus      | low-med  | Proposed    | 2026-06-26 | Batch #6 — keyboard reticle precision; no incoming fire                |
| Ion Swarm                | SHOOTER  | drone (new)     | Keyboard twin-stick: WASD move, arrows aim/fire 8-way       | Kill-chain multiplier + cluster density burst             | medium   | Proposed    | 2026-06-26 | Batch #7 — decoupled move/aim, novel for keyboard                      |
| Columns                  | PUZZLE   | gems (new)      | Cycle colors in a falling 3-stack; match 3+ in 8 directions | Gems cleared × cascade chain multiplier                   | medium   | Proposed    | 2026-06-26 | Batch #8 — cascade chaining, not shape-fitting                         |
| Iron Vanguard            | SHOOTER  | gunship (new)   | Vertical scroller; weave formations, fire upward            | Kills × decaying chain + formation / no-damage bonus      | medium   | Proposed    | 2026-06-26 | Batch #9 — classic shmup; positioning skill                            |
| Aegis Line               | SHOOTER  | silo (new)      | Missile-Command defense; detonate flak at a cursor          | Intercepts × wave multiplier + multi-kill chains          | medium   | Proposed    | 2026-06-26 | Batch #10 — area-denial defense verb                                   |
| Trick Shot               | ARCADE   | cannon (new)    | Angle + charge SPACE to lob projectiles at drifting targets | Airtime/arc value + ricochet & multi-target combos        | medium   | Proposed    | 2026-06-26 | Batch #11 — deliberate arc aiming with bank shots                      |
| Updraft                  | ARCADE   | ascend (new)    | Jump endless ledges as rising lava sets the tempo           | Height × airborne momentum-chain multiplier               | medium   | Proposed    | 2026-06-26 | Batch #12 — Icy-Tower momentum climb                                   |
| Pipe Mania               | PUZZLE   | pipes (new)     | Lay pipe ahead of advancing ooze on a grid                  | Per-segment value (escalating) + crossover/distance bonus | medium   | Proposed    | 2026-06-26 | Batch #13 — spatial routing against a moving deadline                  |
| Pop Ascent               | PUZZLE   | bubbles (new)   | Aim/fire bubbles; match 3+, drop disconnected clusters      | Pops + escalating drop-combo + bank-shot style            | medium   | Proposed    | 2026-06-26 | Batch #14 — angular aim puzzle; descending ceiling                     |
| Klax                     | PUZZLE   | klax (new)      | Catch tumbling tiles on a paddle, drop to make 3-lines      | Klax size/direction value + back-to-back chains           | medium   | Proposed    | 2026-06-26 | Batch #15 — catch-and-place dexterity puzzle                           |
| Deflektor                | ARCADE   | paddle (new)    | Breakout with paddle-angle aim + held "english" spin        | Brick × air-combo (bricks per trip) + no-drop streak      | medium   | Proposed    | 2026-06-26 | Batch #16 — angle-aim brick breaker                                    |
| Slipstream               | VERSUS   | flag (new)      | Side-by-side racer vs an AI rival; nitro + bump             | Distance + per-second lead bonus + overtake bonus         | medium   | Proposed    | 2026-06-26 | Batch #17 — only head-to-head racer                                    |
| Floodline                | VERSUS   | tiles (new)     | Paint-the-grid territory duel vs AI over 60s                | Owned cells + largest contiguous blob + cells stolen      | med-high | Proposed    | 2026-06-26 | Batch #18 — spatial-control tug-of-war; contesting AI is the hard part |
| Standoff                 | VERSUS   | fist (new)      | Footsies RPS duel: strike / block / advance triangle        | Damage + combo multiplier + perfect-block / round bonus   | high     | Proposed    | 2026-06-26 | Batch #19 — fighting-lite mind game; telegraphs + balanced AI hard     |
| Grazefire                | SHOOTER  | hornet (new)    | Bullet-hell boss; tiny hitbox, focus mode, auto-fire        | Damage + survival time × graze multiplier                 | high     | Proposed    | 2026-06-26 | Batch #20 — dodge-first; bullet-pattern scripting is the hard part     |

## Decision log

- **2026-06-26** — Recommended **Snake** (ARCADE / `serpent`) as the next game to build.
  Rationale: cleanest technical fit to the contract, lowest effort, opens the empty
  ARCADE category, claims a reserved glyph, and is maximally different from the two
  existing games (asteroids, tetris). Proposed a deeper scoring model (speed-tier
  multiplier + quick-pickup combo + bonus fruit) to lift score-chasing depth beyond
  the shallow "1 point per food" classic. Status set to Recommended pending user
  go-ahead to Approve. No rejections recorded.
- **2026-06-26** — Batch ideation (user requested 20). Added **20 new candidates** (all
  status Proposed) across every category, generated via 4 parallel category brainstorms
  and curated/ranked against the fit contract + rubric. Ranked build order (low-effort /
  high-fit / category-fill first): 1 Quickdraw, 2 Tower Stacker, 3 Merge Rush,
  4 Thrust Caverns, 5 Slapshot, 6 Tin Star Alley, 7 Ion Swarm, 8 Columns,
  9 Iron Vanguard, 10 Aegis Line, 11 Trick Shot, 12 Updraft, 13 Pipe Mania,
  14 Pop Ascent, 15 Klax, 16 Deflektor, 17 Slipstream, 18 Floodline, 19 Standoff,
  20 Grazefire. Top new pick: **Quickdraw** — claims the reserved `duel` glyph, seeds the
  empty VERSUS category, lowest effort. 5 of the 20 are VERSUS to fill that gap. All new
  glyphs except `duel` would need adding to the `GlyphId` union (minor). **Snake** remains
  the standing immediate next build (Recommended); these 20 are the pipeline behind it.
  Dropped one idea (a gravity-flip runner, "Polarity") as too genre-saturated and
  overlapping with Thrust Caverns. No rejections.
