# Type-Safe Validation Library

A powerful, type-safe validation library for TypeScript that provides a fluent API for validating data structures.

## Features

- Type-safe validation for primitive types (string, number, boolean, date)
- Support for complex types (objects, arrays)
- Fluent API for building validation schemas
- Custom error messages
- Comprehensive test coverage
- Zero dependencies

## Usage

### Using the Library in This Project

1. Import the Schema class directly from the validator.ts file:
```typescript
import { Schema } from './validator';
```

2. Use the Schema class to create validation rules:
```typescript
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

## Testing the Library

To test the library, create an `index.ts` file in the root directory with the following content:

```typescript
import { Schema } from './validator';

// Example 1: User Registration Form
const userSchema = Schema.object({
  username: Schema.string()
    .minLength(3)
    .maxLength(20)
    .withMessage("Username must be between 3 and 20 characters"),
  
  email: Schema.string()
    .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    .withMessage("Please enter a valid email address"),
  
  age: Schema.number()
    .min(18)
    .max(100)
    .optional()
    .withMessage("Age must be between 18 and 100"),
  
  isSubscribed: Schema.boolean()
});

// Example 2: Product Configuration
const productSchema = Schema.object({
  name: Schema.string().minLength(2),
  price: Schema.number().min(0),
  categories: Schema.array(Schema.string()),
  metadata: Schema.object({
    sku: Schema.string(),
    inStock: Schema.boolean()
  }).optional()
});

// Test the validators
console.log("Testing User Validation:");
const userData = {
  username: "john_doe",
  email: "john@example.com",
  age: 25,
  isSubscribed: true
};

const userResult = userSchema.validate(userData);
console.log("User validation result:", userResult);

console.log("\nTesting Product Validation:");
const productData = {
  name: "Laptop",
  price: 999.99,
  categories: ["Electronics", "Computers"],
  metadata: {
    sku: "LAP-001",
    inStock: true
  }
};

const productResult = productSchema.validate(productData);
console.log("Product validation result:", productResult);

// Test with invalid data
console.log("\nTesting Invalid User Data:");
const invalidUserData = {
  username: "jo", // Too short
  email: "invalid-email", // Invalid email format
  age: 15, // Too young
  isSubscribed: "yes" // Wrong type
};

const invalidUserResult = userSchema.validate(invalidUserData);
console.log("Invalid user validation result:", invalidUserResult);
```

Then run the following commands to test:
```bash
npm run build
npm start
```

This will compile the TypeScript code and run the examples, showing validation results for both valid and invalid data.

## Available Validators

#### String Validator
```typescript
Schema.string()
  .minLength(2)           // Minimum length
  .maxLength(50)          // Maximum length
  .pattern(/^[A-Z]+$/)    // Regex pattern
  .withMessage("Custom error message"); // Custom error message
```

#### Number Validator
```typescript
Schema.number()
  .min(0)                 // Minimum value
  .max(100)               // Maximum value
  .optional();            // Makes the field optional
```

#### Boolean Validator
```typescript
Schema.boolean();
```

#### Date Validator
```typescript
Schema.date();  // Accepts both Date objects and parseable date strings
```

#### Object Validator
```typescript
Schema.object({
  field1: Schema.string(),
  field2: Schema.number()
}).optional();  // Makes the entire object optional
```

#### Array Validator
```typescript
Schema.array(Schema.string())  // Array of strings
  .optional();                 // Makes the array optional
```

## Common Use Cases

### Form Validation
```typescript
const loginFormSchema = Schema.object({
  email: Schema.string()
    .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    .withMessage("Invalid email format"),
  password: Schema.string()
    .minLength(8)
    .withMessage("Password must be at least 8 characters")
});
```

### API Request Validation
```typescript
const apiRequestSchema = Schema.object({
  id: Schema.string(),
  data: Schema.object({
    name: Schema.string(),
    value: Schema.number()
  }),
  timestamp: Schema.date()
});
```

### Configuration Validation
```typescript
const configSchema = Schema.object({
  port: Schema.number().min(1).max(65535),
  host: Schema.string(),
  debug: Schema.boolean().optional(),
  allowedOrigins: Schema.array(Schema.string())
});
```

## Error Handling

The validation result has this structure:
```typescript
interface ValidationResult<T> {
  isValid: boolean;
  value?: T;
  errors?: string[];
}
```

Best practice for error handling:
```typescript
function validateWithErrorHandling<T>(schema: any, data: any): T | null {
  try {
    const result = schema.validate(data);
    
    if (result.isValid) {
      return result.value as T;
    }
    
    // Handle validation errors
    console.error("Validation failed:", result.errors);
    return null;
  } catch (error) {
    console.error("Unexpected error during validation:", error);
    return null;
  }
}
```

## Development

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

### Building and Running

The project includes the following npm scripts:

```json
{
  "scripts": {
    "build": "tsc",           // Compiles TypeScript to JavaScript
    "start": "node dist/index.js",  // Runs the compiled code
    "dev": "tsc -w",          // Watches for changes and recompiles
    "test": "jest",           // Runs tests
    "test:coverage": "jest --coverage"  // Runs tests with coverage report
  }
}
```

To use these scripts:

1. Build the project:
   ```bash
   npm run build
   ```

2. Run the project:
   ```bash
   npm start
   ```

3. For development (with auto-rebuild):
   ```bash
   npm run dev
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