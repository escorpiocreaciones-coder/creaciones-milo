(function () {
  'use strict';

  var counter = 0;
  function nextUid() { counter += 1; return 'sc' + counter; }

  var SCENES = [
    { sky: ['#f8c78a', '#dd7b64'], ground: '#5a3040', figure: '#2b1a22', sun: true },
    { sky: ['#241a3f', '#6b3f7a'], ground: '#161025', figure: '#0e0a17', stars: true },
    { sky: ['#d3efc4', '#93b98a'], ground: '#5f8455', figure: '#2f3f28', flowers: true },
    { sky: ['#f2e2cd', '#d3a878'], ground: '#6f4f37', figure: '#4a3a2f', cups: true },
    { sky: ['#ffd7e2', '#ef9ab8'], ground: '#b5577a', figure: '#6e2b4a', hearts: true }
  ];

  function sceneArt(index) {
    var scene = SCENES[index % SCENES.length];
    var uid = nextUid();
    var svg = '<svg viewBox="0 0 800 520" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">';
    svg += '<defs><linearGradient id="' + uid + '" x1="0" y1="0" x2="0" y2="1">';
    svg += '<stop offset="0" stop-color="' + scene.sky[0] + '"/>';
    svg += '<stop offset="1" stop-color="' + scene.sky[1] + '"/></linearGradient></defs>';
    svg += '<rect width="800" height="520" fill="url(#' + uid + ')"/>';
    if (scene.stars) {
      for (var s = 0; s < 26; s += 1) {
        var sx = 30 + ((s * 97) % 740);
        var sy = 26 + ((s * 61) % 260);
        svg += '<circle cx="' + sx + '" cy="' + sy + '" r="' + (1 + (s % 3)) + '" fill="#ffffff" opacity="0.8"/>';
      }
    }
    if (scene.sun) {
      svg += '<circle cx="560" cy="150" r="84" fill="#fff4d6" opacity="0.55"/>';
      svg += '<circle cx="560" cy="150" r="46" fill="#fff9e8"/>';
    }
    svg += '<ellipse cx="400" cy="560" rx="560" ry="168" fill="' + scene.ground + '"/>';
    svg += '<ellipse cx="180" cy="600" rx="380" ry="110" fill="rgba(0,0,0,0.12)"/>';
    if (scene.flowers) {
      for (var f = 0; f < 14; f += 1) {
        var fx = 40 + ((f * 111) % 720);
        var fy = 430 + ((f * 89) % 70);
        svg += '<circle cx="' + fx + '" cy="' + fy + '" r="4" fill="#fff" opacity="0.7"/>';
      }
    }
    if (scene.hearts) {
      for (var h = 0; h < 18; h += 1) {
        var hx = 40 + ((h * 137) % 720);
        var hy = 90 + ((h * 377) % 300);
        svg += '<path d="M' + hx + ' ' + hy + ' q-7 -10 -7 -16 a7 7 0 0 1 14 0 a7 7 0 0 1 14 0 q0 6 -7 16 z" fill="#fff" opacity="0.75"/>';
      }
    }
    var fy2 = 420;
    if (scene.cups) {
      svg += '<g fill="' + scene.figure + '">';
      svg += '<ellipse cx="400" cy="428" rx="150" ry="14"/>';
      svg += '<rect x="386" y="426" width="28" height="62" rx="8"/>';
      svg += '</g>';
      svg += '<g fill="#fff" opacity="0.95">';
      svg += '<rect x="330" y="404" width="30" height="22" rx="5"/>';
      svg += '<rect x="436" y="406" width="26" height="20" rx="5"/>';
      svg += '</g>';
      svg += '<path d="M360 415a6 6 0 0 1 0 12" stroke="#fff" stroke-width="4" fill="none"/>';
      svg += '<path d="M462 416a6 6 0 0 1 0 10" stroke="#fff" stroke-width="3.6" fill="none"/>';
      svg += '<path d="M345 396q7-9 0-16" stroke="rgba(255,255,255,0.85)" stroke-width="4" fill="none" stroke-linecap="round"/>';
      svg += '<path d="M449 398q7-9 0-16" stroke="rgba(255,255,255,0.85)" stroke-width="3.6" fill="none" stroke-linecap="round"/>';
    } else {
      svg += '<g fill="' + scene.figure + '">';
      svg += '<circle cx="336" cy="322" r="26"/>';
      svg += '<rect x="312" y="348" width="48" height="92" rx="20"/>';
      svg += '<circle cx="462" cy="322" r="26"/>';
      svg += '<rect x="438" y="348" width="48" height="92" rx="20"/>';
      svg += '</g>';
      svg += '<path d="M360 374h84" stroke="' + scene.figure + '" stroke-width="10" stroke-linecap="round"/>';
      svg += '<circle cx="402" cy="374" r="9" fill="rgba(255,255,255,0.35)"/>';
    }
    svg += '</svg>';
    return svg;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var coverSection = document.getElementById('book-cover');
    var readerSection = document.getElementById('book-reader');
    var openBtn = document.getElementById('open-book');
    var pageEl = document.getElementById('book-page');
    var prevBtn = document.getElementById('book-prev');
    var nextBtn = document.getElementById('book-next');
    var dotsEl = document.getElementById('book-dots');
    var counterEl = document.getElementById('book-counter');
    var coverMain = document.getElementById('cover-main');
    var coverMini1 = document.getElementById('cover-mini-1');
    var coverMini2 = document.getElementById('cover-mini-2');

    if (!coverSection || !readerSection || !openBtn || !pageEl) return;

    if (coverMain) coverMain.innerHTML = sceneArt(0);
    if (coverMini1) coverMini1.innerHTML = sceneArt(2);
    if (coverMini2) coverMini2.innerHTML = sceneArt(4);

    var pages = [
      {
        kicker: 'Capítulo 01',
        title: 'Donde todo comenzó',
        caption: 'Ese primer café que no queríamos terminar',
        scene: 3,
        text: 'Parecía una tarde común, pero sentados frente a frente nos dimos cuenta de que las horas pasaban sin esfuerzo. Aprendimos que el tiempo junto a la persona correcta nunca se siente perdido.'
      },
      {
        kicker: 'Capítulo 02',
        title: 'Nuestra primera aventura',
        caption: 'Un viaje sin plan, con muchas risas',
        scene: 1,
        text: 'Salimos con más ganas que maletas y regresamos con las mejores historias. Desde entonces sabemos que lo perfecto no existe, pero lo inevitable sí: irnos juntos a explorar.'
      },
      {
        kicker: 'Capítulo 03',
        title: 'Momentos simples',
        caption: 'Domingos, abrazos y café compartido',
        scene: 2,
        text: 'La vida buena vive en los calendarios sin planes: cocinar con descuido, reírnos sin razón, bailar en la cocina. Nosotros coleccionamos esos minutos pequeños.'
      },
      {
        kicker: 'Capítulo 04',
        title: 'Lo que amo de ti',
        caption: '',
        scene: 0,
        list: [
          'Tu manera de convencerte que puedo con lo que se ponga enfrente.',
          'La forma en que sumas aunque estemos cansados.',
          'Tu risa que contagia y tu abrazo que regresa a casa.'
        ],
        text: 'No son detalles: son recibos de lo que somos. Un equipo que no se desfonda fácil.'
      },
      {
        kicker: 'Capítulo 05',
        title: 'Nuestro próximo capítulo',
        caption: '',
        scene: 4,
        text: 'Que este libro sea el recuerdo de que ya vivimos cosas bonitas y la promesa de las que vienen. Aquí vamos a seguir escribiendo, un capítulo a la vez: no empezarnos nunca, reescribirnos siempre.',
        final: true
      }
    ];

    var index = 0;

    function pageHTML(page) {
      var html = '<div class="book-photo"><span class="book-photo-frame">' + sceneArt(page.scene) + '</span>';
      if (page.caption) html += '<span class="book-photo-caption">' + page.caption + '</span>';
      html += '</div>';
      if (page.kicker) html += '<p class="book-kicker">' + page.kicker + '</p>';
      if (page.title) html += '<h2 class="book-page-title">' + page.title + '</h2>';
      html += '<div class="book-text">';
      if (page.list) {
        html += '<ul class="book-list">' + page.list.map(function (item) {
          return '<li>' + item + '</li>';
        }).join('') + '</ul>';
      }
      if (page.text) html += '<p>' + page.text + '</p>';
      if (page.final) {
        html += '<p class="book-sign">Con amor,</p><p class="book-sign-name">Ana &amp; Luis</p>';
        html += '<a class="book-cta" href="index.html#producto/libro-digital">Quiero un libro así</a>';
      }
      html += '</div>';
      return html;
    }

    function renderPage(direction) {
      var page = pages[index];
      var enter = direction === undefined ? '' : direction > 0 ? 'is-next' : 'is-back';
      if (enter) {
        pageEl.className = 'book-page ' + enter;
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            pageEl.classList.remove('is-next', 'is-back');
            pageEl.classList.add('is-shown');
          });
        });
      } else {
        pageEl.className = 'book-page is-shown';
      }
      pageEl.innerHTML = pageHTML(page);
      if (prevBtn) prevBtn.disabled = index === 0;
      if (nextBtn) nextBtn.disabled = index === pages.length - 1;
      if (dotsEl) {
        dotsEl.innerHTML = pages.map(function (_page, i) {
          return '<button type="button" class="dot' + (i === index ? ' is-active' : '') + '" data-page="' + i + '" aria-label="Página ' + (i + 1) + '"></button>';
        }).join('');
      }
      if (counterEl) counterEl.textContent = 'Página ' + (index + 1) + ' de ' + pages.length;
    }

    function go(delta) {
      var target = index + delta;
      if (target < 0 || target >= pages.length) return;
      index = target;
      renderPage(delta);
    }

    openBtn.addEventListener('click', function () {
      coverSection.hidden = true;
      readerSection.hidden = false;
      index = 0;
      renderPage();
    });

    if (prevBtn) prevBtn.addEventListener('click', function () { go(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { go(1); });

    var closeLink = document.getElementById('close-reader');
    if (closeLink) {
      closeLink.addEventListener('click', function (event) {
        event.preventDefault();
        coverSection.hidden = false;
        readerSection.hidden = true;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
    if (dotsEl) {
      dotsEl.addEventListener('click', function (event) {
        var dot = event.target.closest('[data-page]');
        if (!dot) return;
        go(Number(dot.dataset.page) - index);
      });
    }

    document.addEventListener('keydown', function (event) {
      if (readerSection.hidden) return;
      if (event.key === 'ArrowRight') go(1);
      else if (event.key === 'ArrowLeft') go(-1);
    });

    renderPage();

    var params = window.location.search || '';
    var pageMatch = params.match(/page=(\d+)/);
    if (params.indexOf('open=1') !== -1 || pageMatch) {
      openBtn.click();
      if (pageMatch) {
        index = Math.min(pages.length - 1, Math.max(0, parseInt(pageMatch[1], 10) - 1));
        renderPage();
      }
    }
  });
})();
