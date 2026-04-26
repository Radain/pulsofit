import { describe, expect, it } from "vitest";
import { isBlockedProbePath, isScannerUserAgent } from "./security";

describe("security helpers", () => {
  it("blocks common hostile probe paths", () => {
    expect(isBlockedProbePath("/.env")).toBe(true);
    expect(isBlockedProbePath("/.git/config")).toBe(true);
    expect(isBlockedProbePath("/wp-login.php")).toBe(true);
    expect(isBlockedProbePath("/xmlrpc.php")).toBe(true);
    expect(isBlockedProbePath("/dashboard")).toBe(false);
  });

  it("blocks scanner user agents without blocking normal browsers", () => {
    expect(isScannerUserAgent("sqlmap/1.8")).toBe(true);
    expect(isScannerUserAgent("Mozilla/5.0 Chrome/123")).toBe(false);
    expect(isScannerUserAgent(null)).toBe(false);
  });
});
