import { createNavbar } from './components/Navbar.js';
import { Router } from './router.js';
import { openModal } from './components/Modal.js';

const appRoot = document.getElementById('app');

function createLayout() {
  const header = document.createElement('header');
  header.className = 'header';

  const headerInner = document.createElement('div');
  headerInner.className = 'container navbar';
  header.appendChild(headerInner);

  const main = document.createElement('main');
  main.className = 'main';

  const mainInner = document.createElement('div');
  mainInner.className = 'container';
  main.appendChild(mainInner);

  const footer = document.createElement('footer');
  footer.className = 'container footer';
  footer.innerHTML = `
    <div class="badge">Starter UI</div>
    <div style="float:right">Built with ❤️ — Edit files in <code>/workspace/ui</code></div>
  `;

  appRoot.append(header, main, footer);
  return { headerInner, mainInner };
}

const { headerInner, mainInner } = createLayout();
createNavbar(headerInner);

const routes = [
  { path: '/', name: 'Home', loader: () => import('./pages/Home.js') },
  { path: '/about', name: 'About', loader: () => import('./pages/About.js') },
  { path: '/settings', name: 'Settings', loader: () => import('./pages/Settings.js') },
];

const router = new Router({ routes, outlet: mainInner });
router.start();

// Keyboard: open command palette (example modal)
window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    openModal('command-palette');
  }
});