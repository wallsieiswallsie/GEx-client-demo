import { createContext } from "react";

export const DemoContext = createContext({
  isDemoMode: false,
  hasStarted: false,
  selectedRole: null,
  demoUser: null,
  startDemo: () => {},
  selectRole: () => {},
  resetIntro: () => {},
});
