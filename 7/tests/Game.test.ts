import { Game } from '../src/Game';
import { GameConfig } from '../src/types';

describe('Game', () => {
  let game: Game;
  const config: GameConfig = {
    boardSize: 10,
    numShips: 3,
    shipLength: 3
  };

  beforeEach(() => {
    game = new Game(config);
    game.initializeGame();
  });

  describe('initialization', () => {
    it('should create a game with correct configuration', () => {
      const state = game.getGameState();
      expect(state.board.length).toBe(config.boardSize);
      expect(state.playerBoard.length).toBe(config.boardSize);
      expect(state.playerNumShips).toBe(config.numShips);
      expect(state.cpuNumShips).toBe(config.numShips);
    });
  });

  describe('player guess processing', () => {
    it('should reject invalid guess format', () => {
      const result = game.processPlayerGuess('123');
      expect(result.success).toBe(false);
      expect(result.message).toContain('Invalid guess format');
    });

    it('should reject out of bounds guess', () => {
      const result = game.processPlayerGuess('99');
      expect(result.success).toBe(false);
      expect(result.message).toContain('Invalid guess format');
    });

    it('should reject duplicate guess', () => {
      game.processPlayerGuess('00');
      const result = game.processPlayerGuess('00');
      expect(result.success).toBe(false);
      expect(result.message).toContain('already guessed');
    });
  });

  describe('CPU turn processing', () => {
    it('should make a valid guess', () => {
      const result = game.processCpuTurn();
      expect(result.guess.length).toBe(2);
      expect(result.message).toMatch(/CPU (HIT|MISS)/);
    });

    it('should not make duplicate guesses', () => {
      const guesses = new Set<string>();
      for (let i = 0; i < 10; i++) {
        const result = game.processCpuTurn();
        expect(guesses.has(result.guess)).toBe(false);
        guesses.add(result.guess);
      }
    });
  });

  describe('game state', () => {
    it('should detect game over when all CPU ships are sunk', () => {
      const state = game.getGameState();
      state.cpuNumShips = 0;
      expect(game.isGameOver()).toBe(true);
      expect(game.getWinner()).toBe('player');
    });

    it('should detect game over when all player ships are sunk', () => {
      const state = game.getGameState();
      state.playerNumShips = 0;
      expect(game.isGameOver()).toBe(true);
      expect(game.getWinner()).toBe('cpu');
    });

    it('should return null winner when game is not over', () => {
      expect(game.isGameOver()).toBe(false);
      expect(game.getWinner()).toBeNull();
    });
  });
}); 