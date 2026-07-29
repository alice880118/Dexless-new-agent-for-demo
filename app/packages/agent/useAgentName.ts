import { useEffect, useState } from "react";
import {
  AGENT_NAME_CHANGE_EVENT,
  DEFAULT_AGENT_NAME,
  loadSavedAgentName,
  persistAgentName,
} from "./agent-name";

export function useAgentName() {
  const [agentName, setAgentName] = useState(DEFAULT_AGENT_NAME);

  useEffect(() => {
    setAgentName(loadSavedAgentName());
    const onChange = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      setAgentName(
        typeof detail === "string" && detail.trim()
          ? detail.trim()
          : loadSavedAgentName(),
      );
    };
    window.addEventListener(AGENT_NAME_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(AGENT_NAME_CHANGE_EVENT, onChange);
  }, []);

  const saveAgentName = (name: string) => {
    const next = name.trim() || DEFAULT_AGENT_NAME;
    persistAgentName(next);
    setAgentName(next);
  };

  return { agentName, saveAgentName };
}
