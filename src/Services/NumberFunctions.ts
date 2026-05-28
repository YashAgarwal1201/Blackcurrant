// src/Services/NumberFunctions.ts

// Decimal ↔ Hexadecimal ─

export function numberToHex(num: number): string {
  // Guard: only non-negative integers produce valid hex
  const n = Math.floor(Math.abs(num));
  return n.toString(16).toUpperCase();
}

export function hexToNumber(hexStr: string): number | string {
  // parseInt silently stops at the first invalid char ("1G2" → 1).
  // Validate the full string first so we never return a partial result.
  if (!/^[0-9a-fA-F]+$/.test(hexStr.trim())) return "Invalid hex string";
  return parseInt(hexStr.trim(), 16);
}

// Decimal ↔ Binary ──────

export function numberToBinary(num: number): string {
  // Guard: negative inputs produce "-101" which looks like valid binary.
  const n = Math.floor(Math.abs(num));
  return n.toString(2);
}

export function binaryToNumber(binaryStr: string): number | string {
  // parseInt('102', 2) silently returns 2 — it stops at the invalid '2'.
  // Validate strictly: only 0s and 1s allowed.
  if (!/^[01]+$/.test(binaryStr.trim())) return "Invalid binary string";
  return parseInt(binaryStr.trim(), 2);
}

// Number theory ─────────

export function isPrime(num: number): boolean {
  // Works correctly for all integers ≥ 0.
  // 0 and 1 are not prime by definition.
  const n = Math.floor(num);
  if (n <= 1) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}

export function factorial(num: number): number | string {
  const n = Math.floor(num);

  // Factorials of negative numbers are undefined
  if (n < 0) return "Undefined for negative numbers";

  // JavaScript's Number type loses precision above 18! (exceeds MAX_SAFE_INTEGER).
  // Use BigInt for exact results up to any size, then convert back to string.
  // We return a string here because BigInt can't be implicitly coerced to Number.
  if (n > 18) {
    let result = BigInt(1);
    for (let i = BigInt(2); i <= BigInt(n); i++) result *= i;
    return result.toString();
  }

  if (n === 0 || n === 1) return 1;
  return n * (factorial(n - 1) as number);
}

export function fibonacci(n: number): number[] {
  // BUG FIX: original always seeded [0, 1] so fibonacci(1) returned [0,1]
  // instead of [0]. We now build the sequence fully and slice to n elements.
  const count = Math.max(1, Math.floor(n));
  const fib: number[] = [0, 1];
  for (let i = 2; i < count; i++) {
    fib[i] = fib[i - 1] + fib[i - 2];
  }
  return fib.slice(0, count);
}

export function sumOfDigits(num: number): number {
  // BUG FIX: negative numbers had "-" in the split, parseInt("-") = NaN.
  // Using Math.abs() first ensures only digit characters are processed.
  return Math.abs(Math.floor(num))
    .toString()
    .split("")
    .reduce((sum, digit) => sum + parseInt(digit, 10), 0);
}

export function reverseNumber(num: number): number {
  // Negative numbers: strip the sign, reverse, then reapply sign.
  // This is cleaner than silently dropping the minus.
  const sign = num < 0 ? -1 : 1;
  const reversed = parseInt(
    Math.abs(Math.floor(num)).toString().split("").reverse().join(""),
    10,
  );
  return sign * reversed;
}

// GCD & LCM─

export function gcd(a: number, b: number): number {
  // BUG FIX: negative inputs produced a negative GCD (gcd(-12, 8) = -4).
  // GCD is always a positive integer by definition.
  const _gcd = (x: number, y: number): number => (!y ? x : _gcd(y, x % y));
  return _gcd(Math.abs(Math.floor(a)), Math.abs(Math.floor(b)));
}

export function lcm(a: number, b: number): number {
  const _a = Math.abs(Math.floor(a));
  const _b = Math.abs(Math.floor(b));
  if (_a === 0 || _b === 0) return 0;
  return (_a * _b) / gcd(_a, _b);
}
