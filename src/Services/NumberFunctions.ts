export function numberToHex(num) {
  return num?.toString(16)?.toUpperCase();
}

export function hexToNumber(hexStr: string) {
  return parseInt(hexStr, 16);
}

export function numberToBinary(num) {
  return num?.toString(2);
}

export function binaryToNumber(binaryStr) {
  return parseInt(binaryStr, 2);
}

export function isPrime(num) {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

export function factorial(num) {
  if (num < 0) return -1; // Negative numbers don't have factorials
  if (num === 0 || num === 1) return 1;
  return num * factorial(num - 1);
}

export function fibonacci(n) {
  const fib = [0, 1];
  for (let i = 2; i < n; i++) {
    fib[i] = fib[i - 1] + fib[i - 2];
  }
  return fib;
}

export function sumOfDigits(num) {
  return num
    ?.toString()
    ?.split("")
    ?.reduce((sum, digit) => sum + parseInt(digit), 0);
}

export function reverseNumber(num) {
  return parseInt(num?.toString()?.split("")?.reverse()?.join(""));
}

export function gcd(a, b) {
  if (!b) return a;
  return gcd(b, a % b);
}

export function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}
