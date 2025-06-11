import * as readline from 'readline';
import { Game } from './Game';
import { GameConfig } from './types';

export class UI {
  private game: Game;
  private rl: readline.Interface;

  constructor(config: GameConfig) {
    this.game = new Game(config);
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  public start(): void {
    this.game.initializeGame();
    console.log("\nLet's play Sea Battle!");
    console.log(`Try to sink the ${this.game.getGameState().cpuNumShips} enemy ships.`);
    this.gameLoop();
  }

  private gameLoop(): void {
    if (this.game.isGameOver()) {
      this.handleGameOver();
      return;
    }

    this.printBoard();
    this.rl.question('Enter your guess (e.g., 00): ', (answer: string) => {
      const result = this.game.processPlayerGuess(answer);
      console.log(result.message);

      if (result.success) {
        if (this.game.isGameOver()) {
          this.handleGameOver();
          return;
        }

        const cpuResult = this.game.processCpuTurn();
        console.log(cpuResult.message);

        if (this.game.isGameOver()) {
          this.handleGameOver();
          return;
        }
      }

      this.gameLoop();
    });
  }

  private printBoard(): void {
    const state = this.game.getGameState();
    console.log('\n   --- OPPONENT BOARD ---          --- YOUR BOARD ---');
    
    const header = '  ' + Array(state.board.length).fill(0).map((_, i) => i).join(' ');
    console.log(header + '     ' + header);

    for (let i = 0; i < state.board.length; i++) {
      let rowStr = i + ' ';
      
      // Opponent's board
      for (let j = 0; j < state.board[i].length; j++) {
        rowStr += state.board[i][j] + ' ';
      }
      
      rowStr += '    ' + i + ' ';
      
      // Player's board
      for (let j = 0; j < state.playerBoard[i].length; j++) {
        rowStr += state.playerBoard[i][j] + ' ';
      }
      
      console.log(rowStr);
    }
    console.log('\n');
  }

  private handleGameOver(): void {
    const winner = this.game.getWinner();
    this.printBoard();
    
    if (winner === 'player') {
      console.log('\n*** CONGRATULATIONS! You sunk all enemy battleships! ***');
    } else {
      console.log('\n*** GAME OVER! The CPU sunk all your battleships! ***');
    }
    
    this.rl.close();
  }
} 