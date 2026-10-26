import { createContext, useContext } from "react";
export const MapContext = createContext(null);

// Share saved permissions across graph components.
export function useMap() {
  const context = useContext(MapContext);
  if (!context) throw new Error("Map components must be inside AccessMap.");
  return context;
}
