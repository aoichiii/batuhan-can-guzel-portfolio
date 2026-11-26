(() => {
  const page = document.body.dataset.page || 'index';
  const nav = document.querySelector('.main-nav');
  document.querySelectorAll('[data-nav]').forEach(a => { if(a.dataset.nav === page) a.classList.add('active'); });
  document.getElementById('year').textContent = new Date().getFullYear();

  const translations = [...document.querySelectorAll('[data-tr][data-en]')];
  const langButton = document.querySelector('.lang-switch');
  let stored = null;
  try { stored = window.localStorage.getItem('portfolio-language'); } catch (_) { /* Storage may be unavailable for file:// previews. */ }
  let lang = stored === 'en' ? 'en' : 'tr';
  function setLanguage(next) {
    lang = next;
    document.documentElement.lang = lang;
    translations.forEach(el => { el.innerHTML = el.dataset[lang]; });
    document.querySelectorAll('[data-placeholder-tr][data-placeholder-en]').forEach(el => {
      el.placeholder = el.dataset['placeholder' + (lang === 'tr' ? 'Tr' : 'En')];
    });
    if(langButton) langButton.innerHTML = lang === 'tr' ? 'EN <span>↗</span>' : 'TR <span>↗</span>';
    try { window.localStorage.setItem('portfolio-language', lang); } catch (_) { /* Language still works for the current page without storage. */ }
  }
  setLanguage(lang);
  langButton?.addEventListener('click', () => setLanguage(lang === 'tr' ? 'en' : 'tr'));

  const menuButton = document.querySelector('.menu-toggle');
  menuButton?.addEventListener('click', () => {
    const opened = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(opened));
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open'); menuButton?.setAttribute('aria-expanded','false');
  }));

  const form = document.getElementById('contactForm');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const feedback = document.getElementById('formFeedback');
    if(!form.reportValidity()) return;
    const values = new FormData(form);
    const subject = encodeURIComponent(values.get('subject'));
    const labels = lang === 'tr' ? ['Ad Soyad', 'E-posta'] : ['Full name', 'Email'];
    const message = encodeURIComponent(`${labels[0]}: ${values.get('name')}\n${labels[1]}: ${values.get('email')}\n\n${values.get('message')}`);
    const email = 'batuhancanguzel@gmail.com';
    feedback.className = 'form-feedback success';
    feedback.textContent = lang === 'tr' ? 'E-posta uygulaman açılacak; mesajı gönder tuşuna basarak onaylayabilirsin.' : 'Your email app will open; confirm the message by pressing Send there.';
    window.location.href = `mailto:${email}?subject=${subject}&body=${message}`;
  });
})();