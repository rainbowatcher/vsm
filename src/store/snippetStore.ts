import type { GroupedSnippets, VscSnippet, VsmSnippet } from "@composables/vscode"
import { ElMessage } from "element-plus"
import { defineStore } from "pinia"
import Database from "tauri-plugin-sql-api"

const VSM_DB_SCHEMA = "sqlite:vsm-data.db"

export const useSnippetStore = defineStore("snippet", () => {
  const snippets = ref<VsmSnippet[]>([])
  const selectedName = ref<string>()
  const current = ref<VsmSnippet>({ name: "", lang: "" })
  const vscSnippets = ref<VscSnippet[]>()
  let db: Database

  const groupedSnippets = computed(() => snippets.value.reduce<GroupedSnippets>((pre, next) => {
    if (!pre[next.lang]) {
      pre[next.lang] = []
    }
    pre[next.lang].push(next)
    return pre
  }, {}))

  /**
   * this function should only run once when app start
   */
  async function init() {
    db = await Database.load(VSM_DB_SCHEMA)
    const tables = await db.select<string[]>("SELECT name FROM sqlite_master WHERE type='table' AND name='snippets'")
    if (!tables.length) {
      await db.execute(`\
      CREATE TABLE snippets(
        name        TEXT PRIMARY KEY NOT NULL,
        lang        TEXT NOT NULL,
        prefix      TEXT,
        body        TEXT,
        desc        TEXT,
        tags        TEXT,
        del         INT DEFAULT 0,
        create_date DATE DEFAULT current_date
      )`)
    } else {
      snippets.value = await db.select<VsmSnippet[]>("select name,lang,prefix,body,desc,tags,create_date as createDate from snippets where del = 0")
    }
  }

  async function refetch() {
    snippets.value = await db.select<VsmSnippet[]>("select name,lang,prefix,body,desc,tags,create_date as createDate from snippets where del = 0")
    console.log(snippets.value)
    ElMessage.success("Success")
  }

  async function add(snippet?: VsmSnippet) {
    if (!snippet?.name && !snippet?.lang) return ElMessage.warning("snippet is undefined")
    const index = snippets.value.findIndex(i => i.name === snippet.name)
    if (index === -1) {
      snippets.value.push(snippet)
    } else {
      snippets.value[index] = snippet
    }
    const { name, lang, prefix, body, desc, tags } = snippet
    const { rowsAffected } = await db.execute(`\
    insert into snippets(name, lang, prefix, body, desc, tags) values($6, $1, $2, $3, $4, $5) on conflict(name) 
    do update set lang = $1, prefix = $2, body = $3, desc = $4, tags = $5;`,
    [lang, prefix, body, desc, tags, name])
    if (rowsAffected)
      ElMessage.success("Success")
  }

  async function update(snippet: VsmSnippet) {
    if (!snippet.name && !snippet.lang) return ElMessage.warning("name or lang can't be missing")
    const index = snippets.value.findIndex(i => i.name === snippet.name)
    if (index) snippets.value[index] = snippet
    const db = Database.get(VSM_DB_SCHEMA)
    const { name, lang, prefix, body, desc, tags } = snippet
    const { rowsAffected } = await db.execute(`\
    update snippets set 
    lang = $1,
    prefix = $2,
    body = $3,
    desc = $4,
    tags = $5,
    where name = $6
    ;`, [lang, prefix, body, desc, tags, name])
    if (rowsAffected) ElMessage.success("Success")
  }

  async function del(name?: string) {
    if (!name) return ElMessage.warning("name can't be none")
    const index = snippets.value.findIndex(i => i.name === name)
    snippets.value = snippets.value.splice(index, 1)
    const { rowsAffected } = await db.execute("delete from snippets where name = $1", [name])
    if (rowsAffected) ElMessage.success("Success")
  }

  function save() {
    if (selectedName.value != current.value.name)
      del(selectedName.value)
    add(current.value)
    // refetch()
  }

  async function trash(name: string) {
    const { rowsAffected } = await db.execute("update snippets set del = 1 where name = $1", [name])
    if (rowsAffected) ElMessage.success("Success")
  }

  return {
    groupedSnippets,
    current,
    selectedName,
    add,
    del,
    save,
    update,
    init,
    refetch,
    trash,
  }
})