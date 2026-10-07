// Emails new quote requests to the business. Fails soft: a lead is always saved even if email isn't configured.
const nodemailer = require('nodemailer');

let transporter = null;
if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  const port = Number(process.env.SMTP_PORT || 465);
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function notifyNewLead(lead) {
  const to = process.env.NOTIFY_EMAIL;
  if (!transporter || !to) {
    console.log('[mailer] SMTP not configured — lead saved to dashboard only.');
    return false;
  }
  const rows = [
    ['Name', lead.name],
    ['Phone', lead.phone],
    ['Email', lead.email],
    ['Property address', lead.address],
    ['Service', lead.service],
    ['How often', lead.frequency],
    ['Best way to reach', lead.contact_pref],
    ['Details', lead.message],
  ]
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:6px 12px;color:#555"><b>${k}</b></td><td style="padding:6px 12px">${esc(v)}</td></tr>`)
    .join('');

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      replyTo: lead.email || undefined,
      subject: `New quote request: ${lead.service || 'Lawn/Landscaping'} — ${lead.name}`,
      html: `<div style="font-family:Arial,sans-serif">
        <h2 style="color:#1b5e20;margin:0 0 8px">New quote request from the website</h2>
        <table style="border-collapse:collapse;font-size:15px">${rows}</table>
        <p style="color:#777;font-size:13px">Manage all leads at /admin</p></div>`,
    });
    return true;
  } catch (err) {
    console.error('[mailer] send failed:', err.message);
    return false;
  }
}

module.exports = { notifyNewLead };
