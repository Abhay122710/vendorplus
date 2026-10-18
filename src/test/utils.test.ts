import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("Utility Functions (cn)", () => {
  it("merges standard class names", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("handles conditional falsy expressions cleanly", () => {
    const isHidden = false;
    const isVisible = true;
    expect(cn("base-class", isHidden && "hidden", isVisible && "block", null, undefined)).toBe("base-class block");
  });

  it("resolves Tailwind conflicting classes using tailwind-merge", () => {
    // px-4 followed by px-6 should override to px-6
    expect(cn("px-4 text-sm", "px-6 font-bold")).toBe("text-sm px-6 font-bold");
    // text-red-500 followed by text-blue-500 should override
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });
});
