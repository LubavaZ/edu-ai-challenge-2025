export type Position = {
  row: number;
  col: number;
};

export type Ship = {
  locations: string[];
  hits: string[];
};

export type Board = string[][];

export type GameState = {
  board: Board;
  playerBoard: Board;
  playerShips: Ship[];
  cpuShips: Ship[];
  playerNumShips: number;
  cpuNumShips: number;
  guesses: string[];
  cpuGuesses: string[];
  cpuMode: 'hunt' | 'target';
  cpuTargetQueue: string[];
};

export type GameConfig = {
  boardSize: number;
  numShips: number;
  shipLength: number;
}; 