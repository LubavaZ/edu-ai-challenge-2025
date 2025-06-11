import { GameState, GameConfig, Ship, Board, Position } from './types';

export class Game {
  private state: GameState;
  private config: GameConfig;

  constructor(config: GameConfig) {
    this.config = config;
    this.state = this.initializeGameState();
  }

  private initializeGameState(): GameState {
    return {
      board: this.createEmptyBoard(),
      playerBoard: this.createEmptyBoard(),
      playerShips: [],
      cpuShips: [],
      playerNumShips: this.config.numShips,
      cpuNumShips: this.config.numShips,
      guesses: [],
      cpuGuesses: [],
      cpuMode: 'hunt',
      cpuTargetQueue: []
    };
  }

  private createEmptyBoard(): Board {
    return Array(this.config.boardSize)
      .fill(null)
      .map(() => Array(this.config.boardSize).fill('~'));
  }

  public initializeGame(): void {
    this.placeShipsRandomly(this.state.playerBoard, this.state.playerShips, this.state.playerNumShips);
    this.placeShipsRandomly(this.state.board, this.state.cpuShips, this.state.cpuNumShips);
  }

  private placeShipsRandomly(targetBoard: Board, shipsArray: Ship[], numberOfShips: number): void {
    let placedShips = 0;
    while (placedShips < numberOfShips) {
      const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
      const startRow = orientation === 'horizontal' 
        ? Math.floor(Math.random() * this.config.boardSize)
        : Math.floor(Math.random() * (this.config.boardSize - this.config.shipLength + 1));
      const startCol = orientation === 'horizontal'
        ? Math.floor(Math.random() * (this.config.boardSize - this.config.shipLength + 1))
        : Math.floor(Math.random() * this.config.boardSize);

      const shipLocations = this.calculateShipLocations(startRow, startCol, orientation);
      
      if (this.isValidPlacement(shipLocations, targetBoard)) {
        const newShip = this.createShip(shipLocations, targetBoard);
        shipsArray.push(newShip);
        placedShips++;
      }
    }
  }

  private calculateShipLocations(startRow: number, startCol: number, orientation: 'horizontal' | 'vertical'): string[] {
    const locations: string[] = [];
    for (let i = 0; i < this.config.shipLength; i++) {
      const row = orientation === 'horizontal' ? startRow : startRow + i;
      const col = orientation === 'horizontal' ? startCol + i : startCol;
      locations.push(`${row}${col}`);
    }
    return locations;
  }

  private isValidPlacement(locations: string[], board: Board): boolean {
    return locations.every(loc => {
      const [row, col] = loc.split('').map(Number);
      return row >= 0 && row < this.config.boardSize &&
             col >= 0 && col < this.config.boardSize &&
             board[row][col] === '~';
    });
  }

  private createShip(locations: string[], board: Board): Ship {
    const ship: Ship = {
      locations: [...locations],
      hits: Array(locations.length).fill('')
    };

    locations.forEach(loc => {
      const [row, col] = loc.split('').map(Number);
      if (board === this.state.playerBoard) {
        board[row][col] = 'S';
      }
    });

    return ship;
  }

  public processPlayerGuess(guess: string): { success: boolean; message: string } {
    if (!this.isValidGuess(guess)) {
      return { success: false, message: 'Invalid guess format. Use two digits (e.g., 00, 34, 98).' };
    }

    const [row, col] = guess.split('').map(Number);
    if (this.state.guesses.includes(guess)) {
      return { success: false, message: 'You already guessed that location!' };
    }

    this.state.guesses.push(guess);
    const result = this.processGuess(row, col, guess, this.state.cpuShips, this.state.board);
    
    if (result.hit && result.ship && this.isSunk(result.ship)) {
      this.state.cpuNumShips--;
      return { success: true, message: 'You sunk an enemy battleship!' };
    }

    return { success: true, message: result.hit ? 'PLAYER HIT!' : 'PLAYER MISS.' };
  }

