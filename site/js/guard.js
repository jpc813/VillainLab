// Browser copy of netlify/lib/guard.mjs (keep in sync). First line of defense only.

export const PERSONAL = /\b(my|our)\s+\w+|\b(boss|coworker|co-worker|manager|teacher|professor|instructor|classmate|roommate|neighbou?r|ex|girlfriend|boyfriend|wife|husband|mom|mother|dad|father|sister|brother|cousin|aunt|uncle|grandma|grandpa|friend)\b|\bdr\.?\s+lee\b/i;

export const REAL_NAMES = [
  "trump", "biden", "obama", "kamala", "harris", "clinton", "putin", "xi jinping", "zelensky", "netanyahu",
  "elon", "musk", "zuckerberg", "bezos", "gates", "jobs", "taylor swift", "kanye", "ye west", "kardashian",
  "beyonce", "aubrey graham", "diddy", "epstein", "hitler", "stalin", "mussolini", "pol pot", "bin laden", "saddam",
  "ted bundy", "dahmer", "manson", "gacy", "zodiac", "bundy", "unabomber", "kaczynski", "madoff", "elizabeth holmes",
  "sam bankman", "bankman-fried", "shkreli", "jon ronson", "robert hare", "rfk", "desantis",
  "aoc", "ocasio", "pelosi", "mcconnell", "vance", "newsom", "king charles", "pope", "oprah", "mrbeast", "logan paul",
];

export function looksReal(name) {
  const s = String(name || "").toLowerCase();
  if (PERSONAL.test(s)) return true;
  return REAL_NAMES.some((n) => new RegExp(`(^|[^a-z])${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z]|$)`).test(s));
}
