/* Dozier Tech Group site behaviour.
   No dependencies. Everything degrades to a readable static page if JS fails. */
(function () {
  'use strict';

  // Both set once, in index.html. See the comments there.
  var readMeta = function (n) {
    var m = document.querySelector('meta[name="' + n + '"]');
    return (m && m.content.trim()) || '';
  };
  var CONTACT_ENDPOINT = readMeta('dtg:contact-endpoint');
  var CONTACT_KEY = readMeta('dtg:contact-key');
  var USING_WEB3FORMS = /(^|\.)web3forms\.com$/i.test(
    CONTACT_ENDPOINT ? new URL(CONTACT_ENDPOINT, location.href).hostname : ''
  );
  // Web3Forms rejects a submission with no access key, so an endpoint without
  // one is not a working configuration; treat it as unconfigured.
  var CONTACT_READY = !!CONTACT_ENDPOINT && (!USING_WEB3FORMS || !!CONTACT_KEY);
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- nav ---------- */
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav-toggle');
  var links = document.getElementById('nav-links');

  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('is-stuck', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (toggle && links) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      links.dataset.open = String(open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
  }

  /* ---------- one observer drives both scroll-reveal and the diagrams ----------
     Diagrams keep every animation gated behind `.is-visible` so nothing plays
     off-screen, and each element is unobserved after its first intersection. */
  var targets = document.querySelectorAll('[data-reveal], .dgm');

  if (!('IntersectionObserver' in window) || reduced) {
    targets.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.02 }
    );
    targets.forEach(function (el) { io.observe(el); });

    // Stagger siblings that opt in, without hand-writing delays in the markup.
    document.querySelectorAll('[data-reveal-stagger]').forEach(function (group) {
      Array.prototype.forEach.call(group.children, function (child, i) {
        if (child.hasAttribute('data-reveal')) {
          child.style.setProperty('--reveal-delay', i * 70 + 'ms');
        }
      });
    });
  }

  /* ---------- count-up on the proof numbers ---------- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window && !reduced) {
    var cio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          cio.unobserve(el);
          var target = parseFloat(el.dataset.count);
          var suffix = el.dataset.suffix || '';
          var start = performance.now();
          var dur = 1100;
          var tick = function (now) {
            var t = Math.min(1, (now - start) / dur);
            var eased = 1 - Math.pow(1 - t, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- services rail ----------
     A scroll-snap rail, not a carousel: nothing rotates on its own. The rail is
     a native scroll container, so a trackpad, a swipe, or the arrow keys work
     with JS switched off. The buttons and dots ship `hidden` and are revealed
     here, so a broken script never leaves dead controls on the page. */
  var rail = document.getElementById('svc-rail');
  if (rail) {
    var railNav = document.querySelector('.svc-nav');
    var dots = document.querySelector('.svc-dots');
    var cards = rail.querySelectorAll('.svc-card');
    var arrows = railNav.querySelectorAll('.svc-arrow');
    var behavior = reduced ? 'auto' : 'smooth';

    // One "page" is however many whole cards currently fit.
    var metrics = function () {
      var card = cards[0].getBoundingClientRect().width + 1; // +1px rail gap
      var per = Math.max(1, Math.floor((rail.clientWidth + 1) / card));
      return { card: card, per: per, page: card * per };
    };

    var sync = function () {
      var m = metrics();
      var max = rail.scrollWidth - rail.clientWidth;
      arrows[0].disabled = rail.scrollLeft <= 1;
      arrows[1].disabled = rail.scrollLeft >= max - 1;
      var active = max <= 1 ? 0 : Math.round(rail.scrollLeft / m.page);
      dots.querySelectorAll('button').forEach(function (b, i) {
        b.setAttribute('aria-current', String(i === active));
      });
    };

    var buildDots = function () {
      var m = metrics();
      var pages = Math.max(1, Math.ceil(cards.length / m.per));
      dots.innerHTML = '';
      for (var i = 0; i < pages; i++) {
        var li = document.createElement('li');
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Show services starting at number ' + (i * m.per + 1));
        b.dataset.page = String(i);
        b.addEventListener('click', function () {
          rail.scrollTo({ left: Number(this.dataset.page) * metrics().page, behavior: behavior });
        });
        li.appendChild(b);
        dots.appendChild(li);
      }
      // With everything visible at once there is nothing to page through.
      dots.hidden = pages < 2;
      railNav.hidden = pages < 2;
    };

    arrows.forEach(function (btn) {
      btn.addEventListener('click', function () {
        rail.scrollBy({ left: Number(btn.dataset.dir) * metrics().page, behavior: behavior });
      });
    });

    var ticking = false;
    rail.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; sync(); });
    }, { passive: true });

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { buildDots(); sync(); }, 150);
    });

    buildDots();
    sync();
  }

  /* ---------- contact form ----------
     Previously this faked a 2s delay and threw the message away. It now posts
     to the dtg-web Worker, which relays via Microsoft Graph. */
  var form = document.getElementById('contact-form');
  if (!form) return;

  var status = document.getElementById('form-status');
  var submit = form.querySelector('button[type="submit"]');
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  var say = function (msg, state) {
    status.hidden = false;
    status.textContent = msg;
    status.dataset.state = state;
  };

  var setError = function (field, msg) {
    var box = form.querySelector('#' + field.id + '-error');
    field.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (box) box.textContent = msg || '';
    return !msg;
  };

  var validate = function () {
    var ok = true;
    var name = form.elements.name;
    var email = form.elements.email;
    var message = form.elements.message;

    ok = setError(name, name.value.trim() ? '' : 'Please tell us your name.') && ok;
    ok = setError(
      email,
      !email.value.trim()
        ? 'We need an email to reply to.'
        : EMAIL.test(email.value.trim())
          ? ''
          : "That email doesn't look right."
    ) && ok;
    ok = setError(
      message,
      message.value.trim().length >= 10 ? '' : 'A sentence or two about the project, please.'
    ) && ok;
    return ok;
  };

  ['name', 'email', 'message'].forEach(function (n) {
    var f = form.elements[n];
    f.addEventListener('blur', function () {
      if (f.getAttribute('aria-invalid') === 'true') validate();
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) {
      say('Please fix the highlighted fields.', 'err');
      form.querySelector('[aria-invalid="true"]').focus();
      return;
    }
    // Bots fill every field they find, including the hidden one.
    if (form.elements.company.value) return;

    // No backend configured yet. Say so plainly rather than fake a success
    // toast, which is precisely what the previous implementation did.
    if (!CONTACT_READY) {
      say('The form is not connected yet. Please email grant@doziertechgroup.com.', 'err');
      return;
    }

    submit.disabled = true;
    var original = submit.textContent;
    submit.textContent = 'Sending…';
    say('Sending your message…', '');

    var name = form.elements.name.value.trim();
    var email = form.elements.email.value.trim();
    var subject = form.elements.subject.value.trim();

    var payload = {
      name: name,
      email: email,
      message: form.elements.message.value.trim(),
    };

    if (USING_WEB3FORMS) {
      payload.access_key = CONTACT_KEY;
      // Web3Forms puts `subject` on the email itself, so an empty one would
      // arrive blank in the inbox.
      payload.subject = subject || 'New enquiry from doziertechgroup.com';
      payload.from_name = 'doziertechgroup.com';
      payload.replyto = email;
    } else {
      payload.subject = subject;
      payload.company = form.elements.company.value; // honeypot, checked server-side too
      payload.ts = Number(form.dataset.loaded || 0);
    }

    fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) {
        // Web3Forms can answer 200 with { success: false }: a rejected key, a
        // domain that isn't allowed. Don't report that as delivered.
        if (data && data.success === false) throw new Error(data.message || 'rejected');
        form.reset();
        say("Thanks, that's landed in Grant's inbox. You'll hear back within one business day.", 'ok');
      })
      .catch(function () {
        // Never silently swallow. Give the user a route that definitely works.
        say(
          "Something went wrong sending that. Please email grant@doziertechgroup.com directly, or call (337) 412-4767.",
          'err'
        );
      })
      .finally(function () {
        submit.disabled = false;
        submit.textContent = original;
      });
  });

  form.dataset.loaded = String(Date.now());
})();
