import test from "node:test";
import assert from "node:assert/strict";

const baseUrl = process.env.API_URL ?? "http://localhost:4000";

test("API health endpoint responds", async () => {
  const response = await fetch(`${baseUrl}/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ok" });
});

test("protected prescription route rejects anonymous requests", async () => {
  const response = await fetch(`${baseUrl}/api/prescriptions`);
  assert.equal(response.status, 401);
});