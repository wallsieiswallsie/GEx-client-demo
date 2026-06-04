import React, { useEffect, useMemo, useState } from "react";
import { DemoContext } from "./DemoContext";
import { DEMO_MODE, getDemoUser } from "./demoUsers";

const STORAGE_KEY = "gex-demo-state";
const MOBILE_QUERY = "(max-width: 767px)";

function getInitialState() {
  if (!DEMO_MODE || typeof localStorage === "undefined") {
    return {
      hasStarted: false,
      selectedRole: null,
      selectedViewport: null,
    };
  }

  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return {
      hasStarted: Boolean(parsed.hasStarted),
      selectedRole: parsed.selectedRole || null,
      selectedViewport: parsed.selectedViewport || null,
    };
  } catch {
    return {
      hasStarted: false,
      selectedRole: null,
      selectedViewport: null,
    };
  }
}

export function DemoProvider({ children }) {
  const [state, setState] = useState(getInitialState);
  const [isDeviceMobile, setIsDeviceMobile] = useState(false);

  useEffect(() => {
    if (!DEMO_MODE || typeof window === "undefined") return undefined;

    const query = window.matchMedia(MOBILE_QUERY);
    const sync = () => setIsDeviceMobile(query.matches);

    sync();
    query.addEventListener("change", sync);

    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!DEMO_MODE || typeof localStorage === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo(() => {
    const renderViewport = isDeviceMobile
      ? "mobile"
      : state.selectedViewport || "desktop";
    const demoUser = getDemoUser(state.selectedRole);

    return {
      isDemoMode: DEMO_MODE,
      hasStarted: state.hasStarted,
      selectedRole: state.selectedRole,
      selectedViewport: state.selectedViewport,
      isDeviceMobile,
      renderViewport,
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
      selectViewport: (selectedViewport) =>
        setState((current) => ({
          ...current,
          selectedViewport,
        })),
      resetIntro: () =>
        setState({
          hasStarted: false,
          selectedRole: null,
          selectedViewport: null,
        }),
    };
  }, [isDeviceMobile, state]);

  return (
    <DemoContext.Provider value={value}>
      {children}
    </DemoContext.Provider>
  );
}
