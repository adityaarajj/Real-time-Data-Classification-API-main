// Define the string operations
const stringOperations = {
  count: (char, str) => str.split(char).length - 1, // Count occurrences of a character
  avg: (char, str) => {
    const count = str.split(char).length - 1; // Number of occurrences
    return count / str.length; // Average occurrence
  },
  min: (char, str) => {
    const freq = {}; // Frequency map
    str.split("").forEach((char) => (freq[char] = (freq[char] || 0) + 1));
    return Object.keys(freq).reduce((a, b) => (freq[a] < freq[b] ? a : b)); // Least frequent character
  },
  max: (char, str) => {
    const freq = {}; // Frequency map
    str.split("").forEach((char) => (freq[char] = (freq[char] || 0) + 1));
    return Object.keys(freq).reduce((a, b) => (freq[a] > freq[b] ? a : b)); // Most frequent character
  },
  sum: (char, str) => str.length, // Total number of characters
};

// Define comparison operators
const comparisonOperators = {
  ">": (a, b) => a > b,
  "<": (a, b) => a < b,
  ">=": (a, b) => a >= b,
  "<=": (a, b) => a <= b,
  "=": (a, b) => a === b,
  "!=": (a, b) => a !== b,
};

// Define the DSL evaluation function
const evaluateDSL = (rule, str) => {
  // Extract the function name and arguments from the rule
  const functionMatch = rule.match(/(\w+)\(([^)]*)\)/);
  if (!functionMatch) throw new Error("Invalid function syntax");
  const [, functionName, args] = functionMatch; // Destructure to get function name and arguments
  if (!stringOperations[functionName])
    throw new Error(`Unknown function: ${functionName}`);
  const functionArgs = args
    .split(",")
    .map((arg) => arg.trim().replace(/['"]+/g, "")); // Clean arguments
  const functionResult = stringOperations[functionName](...functionArgs, str); // Call function

  // Extract the operator and comparison value from the rule
  const operatorMatch = rule.match(
    /([<>!=]=?|==)\s*(-?\d*\.?\d+|'[^']*'|"[^"]*")$/);
  if (!operatorMatch) throw new Error("Invalid operator or comparison value");
  const [, operator, value] = operatorMatch; // Destructure to get operator and value
  if (!comparisonOperators[operator])
    throw new Error(`Unknown operator: ${operator}`);
  const comparisonValue = isNaN(value)
    ? value.replace(/['"]+/g, "")
    : Number(value); // Parse comparison value
  return comparisonOperators[operator](functionResult, comparisonValue); // Compare and return result
};

// Example rules and usage
// const rules = [
//   `count('a') < 1`, // Rule: count of 'a' should be more than 1
//   `avg('o') < 1`, // Rule: average occurrence of 'o' should be less than 0.5
//   `min() = 'b'`, // Rule: least frequent character should be 'b'
//   `max() != 'a'`, // Rule: most frequent character should not be 'o'
//   `sum() >= 10`, // Rule: total number of characters should be at least
// ];

module.exports = { stringOperations, comparisonOperators, evaluateDSL };
