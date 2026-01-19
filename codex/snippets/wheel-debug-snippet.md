<!-- FILE: codex/snippets/wheel-debug-snippet.md -->
# DevTools snippets for diagnosing broken wheel scrolling

Copy/paste these snippets into the browser DevTools console while reproducing the issue.

Notes:
- These snippets are for debugging only; do not commit them into production code.
- Some helper functions (like `getEventListeners`) exist only in certain browser devtools.

---

## 1) Identify the scroll container and its computed overflow

Run:

    (function () {
      const se = document.scrollingElement;
      const html = document.documentElement;
      const body = document.body;

      function info(el, name) {
        if (!el) return { name, exists: false };
        const cs = getComputedStyle(el);
        return {
          name,
          exists: true,
          tag: el.tagName,
          overflowY: cs.overflowY,
          overflow: cs.overflow,
          position: cs.position,
          height: cs.height,
          scrollHeight: el.scrollHeight,
          clientHeight: el.clientHeight,
          scrollTop: el.scrollTop
        };
      }

      console.table([info(html, 'html'), info(body, 'body'), info(se, 'scrollingElement')]);
      console.log('document.scrollingElement ===', se);
    })();

Interpretation:
- If `overflowY` is `hidden` or `clip` on the scrolling element, page wheel scroll will not work.
- If `scrollHeight <= clientHeight`, the page has nothing to scroll (verify content height).

---

## 2) Log wheel events at capture phase (detect preventDefault)

Run:

    (function () {
      if (window.__ssWheelLoggerInstalled) {
        console.warn('wheel logger already installed');
        return;
      }
      window.__ssWheelLoggerInstalled = true;

      window.addEventListener('wheel', (e) => {
        const t = e.target;
        const name = t && t.nodeType === 1 ? (t.tagName.toLowerCase() + (t.id ? ('#' + t.id) : '') + (t.className ? ('.' + String(t.className).trim().split(/\\s+/).slice(0,3).join('.')) : '')) : String(t);
        console.log('[wheel]', {
          target: name,
          deltaY: e.deltaY,
          cancelable: e.cancelable,
          defaultPrevented: e.defaultPrevented
        });
      }, { capture: true, passive: false });

      console.log('Installed capture-phase wheel logger (passive:false). Scroll and watch logs.');
    })();

Interpretation:
- If `defaultPrevented` becomes true, something is calling `preventDefault()` on wheel events, which blocks native scrolling.

---

## 3) Trace who calls preventDefault on wheel events (stack trace)

WARNING:
- This monkeypatches `Event.prototype.preventDefault`.
- Use only for diagnosis; refresh the page afterward to restore normal behavior.

Run:

    (function () {
      if (window.__ssPreventDefaultPatched) {
        console.warn('preventDefault already patched');
        return;
      }
      window.__ssPreventDefaultPatched = true;

      const orig = Event.prototype.preventDefault;

      Event.prototype.preventDefault = function () {
        try {
          if (this && this.type === 'wheel') {
            console.groupCollapsed('[trace] preventDefault on wheel');
            console.log(this);
            console.trace();
            console.groupEnd();
          }
        } catch (_) {}
        return orig.apply(this, arguments);
      };

      console.log('Patched Event.prototype.preventDefault to trace wheel callers. Trigger wheel now.');
    })();

Interpretation:
- The console trace should point at the exact handler/file that is preventing wheel scroll.

---

## 4) Pricing widget internal scroll probe (index/services only)

Run on index/services pages to watch which scrollTop changes while you wheel:

    (function () {
      const page = document.scrollingElement;
      const list = document.querySelector('.ss-pricing__includes-body');

      if (!page) console.warn('No document.scrollingElement');
      if (!list) console.warn('No .ss-pricing__includes-body found');

      console.log('page scrollTop =', page && page.scrollTop);
      console.log('list scrollTop =', list && list.scrollTop);

      window.addEventListener('wheel', () => {
        console.log('page scrollTop =', page && page.scrollTop, 'list scrollTop =', list && list.scrollTop);
      }, { capture: true, passive: true });

      console.log('Installed scrollTop probe. Wheel over the pricing list vs outside it.');
    })();

Interpretation:
- Wheeling over the includes list should change `list.scrollTop` (internal scroll).
- Wheeling over normal page content should change `page.scrollTop` (page scroll).
