// Base interface for all validators
interface Validator<T> {
  validate(value: any): ValidationResult<T>;
  withMessage(message: string): this;
}

// Validation result type containing validation status and any errors
interface ValidationResult<T> {
  isValid: boolean;
  value?: T;
  errors?: string[];
}

// Base validator class with common functionality for all validators
abstract class BaseValidator<T> implements Validator<T> {
  protected customMessage?: string;

  // Sets a custom error message for this validator
  withMessage(message: string): this {
    this.customMessage = message;
    return this;
  }

  // Creates an error result with the given message
  protected createError(message: string): ValidationResult<T> {
    return {
      isValid: false,
      errors: [this.customMessage || message]
    };
  }

  // Creates a success result with the validated value
  protected createSuccess(value: T): ValidationResult<T> {
    return {
      isValid: true,
      value
    };
  }

  abstract validate(value: any): ValidationResult<T>;
}

// Validator for string values with length and pattern constraints
class StringValidator extends BaseValidator<string> {
  private _minLength?: number;
  private _maxLength?: number;
  private _pattern?: RegExp;

  // Sets the minimum allowed length for the string
  minLength(length: number): this {
    this._minLength = length;
    return this;
  }

  // Sets the maximum allowed length for the string
  maxLength(length: number): this {
    this._maxLength = length;
    return this;
  }

  // Sets a regex pattern that the string must match
  pattern(regex: RegExp): this {
    this._pattern = regex;
    return this;
  }

  // Validates a string value against all constraints
  validate(value: any): ValidationResult<string> {
    if (typeof value !== 'string') {
      return this.createError('Value must be a string');
    }

    if (this._minLength !== undefined && value.length < this._minLength) {
      return this.createError(`String must be at least ${this._minLength} characters long`);
    }

    if (this._maxLength !== undefined && value.length > this._maxLength) {
      return this.createError(`String must be at most ${this._maxLength} characters long`);
    }

    if (this._pattern && !this._pattern.test(value)) {
      return this.createError('String does not match required pattern');
    }

    return this.createSuccess(value);
  }
}

// Validator for number values with range constraints
class NumberValidator extends BaseValidator<number> {
  private _min?: number;
  private _max?: number;
  private isOptional: boolean = false;

  // Sets the minimum allowed value
  min(value: number): this {
    this._min = value;
    return this;
  }

  // Sets the maximum allowed value
  max(value: number): this {
    this._max = value;
    return this;
  }

  // Makes the field optional (undefined is allowed)
  optional(): this {
    this.isOptional = true;
    return this;
  }

  // Validates a number value against all constraints
  validate(value: any): ValidationResult<number> {
    if (this.isOptional && value === undefined) {
      return this.createSuccess(undefined as any);
    }

    if (typeof value !== 'number') {
      return this.createError('Value must be a number');
    }

    if (this._min !== undefined && value < this._min) {
      return this.createError(`Number must be at least ${this._min}`);
    }

    if (this._max !== undefined && value > this._max) {
      return this.createError(`Number must be at most ${this._max}`);
    }

    return this.createSuccess(value);
  }
}

// Validator for boolean values
class BooleanValidator extends BaseValidator<boolean> {
  // Validates that the value is a boolean
  validate(value: any): ValidationResult<boolean> {
    if (typeof value !== 'boolean') {
      return this.createError('Value must be a boolean');
    }
    return this.createSuccess(value);
  }
}

// Validator for date values
class DateValidator extends BaseValidator<Date> {
  // Validates that the value is a valid date (Date object or parseable date string)
  validate(value: any): ValidationResult<Date> {
    if (!(value instanceof Date) && isNaN(Date.parse(value))) {
      return this.createError('Value must be a valid date');
    }
    return this.createSuccess(new Date(value));
  }
}

// Validator for object values with a schema
class ObjectValidator<T> extends BaseValidator<T> {
  private isOptional: boolean = false;

  constructor(private schema: Record<string, Validator<any>>) {
    super();
  }

  // Makes the field optional (undefined is allowed)
  optional(): this {
    this.isOptional = true;
    return this;
  }

  // Validates an object against the defined schema
  validate(value: any): ValidationResult<T> {
    if (this.isOptional && value === undefined) {
      return this.createSuccess(undefined as any);
    }
    if (typeof value !== 'object' || value === null) {
      return this.createError('Value must be an object');
    }

    const errors: string[] = [];
    const result: any = {};

    // Validate each field in the schema
    for (const [key, validator] of Object.entries(this.schema)) {
      const validationResult = validator.validate(value[key]);
      if (!validationResult.isValid) {
        errors.push(...(validationResult.errors || []).map(err => `${key}: ${err}`));
      } else {
        result[key] = validationResult.value;
      }
    }

    if (errors.length > 0) {
      return {
        isValid: false,
        errors
      };
    }

    return this.createSuccess(result as T);
  }
}

// Validator for array values
class ArrayValidator<T> extends BaseValidator<T[]> {
  private isOptional: boolean = false;

  constructor(private itemValidator: Validator<T>) {
    super();
  }

  // Makes the field optional (undefined is allowed)
  optional(): this {
    this.isOptional = true;
    return this;
  }

  // Validates an array and its items against the item validator
  validate(value: any): ValidationResult<T[]> {
    if (this.isOptional && value === undefined) {
      return this.createSuccess(undefined as any);
    }
    if (!Array.isArray(value)) {
      return this.createError('Value must be an array');
    }

    const errors: string[] = [];
    const result: T[] = [];

    // Validate each item in the array
    for (let i = 0; i < value.length; i++) {
      const validationResult = this.itemValidator.validate(value[i]);
      if (!validationResult.isValid) {
        errors.push(...(validationResult.errors || []).map(err => `[${i}]: ${err}`));
      } else {
        result.push(validationResult.value as T);
      }
    }

    if (errors.length > 0) {
      return {
        isValid: false,
        errors
      };
    }

    return this.createSuccess(result);
  }
}

// Schema builder class providing static methods to create validators
export class Schema {
  // Creates a string validator
  static string(): StringValidator {
    return new StringValidator();
  }
  
  // Creates a number validator
  static number(): NumberValidator {
    return new NumberValidator();
  }
  
  // Creates a boolean validator
  static boolean(): BooleanValidator {
    return new BooleanValidator();
  }
  
  // Creates a date validator
  static date(): DateValidator {
    return new DateValidator();
  }
  
  // Creates an object validator with the given schema
  static object<T>(schema: Record<string, Validator<any>>): ObjectValidator<T> {
    return new ObjectValidator<T>(schema);
  }
  
  // Creates an array validator for the given item type
  static array<T>(itemValidator: Validator<T>): ArrayValidator<T> {
    return new ArrayValidator<T>(itemValidator);
  }
} 