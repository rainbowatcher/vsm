export const deepCompare = (first: any, second: any):boolean => {
  if (first === null || first === undefined) {
    return first === second
  }

  // Compare types and values of non-object properties
  if (typeof first !== "object" || typeof second !== "object") {
    return first === second
  }

  // Compare arrays
  if (Array.isArray(first) && Array.isArray(second)) {
    if (first.length !== second.length) {
      return false
    } else {
    // Compare arrays
      return first.every((item, index) => deepCompare(item, second[index]))
    }
  }

  // Compare objects
  const keys1 = Object.keys(first)
  const keys2 = Object.keys(second)
  if (keys1.length !== keys2.length) {
    return false
  }
  for (const key of keys1) {
    if (!keys2.includes(key) || !deepCompare(first[key], second[key])) {
      return false
    }
  }
  return true
}
