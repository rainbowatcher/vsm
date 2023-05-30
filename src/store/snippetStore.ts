import type { GroupedSnippets } from "@store/vscodeStore"
import { defineStore } from "pinia"
import Database from "tauri-plugin-sql-api"
import type { VsmMeta, VsmSnippet, VsmSnippetView } from "../types/snippet"

const VSM_DB_SCHEMA = "sqlite:vsm-data.db"
const emptySnippet = { name: "", lang: "" }

export const useSnippetStore = defineStore("snippet", () => {
  const snippets = ref<VsmSnippetView[]>([])
  const current = ref<VsmSnippetView>(emptySnippet)
  const snapshot = ref<VsmSnippetView>(emptySnippet)
  const garbages = ref<VsmSnippetView[]>([])
  const groupedSnippets = computed(() => snippets.value.reduce<GroupedSnippets>((pre, next) => {
    if (!pre[next.lang]) {
      pre[next.lang] = []
    }
    pre[next.lang].push(next)
    return pre
  }, {}))
  let db: Database

  /**
   * this function should only run once when app start
   */
  async function init() {
    db = await Database.load(VSM_DB_SCHEMA)
    await db.execute(snippetsRepo.create)
    await db.execute(metaRepo.create)
    await db.execute(trashRepo.create)
    snippets.value = await db.select<VsmSnippetView[]>(snippetsRepo.get)
  }

  async function refresh() {
    snippets.value = await db.select<VsmSnippetView[]>(snippetsRepo.get)
    ElMessage.success("Success")
  }

  async function upsert(snippet?: VsmSnippet) {
    if (!snippet?.name && !snippet?.lang) return ElMessage.warning("snippet is undefined")
    const { name, lang, keyword, body, desc } = snippet
    const { rowsAffected } = await db.execute(snippetsRepo.upsert,
      [name, lang, keyword, body, desc])
    notify(rowsAffected)
  }

  async function update() {
    if (!validateObjectProperties(current.value, ["name", "lang"])) return ElMessage.warning("current is no item selected")
    const { name, lang, keyword, body, desc, tags, scopes } = current.value

    const { rowsAffected } = await db.execute(snippetsRepo.update, [name, lang, keyword, body, desc, snapshot.value?.name, snapshot.value?.lang])
    await db.execute(metaRepo.update, [])
    notify(rowsAffected)
  }

  async function saveMeta(name:string, lang: string, tags: string, scope: string) {
    await db.execute(metaRepo.update, [name, lang])
  }

  async function del() {
    const { name, lang } = current.value
    const { rowsAffected } = await db.execute(trashRepo.del, [name, lang])
    notify(rowsAffected)
  }

  async function pickUpGarbage() {
    // todo
  }

  async function restore() {
    // todo
  }

  async function trash() {
    if (!current.value?.name) return ElMessage.warning("No selected item")
    const { name, lang, body, keyword, desc } = current.value
    await db.execute(trashRepo.add, [name, lang, keyword, body, desc])
    const { rowsAffected } = await db.execute(snippetsRepo.del, [current.value.name, current.value.lang])
    notify(rowsAffected)
  }

  function notify(affect: number) {
    if (affect) void refresh()
    else ElMessage.error(`${affect} affected`)
  }

  function select(name: string, lang: string) {
    snapshot.value = snippets.value.find(i => i.name === name && i.lang === lang) || emptySnippet
    current.value = { ...snapshot.value }
  }

  return {
    snippets,
    // snippetTree,
    groupedSnippets,
    current,
    select,
    add: upsert,
    del,
    update,
    init,
    refresh,
    trash,
  }
})