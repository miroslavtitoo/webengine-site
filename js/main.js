/* ============================================================
   Webengine — главная
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

/* ---------- Установка vh для мобилок ---------- */
(function setVH() {
  const set = () => {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  };
  set();
  window.addEventListener('resize', set);
})();

/* ---------- Прелоадер ---------- */
function runPreloader(onDone) {
  const root = document.getElementById('preloader');
  const num = document.getElementById('preloader-num');
  if (!root) { onDone(); return; }

  let p = 0;
  const tick = setInterval(() => {
    p += Math.random() * 18 + 6;
    if (p >= 100) {
      p = 100;
      clearInterval(tick);
      setTimeout(hide, 250);
    }
    num.textContent = Math.floor(p).toString().padStart(2, '0');
  }, 90);

  function hide() {
    root.classList.add('is-hidden');
    document.body.classList.remove('is-loading');
    document.body.classList.add('is-ready');
    setTimeout(() => {
      root.remove();
      onDone();
    }, 700);
  }
}

/* ---------- Hero: видео разворачивается на скролле ---------- */
function initHeroScroll() {
  const hero = document.getElementById('hero');
  const media = document.getElementById('hero-media');
  if (!hero || !media) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: '+=180%',
      scrub: 0.6,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
    }
  });

  // Phase 1 — Expand (0 → 0.45)
  tl.to(media, {
    width: '100vw',
    height: '100vh',
    borderRadius: 0,
    ease: 'power2.inOut',
    duration: 0.45,
  }, 0);
  tl.to('.hero__corner, .hero__tagline', {
    opacity: 0,
    y: -10,
    duration: 0.2,
    ease: 'power2.in',
  }, 0);

  // Phase 2 — Hold full screen
  tl.to(media, { duration: 0.30 }, 0.45);

  // Phase 3 — Exit upward
  tl.to(media, {
    yPercent: -100,
    duration: 0.25,
    ease: 'power2.in',
  }, 0.75);
}

/* ---------- Появление statement ---------- */
function initStatementReveal() {
  const el = document.querySelector('.statement__text');
  if (!el) return;
  gsap.fromTo(
    el,
    { opacity: 0, y: 40, filter: 'blur(8px)' },
    {
      opacity: 1, y: 0, filter: 'blur(0px)',
      duration: 1.2, ease: 'power3.out',
      scrollTrigger: {
        trigger: '.statement',
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      }
    }
  );
}

/* ---------- Появление карточек ---------- */
function initCasesReveal() {
  gsap.utils.toArray('.case').forEach((card) => {
    gsap.fromTo(
      card,
      { opacity: 0, y: 60 },
      {
        opacity: 1, y: 0,
        duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 85%' }
      }
    );
  });
  gsap.fromTo(
    ['.cases__badge', '.cases__title'],
    { opacity: 0, y: 30 },
    {
      opacity: 1, y: 0,
      duration: 1, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: '.cases', start: 'top 75%' }
    }
  );
}

/* ---------- Запуск ---------- */
runPreloader(() => {
  // ScrollTrigger инициализируем после прелоадера, чтобы он
  // считал «нормальное» состояние стартовым
  initHeroScroll();
  initStatementReveal();
  initCasesReveal();
  ScrollTrigger.refresh();
});
