export type Category = "ARCADE" | "PUZZLE" | "SHOOTER" | "VERSUS";
export type GlyphId =
  | "block"
  | "cascade"
  | "serpent"
  | "glutton"
  | "invaders"
  | "rocks"
  | "crosshop"
  | "duel";

export interface Game {
  id: string;
  title: string;
  category: Category;
  icon: GlyphId;
  blurb: string;
  about: string;
  controls: string[];
  seed: number;
}

export const GAMES: Game[] = [
  {
    id: "block-buster",
    title: "BLOCK BUSTER",
    category: "ARCADE",
    icon: "block",
    blurb: "Bounce the ball and shatter walls of neon brick.",
    about:
      "A paddle, a ball, and a wall that will not break itself. Angle every bounce, chain your combos, and clear the board before the ball slips past you. Power-ups drop from shattered bricks — grab the wide paddle and the multiball while you can.",
    controls: ["← / →  move paddle", "SPACE  launch ball", "P  pause"],
    seed: 28450,
  },
  {
    id: "cascade",
    title: "CASCADE",
    category: "PUZZLE",
    icon: "cascade",
    blurb: "Lock the falling pieces before the ceiling crushes you.",
    about:
      "Seven shapes, one shrinking gap. Rotate and slot each piece into a clean line and watch it vanish. The drop speed never stops climbing — survival is a negotiation with gravity you are destined to lose, beautifully.",
    controls: [
      "← / →  shift piece",
      "↑  rotate",
      "↓  soft drop",
      "SPACE  hard drop",
    ],
    seed: 184220,
  },
  {
    id: "serpent",
    title: "SERPENT",
    category: "ARCADE",
    icon: "serpent",
    blurb: "Grow long without biting your own tail.",
    about:
      "Eat, grow, repeat — until your own body becomes the maze. Every pellet makes you longer and the board smaller. Pure nerve and spatial planning, distilled to a single moving line.",
    controls: ["Arrow keys  steer", "P  pause"],
    seed: 7820,
  },
  {
    id: "glutton",
    title: "GLUTTON",
    category: "ARCADE",
    icon: "glutton",
    blurb: "Devour the dots and outrun the ghosts.",
    about:
      "Clear the maze one dot at a time while four relentless hunters close in. Bank a power pellet to flip the chase and eat them back. Greed and timing, in equal measure.",
    controls: ["Arrow keys  move", "P  pause"],
    seed: 96400,
  },
  {
    id: "invaders",
    title: "INVADERS",
    category: "SHOOTER",
    icon: "invaders",
    blurb: "Defend the planet from descending alien rows.",
    about:
      "Rows of invaders march left, right, and ever downward. Thin them out before they reach the ground, duck behind crumbling bunkers, and watch for the mothership streaking overhead for bonus points.",
    controls: ["← / →  move cannon", "SPACE  fire", "P  pause"],
    seed: 54190,
  },
  {
    id: "rocks",
    title: "ROCKS",
    category: "SHOOTER",
    icon: "rocks",
    blurb: "Pulverize asteroids in zero gravity.",
    about:
      "Drift through a field of tumbling rock. Every shot splits an asteroid into faster, smaller pieces — clear them all without flying into one. Momentum is your only friend and your worst enemy.",
    controls: ["← / →  rotate", "↑  thrust", "SPACE  fire"],
    seed: 41200,
  },
  {
    id: "crosshop",
    title: "CROSSHOP",
    category: "ARCADE",
    icon: "crosshop",
    blurb: "Cross the pixel freeway without getting flattened.",
    about:
      "Five lanes of traffic, a river of logs, and a very small window of time. Hop forward one square at a time and read the gaps. One mistimed leap and it is back to the curb.",
    controls: ["Arrow keys  hop", "P  pause"],
    seed: 18900,
  },
  {
    id: "pixel-duel",
    title: "PIXEL DUEL",
    category: "VERSUS",
    icon: "duel",
    blurb: "Two paddles. One ball. Maximum reflexes.",
    about:
      "The original showdown. Keep the ball alive, sharpen your angles, and grind your opponent into a faceplant. Play the house AI or pass the keyboard for a local grudge match.",
    controls: ["W / S  left paddle", "↑ / ↓  right paddle"],
    seed: 21,
  },
];

export const CATEGORIES: ("ALL" | Category)[] = [
  "ALL",
  "ARCADE",
  "PUZZLE",
  "SHOOTER",
  "VERSUS",
];
