import { test } from "node:test";
import assert from "node:assert/strict";
import {
  INITIAL_PERMISSIONS,
  updatePermission,
  hasPublicRead,
} from "../src/permissions.js";

test("restricting read closes the warning without changing other rules", () => {
  const result = updatePermission(INITIAL_PERMISSIONS, "read", "Admin");
  assert.deepEqual(result, {
    create: "Anyone",
    update: "Admin",
    read: "Admin",
  });
  assert.equal(hasPublicRead(result), false);
  assert.equal(INITIAL_PERMISSIONS.read, "Anyone");
});
test("signed-in access also closes the public read path", () => {
  assert.equal(
    hasPublicRead(
      updatePermission(INITIAL_PERMISSIONS, "read", "Signed-in users"),
    ),
    false,
  );
});
test("restoring Anyone restores the warning", () => {
  const restricted = updatePermission(INITIAL_PERMISSIONS, "read", "Admin");
  assert.equal(
    hasPublicRead(updatePermission(restricted, "read", "Anyone")),
    true,
  );
});
test("write permission changes do not hide a public read path", () => {
  assert.equal(
    hasPublicRead(updatePermission(INITIAL_PERMISSIONS, "create", "Admin")),
    true,
  );
});
test("unknown operations are rejected", () => {
  assert.throws(
    () => updatePermission(INITIAL_PERMISSIONS, "drop", "Admin"),
    /operation/,
  );
});
test("unknown roles are rejected", () => {
  assert.throws(
    () => updatePermission(INITIAL_PERMISSIONS, "read", "Root"),
    /role/,
  );
});
