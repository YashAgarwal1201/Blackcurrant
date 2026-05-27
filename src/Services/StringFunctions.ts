// src/Services/StringFunctions.ts

export function alternateCase(input: string): string {
  let result = "";
  let toggle = true; // Start with uppercase

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (/[a-zA-Z]/.test(char)) {
      result += toggle ? char.toUpperCase() : char.toLowerCase();
      toggle = !toggle;
    } else {
      result += char; // Non-letter characters don't affect the toggle
    }
  }

  return result;
}

export function toCamelCase(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, capturedChar) =>
      capturedChar.toUpperCase(),
    );
}

export function toPascalCase(input: string): string {
  return input
    .trim()
    .replace(/[^a-zA-Z0-9]+(.)?/g, (_, capturedChar) =>
      capturedChar ? capturedChar.toUpperCase() : "",
    )
    .replace(/^[a-z]/, (match) => match.toUpperCase());
}

export function toKebabCase(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing dashes
}

export function toSnakeCase(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, ""); // Remove leading/trailing underscores
}

export function toScreamingSnakeCase(input: string): string {
  return input
    .trim()
    .toUpperCase()
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, ""); // Remove leading/trailing underscores
}

export function reverseString(input: string): string {
  return input.split("").reverse().join("");
}

export function randomizeCase(input: string): string {
  return input
    .split("")
    .map((char) =>
      Math.random() < 0.5 ? char.toLowerCase() : char.toUpperCase(),
    )
    .join("");
}

export function removeWhitespace(input: string): string {
  return input.trim().replace(/\s+/g, "");
}

export function stringToBinary(input: string): string {
  return input
    .split("")
    .map((char) => {
      const codePoint = char.codePointAt(0) ?? 0;
      const bits = codePoint.toString(2);
      // Pad to nearest multiple of 8 so each byte boundary is clear.
      const padWidth = Math.max(8, Math.ceil(bits.length / 8) * 8);
      return bits.padStart(padWidth, "0");
    })
    .join(" ");
}

export function stringToAscii(input: string): string {
  return input
    .split("")
    .map((char) => {
      const code = char.charCodeAt(0);
      return code > 127 ? `${code}(?)` : `${code}`;
    })
    .join(", ");
}
