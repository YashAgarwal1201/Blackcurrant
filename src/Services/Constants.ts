import {
  binaryToNumber,
  factorial,
  fibonacci,
  gcd,
  hexToNumber,
  isPrime,
  lcm,
  numberToBinary,
  numberToHex,
  reverseNumber,
  sumOfDigits,
} from "./NumberFunctions";
import {
  alternateCase,
  reverseString,
  toCamelCase,
  toKebabCase,
  toSnakeCase,
  toScreamingSnakeCase,
  toPascalCase,
  randomizeCase,
  removeWhitespace,
  stringToBinary,
  stringToAscii,
} from "./StringFunctions";

export const TOAST_MSGS = {
  FEAT_UNDER_CONSTRUCTION: "This feature is under construction.",
  LINK_IN_NEW_TAB: "This app is opened in new tab.",
};

export const STRING_OPTIONS = [
  "Alternate Case",
  "Camel Case",
  "Pascal Case",
  "Snake Case",
  "Screaming Snake Case",
  "Kebab Case",
  "Reverse",
  "Randomise Case",
  "No Whitespace",
  "Binary String",
  "ASCII String",
];

export const stringFunctions = {
  "Alternate Case": alternateCase,
  Reverse: reverseString,
  "Pascal Case": toPascalCase,
  "Camel Case": toCamelCase,
  "Kebab Case": toKebabCase,
  "Snake Case": toSnakeCase,
  "Screaming Snake Case": toScreamingSnakeCase,
  "Randomise Case": randomizeCase,
  "No Whitespace": removeWhitespace,
  "Binary String": stringToBinary,
  "ASCII String": stringToAscii,
};

export const NUMBER_OPTIONS = [
  "Number to HEX",
  "HEX to Number",
  "Number to Binary",
  "Binary to Number",
  "Is Prime",
  "Factorial",
  "Fibonacci",
  "Sum of Digits",
  "Reverse of Number",
  "Greatest Common Divisor",
  "Least Common Multiple",
];

export const numberFunctions = {
  "Number to HEX": numberToHex,
  "HEX to Number": hexToNumber,
  "Number to Binary": numberToBinary,
  "Binary to Number": binaryToNumber,
  "Is Prime": isPrime,
  Factorial: factorial,
  Fibonacci: fibonacci,
  "Sum of Digits": sumOfDigits,
  "Reverse of Number": reverseNumber,
  "Greatest Common Divisor": gcd,
  "Least Common Multiple": lcm,
};
