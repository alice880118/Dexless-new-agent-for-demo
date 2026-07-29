export const DEFAULT_AGENT_NAME = "Trader DNA";
export const AGENT_NAME_STORAGE_KEY = "trader-dna-agent-name";
export const AGENT_NAME_CHANGE_EVENT = "trader-dna-name-change";

export function loadSavedAgentName(): string {
  try {
    const saved = localStorage.getItem(AGENT_NAME_STORAGE_KEY);
    return saved?.trim() ? saved.trim() : DEFAULT_AGENT_NAME;
  } catch {
    return DEFAULT_AGENT_NAME;
  }
}

export function persistAgentName(name: string) {
  const next = name.trim() || DEFAULT_AGENT_NAME;
  try {
    if (next === DEFAULT_AGENT_NAME) {
      localStorage.removeItem(AGENT_NAME_STORAGE_KEY);
    } else {
      localStorage.setItem(AGENT_NAME_STORAGE_KEY, next);
    }
    window.dispatchEvent(
      new CustomEvent(AGENT_NAME_CHANGE_EVENT, { detail: next }),
    );
  } catch {
    // Ignore storage errors in demo mode.
  }
}
