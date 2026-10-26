import { useState } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  useNodesState,
  useReactFlow,
  useViewport,
} from "@xyflow/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Minus, Plus } from "lucide-react";
import { ActorNode, ApiPermissionNode, TableNode } from "./map-nodes";
import { ConnectionEdge } from "./connection-edge";
import { Button } from "./ui/button";
import { MapContext } from "../map-context";
import {
  INITIAL_PERMISSIONS,
  hasPublicRead,
  updatePermission,
} from "../permissions";
import "@xyflow/react/dist/style.css";

const NODE_TYPES = {
  actor: ActorNode,
  api: ApiPermissionNode,
  table: TableNode,
};
const EDGE_TYPES = { connection: ConnectionEdge };
const MIN_ZOOM = 0.52;
const MAX_ZOOM = 1.48;
const ZOOM_STEP = 0.16;
const GRAPH_WIDTH = 960;
const INITIAL_NODES = [
  {
    id: "signup",
    type: "actor",
    position: { x: 0, y: 0 },
    data: {
      title: "Signup form",
      subtitle: "charlespostiaux.com",
      kind: "form",
    },
  },
  {
    id: "admin",
    type: "actor",
    position: { x: 0, y: 120 },
    data: {
      title: "Charles Postiaux",
      subtitle: "Admin",
      avatar: "CP",
      kind: "admin",
    },
  },
  {
    id: "public",
    type: "actor",
    position: { x: 0, y: 240 },
    data: { title: "Anyone", subtitle: "No sign-in needed", kind: "public" },
  },
  { id: "api", type: "api", position: { x: 432, y: 78 }, data: {} },
  { id: "subscribers", type: "table", position: { x: 760, y: 126 }, data: {} },
];
const EDGES = [
  {
    id: "signup-create",
    source: "signup",
    target: "api",
    targetHandle: "create",
    label: "255 signups",
    type: "connection",
    data: { delay: 0.2 },
  },
  {
    id: "admin-update",
    source: "admin",
    target: "api",
    targetHandle: "update",
    label: "Everything",
    type: "connection",
    data: { delay: 1.3 },
  },
  {
    id: "public-read",
    source: "public",
    target: "api",
    targetHandle: "read",
    type: "connection",
    data: { public: true, incomingPublic: true, delay: 0.5 },
  },
  {
    id: "read-table",
    source: "api",
    sourceHandle: "output",
    target: "subscribers",
    type: "connection",
    data: { public: true, delay: 2 },
  },
];

// Show the warning derived from saved access.
function MapHeader({ publicRead }) {
  return (
    <header className="map-header">
      <div>
        <h1>Who can reach your subscribers</h1>
        <p>Access map for userpage.app, scanned today at 09:42</p>
      </div>
      <div
        className={`status-badge ${publicRead ? "is-risk" : ""}`}
        role="status"
        aria-live="polite"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={String(publicRead)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.14 }}
          >
            {!publicRead && <Check size={12} aria-hidden />}
            {publicRead ? "1 open path" : "No open paths"}
          </motion.span>
        </AnimatePresence>
      </div>
    </header>
  );
}

// Bound zoom while preserving graph position.
function ZoomControls() {
  const { zoomTo } = useReactFlow();
  const { zoom } = useViewport();
  const reducedMotion = useReducedMotion();
  return (
    <div className="zoom-controls" aria-label="Map zoom">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Zoom out"
        disabled={zoom <= MIN_ZOOM}
        onClick={() =>
          zoomTo(Math.max(MIN_ZOOM, zoom - ZOOM_STEP), {
            duration: reducedMotion ? 0 : 220,
          })
        }
      >
        <Minus size={12} />
      </Button>
      <Button
        variant="ghost"
        className="zoom-value"
        aria-label="Reset zoom to 100 percent"
        onClick={() => zoomTo(1, { duration: reducedMotion ? 0 : 220 })}
      >
        {Math.round(zoom * 100)}%
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Zoom in"
        disabled={zoom >= MAX_ZOOM}
        onClick={() =>
          zoomTo(Math.min(MAX_ZOOM, zoom + ZOOM_STEP), {
            duration: reducedMotion ? 0 : 220,
          })
        }
      >
        <Plus size={12} />
      </Button>
    </div>
  );
}

// Keep the demonstration entirely local.
export function AccessMap() {
  const [permissions, setPermissions] = useState(INITIAL_PERMISSIONS);
  const [nodes, , onNodesChange] = useNodesState(INITIAL_NODES);
  const publicRead = hasPublicRead(permissions);
  const { setViewport } = useReactFlow();

  // Commit one validated permission at a time.
  function savePermission(operation, value) {
    setPermissions((current) => updatePermission(current, operation, value));
  }

  // Frame the source composition on first load.
  function initializeMap() {
    const stage = document.querySelector(".flow-stage");
    const zoom = stage.clientWidth >= 1400 ? 1.16 : 1;
    setViewport({
      x: (stage.clientWidth - GRAPH_WIDTH * zoom) / 2,
      y: Math.max(180, stage.clientHeight * 0.315),
      zoom,
    });
  }

  return (
    <MapContext.Provider value={{ permissions, savePermission, publicRead }}>
      <main className="access-map" aria-label="Subscriber access map">
        <MapHeader publicRead={publicRead} />
        <div
          className="canvas-scroll"
          tabIndex={0}
          role="region"
          aria-label="Scrollable access map"
        >
          <div className="flow-stage">
            <ReactFlow
              nodes={nodes}
              edges={EDGES}
              nodeTypes={NODE_TYPES}
              edgeTypes={EDGE_TYPES}
              onNodesChange={onNodesChange}
              onInit={initializeMap}
              minZoom={MIN_ZOOM}
              maxZoom={MAX_ZOOM}
              nodesConnectable={false}
              deleteKeyCode={null}
            >
              <Background
                variant={BackgroundVariant.Dots}
                gap={21}
                size={1.5}
                color="#282828"
              />
            </ReactFlow>
          </div>
        </div>
        <ZoomControls />
      </main>
    </MapContext.Provider>
  );
}
