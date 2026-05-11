import {
  addDaysToDate,
  calculateAge,
  convertTimestampToDate,
  getCurrentDate,
  getDaysBetweenDates,
  getFirstDayOfMonth,
  getLastDayOfMonth,
  isLeapYear,
  isWeekend,
} from "../DateFunctions";
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
} from "../NumberFunctions";
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
} from "../StringFunctions";

export const WEB_APIS_CARDS_BASE_STYLES =
  "h-[300px] bg-color2 text-color5 rounded-md";

export const TOAST_MSGS = {
  FEAT_UNDER_CONSTRUCTION: "This feature is under construction.",
  LINK_IN_NEW_TAB: "This app is opened in new tab.",
};

// export const STRING_OPTIONS = [
//   "Alternate Case",
//   "Camel Case",
//   "Pascal Case",
//   "Snake Case",
//   "Screaming Snake Case",
//   "Kebab Case",
//   "Reverse",
//   "Randomise Case",
//   "No Whitespace",
//   "Binary String",
//   "ASCII String",
// ];

// export const stringFunctions = {
//   "Alternate Case": alternateCase,
//   Reverse: reverseString,
//   "Pascal Case": toPascalCase,
//   "Camel Case": toCamelCase,
//   "Kebab Case": toKebabCase,
//   "Snake Case": toSnakeCase,
//   "Screaming Snake Case": toScreamingSnakeCase,
//   "Randomise Case": randomizeCase,
//   "No Whitespace": removeWhitespace,
//   "Binary String": stringToBinary,
//   "ASCII String": stringToAscii,
// };

// export const NUMBER_OPTIONS = [
//   "Number to HEX",
//   "HEX to Number",
//   "Number to Binary",
//   "Binary to Number",
//   "Is Prime",
//   "Factorial",
//   "Fibonacci",
//   "Sum of Digits",
//   "Reverse of Number",
//   "Greatest Common Divisor",
//   "Least Common Multiple",
// ];

// export const numberFunctions = {
//   "Number to HEX": numberToHex,
//   "HEX to Number": hexToNumber,
//   "Number to Binary": numberToBinary,
//   "Binary to Number": binaryToNumber,
//   "Is Prime": isPrime,
//   Factorial: factorial,
//   Fibonacci: fibonacci,
//   "Sum of Digits": sumOfDigits,
//   "Reverse of Number": reverseNumber,
//   "Greatest Common Divisor": gcd,
//   "Least Common Multiple": lcm,
// };

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

export const dateFunctions = {
  "Current Date": getCurrentDate,
  "Is Weekend": isWeekend,
  "Is leap year": isLeapYear,
  "Calculate Age": calculateAge,
  "First Day of Month": getFirstDayOfMonth,
  "Last Day of Month": getLastDayOfMonth,
  "Timestamp to Dates": convertTimestampToDate,
  "Days b/w Dates": getDaysBetweenDates,
  "Add Days to Date": addDaysToDate,
};

// Generate options from the keys of the functions
export const STRING_OPTIONS = Object.keys(stringFunctions);
export const NUMBER_OPTIONS = Object.keys(numberFunctions);
export const DATE_OPTIONS = Object.keys(dateFunctions);

export const NAV_OPTIONS = [
  { title: "Play with Strings", link: "/play-with-strings" },
  { title: "Play with Numbers", link: "/play-with-numbers" },
  // { title: "Play with JS Dates", link: "/play-with-dates" },
  { title: "Browser Vitals", link: "/browser-vitals" },
  { title: "Coditor Playground", link: "/coditor-playground" },
];
