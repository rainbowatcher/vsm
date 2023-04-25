import { readDir, readTextFile } from "@tauri-apps/api/fs"
import { configDir, resolve, sep } from "@tauri-apps/api/path"
import json5 from "json5"
import Database from "tauri-plugin-sql-api"
import { deepCompare } from "./util"

const EXCLUDE = [".DS_Store"]

type Snippet = Record<string, SnippetItem>

type SnippetItem = Omit<VscSnippet, "name" | "lang">

export type VscSnippet = {
  name:string
  lang: string
  prefix: string
  body: string[]
  desc: string
  scope: string
}

export type VsmSnippet = {
  name: string
  lang: string
  prefix?: string
  body?: string
  desc?: string
  tags?: string
  createDate?: string
}

export type Profile = {
  profile: string
  path: string
  snippetPath: string
}

export type GroupedSnippets = Record<string, VsmSnippet[]>

export const getVSCConfigDir = async () => {
  const publicConfigDir = await configDir()
  return await resolve(publicConfigDir, "Code")
}

export async function getAllProfiles(): Promise<Profile[]> {
  const vscConfigDir = await getVSCConfigDir()

  const defaultSnippets = {
    profile: "default",
    path: await resolve(vscConfigDir, "User"),
    snippetPath: await resolve(vscConfigDir, "User", "snippets"),
  }
  const otherProfileSnippets = await Promise.all((await getGlobalStorageConfig()).userDataProfiles
    .map(async e => ({
      profile: e.name,
      path: await resolve(vscConfigDir, "User", "profiles", e.location),
      snippetPath: await resolve(vscConfigDir, "User", "profiles", e.location, "snippets"),
    })),
  )
  return [defaultSnippets, ...otherProfileSnippets]
}


export const getAllSnippets = async () => {
  const allProfiles = await getAllProfiles()

  return await Promise.all(allProfiles.map(async (p) => {
    const files = await readDir(p.snippetPath)
    return {
      profile: p.profile,
      snippets: files.filter(i => !EXCLUDE.includes(i.name || ""))
        .map(i => ({ profile: i.name, path: i.path })),
    }
  }))
}


export const getSnippetItems = async () => {
  const snippets = await getAllSnippets()
  const a = await Promise.all(
    snippets
      .filter(i => i.snippets.length)
      .flatMap((i) => {
        return i.snippets.flatMap(async (s) => {
          const data = await readTextFile(s.path)
          const snippetRecord = json5.parse<Snippet>(data)
          const fileName = s.path.split(sep).at(-1)?.split(".")[0]
          return Object.entries(snippetRecord).map(([name, value]) => ({
            name,
            ...value,
            lang: value.scope?.length ? value.scope[0] : fileName ?? "json",
            prefix: Array.isArray(value.prefix)
              ? value.prefix.join(",")
              : value.prefix,
          }))
        })
      }))
  return a.flat()
}


export const findConflictingSnippets = (snippets: VscSnippet[]) => {
  return snippets
    .reduce<Record<string, {count: number; items: VscSnippet[]}>>((acc, value) => {
    if (acc[value.name]) {
      if (!deepCompare(acc[value.name].items[0], value)) {
        acc[value.name].count++
        acc[value.name].items.push(value)
      }
    } else {
      acc[value.name] = { count: 1, items: [value] }
    }
    return acc
  }, {})
}

export const getUniqueSnippets = (snippets: VscSnippet[]) => {
  return snippets.filter((obj, idx, self) => self.findIndex(o => deepCompare(o, obj)) === idx)
}

export const getGlobalStorageConfig = async (): Promise<{userDataProfiles: Array<{location:string; name: string}>}> => {
  const vscConfigDir = await getVSCConfigDir()
  const globalStoragePath = await resolve(vscConfigDir, "User", "globalStorage", "storage.json")
  return await readFileToJson(globalStoragePath)
}

export const readFileToJson = async (file: string) => {
  return json5.parse(await readTextFile(file))
}
