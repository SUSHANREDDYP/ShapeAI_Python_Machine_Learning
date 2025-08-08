export async function render(target) {
  const wrap = document.createElement('div');
  wrap.className = 'panel';
  wrap.innerHTML = `
    <h2 style="margin:0 0 .5rem">About</h2>
    <p style="margin:0 0 1rem; color: var(--muted)">This is a minimal, framework-free UI scaffold built with modern browser APIs.</p>
    <ul style="margin:0; padding-left:1rem">
      <li>Vanilla JS modules</li>
      <li>Responsive layout and components</li>
      <li>Zero build step</li>
    </ul>
  `;
  target.appendChild(wrap);
}