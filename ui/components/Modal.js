const registry = new Map();

function ensureScaffold() {
  if (document.getElementById('modal-backdrop')) return;
  const backdrop = document.createElement('div');
  backdrop.id = 'modal-backdrop';
  backdrop.className = 'modal-backdrop';
  backdrop.addEventListener('click', () => closeModal());
  document.body.appendChild(backdrop);
}

export function registerModal(id, content) {
  ensureScaffold();
  let modal = document.getElementById(`modal-${id}`);
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'modal panel';
    modal.id = `modal-${id}`;
    document.body.appendChild(modal);
  }
  modal.innerHTML = content;
  registry.set(id, modal);
}

export function openModal(id) {
  ensureScaffold();
  const modal = registry.get(id) || document.getElementById(`modal-${id}`);
  const backdrop = document.getElementById('modal-backdrop');
  if (!modal) return;
  modal.classList.add('open');
  backdrop.classList.add('open');
}

export function closeModal(id) {
  const backdrop = document.getElementById('modal-backdrop');
  if (id) {
    const modal = registry.get(id) || document.getElementById(`modal-${id}`);
    if (modal) modal.classList.remove('open');
  } else {
    document.querySelectorAll('.modal.open').forEach(m => m.classList.remove('open'));
  }
  backdrop?.classList.remove('open');
}