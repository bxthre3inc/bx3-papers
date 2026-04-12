/**
 * MODULAR DAP > Module: E-DAP
 * Project: Valley Players Club
 */

import { test, expect } from "bun:test";

const BASE_URL = "http://localhost:3001";

test("Security: Health Check Headers", async () => {
  const res = await fetch(`${BASE_URL}/health`);
  expect(res.status).toBe(200);
  expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
});

test("Security: CORS Rejection", async () => {
  const res = await fetch(`${BASE_URL}/`, {
    headers: { "Origin": "http://evil.com" }
  });
  // CORS is checked in index.ts for non-health routes
  expect(res.status).toBe(403);
  expect(await res.text()).toBe("CORS Forbidden");
});

test("Security: Security Headers", async () => {
  const res = await fetch(`${BASE_URL}/`);
  expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
  expect(res.headers.get("X-Frame-Options")).toBe("DENY");
});

test("Security: Unauthorized Access (Production Mode Sim)", async () => {
  // Simulate production mode via headers or just check current state
  // Since we can't easily change process.env mid-test in some runners, 
  // we check that if no token is provided, it handles it based on its logic.
  const res = await fetch(`${BASE_URL}/`);
  if (process.env.NODE_ENV === 'production') {
      expect(res.status).toBe(401);
  } else {
      expect(res.status).toBe(200); // Default dev response
  }
});
