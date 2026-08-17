import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { HashUtil } from "../utils/hash.util.js";
import { TokenService } from "../services/token.service.js";

describe("Auth & Token Service", () => {
  it("hashes password and verifies match correctly", async () => {
    const rawPassword = "SecurePassword@2026!";
    const hashedPassword = await HashUtil.hash(rawPassword);

    assert.notStrictEqual(hashedPassword, rawPassword);
    assert.strictEqual(await HashUtil.compare(rawPassword, hashedPassword), true);
    assert.strictEqual(await HashUtil.compare("WrongPassword", hashedPassword), false);
  });

  it("generates and verifies access & refresh tokens", () => {
    const payload = {
      userId: "60d0fe4f5311236168a109ca",
      email: "admin@tranhieu.dev",
      role: "admin",
    };

    const { accessToken, refreshToken, refreshExpiresAt } =
      TokenService.generateTokens(payload);

    assert.ok(accessToken && typeof accessToken === "string");
    assert.ok(refreshToken && typeof refreshToken === "string");
    assert.ok(refreshExpiresAt instanceof Date);
    assert.ok(refreshExpiresAt.getTime() > Date.now());

    const decodedAccess = TokenService.verifyAccessToken(accessToken);
    assert.strictEqual(decodedAccess.userId, payload.userId);
    assert.strictEqual(decodedAccess.email, payload.email);
    assert.strictEqual(decodedAccess.role, payload.role);

    const decodedRefresh = TokenService.verifyRefreshToken(refreshToken);
    assert.strictEqual(decodedRefresh.userId, payload.userId);
  });
});
