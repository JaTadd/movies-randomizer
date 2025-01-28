// Exemple de fonction simple à tester
function addNumbers(a, b) {
    return a + b;
  }
  
  describe('Simple Function Test', () => {
    it('should return the correct sum of two numbers', () => {
      const result = addNumbers(2, 3); // Appelle la fonction avec 2 et 3
      expect(result).toBe(5); // Vérifie que le résultat est bien 5
    });
  
    it('should return 0 when adding 0 and 0', () => {
      const result = addNumbers(0, 0);
      expect(result).toBe(0);
    });
  
    it('should handle negative numbers', () => {
      const result = addNumbers(-5, 3);
      expect(result).toBe(-2);
    });
  });
  