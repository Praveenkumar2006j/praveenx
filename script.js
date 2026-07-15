/* =========================================================================
   PRAVEEN KUMAR J — PORTFOLIO SCRIPT
   Vanilla JavaScript controlling navigation, theme switching, scroll
   animations, animated counters/skill bars, particles background,
   the typing effect, and the contact form.
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------------
     1. FOOTER YEAR
  ---------------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----------------------------------------------------------------
     2. THEME TOGGLE (Dark / Light) — persisted in localStorage
  ---------------------------------------------------------------- */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
  const root = document.documentElement;

  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    if (themeIcon) {
      themeIcon.classList.toggle('fa-moon', theme === 'dark');
      themeIcon.classList.toggle('fa-sun', theme === 'light');
    }
    localStorage.setItem('pk-theme', theme);
  };

  // Load saved theme, or default to dark
  const savedTheme = localStorage.getItem('pk-theme') || 'dark';
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(current);
    });
  }

  /* ----------------------------------------------------------------
     3. MOBILE NAV TOGGLE (Bootstrap collapse handles the mechanics;
        we just close the menu after a link is clicked for UX)
  ---------------------------------------------------------------- */
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('#navMenu .nav-link');

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navMenu);
        bsCollapse.hide();
      }
    });
  });

  /* ----------------------------------------------------------------
     4. STICKY NAV — shrink/shadow on scroll + scroll progress bar
        + active link highlighting
  ---------------------------------------------------------------- */
  const mainNav = document.getElementById('mainNav');
  const scrollProgress = document.getElementById('scrollProgress');
  const sections = document.querySelectorAll('main section[id]');
  const backToTopBtn = document.getElementById('backToTop');

  const onScroll = () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

    // Nav shadow state
    mainNav.classList.toggle('scrolled', scrollY > 30);

    // Progress bar
    if (scrollProgress) scrollProgress.style.width = progress + '%';

    // Back to top visibility
    if (backToTopBtn) backToTopBtn.classList.toggle('visible', scrollY > 500);

    // Active nav link
    let currentId = '';
    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      if (scrollY >= top) currentId = section.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ----------------------------------------------------------------
     5. BACK TO TOP BUTTON
  ---------------------------------------------------------------- */
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ----------------------------------------------------------------
     6. AOS (Animate On Scroll) INIT
  ---------------------------------------------------------------- */
  if (window.AOS) {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
    });
  }

  /* ----------------------------------------------------------------
     7. TYPED.JS — rotating role titles in the hero
  ---------------------------------------------------------------- */
  if (window.Typed) {
    new Typed('#typed-role', {
      strings: [
        'Aspiring Java Developer',
        'Cybersecurity Enthusiast',
        'Full Stack Learner',
        'Problem Solver'
      ],
      typeSpeed: 55,
      backSpeed: 30,
      backDelay: 1600,
      startDelay: 400,
      loop: true,
      showCursor: false, // we render our own blinking cursor in CSS
    });
  }

  /* ----------------------------------------------------------------
     8. PARTICLES.JS — ambient animated background
  ---------------------------------------------------------------- */
  if (window.particlesJS) {
    particlesJS('particles-js', {
      particles: {
        number: { value: 55, density: { enable: true, value_area: 900 } },
        color: { value: ['#3b5bff', '#4fd1ff', '#6f8bff'] },
        shape: { type: 'circle' },
        opacity: { value: 0.35, random: true },
        size: { value: 2.4, random: true },
        line_linked: {
          enable: true,
          distance: 140,
          color: '#3b5bff',
          opacity: 0.18,
          width: 1,
        },
        move: {
          enable: true,
          speed: 0.9,
          direction: 'none',
          random: true,
          straight: false,
          out_mode: 'out',
        },
      },
      interactivity: {
        detect_on: 'window',
        events: {
          onhover: { enable: true, mode: 'grab' },
          onclick: { enable: false },
          resize: true,
        },
        modes: {
          grab: { distance: 140, line_linked: { opacity: 0.4 } },
        },
      },
      retina_detect: true,
    });
  }

  /* ----------------------------------------------------------------
     9. ANIMATED SKILL BARS — fill width when scrolled into view
  ---------------------------------------------------------------- */
  const barFills = document.querySelectorAll('.bar-fill');

  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const targetWidth = fill.getAttribute('data-width');
        fill.style.width = targetWidth + '%';
        barObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.4 });

  barFills.forEach((fill) => barObserver.observe(fill));

  /* ----------------------------------------------------------------
     10. ANIMATED COUNTERS — count up when scrolled into view
  ---------------------------------------------------------------- */
  const counters = document.querySelectorAll('.counter-num');

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1400; // ms
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      // easeOutQuad
      const eased = 1 - (1 - progress) * (1 - progress);
      const value = Math.floor(eased * target);
      el.textContent = value;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    };
    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach((counter) => counterObserver.observe(counter));

  /* ----------------------------------------------------------------
     11. CONTACT FORM — client-side validation + simulated submission
        (No backend is wired up; this provides real UX feedback and
        opens the user's mail client with a pre-filled message so the
        form is genuinely usable when hosted on GitHub Pages.)
  ---------------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!contactForm.checkValidity()) {
        e.stopPropagation();
        contactForm.classList.add('was-validated');
        return;
      }

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      // Build a mailto link so the message actually reaches Praveen,
      // since GitHub Pages hosts static sites with no backend/server.
      const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:praveenexpress444@gmail.com?subject=${subject}&body=${body}`;

      formStatus.textContent = 'Opening your mail client to send the message...';
      contactForm.classList.remove('was-validated');
      contactForm.reset();
    });
  }

  /* ----------------------------------------------------------------
     12. SVG SCAN-RING SWEEP EXTRA GLOW (subtle pulse on hover)
  ---------------------------------------------------------------- */
  const portraitWrap = document.querySelector('.portrait-wrap');
  const scanRing = document.querySelector('.scan-ring');
  if (portraitWrap && scanRing) {
    portraitWrap.addEventListener('mouseenter', () => {
      scanRing.style.animationDuration = '4s';
    });
    portraitWrap.addEventListener('mouseleave', () => {
      scanRing.style.animationDuration = '14s';
    });
  }

});
