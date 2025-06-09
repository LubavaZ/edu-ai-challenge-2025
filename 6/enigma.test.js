const { Enigma } = require('./enigma');

describe('Enigma Machine', () => {
  // Test case 1: Basic encryption/decryption
  test('should correctly encrypt and decrypt a message', () => {
    const enigma = new Enigma(
      [0, 1, 2], // Rotor IDs
      [0, 0, 0], // Rotor positions
      [0, 0, 0], // Ring settings
      [] // No plugboard pairs
    );

    const message = 'HELLO';
    const encrypted = enigma.process(message);
    
    // Create a new instance with same settings for decryption
    const enigma2 = new Enigma(
      [0, 1, 2],
      [0, 0, 0],
      [0, 0, 0],
      []
    );
    
    const decrypted = enigma2.process(encrypted);
    expect(decrypted).toBe(message);
  });

  // Test case 2: With plugboard
  test('should handle plugboard connections', () => {
    const enigma = new Enigma(
      [0, 1, 2],
      [0, 0, 0],
      [0, 0, 0],
      [['A', 'B'], ['C', 'D']]
    );

    const message = 'HELLO';
    const encrypted = enigma.process(message);
    
    const enigma2 = new Enigma(
      [0, 1, 2],
      [0, 0, 0],
      [0, 0, 0],
      [['A', 'B'], ['C', 'D']]
    );
    
    const decrypted = enigma2.process(encrypted);
    expect(decrypted).toBe(message);
  });

  // Test case 3: Different rotor positions
  test('should work with different rotor positions', () => {
    const enigma = new Enigma(
      [0, 1, 2],
      [1, 2, 3],
      [0, 0, 0],
      []
    );

    const message = 'HELLO';
    const encrypted = enigma.process(message);
    
    const enigma2 = new Enigma(
      [0, 1, 2],
      [1, 2, 3],
      [0, 0, 0],
      []
    );
    
    const decrypted = enigma2.process(encrypted);
    expect(decrypted).toBe(message);
  });

  // Test case 4: Different ring settings
  test('should work with different ring settings', () => {
    const enigma = new Enigma(
      [0, 1, 2],
      [0, 0, 0],
      [1, 2, 3],
      []
    );

    const message = 'HELLO';
    const encrypted = enigma.process(message);
    
    const enigma2 = new Enigma(
      [0, 1, 2],
      [0, 0, 0],
      [1, 2, 3],
      []
    );
    
    const decrypted = enigma2.process(encrypted);
    expect(decrypted).toBe(message);
  });

  // Test case 5: Non-alphabetic characters
  test('should handle non-alphabetic characters', () => {
    const enigma = new Enigma(
      [0, 1, 2],
      [0, 0, 0],
      [0, 0, 0],
      []
    );

    const message = 'HELLO WORLD! 123';
    const encrypted = enigma.process(message);
    
    const enigma2 = new Enigma(
      [0, 1, 2],
      [0, 0, 0],
      [0, 0, 0],
      []
    );
    
    const decrypted = enigma2.process(encrypted);
    expect(decrypted).toBe('HELLO WORLD! 123');
  });

  // Test case 6: Double-stepping mechanism
  test('should implement correct double-stepping mechanism', () => {
    const enigma = new Enigma(
      [0, 1, 2],
      [0, 0, 0],
      [0, 0, 0],
      []
    );

    // Test message that will trigger double-stepping
    const message = 'A'.repeat(26); // Will cause middle rotor to reach notch
    const encrypted = enigma.process(message);
    
    const enigma2 = new Enigma(
      [0, 1, 2],
      [0, 0, 0],
      [0, 0, 0],
      []
    );
    
    const decrypted = enigma2.process(encrypted);
    expect(decrypted).toBe(message);
  });

  // Test case 7: Different rotor combinations
  test('should work with different rotor combinations', () => {
    const enigma = new Enigma(
      [2, 1, 0], // Different rotor order
      [0, 0, 0],
      [0, 0, 0],
      []
    );

    const message = 'HELLO';
    const encrypted = enigma.process(message);
    
    const enigma2 = new Enigma(
      [2, 1, 0],
      [0, 0, 0],
      [0, 0, 0],
      []
    );
    
    const decrypted = enigma2.process(encrypted);
    expect(decrypted).toBe(message);
  });

  // Test case 8: Long message with multiple rotor turnovers
  test('should handle long messages with multiple rotor turnovers', () => {
    const enigma = new Enigma(
      [0, 1, 2],
      [0, 0, 0],
      [0, 0, 0],
      []
    );

    const message = 'A'.repeat(100); // Long message to test multiple turnovers
    const encrypted = enigma.process(message);
    
    const enigma2 = new Enigma(
      [0, 1, 2],
      [0, 0, 0],
      [0, 0, 0],
      []
    );
    
    const decrypted = enigma2.process(encrypted);
    expect(decrypted).toBe(message);
  });

  // Test case 9: Edge cases with rotor positions
  test('should handle edge cases with rotor positions', () => {
    const enigma = new Enigma(
      [0, 1, 2],
      [25, 25, 25], // Maximum positions
      [0, 0, 0],
      []
    );

    const message = 'HELLO';
    const encrypted = enigma.process(message);
    
    const enigma2 = new Enigma(
      [0, 1, 2],
      [25, 25, 25],
      [0, 0, 0],
      []
    );
    
    const decrypted = enigma2.process(encrypted);
    expect(decrypted).toBe(message);
  });

  // Test case 10: Complex plugboard configuration
  test('should handle complex plugboard configurations', () => {
    const enigma = new Enigma(
      [0, 1, 2],
      [0, 0, 0],
      [0, 0, 0],
      [['A', 'B'], ['C', 'D'], ['E', 'F'], ['G', 'H'], ['I', 'J']] // Multiple plugboard pairs
    );

    const message = 'HELLO';
    const encrypted = enigma.process(message);
    
    const enigma2 = new Enigma(
      [0, 1, 2],
      [0, 0, 0],
      [0, 0, 0],
      [['A', 'B'], ['C', 'D'], ['E', 'F'], ['G', 'H'], ['I', 'J']]
    );
    
    const decrypted = enigma2.process(encrypted);
    expect(decrypted).toBe(message);
  });
}); 