// Time formatting and session windows. Pure: no DOM access. Internal values are UTC; display is SAST by default.
export const TIMEZONES = Object.freeze({
  SAST: { iana: "Africa/Johannesburg", label: "SAST" },
  UTC: { iana: "UTC", label: "UTC" }
});

function zone(tzKey) {
  return TIMEZONES[tzKey] ?? TIMEZONES.SAST;
}

function parts(date, tzKey) {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: zone(tzKey).iana,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23"
  });
  return Object.fromEntries(fmt.formatToParts(date).map((p) => [p.type, p.value]));
}

function toDate(value) {
  if (value == null || value === "") return null; // new Date(null) would silently be 1970
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatClock(value, tzKey = "SAST") {
  const d = toDate(value);
  if (!d) return "—";
  const p = parts(d, tzKey);
  return `${p.hour}:${p.minute}`;
}

export function formatDateTime(value, tzKey = "SAST") {
  const d = toDate(value);
  if (!d) return "—";
  const p = parts(d, tzKey);
  return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute} ${zone(tzKey).label}`;
}

export const tzLabel = (tzKey) => zone(tzKey).label;

// Approximate reference windows in UTC, informational only. No daylight-saving adjustment.
export const SESSIONS = Object.freeze([
  { id: "sydney", name: "Sydney", startUtc: 22, endUtc: 7 },
  { id: "tokyo", name: "Tokyo", startUtc: 0, endUtc: 9 },
  { id: "london", name: "London", startUtc: 8, endUtc: 17 },
  { id: "new-york", name: "New York", startUtc: 13, endUtc: 22 }
]);

export function isSessionActive(session, date) {
  const d = toDate(date);
  if (!d) return false;
  const h = d.getUTCHours();
  return session.startUtc < session.endUtc
    ? h >= session.startUtc && h < session.endUtc
    : h >= session.startUtc || h < session.endUtc;
}

export const activeSessions = (date) => SESSIONS.filter((s) => isSessionActive(s, date));

// Express a UTC hour boundary in the selected display timezone (fixed reference date; SAST has no DST).
export function utcHourInTz(hour, tzKey = "SAST") {
  return formatClock(new Date(Date.UTC(2000, 0, 3, hour)), tzKey);
}
