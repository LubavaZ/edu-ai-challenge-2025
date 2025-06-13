# Type-Safe Validation Library

A powerful, type-safe validation library for TypeScript that provides a fluent API for validating data structures.

## Features

- Type-safe validation for primitive types (string, number, boolean, date)
- Support for complex types (objects, arrays)
- Fluent API for building validation schemas
- Custom error messages
- Comprehensive test coverage
- Zero dependencies

## Installation

```bash
npm install type-safe-validator
```

## Usage

### Basic Usage

```typescript
import { Schema } from 'type-safe-validator';

// Create a simple schema
const userSchema = Schema.object({
  name: Schema.string().minLength(2).maxLength(50),
  age: Schema.number().min(0).max(120),
  email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
});

// Validate data
const result = userSchema.validate({
  name: "John Doe",
  age: 30,
  email: "john@example.com"
});

if (result.isValid) {
  console.log("Valid data:", result.value);
} else {
  console.log("Validation errors:", result.errors);
}
```

### Available Validators

#### String Validator
```typescript
Schema.string()
  .minLength(2)
  .maxLength(50)
  .pattern(/^[A-Z]+$/)
  .withMessage("Custom error message");
```

#### Number Validator
```typescript
Schema.number()
  .min(0)
  .max(100)
  .optional();
```

#### Boolean Validator
```typescript
Schema.boolean();
```

#### Date Validator
```typescript
Schema.date();
```

#### Object Validator
```typescript
Schema.object({
  name: Schema.string(),
  age: Schema.number()
});
```

#### Array Validator
```typescript
Schema.array(Schema.string());
```

### Complex Example

```typescript
const addressSchema = Schema.object({
  street: Schema.string(),
  city: Schema.string(),
  postalCode: Schema.string().pattern(/^\d{5}$/),
  country: Schema.string()
});

const userSchema = Schema.object({
  id: Schema.string(),
  name: Schema.string().minLength(2).maxLength(50),
  email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  age: Schema.number().optional(),
  isActive: Schema.boolean(),
  tags: Schema.array(Schema.string()),
  address: addressSchema.optional(),
  metadata: Schema.object({}).optional()
});
```

## Development

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Building

```bash
npm run build
```

### Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## License

MIT 