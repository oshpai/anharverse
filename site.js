/* Shared behaviour: language switch (Arabic / English), mobile menu, YouTube click-to-load. */
(function () {
  var doc = document, root = doc.documentElement;
  var hasEn = doc.body.hasAttribute('data-i18n');

  function setLang(l) {
    root.lang = l;
    root.dir = l === 'en' ? 'ltr' : 'rtl';
    doc.querySelectorAll('[data-lang]').forEach(function (el) {
      el.hidden = el.getAttribute('data-lang') !== l;
    });
    var b = doc.getElementById('langBtn');
    if (b) b.textContent = l === 'en' ? 'عربي' : 'EN';
    try { localStorage.setItem('lang', l); } catch (e) {}
  }

  if (hasEn) {
    var saved = 'ar';
    try { saved = localStorage.getItem('lang') === 'en' ? 'en' : 'ar'; } catch (e) {}
    setLang(saved);
    var btn = doc.getElementById('langBtn');
    if (btn) btn.addEventListener('click', function () {
      setLang(root.lang === 'en' ? 'ar' : 'en');
    });
  }

  var top = doc.querySelector('.top');
  var menu = doc.querySelector('.top__menu');
  if (top && menu) {
    menu.addEventListener('click', function () {
      var open = top.classList.toggle('top--open');
      menu.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    doc.querySelectorAll('.top__nav a').forEach(function (a) {
      a.addEventListener('click', function () {
        top.classList.remove('top--open');
        menu.setAttribute('aria-expanded', 'false');
      });
    });
  }

  doc.querySelectorAll('a.yt[data-yt]').forEach(function (a) {
    var img = a.querySelector('img');
    if (img) img.addEventListener('error', function () {
      img.src = 'https://i.ytimg.com/vi/' + a.dataset.yt + '/mqdefault.jpg';
    }, { once: true });
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var f = doc.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + a.dataset.yt + '?autoplay=1&rel=0&playsinline=1';
      f.title = a.getAttribute('aria-label') || 'YouTube video';
      f.allow = 'accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.allowFullscreen = true;
      a.replaceChildren(f);
    });
  });
})();
