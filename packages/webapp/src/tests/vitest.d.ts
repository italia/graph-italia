/// <reference types="vitest/globals" />

import type { AxeMatchers } from "vitest-axe/matchers";

declare module "vitest" {
  // Merge axe matchers into Vitest's Assertion interface
  // so tests can do `expect(container).toHaveNoViolations()`.
  interface Assertion<T = any> extends AxeMatchers {}
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}
