// Admin: login + lead dashboard + JSON API
const path = require('path');
const express = require('express');
const rateLimit = require('express-rate-limit');
const { checkCredentials, requireAdmin } = require('../lib/auth');
const { STATUSES, listLeads, countLeads, updateLead, deleteLead } = require('../db/database');

const router = express.Router();
const views = path.join(__dirname, '..', 'views');

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });

router.get('/login', (req, res) => {
  if (req.session?.isAdmin) return res.redirect('/admin');
  res.sendFile(path.join(views, 'admin-login.html'));
});

router.post('/login', loginLimiter, (req, res) => {
  const { username, password } = req.body || {};
  if (checkCredentials(username, password)) {
    req.session.regenerate(() => {
      req.session.isAdmin = true;
      res.redirect('/admin');
    });
  } else {
    res.redirect('/admin/login?error=1');
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
});

router.get('/', requireAdmin, (_req, res) => res.sendFile(path.join(views, 'admin.html')));

router.get('/api/leads', requireAdmin, (req, res) => {
  res.json({ statuses: STATUSES, counts: countLeads(), leads: listLeads(req.query.status) });
});

router.patch('/api/leads/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const { status, notes = '' } = req.body || {};
  if (!STATUSES.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  const changed = updateLead(id, status, String(notes).slice(0, 2000));
  res.json({ ok: changed > 0 });
});

router.delete('/api/leads/:id', requireAdmin, (req, res) => {
  res.json({ ok: deleteLead(Number(req.params.id)) > 0 });
});

router.get('/api/leads.csv', requireAdmin, (_req, res) => {
  const leads = listLeads();
  const cols = ['id', 'created_at', 'status', 'name', 'phone', 'email', 'address', 'service', 'frequency', 'contact_pref', 'message', 'notes'];
  const q = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = [cols.join(','), ...leads.map((l) => cols.map((c) => q(l[c])).join(','))].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="greenlife-leads.csv"');
  res.send(csv);
});

module.exports = router;
