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

  nav.querySelectorAll('a').forEach(function(a) {
    a.addEventListener('click', close);
  });
})();

// Location toggle buttons
(function() {
  var buttons = document.querySelectorAll('.loc-btn');
  if (!buttons.length) return;

  buttons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var loc = btn.getAttribute('data-location');
      var panel = document.getElementById('loc-' + loc);
      var isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all panels first
      buttons.forEach(function(b) {
        b.setAttribute('aria-expanded', 'false');
      });
      document.querySelectorAll('.loc-detail').forEach(function(d) {
        d.classList.remove('is-open');
        d.setAttribute('aria-hidden', 'true');
      });

      // If wasn't open, open it
      if (!isOpen && panel) {
        btn.setAttribute('aria-expanded', 'true');
        panel.classList.add('is-open');
        panel.setAttribute('aria-hidden', 'false');
      }
    });
  });
})();

// Scroll reveal
(function() {
  var els = document.querySelectorAll('.about-item');
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
