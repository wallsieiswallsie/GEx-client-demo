import { createContext } from "react";

export const TourContext = createContext({
  isActive: false,
  currentStep: null,
  currentIndex: 0,
  totalSteps: 0,
  startTour: () => {},
  restartTour: () => {},
  nextStep: () => {},
  previousStep: () => {},
  skipTour: () => {},
  finishTour: () => {},
});
