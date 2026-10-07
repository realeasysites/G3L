// Simple single-user admin auth backed by env vars + session.
const crypto = require('crypto');

function safeEqual(a = '', b = '') {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

function checkCredentials(username, password) {
  const u = process.env.ADMIN_USERNAME || 'admin';
  const p = process.env.ADMIN_PASSWORD;
  if (!p) {
    console.warn('[auth] ADMIN_PASSWORD is not set — admin login disabled.');
    return false;
  }
  return safeEqual(username, u) && safeEqual(password, p);
}

function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) return next();
  if (req.path.startsWith('/api') || req.xhr || req.headers.accept?.includes('application/json')) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  return res.redirect('/admin/login');
}

module.exports = { checkCredentials, requireAdmin };
