const siteHeader = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('#primary-nav');
const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

function setMenuOpen(isOpen) {
    if (!siteHeader || !menuToggle) return;

    siteHeader.classList.toggle('menu-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
}

menuToggle?.addEventListener('click', () => {
    setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
});

primaryNav?.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenuOpen(false);
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && siteHeader?.classList.contains('menu-open')) {
        setMenuOpen(false);
        menuToggle.focus();
    }
});

function updateActiveSection() {
    const activationLine = window.scrollY + (siteHeader?.offsetHeight ?? 0) + 80;
    let activeSection = sections[0];

    sections.forEach((section) => {
        if (section.offsetTop <= activationLine) activeSection = section;
    });

    if (!activeSection) return;

    navLinks.forEach((link) => {
        if (link.hash === `#${activeSection.id}`) {
            link.setAttribute('aria-current', 'location');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

let scrollSpyScheduled = false;
window.addEventListener('scroll', () => {
    if (scrollSpyScheduled) return;

    scrollSpyScheduled = true;
    window.requestAnimationFrame(() => {
        updateActiveSection();
        scrollSpyScheduled = false;
    });
}, { passive: true });

window.addEventListener('load', updateActiveSection, { once: true });
updateActiveSection();

