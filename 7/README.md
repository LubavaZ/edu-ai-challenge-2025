# Sea Battle Game

A modern implementation of the classic Sea Battle (Battleship) game using TypeScript.

## Features

- 10x10 game board
- 3 ships per player, each 3 units long
- Turn-based gameplay
- Smart CPU opponent with 'hunt' and 'target' modes
- Modern TypeScript implementation
- Comprehensive unit tests

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:
```bash
npm install
```

## Running the Game

To start the game:
```bash
npm start
```

## Running Tests

To run the test suite:
```bash
npm test
```

To run tests with coverage report:
```bash
npm run test:coverage
```

## Game Rules

1. The game is played on a 10x10 grid
2. Each player has 3 ships, each 3 units long
3. Ships are placed randomly on the board
4. Players take turns guessing coordinates (e.g., "00", "34", "98")
5. A hit is marked with 'X', a miss with 'O'
6. The first player to sink all opponent's ships wins

## Project Structure

```
src/
  ├── Game.ts      # Core game logic
  ├── UI.ts        # User interface and display
  ├── types.ts     # TypeScript type definitions
  └── index.ts     # Application entry point
tests/
  └── Game.test.ts # Unit tests
```

## Development

The project uses:
- TypeScript for type safety
- Jest for testing
- ESLint for code quality
- Modern ES6+ features

## License

MIT 