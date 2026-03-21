import { describe, it, expect } from 'vitest';
import { isValidRFC } from './rfc.utils';

describe('isValidRFC', () => {
  it('should validate a correct physical person RFC', () => {
    expect(isValidRFC('GOME880101ABC')).toBe(true);
  });

  it('should validate a correct moral person RFC', () => {
    expect(isValidRFC('ABC880101AB1')).toBe(true);
  });

  it('should invalidate an incorrect RFC', () => {
    expect(isValidRFC('INVALID-RFC')).toBe(false);
  });

  it('should be case insensitive', () => {
    expect(isValidRFC('gome880101abc')).toBe(true);
  });
});
