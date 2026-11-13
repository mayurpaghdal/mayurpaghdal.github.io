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

  /* ---------- architecture diagram facets ---------- */
  var CLIENTS = ['cl-admin', 'cl-web', 'cl-desk', 'cl-ops'];
  var CLIENT_EDGES = ['c1', 'c2', 'c3', 'c4'];

  var FACETS = {
    tenancy: {
      title: 'Tenancy & data isolation',
      body: 'Designed a database-per-tenant model with a central tenant catalogue, row-level security and a separate analytics warehouse — strong isolation for enterprise customers while one codebase serves cloud-hosted and on-premise tenants.',
      nodes: ['api', 'cat', 'db', 'wh'],
      edges: ['api-cat', 'api-db', 'cat-db', 'db-wh']
    },
    gtm: {
      title: 'Go-to-market enablement',
      body: 'Designed self-service onboarding from AppSource purchase to a provisioned tenant with Entra ID admin consent, plus Marketplace subscription handling that acknowledges events instantly and processes them through an idempotent, retry-safe queue.',
      nodes: ['market', 'queue', 'fn', 'cat', 'db', 'entra'],
      edges: ['mk-q', 'q-fn', 'fn-db', 'cat-db']
    },
    identity: {
      title: 'Identity & security',
      body: 'Defined single sign-on across all web apps on Microsoft Entra ID, with shared authentication and per-app authorization, and secured pre-session service calls with signed, time-limited keys.',
      nodes: CLIENTS.concat(['entra', 'api']),
      edges: CLIENT_EDGES.concat(['entra-api'])
    },
    integration: {
      title: 'Integration architecture',
      body: 'Shaped an event-driven layer connecting Outlook, Planner, To Do, SharePoint, Dynamics 365 and Azure DevOps through Graph change notifications, delta-based incremental sync and 20+ scheduled services, with a deduplication buffer that prevents duplicate writes and database deadlocks.',
      nodes: ['m365', 'graph', 'fn', 'db'],
      edges: ['m365-graph', 'graph-fn', 'fn-db']
    },
    channels: {
      title: 'Multi-channel product',
      body: 'Set the architecture for four client channels — admin portal, web tracker, Windows desktop app with push notifications, and operations console — on shared APIs with English and German localization.',
      nodes: CLIENTS.concat(['api']),
      edges: CLIENT_EDGES
    },
    reliability: {
      title: 'Reliability & release governance',
      body: 'Led production-stability remediation (thread-pool starvation, connection-pool exhaustion) across the API and 20+ background services, added endpoint health monitoring, and designed a unified database release pipeline with backups, drift validation and per-script audit.',
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

  /* ---------- active section in the sidebar ---------- */
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

  /* ---------- copy buttons ---------- */
  document.querySelectorAll('.copy').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var done = function () {
        btn.textContent = 'Copied';
        btn.classList.add('done');
        setTimeout(function () { btn.textContent = 'Copy'; btn.classList.remove('done'); }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () {});
      }
    });
  });

  /* ---------- footer year ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
