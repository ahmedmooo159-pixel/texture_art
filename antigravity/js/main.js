document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  initMobileMenu();
  initScrollHeader();
  initScrollAnimations();
  initActiveNavLink();
  initVideoModal();
  initCategoryFilters();
});

/* ==========================================
   PERSISTENT LANGUAGE SYSTEM
   ========================================== */
function initLanguage() {
  const langToggles = document.querySelectorAll('.lang-toggle');
  
  // Set initial language from local storage or default to English
  const savedLang = localStorage.getItem('antigravity_lang') || 'en';
  setLanguage(savedLang);

  langToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const currentLang = localStorage.getItem('antigravity_lang') || 'en';
      const newLang = currentLang === 'en' ? 'ar' : 'en';
      setLanguage(newLang);
    });
  });
}

function setLanguage(lang) {
  localStorage.setItem('antigravity_lang', lang);
  
  const body = document.body;
  const html = document.documentElement;

  if (lang === 'ar') {
    body.classList.add('rtl');
    html.setAttribute('dir', 'rtl');
    html.setAttribute('lang', 'ar');
  } else {
    body.classList.remove('rtl');
    html.setAttribute('dir', 'ltr');
    html.setAttribute('lang', 'en');
  }
}

/* ==========================================
   MOBILE HAMBURGER MENU
   ========================================== */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu when link clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
}

/* ==========================================
   HEADER SCROLL EFFECT
   ========================================== */
function initScrollHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  const checkScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  };

  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Run once in case page loaded scrolled
}

/* ==========================================
   SCROLL FADE-UP ANIMATIONS (Intersection Observer)
   ========================================== */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-up');
  
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Stop observing once animated
        }
      });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    animatedElements.forEach(el => el.classList.add('visible'));
  }
}

/* ==========================================
   ACTIVE NAV LINK HIGHLIGHT
   ========================================== */
function initActiveNavLink() {
  const navLinks = document.querySelectorAll('.nav-link');
  const currentPath = window.location.pathname;
  
  // Get filename (e.g. index.html) from path
  const filename = currentPath.substring(currentPath.lastIndexOf('/') + 1);

  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    
    // Check if filename matches link href, or defaults to index.html if blank/root
    if (linkHref === filename || (filename === '' && linkHref === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==========================================
   VIDEO TEASER MODAL POPUP
   ========================================== */
function initVideoModal() {
  const modal = document.querySelector('.modal');
  const openButtons = document.querySelectorAll('.open-teaser');
  const closeButton = document.querySelector('.modal-close');
  const overlay = document.querySelector('.modal-overlay');
  const iframe = document.querySelector('.modal-body iframe');

  if (!modal || !closeButton || !overlay || !iframe) return;

  const openModal = (videoUrl) => {
    // Use Vimeo / YouTube embed structure
    iframe.src = videoUrl;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Disable scroll
  };

  const closeModal = () => {
    modal.classList.remove('active');
    iframe.src = '';
    document.body.style.overflow = ''; // Restore scroll
  };

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // Default fallback demo teaser: a cool design showcase video
      const videoUrl = btn.getAttribute('data-video-url') || 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1';
      openModal(videoUrl);
    });
  });

  closeButton.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  // Close on ESC key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================
   CATEGORY FILTERS FOR PLANS
   ========================================== */
function initCategoryFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const courseCards = document.querySelectorAll('.course-card');

  if (!filterBtns.length || !courseCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      courseCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = '';
          // Force a slight delay to trigger entry transition if desired
          setTimeout(() => {
            card.classList.add('visible');
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}
