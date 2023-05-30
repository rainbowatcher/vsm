/**
 * primary key of snippets table, all these field is required
 */
export type VsmSnippetPrimary = {
  name: string
  lang: string
}

/**
 * vsm snippets object
 */
export type VsmSnippet = VsmSnippetPrimary & Partial<VsmSnippetDetail>

export type VsmSnippetDetail = {
  keyword: string
  body: string
  desc: string
  createDate: string
}

/**
 * Meta information for snippets
 */
export type VsmSnippetMeta = {
  tags?: string
  scopes?: string
}

/**
 * vsm meta object, used for mapping meta table
 */
export type VsmMeta = {
  id: number
  name: string
  lang: string
  key: string
  val: string
}

/**
 * object that used in views
 */
export type VsmSnippetView = VsmSnippet & Partial<VsmSnippetMeta>

/**
 * Grouped snippets object, used in @see {List}
 */
export type GroupedSnippets = Record<string, VsmSnippetView[]>


// #region *************** Vscode ***************

/**
 * used to map vscode's snippet json file
 */
export type VscSnippet = Record<string, VscSnippetInfo>

export type VscProfile = { profile: string; path: string }

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
// #endregion