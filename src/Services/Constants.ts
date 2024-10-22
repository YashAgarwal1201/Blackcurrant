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
