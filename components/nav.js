/**
 * nav.js — shared header & footer loader
 *
 * Usage: add the following to any page's <body> before </body>:
 *
 *   <div id="header-placeholder"></div>
 *   ... page content ...
 *   <div id="footer-placeholder"></div>
 *   <script src="./components/nav.js"></script>
 *
 * The script automatically highlights the active nav link
 * by matching the current filename against each link's data-page attribute.
 *
 * Supported data-page values: home | skill2school | upskill4teacher | ttt
 */

(function () {
  const BASE = './components/';

  // Map filenames to data-page identifiers
  const PAGE_MAP = {
    'index.html':           'home',
    'skill2school.html':    'skill2school',
    'upskill4teacher.html': 'upskill4teacher',
    'ttt.html':             'ttt',
  };

  // Derive current page key from the URL
  const filename = window.location.pathname.split('/').pop().toLowerCase() || 'index.html';
  const activePage = PAGE_MAP[filename] || '';

  /**
   * Fetch an HTML fragment and inject it into a placeholder element.
   * @param {string} placeholderId  - id of the target div
   * @param {string} fragmentFile   - filename inside components/
   * @param {function} [callback]   - optional post-inject callback
   */
  function loadComponent(placeholderId, fragmentFile, callback) {
    const el = document.getElementById(placeholderId);
    if (!el) return;

    fetch(BASE + fragmentFile)
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to load ' + fragmentFile);
        return res.text();
      })
      .then(function (html) {
        el.innerHTML = html;
        if (typeof callback === 'function') callback(el);
      })
      .catch(function (err) {
        console.warn('[nav.js]', err.message);
      });
  }

  /**
   * Highlight the active nav link after header is injected.
   */
  function highlightActiveLink(headerEl) {
    if (!activePage) return;

    var allLinks = headerEl.querySelectorAll('[data-page]');
    allLinks.forEach(function (link) {
      if (link.getAttribute('data-page') === activePage) {
        // Active styles
        link.classList.remove('text-on-surface-variant');
        link.classList.add('text-primary', 'font-bold', 'border-b-2', 'border-primary', 'py-1');
      }
    });

    // Mobile menu toggle
    var btn = headerEl.querySelector('#mobile-menu-btn');
    var menu = headerEl.querySelector('#mobile-menu');
    if (btn && menu) {
      btn.addEventListener('click', function () {
        menu.classList.toggle('hidden');
      });
    }
  }

  // Load both components on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', function () {
    loadComponent('header-placeholder', 'header.html', highlightActiveLink);
    loadComponent('footer-placeholder', 'footer.html');
  });
})();
