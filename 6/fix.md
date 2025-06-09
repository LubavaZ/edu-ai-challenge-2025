# Enigma Machine Bug Fix

## The Bug

The original implementation had an incorrect rotor stepping mechanism. The bug was in the `stepRotors()` method of the `Enigma` class. The original implementation was:

```javascript
stepRotors() {
  if (this.rotors[2].atNotch()) this.rotors[1].step();
  if (this.rotors[1].atNotch()) this.rotors[0].step();
  this.rotors[2].step();
}
```

This implementation had two main issues:

1. It didn't properly implement the double-stepping mechanism that was a key feature of the Enigma machine.
2. The order of checking and stepping the rotors was incorrect, which led to inconsistent encryption/decryption.

## The Fix

The fixed implementation properly implements the double-stepping mechanism:

```javascript
stepRotors() {
  // Check if middle rotor is at notch position
  const middleAtNotch = this.rotors[1].atNotch();
  // Check if right rotor is at notch position
  const rightAtNotch = this.rotors[2].atNotch();

  // Double-stepping mechanism
  if (middleAtNotch) {
    this.rotors[0].step(); // Step left rotor
    this.rotors[1].step(); // Step middle rotor
  } else if (rightAtNotch) {
    this.rotors[1].step(); // Step middle rotor
  }
  
  // Always step the right rotor
  this.rotors[2].step();
}
```

The key changes in the fix are:

1. We first check the state of both middle and right rotors before making any changes
2. We implement the proper double-stepping mechanism:
   - If the middle rotor is at its notch position, both the left and middle rotors step
   - If the right rotor is at its notch position, the middle rotor steps
   - The right rotor always steps
3. The order of operations ensures that the rotors step in the correct sequence

## Why This Fixes the Issue

The Enigma machine's security relied heavily on its complex stepping mechanism. The original implementation didn't properly handle the double-stepping feature, which meant that the encryption pattern was incorrect. The fixed implementation ensures that:

1. The rotors step in the correct sequence
2. The double-stepping mechanism works as designed
3. The encryption/decryption process is consistent and reversible

This fix makes the implementation historically accurate and ensures that the same message encrypted twice will produce different results (unless the rotors are in the same position), which was a key security feature of the Enigma machine. 