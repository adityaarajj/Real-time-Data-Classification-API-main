// __tests__/dslEvaluator.test.js
const {
  stringOperations,
  comparisonOperators,
  evaluateDSL,
} = require("../../app/logic");

describe("String Operations", () => {
  test("count: should count occurrences of a character", () => {
    expect(stringOperations.count("a", "banana")).toBe(3);
    expect(stringOperations.count("x", "banana")).toBe(0);
  });

  test("avg: should calculate the average occurrence of a character", () => {
    expect(stringOperations.avg("a", "banana")).toBe(3 / 6);
    expect(stringOperations.avg("x", "banana")).toBe(0);
  });

  test("min: should return the least frequent character", () => {
    expect(stringOperations.min(null, "banana")).toBe("b");
    expect(stringOperations.min(null, "aabba")).toBe("b"); // Both 'a' and 'b' are equally frequent
  });

  test("max: should return the most frequent character", () => {
    expect(stringOperations.max(null, "banana")).toBe("a");
    expect(stringOperations.max(null, "aabba")).toBe("a"); // Both 'a' and 'b' are equally frequent
  });

  test("sum: should return the total number of characters", () => {
    expect(stringOperations.sum(null, "banana")).toBe(6);
    expect(stringOperations.sum(null, "")).toBe(0);
  });
});

describe("Comparison Operators", () => {
  test("> : should return true if a is greater than b", () => {
    expect(comparisonOperators[">"](5, 3)).toBe(true);
    expect(comparisonOperators[">"](2, 4)).toBe(false);
  });

  test("< : should return true if a is less than b", () => {
    expect(comparisonOperators["<"](3, 5)).toBe(true);
    expect(comparisonOperators["<"](6, 2)).toBe(false);
  });

  test(">= : should return true if a is greater than or equal to b", () => {
    expect(comparisonOperators[">="](5, 5)).toBe(true);
    expect(comparisonOperators[">="](5, 3)).toBe(true);
    expect(comparisonOperators[">="](2, 4)).toBe(false);
  });

  test("<= : should return true if a is less than or equal to b", () => {
    expect(comparisonOperators["<="](3, 5)).toBe(true);
    expect(comparisonOperators["<="](5, 5)).toBe(true);
    expect(comparisonOperators["<="](6, 2)).toBe(false);
  });

  test("= : should return true if a is equal to b", () => {
    expect(comparisonOperators["="](5, 5)).toBe(true);
    expect(comparisonOperators["="](5, 3)).toBe(false);
  });

  test("!= : should return true if a is not equal to b", () => {
    expect(comparisonOperators["!="](5, 3)).toBe(true);
    expect(comparisonOperators["!="](5, 5)).toBe(false);
  });
});

describe("DSL Evaluation", () => {
  test("should evaluate count rule correctly", () => {
    expect(evaluateDSL(`count('a') < 3`, "banana")).toBe(false); // 3 is not less than 3
    expect(evaluateDSL(`count('a') > 2`, "banana")).toBe(true); // 3 is greater than 2
  });

  test("should evaluate avg rule correctly", () => {
    expect(evaluateDSL(`avg('a') < 1`, "banana")).toBe(true); // 0.5 is less than 1
    expect(evaluateDSL(`avg('a') > 1`, "banana")).toBe(false); // 0.5 is greater than 0.4
  });

  test("should evaluate min rule correctly", () => {
    expect(evaluateDSL(`min() = 'b'`, "banana")).toBe(true); // 'b' is the least frequent character
    expect(evaluateDSL(`min() != 'n'`, "banana")).toBe(true); // 'n' is not the least frequent
  });

  test("should evaluate max rule correctly", () => {
    expect(evaluateDSL(`max() = 'a'`, "banana")).toBe(true); // 'a' is the most frequent character
    expect(evaluateDSL(`max() != 'n'`, "banana")).toBe(true); // 'n' is not the most frequent
  });

  test("should evaluate sum rule correctly", () => {
    expect(evaluateDSL(`sum() >= 6`, "banana")).toBe(true); // 6 is equal to 6
    expect(evaluateDSL(`sum() < 10`, "banana")).toBe(true); // 6 is less than 10
  });
});
