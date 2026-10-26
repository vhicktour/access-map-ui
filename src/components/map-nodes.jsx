import { FileCode2, Globe, Lock, ShieldAlert } from "lucide-react";
import { Handle, Position } from "@xyflow/react";
import { motion } from "motion/react";
import { Card } from "./ui/card";
import { PermissionRow } from "./permission-row";
import { OPERATIONS } from "../permissions";
import { useMap } from "../map-context";

const ACTIVITY = [
  ["DE", "Today 03:12"],
  ["US", "Tue 22:47"],
  ["US", "Tue 22:46"],
  ["PT", "Sun 14:05"],
];
const FIELDS = [
  ["email", "text"],
  ["name", "text"],
  ["source", "text"],
  ["joined", "date"],
];

// Give node headers a consistent hierarchy.
function NodeHeading({ icon: Icon, title, subtitle, avatar }) {
  return (
    <div className="node-heading">
      {avatar ? (
        <span className="avatar">{avatar}</span>
      ) : (
        <span className="node-icon">
          <Icon size={18} strokeWidth={1.5} aria-hidden />
        </span>
      )}
      <div>
        <div className="node-title">{title}</div>
        <div className="node-subtitle">{subtitle}</div>
      </div>
    </div>
  );
}

// Show historical reads beside public access.
function ReadActivity({ risky }) {
  return (
    <div
      className={`read-activity ${risky ? "is-risk" : ""}`}
      aria-label="Recent reads"
    >
      <p>4 reads this week</p>
      {ACTIVITY.map(([country, time], index) => (
        <span className="activity-chip" key={index}>
          <span className="activity-country">{country}</span>
          <span>{time}</span>
        </span>
      ))}
    </div>
  );
}

// Render each person or entry point.
export function ActorNode({ data }) {
  const { publicRead } = useMap();
  const isPublic = data.kind === "public";
  const risky = isPublic && publicRead;
  return (
    <div className={`actor-wrapper ${risky ? "is-risk" : ""}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        <Card className={`map-card actor-card ${risky ? "is-risk" : ""}`}>
          <NodeHeading
            icon={isPublic ? Globe : FileCode2}
            title={data.title}
            subtitle={data.subtitle}
            avatar={data.avatar}
          />
          <Handle
            type="source"
            position={Position.Right}
            isConnectable={false}
          />
        </Card>
      </motion.div>
      {isPublic && <ReadActivity risky={risky} />}
    </div>
  );
}

// Connect each rule to its own port.
export function ApiPermissionNode() {
  const { publicRead } = useMap();
  return (
    <Card className="map-card api-card">
      <NodeHeading
        icon={ShieldAlert}
        title="/api/subscribers"
        subtitle="userpage.app"
      />
      <div className="permission-rows">
        {OPERATIONS.map((operation) => (
          <div
            className={`permission-port permission-port-${operation.id}`}
            key={operation.id}
          >
            <Handle
              type="target"
              position={Position.Left}
              id={operation.id}
              className={operation.id === "read" && publicRead ? "is-risk" : ""}
              isConnectable={false}
            />
            <PermissionRow operation={operation} />
            {operation.id === "read" && (
              <Handle
                type="source"
                position={Position.Right}
                id="output"
                className={publicRead ? "is-risk" : ""}
                isConnectable={false}
              />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

// Keep the destination schema easy to scan.
export function TableNode() {
  const { publicRead } = useMap();
  return (
    <Card className="map-card table-card">
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={false}
        className={publicRead ? "is-risk" : ""}
        style={{ top: 29 }}
      />
      <NodeHeading icon={Lock} title="Subscribers" subtitle="2,418 rows" />
      <dl className="schema-fields">
        {FIELDS.map(([name, type]) => (
          <div className="schema-field" key={name}>
            <dt>{name}</dt>
            <dd>{type}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
