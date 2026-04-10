// Mobile menu
(function() {
  const btn = document.querySelector('.mobile-menu-btn');
  const nav = document.getElementById('mobileNav');
  if (!btn || !nav) return;

  btn.addEventListener('click', function() {
    const isOpen = nav.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', isOpen);
    nav.setAttribute('aria-hidden', !isOpen);
    // Swap icon
    btn.innerHTML = isOpen
      ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/></svg>'
      : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>';
  });

  // Close on link click
  nav.querySelectorAll('a').forEach(function(a) {
    a.addEventListener('click', function() {
      nav.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      nav.setAttribute('aria-hidden', 'true');
      btn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>';
    });
  });
})();

// Scroll reveal for location cards
(function() {
  var cards = document.querySelectorAll('.location-card');
  if (!cards.length) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(function(card) {
    observer.observe(card);
  });
})();
