import { MotionConfig } from "motion/react";
import { ReactFlowProvider } from "@xyflow/react";
import { AccessMap } from "./components/access-map";

// Mount the isolated component preview.
export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ReactFlowProvider>
        <AccessMap />
      </ReactFlowProvider>
    </MotionConfig>
  );
}
