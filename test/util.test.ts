import { describe, expect, it } from "vitest"
import { deepCompare, validateObjectProperties } from "@/hooks/util"

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

  it("compare two objects specified by key and return whether they are equal.", () => {
    const obj1 = { a: 1, b: { c: [0, 1] }, d: 2 }
    const obj2 = { d: 3, b: { c: [0, 1] }, a: 1 }
    const keys = ["a", "b"]
    expect(deepCompare(obj1, obj2, keys)).toBe(true)
    expect(deepCompare(obj1, obj2, ["a", "b", "d"])).toBe(false)
  })

  it("should be able to recognize null and undefined", () => {
    expect(deepCompare(null, undefined)).toBe(false)
    expect(deepCompare(undefined, null)).toBe(false)
  })

})


describe("validateObjectProperties", () => {
  it("should return true when object has all properties defined", () => {
    const object = { name: "John", age: 30 }
    const properties = ["name", "age"]
    expect(validateObjectProperties(object, properties)).toBe(true)
  })

  it("should return false when object has at least one property undefined", () => {
    const object = { name: "John", age: 30 }
    const properties = ["name", "email"]
    expect(validateObjectProperties(object, properties)).toBe(false)
  })

  it("should return false when object is missing all properties", () => {
    const object = {}
    const properties = ["name", "email"]
    expect(validateObjectProperties(object, properties)).toBe(false)
  })
})

