// Green Life — front-end interactions
(function () {
  // Mobile menu
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      })
    );
  }

  // Scroll reveal
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add('in'));
  }

  // Service card links pre-select the service in the quote form
  const select = document.getElementById('serviceSelect');
  document.querySelectorAll('[data-service]').forEach((link) =>
    link.addEventListener('click', () => {
      if (!select) return;
      const want = link.getAttribute('data-service').toLowerCase();
      const opt = [...select.options].find((o) => o.text.toLowerCase() === want);
      if (opt) select.value = opt.value || opt.text;
    })
  );

  // Footer year
  const yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  // Quote form
  const form = document.getElementById('quoteForm');
  const note = document.getElementById('formNote');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    form.querySelectorAll('.invalid').forEach((el) => el.classList.remove('invalid'));
    note.className = 'form-note';

    const data = Object.fromEntries(new FormData(form).entries());
    const missing = [];
    if (!data.name || !data.name.trim()) missing.push('name');
    if (!data.phone || data.phone.replace(/\D/g, '').length < 10) missing.push('phone');
    if (missing.length) {
      missing.forEach((n) => form.elements[n].classList.add('invalid'));
      note.textContent = 'Please add your name and a valid phone number.';
      note.classList.add('err');
      form.elements[missing[0]].focus();
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    const label = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending…';

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || !out.ok) throw new Error(out.error || 'Something went wrong.');
      form.innerHTML =
        '<div class="form-success"><div class="check">✓</div><h3>Got it — thank you!</h3>' +
        '<p>We’ll reach out shortly with your quote. Need it sooner? Call <a href="tel:+15856430201"><b>(585) 643-0201</b></a>.</p></div>';
    } catch (err) {
      note.textContent = (err && err.message) || 'Couldn’t send. Please call (585) 643-0201.';
      note.classList.add('err');
      btn.disabled = false;
      btn.textContent = label;
    }
  });
})();
