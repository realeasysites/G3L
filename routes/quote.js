// Public quote-request endpoint
const express = require('express');
const rateLimit = require('express-rate-limit');
const { createLead } = require('../db/database');
const { notifyNewLead } = require('../lib/mailer');

const router = express.Router();

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 8, standardHeaders: true, legacyHeaders: false });

const clean = (v, max = 500) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

router.post('/', limiter, async (req, res) => {
  const b = req.body || {};

  // Honeypot: real people never fill this hidden field
  if (clean(b.company_website)) return res.json({ ok: true });

  const lead = {
    name: clean(b.name, 120),
    phone: clean(b.phone, 40),
    email: clean(b.email, 160),
    address: clean(b.address, 200),
    service: clean(b.service, 80),
    frequency: clean(b.frequency, 60),
    message: clean(b.message, 2000),
    contact_pref: clean(b.contact_pref, 30),
  };

  if (!lead.name || !lead.phone) {
    return res.status(400).json({ ok: false, error: 'Please include your name and phone number.' });
  }
  if (lead.phone.replace(/\D/g, '').length < 10) {
    return res.status(400).json({ ok: false, error: 'Please enter a valid phone number.' });
  }
  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    return res.status(400).json({ ok: false, error: 'That email address doesn’t look right.' });
  }

  try {
    const id = createLead(lead);
    notifyNewLead(lead); // fire-and-forget
    return res.json({ ok: true, id });
  } catch (err) {
    console.error('[quote] save failed:', err);
    return res.status(500).json({ ok: false, error: 'Something went wrong. Please call (585) 643-0201.' });
  }
});

module.exports = router;
