// Green Life Lawn and Landscaping LLC — website + lead system
// Thin entry point: config, middleware, route mounting. Logic lives in lib/ and routes/.
require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');

const quoteRoutes = require('./routes/quote');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

if (isProd) app.set('trust proxy', 1); // Render sits behind a proxy

app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: false, limit: '50kb' }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-only-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: 'lax', secure: isProd, maxAge: 1000 * 60 * 60 * 8 },
  })
);

app.use('/api/quote', quoteRoutes);
app.use('/admin', adminRoutes);

app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'], maxAge: isProd ? '7d' : 0 }));

app.get('/healthz', (_req, res) => res.json({ ok: true }));

app.use((_req, res) => res.status(404).sendFile(path.join(__dirname, 'public', '404.html')));

app.listen(PORT, () => console.log(`Green Life site running on http://localhost:${PORT}`));
