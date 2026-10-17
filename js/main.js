/*
 * StoryCast – vanilla JavaScript (progressive enhancement only).
 * Without JavaScript every story card is visible and every link works.
 * With JavaScript the Home page gets category filtering and live search.
 */
(function () {
  'use strict';

  var grid = document.querySelector('[data-story-grid]');
  if (!grid) return;

  var items = Array.prototype.slice.call(grid.querySelectorAll('[data-story]'));
  var chips = Array.prototype.slice.call(document.querySelectorAll('[data-category-filter]'));
  var search = document.querySelector('[data-search]');
  var count = document.querySelector('[data-count]');
  var empty = document.querySelector('[data-empty]');
  var category = 'All stories';

  function update() {
    var query = search.value.trim().toLowerCase();
    var filtering = category !== 'All stories' || query !== '';
    var visible = 0;

    items.forEach(function (item) {
      var matchesCategory = category === 'All stories' || item.dataset.category === category;
      var matchesQuery = item.dataset.search.indexOf(query) !== -1;
      // The featured story already has its own large card, so hide its
      // duplicate until the visitor starts filtering or searching.
      var hideFeatured = !filtering && item.hasAttribute('data-featured');
      var show = matchesCategory && matchesQuery && !hideFeatured;
      item.hidden = !show;
      if (show) visible += 1;
    });

    var noun = visible === 1 ? 'story' : 'stories';
    count.textContent = visible + ' ' + (filtering ? noun + ' found' : 'curated ' + noun);
    empty.hidden = visible !== 0;
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      category = chip.dataset.categoryFilter;
      chips.forEach(function (other) {
        other.setAttribute('aria-pressed', String(other === chip));
      });
      update();
    });
  });

  search.addEventListener('input', update);
  search.form.addEventListener('submit', function (event) {
    event.preventDefault();
  });

  update();
})();

/*
 * Transcript follow-along (audio story page).
 * Highlights the line being read, using the start/end times stored on each
 * transcript line. Purely visual; the transcript works without JavaScript.
 */
(function () {
  'use strict';

  var audio = document.getElementById('story-audio');
  var lines = Array.prototype.slice.call(document.querySelectorAll('[data-transcript] [data-start]'));
  if (!audio || !lines.length) return;

  var active = null;

  function sync() {
    var now = audio.currentTime;
    var next = null;
    lines.forEach(function (line) {
      if (now >= parseFloat(line.dataset.start) && now < parseFloat(line.dataset.end)) next = line;
    });
    if (next === active) return;
    if (active) active.classList.remove('is-active');
    if (next) next.classList.add('is-active');
    active = next;
  }

  audio.addEventListener('timeupdate', sync);
  audio.addEventListener('seeked', sync);
  audio.addEventListener('ended', function () {
    if (active) active.classList.remove('is-active');
    active = null;
  });
})();