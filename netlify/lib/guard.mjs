// Real-person guard shared by the function (server side). The browser has a
// copy in site/js/guard.js. This is a first line of defense only: every
// on-stage agent also refuses real people in its own instructions.

export const PERSONAL = /\b(my|our)\s+\w+|^(the\s+)?(boss|coworker|co-worker|manager|teacher|professor|instructor|classmate|roommate|neighbou?r|girlfriend|boyfriend|wife|husband|mom|mother|dad|father|sister|brother|cousin|aunt|uncle|grandma|grandpa|friend|ceo)$|\b\w+\s+from\s+(hr|work|school|class|the office|accounting)\b|\b(coworker|co-worker|classmate|roommate)\b/i;

export const REAL_NAMES = [
  "trump", "biden", "obama", "kamala", "harris", "clinton", "putin", "xi jinping", "zelensky", "netanyahu",
  "elon", "musk", "zuckerberg", "bezos", "gates", "jobs", "taylor swift", "kanye", "ye west", "kardashian",
  "beyonce", "aubrey graham", "diddy", "epstein", "hitler", "stalin", "mussolini", "pol pot", "bin laden", "saddam",
  "ted bundy", "dahmer", "manson", "gacy", "zodiac", "unabomber", "kaczynski", "madoff", "elizabeth holmes",
  "sam bankman", "bankman-fried", "shkreli", "jon ronson", "robert hare", "rfk", "desantis",
  "aoc", "ocasio", "pelosi", "mcconnell", "vance", "newsom", "king charles", "pope", "oprah", "mrbeast", "logan paul",
  "brad pitt", "tom cruise", "sam altman", "weinstein", "kim jong", "the donald",
];

export function looksReal(name) {
  const s = String(name || "").toLowerCase().replace(/[-_.\s]+/g, " ").trim();
  if (PERSONAL.test(s)) return true;
  return REAL_NAMES.some((n) => new RegExp(`(^|[^a-z])${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z]|$)`).test(s));
}