  private isValidGuess(guess: string): boolean {
    if (!guess || guess.length !== 2) return false;
    const [row, col] = guess.split('').map(Number);
    return !isNaN(row) && !isNaN(col) &&
           row >= 0 && row < this.config.boardSize &&
           col >= 0 && col < this.config.boardSize;
  }

  private processGuess(row: number, col: number, guess: string, ships: Ship[], board: Board): { hit: boolean; ship?: Ship } {
    for (const ship of ships) {
      const index = ship.locations.indexOf(guess);
      if (index >= 0) {
        if (ship.hits[index] === 'hit') {
          return { hit: true };
        }
        ship.hits[index] = 'hit';
        board[row][col] = 'X';
        return { hit: true, ship };
      }
    }
    board[row][col] = 'O';
    return { hit: false };
  }

  public processCpuTurn(): { guess: string; message: string } {
    let guess: string;
    let madeValidGuess = false;

    while (!madeValidGuess) {
      if (this.state.cpuMode === 'target' && this.state.cpuTargetQueue.length > 0) {
        guess = this.state.cpuTargetQueue.shift()!;
        if (this.state.cpuGuesses.includes(guess)) {
          if (this.state.cpuTargetQueue.length === 0) this.state.cpuMode = 'hunt';
          continue;
        }
      } else {
        this.state.cpuMode = 'hunt';
        const row = Math.floor(Math.random() * this.config.boardSize);
        const col = Math.floor(Math.random() * this.config.boardSize);
        guess = `${row}${col}`;
        if (this.state.cpuGuesses.includes(guess)) continue;
      }

      madeValidGuess = true;
      this.state.cpuGuesses.push(guess);
      const [row, col] = guess.split('').map(Number);
      const result = this.processGuess(row, col, guess, this.state.playerShips, this.state.playerBoard);

      if (result.hit) {
        if (result.ship && this.isSunk(result.ship)) {
          this.state.playerNumShips--;
          this.state.cpuMode = 'hunt';
          this.state.cpuTargetQueue = [];
          return { guess, message: `CPU sunk your battleship at ${guess}!` };
        }
        this.state.cpuMode = 'target';
        this.addAdjacentTargets(row, col);
        return { guess, message: `CPU HIT at ${guess}!` };
      }

      if (this.state.cpuMode === 'target' && this.state.cpuTargetQueue.length === 0) {
        this.state.cpuMode = 'hunt';
      }
      return { guess, message: `CPU MISS at ${guess}.` };
    }

    return { guess: '', message: 'CPU turn failed' };
  }

  private addAdjacentTargets(row: number, col: number): void {
    const adjacent: Position[] = [
      { row: row - 1, col },
      { row: row + 1, col },
      { row, col: col - 1 },
      { row, col: col + 1 }
    ];

    adjacent.forEach(pos => {
      if (this.isValidPosition(pos)) {
        const guess = `${pos.row}${pos.col}`;
        if (!this.state.cpuGuesses.includes(guess) && !this.state.cpuTargetQueue.includes(guess)) {
          this.state.cpuTargetQueue.push(guess);
        }
      }
    });
  }

  private isValidPosition(pos: Position): boolean {
    return pos.row >= 0 && pos.row < this.config.boardSize &&
           pos.col >= 0 && pos.col < this.config.boardSize;
  }

  private isSunk(ship: Ship): boolean {
    return ship.hits.every(hit => hit === 'hit');
  }

  public getGameState(): GameState {
    return { ...this.state };
  }

  public isGameOver(): boolean {
    return this.state.playerNumShips === 0 || this.state.cpuNumShips === 0;
  }

  public getWinner(): 'player' | 'cpu' | null {
    if (this.state.cpuNumShips === 0) return 'player';
    if (this.state.playerNumShips === 0) return 'cpu';
    return null;
  }
} 