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
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
}

export function toPascalCase(input: string) {
  return input
    .replace(
      /(\w)(\w*)/g,
      (_, firstLetter: string, rest: string) =>
        firstLetter.toUpperCase() + rest.toLowerCase()
    )
    .replace(/\s+/g, ""); // Remove spaces
}

export function toKebabCase(input) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+/g, "-");
}

export function toSnakeCase(input) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+/g, "_");
}

export function toScreamingSnakeCase(input) {
  return input
    .trim()
    .toUpperCase()
    .replace(/[^a-zA-Z0-9]+/g, "_");
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
  return input.split("").map((char) => char.charCodeAt(0)); // Convert each character to its ASCII code
}
