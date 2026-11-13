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
  var CLIENTS = ['cl-admin', 'cl-web', 'cl-desk', 'cl-ops'];
  var CLIENT_EDGES = ['c1', 'c2', 'c3', 'c4'];

  var FACETS = {
    tenancy: {
      title: 'Tenancy & data isolation',
      body: 'One database per tenant, a central tenant catalogue, row-level security and a separate analytics warehouse. Enterprise customers get their data isolated, and the same codebase runs both cloud-hosted and on-premise tenants.',
      nodes: ['api', 'cat', 'db', 'wh'],
      edges: ['api-cat', 'api-db', 'cat-db', 'db-wh']
    },
    gtm: {
      title: 'Marketplace onboarding',
      body: 'Self-service onboarding: a customer buys on AppSource, grants Entra ID admin consent and gets a provisioned tenant. Marketplace subscription events are acknowledged immediately and processed through an idempotent, retry-safe queue.',
      nodes: ['market', 'queue', 'fn', 'cat', 'db', 'entra'],
      edges: ['mk-q', 'q-fn', 'fn-db', 'cat-db']
    },
    identity: {
      title: 'Identity & security',
      body: 'Single sign-on across all web apps with Microsoft Entra ID: shared authentication, per-app authorization, and signed, time-limited keys for service calls made before a user session exists.',
      nodes: CLIENTS.concat(['entra', 'api']),
      edges: CLIENT_EDGES.concat(['entra-api'])
    },
    integration: {
      title: 'Integrations',
      body: 'Event-driven sync with Outlook, Planner, To Do, SharePoint, Dynamics 365 and Azure DevOps using Graph change notifications, delta queries and 20+ scheduled services. A deduplication buffer prevents duplicate writes and database deadlocks.',
      nodes: ['m365', 'graph', 'fn', 'db'],
      edges: ['m365-graph', 'graph-fn', 'fn-db']
    },
    channels: {
      title: 'Client apps',
      body: 'Four client apps (admin portal, web tracker, Windows desktop app with push notifications, operations console) on one set of shared APIs, localized in English and German.',
      nodes: CLIENTS.concat(['api']),
      edges: CLIENT_EDGES
    },
    reliability: {
      title: 'Reliability & releases',
      body: 'Fixed production stability issues (thread-pool starvation, connection-pool exhaustion) across the API and 20+ background services, added endpoint health monitoring, and built one database release pipeline with backups, drift checks and a per-script audit.',
      nodes: ['api', 'fn', 'db', 'cat'],
      edges: ['api-db', 'fn-db', 'api-cat', 'q-fn']
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
