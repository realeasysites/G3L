// SQLite storage for quote requests (leads)
const path = require('path');
const Database = require('better-sqlite3');

const db = new Database(path.join(__dirname, 'greenlife.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    phone       TEXT NOT NULL,
    email       TEXT,
    address     TEXT,
    service     TEXT,
    frequency   TEXT,
    message     TEXT,
    contact_pref TEXT,
    status      TEXT NOT NULL DEFAULT 'new',
    notes       TEXT DEFAULT '',
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
  CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);
`);

const STATUSES = ['new', 'contacted', 'quoted', 'scheduled', 'won', 'lost'];

const stmts = {
  insert: db.prepare(`
    INSERT INTO leads (name, phone, email, address, service, frequency, message, contact_pref)
    VALUES (@name, @phone, @email, @address, @service, @frequency, @message, @contact_pref)
  `),
  all: db.prepare(`SELECT * FROM leads ORDER BY datetime(created_at) DESC`),
  byStatus: db.prepare(`SELECT * FROM leads WHERE status = ? ORDER BY datetime(created_at) DESC`),
  counts: db.prepare(`SELECT status, COUNT(*) AS n FROM leads GROUP BY status`),
  update: db.prepare(`UPDATE leads SET status = @status, notes = @notes, updated_at = datetime('now') WHERE id = @id`),
  remove: db.prepare(`DELETE FROM leads WHERE id = ?`),
};

module.exports = {
  STATUSES,
  createLead: (lead) => stmts.insert.run(lead).lastInsertRowid,
  listLeads: (status) => (status && STATUSES.includes(status) ? stmts.byStatus.all(status) : stmts.all.all()),
  countLeads: () => Object.fromEntries(stmts.counts.all().map((r) => [r.status, r.n])),
  updateLead: (id, status, notes) => stmts.update.run({ id, status, notes }).changes,
  deleteLead: (id) => stmts.remove.run(id).changes,
};
