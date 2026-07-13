/* ====================================================
   D Cyber Office — Main JavaScript
   Version: 1.1
   ==================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- 1. Loading Screen ---- */
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 1200);
  }

  /* ---- 2. Navbar Scroll Effect ---- */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    // Add default check on load
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    }
    
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  /* ---- 3. Mobile Nav Toggle ---- */
  const navToggle = document.getElementById('navToggle');
  const navMobile = document.getElementById('navMobile');
  if (navToggle && navMobile) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navMobile.classList.toggle('open');
    });
    // Close on link click
    navMobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navMobile.classList.remove('open');
      });
    });
  }

  /* ---- 4. Hero Particles ---- */
  const particlesContainer = document.querySelector('.hero-particles');
  if (particlesContainer) {
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 8 + 4;
      const left = Math.random() * 100;
      const delay = Math.random() * 15;
      const duration = Math.random() * 10 + 8;
      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
      `;
      particlesContainer.appendChild(p);
    }
  }

  /* ---- 5. Intersection Observer — Scroll Animations ---- */
  const animElements = document.querySelectorAll('.fade-up, .slide-in-left, .slide-in-right, .process-step');
  if (animElements.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    animElements.forEach(el => observer.observe(el));
  }

  /* ---- 6. Counter Animation ---- */
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target') || '0');
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.round(current).toLocaleString() + suffix;
    }, 16);
  }

  const counters = document.querySelectorAll('[data-target]');
  if (counters.length) {
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = 'true';
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObs.observe(c));
  }

  /* ---- 7. Testimonials Slider ---- */
  const track       = document.querySelector('.testimonials-track');
  const prevBtn     = document.querySelector('.slider-btn.prev');
  const nextBtn     = document.querySelector('.slider-btn.next');
  const dotsWrap    = document.querySelector('.slider-dots');

  if (track) {
    const cards = track.querySelectorAll('.testimonial-card');
    let current = 0;
    let perPage = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
    const totalPages = Math.ceil(cards.length / perPage);

    // Build dots
    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      for (let i = 0; i < totalPages; i++) {
        const d = document.createElement('div');
        d.className = 'slider-dot' + (i === 0 ? ' active' : '');
        d.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(d);
      }
    }

    function goTo(page) {
      current = Math.max(0, Math.min(page, totalPages - 1));
      const cardWidth = cards[0].offsetWidth + 28;
      track.style.transform = `translateX(-${current * perPage * cardWidth}px)`;
      dotsWrap?.querySelectorAll('.slider-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    prevBtn?.addEventListener('click', () => goTo(current - 1));
    nextBtn?.addEventListener('click', () => goTo(current + 1));

    // Auto play
    let autoPlay = setInterval(() => {
      goTo(current >= totalPages - 1 ? 0 : current + 1);
    }, 4000);

    track.addEventListener('mouseenter', () => clearInterval(autoPlay));
    track.addEventListener('mouseleave', () => {
      autoPlay = setInterval(() => {
        goTo(current >= totalPages - 1 ? 0 : current + 1);
      }, 4000);
    });

    // Recalculate on resize
    window.addEventListener('resize', () => {
      perPage = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
      goTo(0);
    }, { passive: true });
  }

  /* ---- 8. FAQ Accordion ---- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ---- 9. Services Filter (Services Page) ---- */
  const filterTags   = document.querySelectorAll('.filter-tag');
  const serviceCards = document.querySelectorAll('.service-card-item');
  const searchInput  = document.getElementById('serviceSearch');
  const countEl      = document.getElementById('servicesCount');

  function filterServices() {
    const activeTag   = document.querySelector('.filter-tag.active')?.dataset.filter || 'all';
    const searchVal   = searchInput?.value.toLowerCase().trim() || '';
    let visible = 0;
    
    serviceCards.forEach(card => {
      const cat  = card.dataset.category || '';
      const name = card.querySelector('h3')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('p')?.textContent.toLowerCase() || '';
      
      const matchCat    = activeTag === 'all' || cat === activeTag;
      const matchSearch = !searchVal || name.includes(searchVal) || desc.includes(searchVal);
      
      card.style.display = matchCat && matchSearch ? '' : 'none';
      if (matchCat && matchSearch) visible++;
    });
    if (countEl) countEl.textContent = visible;
  }

  filterTags.forEach(tag => {
    tag.addEventListener('click', () => {
      filterTags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      filterServices();
    });
  });

  searchInput?.addEventListener('input', filterServices);

  /* ---- 10. Contact Form ---- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('[type="submit"]');
      const original = btn.textContent;
      btn.textContent = '✓ Message Sent!';
      btn.style.background = 'var(--secondary)';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.disabled = false;
        contactForm.reset();
      }, 3000);
    });
  }

  /* ---- 11. Active Nav Link ---- */
  const currentPath = location.pathname;
  document.querySelectorAll('.nav-links a, #navMobile a').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

});
