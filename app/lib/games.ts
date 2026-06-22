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

export const CATEGORIES: ("ALL" | Category)[] = [
  "ALL",
  "ARCADE",
  "PUZZLE",
  "SHOOTER",
  "VERSUS",
];
