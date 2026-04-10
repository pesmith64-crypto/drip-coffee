// Mobile menu
(function() {
  var openBtn = document.querySelector('.mobile-menu-btn');
  var closeBtn = document.querySelector('.mobile-close-btn');
  var nav = document.getElementById('mobileNav');
  if (!openBtn || !nav) return;

  function open() {
    nav.classList.add('is-open');
    openBtn.setAttribute('aria-expanded', 'true');
    nav.setAttribute('aria-hidden', 'false');
  }

  function close() {
    nav.classList.remove('is-open');
    openBtn.setAttribute('aria-expanded', 'false');
    nav.setAttribute('aria-hidden', 'true');
  }

  openBtn.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', close);

  // Close on link click
  nav.querySelectorAll('a').forEach(function(a) {
    a.addEventListener('click', close);
  });
})();

// Scroll reveal
(function() {
  var els = document.querySelectorAll('.location-card, .about-item');
  if (!els.length) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  els.forEach(function(el) {
    observer.observe(el);
  });
})();
