export async function render(target) {
  const form = document.createElement('form');
  form.className = 'panel';
  form.innerHTML = `
    <h2 style="margin:0 0 1rem">Settings</h2>
    <div style="display:grid; gap: .75rem; grid-template-columns: 1fr 2fr; align-items:center">
      <label for="name">Display name</label>
      <input id="name" class="input" placeholder="Your name" />
      <label for="theme">Theme</label>
      <select id="theme" class="input">
        <option value="system">System</option>
        <option value="dark">Dark</option>
        <option value="light">Light</option>
      </select>
      <div></div>
      <button class="button" type="submit">Save</button>
    </div>
  `;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('#name').value;
    const theme = form.querySelector('#theme').value;
    localStorage.setItem('ui.name', name);
    localStorage.setItem('ui.theme', theme);
    alert('Saved!');
  });

  target.appendChild(form);
}