import { Schema } from './validator';

describe('Schema Validators', () => {
  describe('String Validator', () => {
    it('should validate string values', () => {
      const validator = Schema.string();
      expect(validator.validate('test').isValid).toBe(true);
      expect(validator.validate(123).isValid).toBe(false);
    });

    it('should validate string length constraints', () => {
      const validator = Schema.string().minLength(2).maxLength(5);
      expect(validator.validate('ab').isValid).toBe(true);
      expect(validator.validate('a').isValid).toBe(false);
      expect(validator.validate('abcdef').isValid).toBe(false);
    });

    it('should validate string patterns', () => {
      const validator = Schema.string().pattern(/^[A-Z]+$/);
      expect(validator.validate('ABC').isValid).toBe(true);
      expect(validator.validate('abc').isValid).toBe(false);
    });

    it('should support custom error messages', () => {
      const validator = Schema.string().withMessage('Custom error');
      expect(validator.validate(123).errors?.[0]).toBe('Custom error');
    });
  });

  describe('Number Validator', () => {
    it('should validate number values', () => {
      const validator = Schema.number();
      expect(validator.validate(123).isValid).toBe(true);
      expect(validator.validate('123').isValid).toBe(false);
    });

    it('should validate number range constraints', () => {
      const validator = Schema.number().min(1).max(10);
      expect(validator.validate(5).isValid).toBe(true);
      expect(validator.validate(0).isValid).toBe(false);
      expect(validator.validate(11).isValid).toBe(false);
    });

    it('should support optional numbers', () => {
      const validator = Schema.number().optional();
      expect(validator.validate(undefined).isValid).toBe(true);
      expect(validator.validate(null).isValid).toBe(false);
    });
  });

  describe('Boolean Validator', () => {
    it('should validate boolean values', () => {
      const validator = Schema.boolean();
      expect(validator.validate(true).isValid).toBe(true);
      expect(validator.validate(false).isValid).toBe(true);
      expect(validator.validate('true').isValid).toBe(false);
    });
  });

  describe('Date Validator', () => {
    it('should validate date values', () => {
      const validator = Schema.date();
      expect(validator.validate(new Date()).isValid).toBe(true);
      expect(validator.validate('2023-01-01').isValid).toBe(true);
      expect(validator.validate('invalid').isValid).toBe(false);
    });
  });

  describe('Object Validator', () => {
    it('should validate object values', () => {
      const schema = Schema.object({
        name: Schema.string(),
        age: Schema.number()
      });

      expect(schema.validate({ name: 'John', age: 30 }).isValid).toBe(true);
      expect(schema.validate({ name: 'John' }).isValid).toBe(false);
      expect(schema.validate('not an object').isValid).toBe(false);
    });

    it('should validate nested objects', () => {
      const schema = Schema.object({
        user: Schema.object({
          name: Schema.string(),
          age: Schema.number()
        })
      });

      expect(schema.validate({
        user: { name: 'John', age: 30 }
      }).isValid).toBe(true);

      expect(schema.validate({
        user: { name: 'John' }
      }).isValid).toBe(false);
    });
  });

  describe('Array Validator', () => {
    it('should validate array values', () => {
      const validator = Schema.array(Schema.string());
      expect(validator.validate(['a', 'b']).isValid).toBe(true);
      expect(validator.validate(['a', 1]).isValid).toBe(false);
      expect(validator.validate('not an array').isValid).toBe(false);
    });

    it('should validate arrays of objects', () => {
      const validator = Schema.array(
        Schema.object({
          name: Schema.string(),
          age: Schema.number()
        })
      );

      expect(validator.validate([
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 }
      ]).isValid).toBe(true);

      expect(validator.validate([
        { name: 'John' }
      ]).isValid).toBe(false);
    });
  });

  describe('Complex Schema Example', () => {
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

    it('should validate complex user data', () => {
      const validUser = {
        id: "12345",
        name: "John Doe",
        email: "john@example.com",
        isActive: true,
        tags: ["developer", "designer"],
        address: {
          street: "123 Main St",
          city: "Anytown",
          postalCode: "12345",
          country: "USA"
        }
      };

      expect(userSchema.validate(validUser).isValid).toBe(true);
    });

    it('should reject invalid user data', () => {
      const invalidUser = {
        id: "12345",
        name: "J", // Too short
        email: "invalid-email",
        isActive: "true", // Should be boolean
        tags: ["developer", 123], // Invalid tag type
        address: {
          street: "123 Main St",
          city: "Anytown",
          postalCode: "1234", // Invalid postal code
          country: "USA"
        }
      };

      const result = userSchema.validate(invalidUser);
      expect(result.isValid).toBe(false);
      expect(result.errors?.length).toBeGreaterThan(0);
    });
  });
}); 