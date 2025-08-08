export class Router {
  constructor({ routes, outlet }) {
    this.routes = routes;
    this.outlet = outlet;
    this.onRoute = this.onRoute.bind(this);
  }

  start() {
    window.addEventListener('hashchange', this.onRoute);
    if (!location.hash) {
      location.hash = '#/';
    } else {
      this.onRoute();
    }
  }

  async onRoute() {
    const path = (location.hash || '#/').slice(1);
    const match = this.routes.find(r => r.path === path);
    if (!match) {
      this.outlet.innerHTML = `<div class="panel">Not found</div>`;
      return;
    }
    const mod = await match.loader();
    this.outlet.replaceChildren();
    await mod.render(this.outlet);
  }
}