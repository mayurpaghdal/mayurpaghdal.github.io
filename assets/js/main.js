(function () {
  'use strict';

  /* ---------- theme toggle ---------- */
  var root = document.documentElement;
  var themeBtn = document.getElementById('themeBtn');

  function currentTheme() {
    var set = root.getAttribute('data-theme');
    if (set) return set;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  themeBtn.addEventListener('click', function () {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  /* ---------- hero illustration: stop moving packets if the visitor prefers less motion ---------- */
  var heroSvg = document.querySelector('.hero-art svg');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  function applyMotion() {
    if (!heroSvg || !heroSvg.pauseAnimations) return;
    if (reduceMotion.matches) heroSvg.pauseAnimations(); else heroSvg.unpauseAnimations();
  }
  applyMotion();
  if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', applyMotion);

  /* ---------- architecture diagram topics ---------- */
  var CLIENTS = ['cl-admin', 'cl-web', 'cl-desk', 'cl-mob', 'cl-ops'];
  var CLIENT_EDGES = ['c1', 'c2', 'c3', 'c4', 'c5'];

  var FACETS = {
    tenancy: {
      title: 'Tenancy',
      body: 'bs-one started as a standalone system installed separately for every customer. I designed the backend that made it multi-tenant: one database per tenant, a central tenant catalogue and row-level security, with one codebase for cloud and on-premise customers.',
      nodes: ['api', 'cat', 'db'],
      edges: ['api-cat', 'api-db', 'cat-db']
    },
    gtm: {
      title: 'Marketplace onboarding',
      body: 'A customer buys on AppSource, gives Entra ID admin consent and gets a ready tenant with no manual setup. Subscription events go through a retry-safe queue, so a retry never applies a change twice.',
      nodes: ['market', 'queue', 'fn', 'cat', 'db', 'entra'],
      edges: ['mk-q', 'q-fn', 'fn-db']
    },
    identity: {
      title: 'Security',
      body: 'Entra ID single sign-on with per-app permissions, secrets kept in Key Vault, and short-lived signed keys for calls made before login.',
      nodes: CLIENTS.concat(['entra', 'api', 'kv']),
      edges: CLIENT_EDGES.concat(['entra-api'])
    },
    integration: {
      title: 'Event-driven sync',
      body: 'Sync with Outlook, Planner, To Do, SharePoint, Dynamics 365 and Azure DevOps using Graph change notifications, delta sync and 20+ background services. A dedup buffer stops duplicate writes and deadlocks, and SignalR pushes live updates to the apps.',
      nodes: ['m365', 'graph', 'fn', 'db', 'api'].concat(CLIENTS),
      edges: ['m365-graph', 'graph-fn', 'fn-db'].concat(CLIENT_EDGES)
    },
    channels: {
      title: 'Client apps',
      body: 'Five multilingual apps (admin portal, web tracker, desktop app, mobile app, operations console) on one set of shared APIs. Desktop push notifications go through Azure Notification Hubs. The desktop app, bs-one Uplift, is live on Microsoft Marketplace and the Microsoft Store.',
      nodes: CLIENTS.concat(['api']),
      edges: CLIENT_EDGES
    },
    hosting: {
      title: 'Hosting cost',
      body: 'The Azure setup (Functions, queues, Service Bus, VMs, Redis) is designed to keep hosting cost down without losing reliability, and the same codebase also runs on customers’ own servers.',
      nodes: ['fn', 'queue', 'redis', 'api'],
      edges: ['q-fn']
    },
    reliability: {
      title: 'Releases & stability',
      body: 'Database releases use hand-written scripts plus Visual Studio Schema Compare against a base PROD database. Only the final change set goes to every tenant, then random tenant databases are compared to confirm. In production I handle issues like thread-pool starvation and connection-pool exhaustion across the API and 20+ background services, with health checks on key endpoints.',
      nodes: ['api', 'fn', 'db', 'cat'],
      edges: ['api-db', 'fn-db', 'api-cat', 'cat-db']
    }
  };

  var diagram = document.getElementById('diagram');
  var titleEl = document.getElementById('facetTitle');
  var bodyEl = document.getElementById('facetBody');
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.facets [data-facet]'));

  function showFacet(key) {
    var f = FACETS[key];
    if (!f || !diagram) return;
    diagram.classList.add('has-focus');
    diagram.querySelectorAll('.node, .edge').forEach(function (el) {
      var k = el.getAttribute('data-k');
      var on = el.classList.contains('node') ? f.nodes.indexOf(k) > -1 : f.edges.indexOf(k) > -1;
      el.classList.toggle('on', on);
    });
    titleEl.textContent = f.title;
    bodyEl.textContent = f.body;
    tabs.forEach(function (t) {
      var sel = t.getAttribute('data-facet') === key;
      t.setAttribute('aria-selected', sel ? 'true' : 'false');
      t.tabIndex = sel ? 0 : -1;
    });
  }

  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { showFacet(t.getAttribute('data-facet')); });
    t.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      var next = tabs[(i + d + tabs.length) % tabs.length];
      next.focus();
      showFacet(next.getAttribute('data-facet'));
    });
  });

  showFacet('tenancy');

  /* ---------- highlight the section being read ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.side-nav a'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id);
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { io.observe(s); });
  }

  /* ---------- footer year ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
