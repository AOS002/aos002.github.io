'use strict';

// The site content and navigation remain available without JavaScript.
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('#site-navigation');
const navigationLinks = [...document.querySelectorAll('.nav-link')];
const narrowScreen = window.matchMedia('(max-width: 760px)');

function setMenu(open) {
  menuToggle.setAttribute('aria-expanded', String(open));
  menu.classList.toggle('is-collapsed', !open);
  menuToggle.querySelector('.menu-label').textContent = open ? 'Close' : 'Menu';
}

function resetMenu() {
  setMenu(!narrowScreen.matches);
}

menuToggle.classList.add('is-enhanced');
menu.classList.add('is-enhanced');
document.querySelector('.sidebar').classList.add('is-enhanced');
resetMenu();
menuToggle.addEventListener('click', () => {
  setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
});
if (narrowScreen.addEventListener) narrowScreen.addEventListener('change', resetMenu);
else narrowScreen.addListener(resetMenu);

function activateLink(id) {
  navigationLinks.forEach(link => {
    const active = link.hash === '#' + id;
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}

navigationLinks.forEach(link => {
  link.addEventListener('click', () => {
    activateLink(link.hash.slice(1));
    if (narrowScreen.matches) setMenu(false);
  });
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && narrowScreen.matches && menuToggle.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuToggle.focus();
  }
});

// Mark the section whose heading has most recently crossed the upper viewport.
const sections = [...document.querySelectorAll('main > section[id]')];
let scrollScheduled = false;
function updateNavigation() {
  const threshold = narrowScreen.matches ? 140 : 110;
  let active = sections[0];
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= threshold) active = section;
  }
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 5) active = sections[sections.length - 1];
  activateLink(active.id);
  scrollScheduled = false;
}
window.addEventListener('scroll', () => {
  if (!scrollScheduled) {
    scrollScheduled = true;
    window.requestAnimationFrame(updateNavigation);
  }
}, { passive: true });
window.addEventListener('load', updateNavigation);
window.addEventListener('resize', updateNavigation);

document.querySelector('#year').textContent = String(new Date().getFullYear());
