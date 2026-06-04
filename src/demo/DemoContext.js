import { createContext } from "react";

export const DemoContext = createContext({
  isDemoMode: false,
  hasStarted: false,
  selectedRole: null,
  selectedViewport: null,
  isDeviceMobile: false,
  renderViewport: "desktop",
  demoUser: null,
  startDemo: () => {},
  selectRole: () => {},
  selectViewport: () => {},
  resetIntro: () => {},
});
