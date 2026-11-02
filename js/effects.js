(function () {
  if (window.__miloEffects) return;
  window.__miloEffects = true;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var canvas = document.createElement('canvas');
  canvas.id = 'particle-canvas';
  document.body.prepend(canvas);
  var ctx = canvas.getContext('2d');
  var w = 0, h = 0, pts = [];
  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    pts = Array.from({ length: 50 }, function () {
      return { x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25, r: Math.random() * 1.6 + .6 };
    });
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(224,82,127,.45)';
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  resize();
  draw();
  window.addEventListener('resize', resize);

  var heroVisual = document.querySelector('.hero-visual');
  window.addEventListener('scroll', function () {
    if (heroVisual) heroVisual.style.transform = 'translateY(' + (window.scrollY * .12) + 'px)';
  }, { passive: true });

  document.addEventListener('mousemove', function (e) {
    document.querySelectorAll('.product-card').forEach(function (card) {
      var r = card.getBoundingClientRect();
      var x = e.clientX - r.left, y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > r.width || y > r.height) return;
      var rx = (y / r.height - .5) * -7;
      var ry = (x / r.width - .5) * 7;
      card.style.transform = 'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-6px)';
    });
  });
  document.addEventListener('mouseleave', function () {
    document.querySelectorAll('.product-card').forEach(function (c) { c.style.transform = ''; });
  });

  document.addEventListener('mousemove', function (e) {
    document.querySelectorAll('.btn, .card-button').forEach(function (btn) {
      var r = btn.getBoundingClientRect();
      var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      var dx = e.clientX - cx, dy = e.clientY - cy;
      var dist = Math.hypot(dx, dy);
      if (dist < 110) btn.style.transform = 'translate(' + (dx * .18) + 'px,' + (dy * .18) + 'px)';
      else btn.style.transform = '';
    });
  });
})();
