import { describe, expect, it } from "vitest"
import { deepCompare } from "../src/composables/util"

describe("deepCompare function", () => {
  it("Accurately compare two non-object", () => {
    expect(deepCompare(1, 1)).toBe(true)
    expect(deepCompare(1, "1")).toBe(false)
    expect(deepCompare("hello", "world")).toBe(false)
    expect(deepCompare(true, false)).toBe(false)
    expect(deepCompare(undefined, null)).toBe(false)
    expect(deepCompare(null, null)).toBe(true)
  })

  it("Accurately compare two arrays", () => {
    expect(deepCompare([], [])).toBe(true)
    expect(deepCompare([1, 2, 3], [1, 2, 3])).toBe(true)
    expect(deepCompare([1, 2, 3], [3, 2, 1])).toBe(false)
    expect(deepCompare([1, 2, 3], [1, 2])).toBe(false)
    expect(deepCompare(["a", "b", "c"], ["a", "b"])).toBe(false)
    expect(deepCompare([{ id: 1 }, { id: 2 }], [{ id: 1 }, { id: 2 }])).toBe(
      true,
    )
    expect(deepCompare([{ id: 1 }, { id: 2 }], [{ id: 2 }, { id: 1 }])).toBe(
      false,
    )
  })

  it("Accurately compare two object", () => {
    expect(deepCompare({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true)
    expect(deepCompare({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true)
    expect(deepCompare({ a: 1, b: 2 }, { a: "1", b: "2" })).toBe(false)
    expect(deepCompare({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true)
    expect(deepCompare({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false)
    expect(
      deepCompare({ a: { b: { c: { d: 1 } } } }, { a: { b: { c: { d: 1 } } } }),
    ).toBe(true)
  })

  it("Compare the attributes of mixed types correctly", () => {
    expect(deepCompare({ a: 1, b: [2, 3] }, { a: 1, b: [2, 3] })).toBe(true)
    expect(deepCompare({ a: 1, b: [2, 3] }, { a: 1, b: [3, 2] })).toBe(false)
    expect(deepCompare({ a: 1, b: [2, 3] }, { a: 1, b: [3, 2], c: "foo" })).toBe(false)
    expect(deepCompare([{ id: 1, name: "apple" }], [{ id: 1, name: "apple" }]))
      .toBe(true)
    expect(deepCompare({ a: 1, b: [2, 3] }, "apple")).toBe(false)
    expect(deepCompare("", { a: 1, b: [2] })).toBe(false)
  })
})
