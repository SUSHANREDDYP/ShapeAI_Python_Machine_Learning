import { Card } from '../components/Card.js';
import { registerModal, openModal, closeModal } from '../components/Modal.js';

export async function render(target) {
  const hero = document.createElement('section');
  hero.className = 'hero';
  hero.innerHTML = `
    <div>
      <div class="badge">New</div>
      <h1>Build delightful UIs, fast.</h1>
      <p>Lightweight starter with modern styling, components, and routing. No build tools required.</p>
      <div class="controls">
        <a class="cta" href="#/settings">Open Settings</a>
        <button class="cta secondary" id="open-cmd">Command Palette ⌘K</button>
      </div>
    </div>
    <div class="panel">
      <img src="./assets/preview.svg" alt="Preview" style="width:100%; height:auto; display:block;" />
    </div>
  `;

  const grid = document.createElement('section');
  grid.className = 'grid';
  const cards = [
    { title: 'Components', description: 'Prebuilt Navbar, Card, Modal to speed up your workflow.' },
    { title: 'Routing', description: 'Simple hash router with code-splitting per page.' },
    { title: 'A11y & Dark Mode', description: 'Accessible colors, reduced motion friendly, and dark by default.' },
  ];
  cards.forEach(c => grid.appendChild(Card(c)));

  target.append(hero, grid);

  registerModal('command-palette', `
    <div style="display:flex; align-items:center; justify-content:space-between; gap:1rem;">
      <h3 style="margin:0">Command Palette</h3>
      <button class="button" id="close-cmd">Close</button>
    </div>
    <div style="margin-top: .75rem">
      <input class="input" placeholder="Type a command... (e.g., go to settings)" />
    </div>
  `);

  hero.querySelector('#open-cmd').addEventListener('click', () => openModal('command-palette'));
  document.getElementById('close-cmd')?.addEventListener('click', () => closeModal('command-palette'));
}