(function () {
  'use strict';

  // To get bookings on WhatsApp, put your number here with the country code and no + or spaces.
  // Example for Pakistan: '923001234567'. Leave empty to only show a confirmation message.
  var WHATSAPP_NUMBER = '';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* header: solid background after scrolling, mobile menu */
  var header = $('.site');
  function onScroll() {
    header.classList.toggle('solid', window.scrollY > 24);
    if (!reduce) {
      var img = $('.hero-ph img');
      if (img && window.scrollY < 900) {
        img.style.transform = 'translateY(' + (window.scrollY * 0.08).toFixed(1) + 'px) scale(1.06)';
      }
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var menuBtn = $('#menuBtn'), nav = $('#nav');
  menuBtn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  $$('#nav a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });

  /* service tabs */
  var tabs = $$('.tab');
  function selectTab(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      $('#' + t.getAttribute('aria-controls')).hidden = !on;
    });
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(tab); });
    tab.addEventListener('keydown', function (e) {
      var j = null;
      if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      if (j !== null) { e.preventDefault(); tabs[j].focus(); selectTab(tabs[j]); }
    });
  });

  /* reveal sections as they scroll into view */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    $$('.reveal').forEach(function (el) { io.observe(el); });
  }

  /* booking form */
  var form = $('#bookForm'), msg = $('#formMsg'), dateInput = $('#bDate');
  var d = new Date();
  var iso = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  dateInput.min = iso;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var fields = $$('input, select', form), firstBad = null;
    fields.forEach(function (f) {
      var bad = !f.value.trim();
      f.classList.toggle('bad', bad);
      if (bad && !firstBad) firstBad = f;
    });
    msg.className = 'form-msg';
    msg.textContent = '';
    if (firstBad) {
      msg.classList.add('error');
      msg.textContent = 'Please fill in every field so we can confirm your booking.';
      firstBad.focus();
      return;
    }
    var name = form.elements.name.value.trim();
    var service = form.elements.service.value;
    var date = form.elements.date.value;
    var time = form.elements.time.value;
    var phone = form.elements.phone.value.trim();
    msg.textContent = 'Thank you, ' + name.split(' ')[0] + '. Your request for ' + service + ' on ' + date + ' at ' + time + ' is noted.';

    if (WHATSAPP_NUMBER) {
      var text = 'Hello, I would like to book ' + service + ' on ' + date + ' at ' + time + '. Name: ' + name + ', phone: ' + phone + '.';
      var a = document.createElement('a');
      a.className = 'btn small';
      a.target = '_blank';
      a.rel = 'noopener';
      a.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);
      a.textContent = 'Send on WhatsApp';
      msg.appendChild(document.createElement('br'));
      msg.appendChild(a);
    } else {
      msg.appendChild(document.createElement('br'));
      msg.appendChild(document.createTextNode('This is a sample form, so nothing was sent.'));
    }
    form.reset();
  });
  $$('input, select', form).forEach(function (f) {
    f.addEventListener('input', function () { f.classList.remove('bad'); });
  });
})();