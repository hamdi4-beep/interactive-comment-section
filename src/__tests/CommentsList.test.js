function sum(a, b) {
  return a + b;
}

describe('sum function', () => {
  it('should return the sum of two numbers', () => {
    expect(sum(1, 2)).toBe(3);
    expect(sum(-1, 1)).toBe(0);
    expect(sum(0, 0)).toBe(0);
  });

  it('should handle negative numbers', () => {
    expect(sum(-5, -5)).toBe(-10);
    expect(sum(-1, -1)).toBe(-2);
  });

  it('should handle zero', () => {
    expect(sum(0, 5)).toBe(5);
    expect(sum(5, 0)).toBe(5);
  });
});