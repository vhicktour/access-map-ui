import { BaseEdge, EdgeLabelRenderer, getBezierPath } from "@xyflow/react";
import { motion, useReducedMotion } from "motion/react";
import { useMap } from "../map-context";

const PULSE_SECONDS = 3.2;

// Animate real graph paths behind the nodes.
export function ConnectionEdge(props) {
  const { publicRead } = useMap();
  const reducedMotion = useReducedMotion();
  const [path, labelX, labelY] = getBezierPath({ ...props, curvature: 0.45 });
  const risky = props.data?.public && publicRead;
  const blocked = props.data?.incomingPublic && !publicRead;
  const color = risky ? "var(--danger-line)" : "var(--edge-color)";
  return (
    <g className={`connection ${risky ? "is-risk" : ""}`}>
      <BaseEdge
        id={props.id}
        path={path}
        style={{
          stroke: color,
          strokeWidth: 1.2,
          strokeDasharray: blocked ? "3 5" : undefined,
        }}
      />
      {!reducedMotion && !blocked && (
        <motion.path
          d={path}
          fill="none"
          stroke={risky ? "#ffd7df" : "#f2f2f2"}
          strokeWidth={1.7}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray=".075 .925"
          className="edge-pulse"
          animate={{ strokeDashoffset: [1, 0] }}
          transition={{
            duration: PULSE_SECONDS,
            repeat: Infinity,
            ease: "linear",
            delay: props.data?.delay || 0,
          }}
        />
      )}
      {props.label && (
        <EdgeLabelRenderer>
          <div
            className="edge-label"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
          >
            {props.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </g>
  );
}
