export const dbMetadata = {
  tables: "SELECT name FROM sqlite_master WHERE type = 'table' AND name = $1;",
}
export const snippetsRepo = {
  create: `CREATE TABLE IF NOT EXISTS snippets (
    id          INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name        TEXT                              NOT NULL,
    lang        TEXT                              NOT NULL,
    keyword     TEXT,
    body        TEXT,
    desc        TEXT,
    create_date DATE DEFAULT current_date,
    PRIMARY KEY (name, lang)
);`,
  add: "INSERT INTO snippets(name, lang, keyword, body, desc) VALUES ($1, $2, $3, $4, $5);",
  del: "DELETE FROM snippets WHERE name = $1 and lang = $2;",
  update: "UPDATE snippets SET name = $1, lang = $2, keyword = $3, body = $4, desc = $5 WHERE name = $6 and lang = $7;",
  upsert: `INSERT INTO snippets(name, lang, keyword, body, desc)
  VALUES ($1, $2, $3, $4, $5)
  ON CONFLICT(name, lang) DO UPDATE SET keyword = $3, body = $4, DESC = $5`,
  getNames: "SELECT name FROM snippets;",
  exists: "select count(1) from snippets where name = $1 and lang = $2;",
  get: `SELECT a.name,
a.lang,
a.keyword,
a.body,
a.desc,
a.create_date AS createDate,
m.tags,
m.scopes
FROM snippets a
LEFT JOIN (SELECT id,
                  name,
                  lang,
                  group_concat(CASE WHEN key = 'tag' THEN val END)   AS tags,
                  group_concat(CASE WHEN key = 'scope' THEN val END) AS scopes
             FROM meta
            GROUP BY name
          ) m
USING (name, lang);`,
}

export const metaRepo = {
  create: `CREATE TABLE IF NOT EXISTS meta (
    id   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name TEXT,
    lang TEXT,
    key  TEXT,
    val  TEXT
);`,
  add: "INSERT INTO meta(name, lang, key, val) VALUES ($1, $2, $3, $4);",
  del: "DELETE FROM meta WHERE name = $1 and lang = $2;",
  update: "UPDATE meta SET name = $1, lang = $2, key = $3, val = $4 WHERE name = $5 AND lang = $6;",
  get: "select * from meta;",
  getOne: "SELECT * FROM meta WHERE name = $1 and lang = $2;",
}

export const trashRepo = {
  create: `CREATE TABLE IF NOT EXISTS trash (
    id          INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name        TEXT                              NOT NULL,
    lang        TEXT                              NOT NULL,
    keyword     TEXT,
    body        TEXT,
    desc        TEXT,
    create_date DATE DEFAULT current_date
);`,
  add: "insert into trash (name, lang, keyword, body, desc) values($1, $2, $3, $4, $5);",
  del: "DELETE FROM trash WHERE name = $1 and lang = $2;",
  // should't use it
  update: "UPDATE trash SET name = $1, lang = $2, keyword = $3, body = $4, DESC = $5 WHERE name = $6 AND lang = $7;",
  getOne: "select name, lang, keyword, body, desc, create_date from trash where name = $1 and lang = $2;",
}