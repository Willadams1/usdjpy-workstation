// Deterministic classification of a driver's display state. Pure: no DOM access.
// Key rule: missing information is NEVER treated as neutral.

export const DRIVER_STATES = Object.freeze({
  "usd-supportive": { label: "USD-supportive", icon: "arrow-up", tone: "usd", description: "Evidence tends to support USD strength (upward pressure on USD/JPY)." },
  "jpy-supportive": { label: "JPY-supportive", icon: "arrow-down", tone: "jpy", description: "Evidence tends to support JPY strength (downward pressure on USD/JPY)." },
  neutral: { label: "Neutral", icon: "equal", tone: "neutral", description: "Evidence was assessed and is balanced." },
  mixed: { label: "Mixed", icon: "arrows-lr", tone: "mixed", description: "Evidence conflicts: components point in different directions." },
  "no-impact": { label: "No impact", icon: "minus-circle", tone: "neutral", description: "Assessed and found not relevant to USD/JPY." },
  unavailable: { label: "Unavailable", icon: "ban", tone: "caution", description: "No reliable input exists. This is not the same as neutral." },
  stale: { label: "Stale", icon: "clock", tone: "caution", description: "The last known reading is older than the freshness threshold." }
});

const DIRECTIONS = new Set(["usd-supportive", "jpy-supportive", "neutral", "mixed", "no-impact"]);

export function classifyDriver(driver) {
  const direction = driver?.direction;
  if (!DIRECTIONS.has(direction)) return "unavailable"; // null, undefined, unknown values
  if (driver?.freshness?.state === "stale") return "stale";
  return direction;
}

export const STRENGTH_BANDS = Object.freeze(["Very low", "Low", "Moderate", "High", "Very high"]);
export const CONFIDENCE_LEVELS = Object.freeze(["Low", "Medium", "High"]);

export function bandLabel(step) {
  return Number.isInteger(step) && step >= 1 && step <= 5 ? STRENGTH_BANDS[step - 1] : "—";
}

export function confidenceLabel(step) {
  return Number.isInteger(step) && step >= 1 && step <= 3 ? CONFIDENCE_LEVELS[step - 1] : "—";
}

export const PRESSURE_STEPS = Object.freeze([
  { step: -2, label: "Strongly JPY-favoured" },
  { step: -1, label: "Slightly JPY-favoured" },
  { step: 0, label: "Balanced" },
  { step: 1, label: "Slightly USD-favoured" },
  { step: 2, label: "Strongly USD-favoured" }
]);

export function pressureLabel(step) {
  return PRESSURE_STEPS.find((p) => p.step === step)?.label ?? "—";
}

// Plain-text strength shown beside the meter, so strength is never conveyed by the bars alone.
export function driverStrengthText(driver, stateKey) {
  switch (stateKey) {
    case "usd-supportive":
    case "jpy-supportive":
    case "mixed": return bandLabel(driver.strength);
    case "stale": return `Last known: ${bandLabel(driver.strength)}`;
    case "neutral": return "Balanced";
    case "no-impact": return "None";
    default: return "No data";
  }
}
