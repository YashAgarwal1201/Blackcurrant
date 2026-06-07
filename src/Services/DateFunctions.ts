export function getCurrentDate(): string {
  const today: Date = new Date();
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return today.toLocaleDateString(undefined, options);
}

export function isWeekend(date: string | Date): boolean {
  const day: number = new Date(date).getDay();
  return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function calculateAge(birthDate: string | Date): number {
  const today: Date = new Date();
  const birth: Date = new Date(birthDate);
  let age: number = today.getFullYear() - birth.getFullYear();
  const monthDiff: number = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

export function getFirstDayOfMonth(date: string | Date): Date {
  const d: Date = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function getLastDayOfMonth(date: string | Date): Date {
  const d: Date = new Date(date);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

export function convertTimestampToDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString();
}

export function getDaysBetweenDates(
  date1: string | Date,
  date2: string | Date,
): number {
  const oneDay: number = 24 * 60 * 60 * 1000; // Milliseconds in a day
  const diffInTime: number = Math.abs(
    new Date(date2).getTime() - new Date(date1).getTime(),
  );
  return Math.ceil(diffInTime / oneDay);
}

export function addDaysToDate(date: string | Date, days: number): Date {
  const result: Date = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
