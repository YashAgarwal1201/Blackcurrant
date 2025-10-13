// String Manipulation Functions

export function alternateCase(input) {
  let result = "";
  let toggle = true; // Start with uppercase

  for (let i = 0; i < input.length; i++) {
    let char = input[i];

    // Check if the character is a letter
    if (/[a-zA-Z]/.test(char)) {
      if (toggle) {
        result += char.toUpperCase();
      } else {
        result += char.toLowerCase();
      }
      toggle = !toggle; // Flip toggle between uppercase and lowercase
    } else {
      result += char; // If it's not a letter, just append it
    }
  }

  return result;
}

export function toCamelCase(input) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (chr) => chr.toUpperCase())
    .replace(/^[A-Z]/, (match) => match.toLowerCase()); // Ensure first letter is lowercase
}

export function toPascalCase(input: string) {
  return input
    .trim()
    .replace(/[^a-zA-Z0-9]+(.)?/g, (chr) => (chr ? chr.toUpperCase() : ""))
    .replace(/^[a-z]/, (match) => match.toUpperCase()); // Ensure first letter is uppercase
}

export function toKebabCase(input) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing dashes
}

export function toSnakeCase(input) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, ""); // Remove leading/trailing underscores
}

export function toScreamingSnakeCase(input) {
  return input
    .trim()
    .toUpperCase()
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, ""); // Remove leading/trailing underscores
}

export function reverseString(input) {
  return input.split("").reverse().join("");
}

export function randomizeCase(input) {
  return input
    .split("")
    .map((char) => {
      // Randomly decide to convert the character to uppercase or lowercase
      return Math.random() < 0.5 ? char.toLowerCase() : char.toUpperCase();
    })
    .join("");
}

export function removeWhitespace(input) {
  // Remove leading and trailing whitespace
  const trimmedString = input.trim();

  // Remove all whitespace characters within the string
  const noWhitespaceString = trimmedString.replace(/\s+/g, "");

  return noWhitespaceString;
}

export function stringToBinary(input) {
  return input
    .split("")
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0")) // Convert each character to binary
    .join(" "); // Join the binary values with spaces
}

export function stringToAscii(input) {
  return input
    .split("")
    .map((char) => char.charCodeAt(0))
    .join(", "); // Return as comma-separated string for better display
}
