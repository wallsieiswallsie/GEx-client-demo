import React, { useEffect, useMemo, useState } from "react";
import { DemoContext } from "./DemoContext";
import { DEMO_MODE, getDemoUser } from "./demoUsers";

const STORAGE_KEY = "gex-demo-state";

function getInitialState() {
  if (!DEMO_MODE || typeof localStorage === "undefined") {
    return {
      hasStarted: false,
      selectedRole: null,
    };
  }

  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return {
      hasStarted: Boolean(parsed.hasStarted),
      selectedRole: parsed.selectedRole || null,
    };
  } catch {
    return {
      hasStarted: false,
      selectedRole: null,
    };
  }
}

export function DemoProvider({ children }) {
  const [state, setState] = useState(getInitialState);

  useEffect(() => {
    if (!DEMO_MODE || typeof localStorage === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo(() => {
    const demoUser = getDemoUser(state.selectedRole);

    return {
      isDemoMode: DEMO_MODE,
      hasStarted: state.hasStarted,
      selectedRole: state.selectedRole,
      demoUser,
      startDemo: () =>
        setState((current) => ({
          ...current,
          hasStarted: true,
        })),
      selectRole: (selectedRole) =>
        setState((current) => ({
          ...current,
          hasStarted: true,
          selectedRole,
        })),
      resetIntro: () =>
        setState({
          hasStarted: false,
          selectedRole: null,
        }),
    };
  }, [state]);

  return (
    <DemoContext.Provider value={value}>
      {children}
    </DemoContext.Provider>
  );
}
