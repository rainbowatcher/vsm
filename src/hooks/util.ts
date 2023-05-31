import type { MaybeRef } from "vue"
import { unref } from "vue"
import Fuse from "fuse.js"

export function deepCompare(first: any, second: any, keys?: string[]):boolean {
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
  const keys1 = keys ?? Object.keys(first)
  const keys2 = keys ?? Object.keys(second)
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

export function validateObjectProperties(object: Record<string, unknown> | undefined, properties: string[]): boolean {
  if (!object) {
    return false
  } else {
    return properties.every(property => Object.prototype.hasOwnProperty.call(object, property) && object[property] !== undefined)
  }
}

type SearchOptions<T> = {
  filter?: (item: T) => boolean
  isStrict?: boolean
  shouldFuzzy?: boolean
  searchField?: string
}

export function useSearch <T>(source: MaybeRef<T[] | undefined>, options?: SearchOptions<T>) {
  const {
    isStrict = false,
    shouldFuzzy = false,
    searchField,
    filter = (item: T) => {
      const keywordValue = unref(keyword)
      // if (typeof item === "object" && searchField item?.[searchField]) {

      // }
      if (
        typeof item === "string" ||
        typeof item === "number" ||
        typeof item === "boolean"
      ) {
        if (isStrict) {
          return String(item).includes(keywordValue)
        }
        return String(item)
          .toLocaleLowerCase()
          .includes(keywordValue.toLocaleLowerCase())
      } else if (typeof item === "object") {
        return searchObject(item as Record<string, unknown>)
      } else if (typeof item === "symbol") {
        // no implement
        return false
      }
      return false
    },
  } = options ?? {}
  const keyword = ref("")
  const searchReturn = ref<T[]>()
  const matchesReturn = ref<Array<readonly Fuse.FuseResultMatch[] | undefined>>()

  // search method for the click or keyboard event
  function search(e?: KeyboardEvent | Event) {
    if (
      // press enter
      (e instanceof KeyboardEvent && e.code === "Enter") ||
      // click search button
      (e instanceof MouseEvent && e.type === "click") ||
      // clear input content
      typeof e === "undefined"
    ) {
      const { result, matches } = doSearch()
      searchReturn.value = result
      matchesReturn.value = matches
    }
  }

  function doSearch() {
    const sourceValue = unref(source)
    // when keyword is empty string
    if (!keyword.value) {
      return {
        result: sourceValue,
      }
    }

    const keys = searchField ? [searchField] : (sourceValue?.[0] ? Object.keys(sourceValue[0]) : [])

    if (shouldFuzzy) {
      const fuseReturn = new Fuse(sourceValue || [], {
        keys,
        isCaseSensitive: unref(isStrict),
        includeMatches: true,
        includeScore: true,
      }).search(keyword.value)

      return {
        result: fuseReturn.map(i => i.item),
        matches: fuseReturn.map(i => i.matches),
      }
    }
    return {
      result: sourceValue?.filter(filter),
    }
  }

  function searchObject(obj: Record<string, unknown>): boolean {
    return !!Object.values(obj).find(filter as (value: unknown, i: number, o: unknown[]) => boolean) || false
  }

  // when source changed, do search immediately
  watch(
    () => unref(source),
    () => { search() },
  )

  return {
    result: searchReturn,
    keyword,
    search,
    matches: matchesReturn,
  }
}