import { UI } from './UI';
import { GameConfig } from './types';

const config: GameConfig = {
  boardSize: 10,
  numShips: 3,
  shipLength: 3
};

const game = new UI(config);
game.start(); 