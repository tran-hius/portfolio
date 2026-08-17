import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { isOriginAllowed } from "../utils/cors.util.js";

describe("CORS Origin Validation", () => {
  it("allows non-browser requests without origin header", () => {
    assert.strictEqual(isOriginAllowed(undefined), true);
    assert.strictEqual(isOriginAllowed(""), true);
  });

  it("allows production domain hieutran-theta.vercel.app", () => {
    assert.strictEqual(isOriginAllowed("https://hieutran-theta.vercel.app"), true);
  });

  it("allows vercel preview deployments for hieutran", () => {
    assert.strictEqual(
      isOriginAllowed("https://hieutran-theta-git-main-user.vercel.app"),
      true,
    );
  });

  it("allows localhost and local dev origins", () => {
    assert.strictEqual(isOriginAllowed("http://localhost:5173"), true);
    assert.strictEqual(isOriginAllowed("http://127.0.0.1:3000"), true);
  });

  it("rejects untrusted third-party origins", () => {
    assert.strictEqual(isOriginAllowed("https://untrusted-app.vercel.app"), false);
    assert.strictEqual(isOriginAllowed("https://malicious-site.com"), false);
  });
});
