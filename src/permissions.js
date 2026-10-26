export const PERMISSION_OPTIONS = [
  { value: "Anyone", description: "Open to the internet" },
  { value: "Signed-in users", description: "312 Userpage accounts" },
  { value: "Admin", description: "Only you" },
];
export const INITIAL_PERMISSIONS = {
  create: "Anyone",
  update: "Admin",
  read: "Anyone",
};
export const OPERATIONS = [
  { id: "create", label: "create" },
  { id: "update", label: "update, delete" },
  { id: "read", label: "read" },
];

// Keep saved rules within known choices.
export function updatePermission(permissions, operation, value) {
  if (!OPERATIONS.some((item) => item.id === operation))
    throw new Error("Unknown permission operation.");
  if (!PERMISSION_OPTIONS.some((item) => item.value === value))
    throw new Error("Unknown permission role.");
  return { ...permissions, [operation]: value };
}

// Derive the public read warning once.
export function hasPublicRead(permissions) {
  return permissions.read === "Anyone";
}
