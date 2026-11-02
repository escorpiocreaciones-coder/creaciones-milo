(function () {
  var key = 'milo-theme';
  function apply(theme) {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    var btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = theme === 'dark' ? 'â˜€ï¸' : 'ðŸŒ™';
  }
  var saved = null;
  try { saved = localStorage.getItem(key); } catch (e) {}
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  var theme = saved || (prefersDark ? 'dark' : 'light');
  apply(theme);
  var btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.addEventListener('click', function () {
      var isDark = document.documentElement.classList.toggle('dark');
      try { localStorage.setItem(key, isDark ? 'dark' : 'light'); } catch (e) {}
      btn.textContent = isDark ? 'â˜€ï¸' : 'ðŸŒ™';
    });
  }
})();
