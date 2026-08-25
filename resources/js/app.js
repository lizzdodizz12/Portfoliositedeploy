const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const mobileNav = document.querySelector('[data-mobile-nav]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const closeMenu = () => {
    mobileNav?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    if (menuToggle) menuToggle.innerHTML = '<i class="icon icon-menu"></i>';
};
menuToggle?.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.innerHTML = `<i class="icon icon-${isOpen ? 'x' : 'menu'}"></i>`;
});
mobileNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
window.addEventListener('scroll', () => header?.classList.toggle('is-small', window.scrollY > 50), { passive: true });

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const navLinks = document.querySelectorAll('[data-nav-link]');
const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) navLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`));
    });
}, { rootMargin: '-35% 0px -55% 0px' });
document.querySelectorAll('main section[id]').forEach((section) => activeObserver.observe(section));

document.querySelectorAll('[data-skill-tab]').forEach((tab) => tab.addEventListener('click', () => {
    const index = tab.dataset.skillTab;
    document.querySelectorAll('[data-skill-tab]').forEach((item) => { const active = item === tab; item.classList.toggle('is-active', active); item.setAttribute('aria-selected', String(active)); });
    document.querySelectorAll('[data-skill-panel]').forEach((panel) => panel.classList.toggle('is-active', panel.dataset.skillPanel === index));
}));
const detail = document.querySelector('[data-skill-detail]');
document.querySelectorAll('[data-skill-name]').forEach((skill) => {
    const showDetail = () => { detail.innerHTML = `<span class="detail-label">${skill.dataset.skillLevel}</span><strong>${skill.dataset.skillName}</strong><p>${skill.dataset.skillDescription}</p>`; };
    skill.addEventListener('mouseenter', showDetail); skill.addEventListener('focus', showDetail); skill.addEventListener('click', showDetail);
});

const modal = document.querySelector('[data-project-modal]');
const selectors = { image: '[data-modal-image]', number: '[data-modal-number]', category: '[data-modal-category]', title: '[data-modal-title]', description: '[data-modal-description]', problem: '[data-modal-problem]', solution: '[data-modal-solution]', stack: '[data-modal-stack]' };
const closeModal = () => { modal.classList.remove('is-open'); modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; };
document.querySelectorAll('[data-project]').forEach((project) => project.addEventListener('click', () => {
    const data = JSON.parse(project.dataset.project);
    modal.querySelector(selectors.image).src = data.image; modal.querySelector(selectors.image).alt = `${data.title} project placeholder`;
    modal.querySelector(selectors.number).textContent = data.number; modal.querySelector(selectors.category).textContent = data.category; modal.querySelector(selectors.title).textContent = data.title; modal.querySelector(selectors.description).textContent = data.description; modal.querySelector(selectors.problem).textContent = data.problem; modal.querySelector(selectors.solution).textContent = data.solution; modal.querySelector(selectors.stack).innerHTML = data.stack.map((item) => `<span>${item}</span>`).join('');
    modal.classList.add('is-open'); modal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; modal.querySelector('[data-modal-close]').focus();
}));
modal?.querySelectorAll('[data-modal-close]').forEach((button) => button.addEventListener('click', closeModal));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') { closeModal(); closeMenu(); } });

document.querySelector('[data-contact-form]')?.addEventListener('submit', (event) => { event.preventDefault(); const status = event.currentTarget.querySelector('.form-status'); status.textContent = 'Thanks. This prototype is ready to connect to Laravel.'; event.currentTarget.reset(); });
document.querySelector('[data-back-top]')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    const dot = document.querySelector('.cursor-dot'); const ring = document.querySelector('.cursor-ring'); let mouseX = 0; let mouseY = 0; let ringX = 0; let ringY = 0;
    window.addEventListener('mousemove', (event) => { mouseX = event.clientX; mouseY = event.clientY; dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`; });
    const moveCursor = () => { ringX += (mouseX - ringX) * .14; ringY += (mouseY - ringY) * .14; ring.style.transform = `translate(${ringX}px, ${ringY}px)`; requestAnimationFrame(moveCursor); }; moveCursor();
    document.querySelectorAll('a, button').forEach((element) => { element.addEventListener('mouseenter', () => { ring.classList.add('is-hovering'); ring.querySelector('span').textContent = element.dataset.cursorLabel || ''; }); element.addEventListener('mouseleave', () => ring.classList.remove('is-hovering')); });
    document.querySelectorAll('[data-parallax]').forEach((element) => window.addEventListener('mousemove', (event) => { const x = (event.clientX / window.innerWidth - .5) * 10; const y = (event.clientY / window.innerHeight - .5) * 8; element.style.transform = `translate(${x}px, ${y}px)`; }));
} else { document.querySelector('.cursor-dot')?.remove(); document.querySelector('.cursor-ring')?.remove(); }
