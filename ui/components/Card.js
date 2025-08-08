export function Card({ title, description, footer = '' }) {
  const el = document.createElement('div');
  el.className = 'panel card';
  el.innerHTML = `
    <h3>${title}</h3>
    <p>${description}</p>
    ${footer ? `<div style="margin-top:.75rem">${footer}</div>` : ''}
  `;
  return el;
}