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
