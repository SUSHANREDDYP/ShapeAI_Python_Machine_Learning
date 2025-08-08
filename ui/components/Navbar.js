export function createNavbar(target) {
  const brand = document.createElement('a');
  brand.className = 'brand';
  brand.href = '#/';
  brand.innerHTML = `
    <img src="./assets/logo.svg" alt="Logo" />
    <span>Starter UI</span>
  `;

  const nav = document.createElement('nav');
  nav.className = 'navlinks';

  const links = [
    { href: '#/', label: 'Home' },
    { href: '#/about', label: 'About' },
    { href: '#/settings', label: 'Settings' },
  ];

  links.forEach(({ href, label }) => {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = label;
    nav.appendChild(a);
  });

  target.append(brand, nav);

  function setActive() {
    const current = location.hash || '#/';
    [...nav.querySelectorAll('a')].forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === current);
    });
  }

  setActive();
  window.addEventListener('hashchange', setActive);
}