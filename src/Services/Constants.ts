import {
  alternateCase,
  reverseString,
  toCamelCase,
  toKebabCase,
  toSnakeCase,
  toScreamingSnakeCase,
} from "./StringFunctions";

export const TOAST_MSGS = {
  FEAT_UNDER_CONSTRUCTION: "This feature is under construction.",
  LINK_IN_NEW_TAB: "This app is opened in new tab.",
};

export const STRING_OPTIONS = [
  "Alternate Case",
  "Camel Case",
  // "Pascal Case",
  "Snake Case",
  "Screaming Snake Case",
  "Kebab Case",
  "Reverse",
];

export const stringFunctions = {
  "Alternate Case": alternateCase,
  Reverse: reverseString,
  // "Pascal Case": toPascalCase,
  "Camel Case": toCamelCase,
  "Kebab Case": toKebabCase,
  "Snake Case": toSnakeCase,
  "Screaming Snake Case": toScreamingSnakeCase,
};
