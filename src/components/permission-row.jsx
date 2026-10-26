import { useState } from "react";
import { useViewport } from "@xyflow/react";
import { Check, ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "./ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverTitle,
} from "./ui/popover";
import { PERMISSION_OPTIONS } from "../permissions";
import { useMap } from "../map-context";

// Edit a draft before saving it.
export function PermissionRow({ operation }) {
  const { permissions, savePermission, publicRead } = useMap();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(permissions[operation.id]);
  const reducedMotion = useReducedMotion();
  const { zoom } = useViewport();
  const risky = operation.id === "read" && publicRead;
  const value = permissions[operation.id];

  // Reset abandoned drafts when opening again.
  function changeOpen(nextOpen) {
    if (nextOpen) setDraft(value);
    setOpen(nextOpen);
  }

  // Apply the selected rule atomically.
  function saveRule(event) {
    event.preventDefault();
    savePermission(operation.id, draft);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={changeOpen}>
      <PopoverTrigger
        className={`permission-row nodrag nopan ${risky ? "is-risk" : ""}`}
        aria-label={`Change ${operation.label} permission, currently ${value}`}
      >
        <span>{operation.label}</span>
        <span className="permission-value">
          {value}
          <ChevronDown size={13} aria-hidden />
        </span>
      </PopoverTrigger>
      <PopoverContent
        className="permission-popover nodrag nopan"
        align="start"
        sideOffset={8}
        style={{ width: 248 * zoom }}
      >
        <motion.form
          onSubmit={saveRule}
          initial={reducedMotion ? false : { opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
        >
          <PopoverTitle className="popover-heading">
            Who can {operation.label} Subscribers?
          </PopoverTitle>
          <fieldset className="permission-options">
            <legend className="sr-only">Access level</legend>
            {PERMISSION_OPTIONS.map((option) => (
              <label
                className={`permission-option ${draft === option.value ? "is-selected" : ""}`}
                key={option.value}
              >
                <input
                  type="radio"
                  name={`permission-${operation.id}`}
                  value={option.value}
                  checked={draft === option.value}
                  onChange={() => setDraft(option.value)}
                />
                <span>
                  <span className="option-title">{option.value}</span>
                  <span
                    className={`option-detail ${option.value === "Anyone" && value === "Anyone" ? "danger-text" : ""}`}
                  >
                    {option.value === value ? "Current · " : ""}
                    {option.description}
                  </span>
                </span>
                {draft === option.value && <Check size={13} aria-hidden />}
              </label>
            ))}
          </fieldset>
          <Button className="save-button" type="submit">
            Save rule
          </Button>
        </motion.form>
      </PopoverContent>
    </Popover>
  );
}
