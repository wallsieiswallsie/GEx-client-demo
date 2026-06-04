import { useContext } from "react";
import { DemoContext } from "./DemoContext";

export function useDemo() {
  return useContext(DemoContext);
}
