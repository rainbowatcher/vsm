import { readDir, readTextFile } from "@tauri-apps/api/fs"
import { configDir, resolve, sep } from "@tauri-apps/api/path"
import { deepCompare } from "@composables/util"
import json5 from "json5"
import type { VsmSnippet, VsmSnippetView } from "../types/snippet"

const EXCLUDE = [".DS_Store"]

export type GroupedSnippets = Record<string, VsmSnippet[]>
export type VscSnippet = Record<string, VscSnippetInfo>
export type Profile = { profile: string; path: string }
export type VscSnippetInfo = {
  prefix: string
  body: string[]
  desc: string
  scope: string
}
export type GlobalStorage = {
  userDataProfiles: Array<{
    location: string
    name: string
  }>
}

export const scopeMap: Record<string, string> = {
  javascript: "javascript",
  typescript: "typescript",
  javascriptreact: "javascript",
  typescriptreact: "typescript",
  java: "java",
  rust: "rust",
  jsonc: "jsonc",
  go: "go",
  groovy: "groovy",
  less: "less",
  scss: "scss",
  sass: "sass",
  python: "python",
  shellscript: "bash",
  toml: "toml",
  yaml: "yaml",
  dockerfile: "dockerfile",
  ignore: "ignore",
  dockercompose: "yaml",
  just: "just",
  makefile: "makefile",
  "pip-requirements": "requirements",
  properties: "properties",
  ruby: "ruby",
  sql: "sql",
  lua: "lua",
}


// export type VscSnippet = Record<string, VscSnippetInfo>

export const useVscodeStore = defineStore("vscode", () => {
  const snippets = ref<VsmSnippetView[]>()
  const conflictSnippets = ref<Array<[string, VsmSnippetView[]]>>()

  const getVSCConfigDir = async () => {
    const publicConfigDir = await configDir()
    return await resolve(publicConfigDir, "Code")
  }

  /**
     *
     * @returns config file object
     */
  const readGlobalStorageConfig = async (): Promise<GlobalStorage> => {
    const vscConfigDir = await getVSCConfigDir()
    const globalStoragePath = await resolve(vscConfigDir, "User", "globalStorage", "storage.json")
    const file = await readTextFile(globalStoragePath)
    return await json5.parse(file)
  }

  function readSettings() {
    // TODO
  }

  function readProfileStorageDB(profile: string) {
    // TODO
  }

  async function getProfiles(): Promise<Profile[]> {
    const vscConfigDir = await getVSCConfigDir()
    const globalStorageConfig = await readGlobalStorageConfig()

    const defaultProfile = {
      profile: "default",
      path: await resolve(vscConfigDir, "User"),
    }

    const otherProfiles = await Promise.all(globalStorageConfig.userDataProfiles
      .map(async e => ({
        profile: e.name,
        path: await resolve(vscConfigDir, "User", "profiles", e.location),
      })),
    )
    return [defaultProfile, ...otherProfiles]
  }

  async function getSnippets() {
    const profiles = await getProfiles()
    // read every profile's snippets folder
    const snippetFiles = await Promise.all(profiles.map(async (p) => {
      const snippetPath = await resolve(p.path, "snippets")
      return (await readDir(snippetPath)).filter(file => !EXCLUDE.includes(file.name || ""))
    }))
    // read every snippets file
    const nestedSnippets = await Promise.all(snippetFiles.flatMap(i => i).map(async (s) => {
      const data = await readTextFile(s.path)
      const snippetRecord = json5.parse<VscSnippet>(data)
      const fileName = s.path.split(sep).at(-1)?.split(".")[0]
      return Object.entries(snippetRecord).map(([name, value]) => ({
        name,
        lang: value.scope?.length ? scopeMap[value.scope[0]] : fileName ?? "json",
        body: value.body.join("\n"),
        desc: value.desc,
        keyword: Array.isArray(value.prefix)
          ? value.prefix.join(",")
          : value.prefix,
      }))
    }))

    snippets.value = nestedSnippets.flat()
    conflictSnippets.value = findConflictingSnippets(snippets.value)
  }

  const findConflictingSnippets = (snippets: VsmSnippetView[]): Array<[string, VsmSnippetView[]]> => {
    const conflictSnippets: Record<string, VsmSnippetView[]> = {}
    const sameSnippets = snippets
      .reduce<Record<string, VsmSnippetView[]>>((acc, value) => {
      if (acc[value.name]) {
        if (!deepCompare(acc[value.name][0], value)) {
          acc[value.name].push(value)
        }
      } else {
        acc[value.name] = [value]
      }
      return acc
    }, {})

    for (const key in sameSnippets) {
      if (sameSnippets[key].length === 1) {
        continue
      }
      conflictSnippets[key] = sameSnippets[key].filter((val, idx, arr) => idx === arr.findIndex(i => deepCompare(val, i)))
    }

    return Object.entries(conflictSnippets)
  }

  const getUniqueSnippets = (snippets: VscSnippet[]) => {
    return snippets.filter((obj, idx, self) => self.findIndex(o => deepCompare(o, obj)) === idx)
  }

  return {
    snippets,
    conflictSnippets,
    getProfiles,
    getSnippets,
  }

})