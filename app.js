// ============================================================
// SCENARIO ENGINE
// Handles rendering, navigation, history, and help modal.
// Requires scenes.js to be loaded first.
// ============================================================

const app = document.getElementById('app');
const helpBtn = document.getElementById('helpBtn');
const helpModal = document.getElementById('helpModal');
const helpClose = document.getElementById('helpClose');

let history = [];
const totalDepth = 10; // max depth value for progress calculation

function getProgress(depth) {
  return Math.min(100, Math.round((depth / totalDepth) * 100));
}

function renderScene(sceneId, pushHistory) {
  if (pushHistory === undefined) pushHistory = true;

  const scene = scenes[sceneId];
  if (!scene) return;

  if (pushHistory && (history.length === 0 || history[history.length - 1] !== sceneId)) {
    history.push(sceneId);
  }

  const progress = getProgress(scene.depth);

  let html = '';

  // Title
  html += '<div class="scenario-title">Vehicle Recovery — Customer Service Training</div>';

  // Progress bar
  html += '<div class="progress-wrap">';
  html += '  <div class="progress-label">';
  html += '    <span>Progress</span>';
  html += '    <span>' + progress + '%</span>';
  html += '  </div>';
  html += '  <div class="progress-track">';
  html += '    <div class="progress-fill" style="width:' + progress + '%"></div>';
  html += '  </div>';
  html += '</div>';

  // Card
  html += '<div class="card">';

  // Image
  html += '<img class="card-image" src="' + scene.image + '" alt="Scene illustration" />';

  // Feedback banner (coaching notes)
  if (scene.feedback) {
    var fbClass = scene.feedback.type === 'warn' ? 'warn' : scene.feedback.type === 'good' ? 'good' : 'bad';
    var fbLabel = scene.feedback.type === 'warn' ? '⚡ Coaching note:' : scene.feedback.type === 'good' ? '✓ Good:' : '✗ Issue:';
    html += '<div class="feedback ' + fbClass + '">';
    html += '  <strong>' + fbLabel + '</strong> ' + scene.feedback.text;
    html += '</div>';
  }

  // Outcome banner (for endings)
  if (scene.outcome) {
    html += '<div class="outcome-banner ' + scene.outcome.type + '">';
    html += '  <div class="outcome-icon">' + scene.outcome.icon + '</div>';
    html += '  <div class="outcome-title">' + scene.outcome.title + '</div>';
    html += '  <div class="outcome-text">' + scene.outcome.text + '</div>';
    html += '</div>';
  }

  // Body text
  html += '<div class="card-body">';
  for (var i = 0; i < scene.body.length; i++) {
    var item = scene.body[i];
    if (typeof item === 'string') {
      html += '<p>' + item + '</p>';
    } else if (item.dialogue) {
      html += '<p class="dialogue">' + item.dialogue + '</p>';
    }
  }
  if (scene.question) {
    html += '<p class="question">' + scene.question + '</p>';
  }
  html += '</div>';

  // Choice buttons
  if (scene.choices && scene.choices.length > 0) {
    var labels = ['A', 'B', 'C'];
    html += '<div class="choices">';
    for (var j = 0; j < scene.choices.length; j++) {
      var c = scene.choices[j];
      html += '<button class="choice-btn" data-label="' + labels[j] + '" data-next="' + c.next + '">' + c.text + '</button>';
    }
    html += '</div>';
  }

  // Continue button (mid-story transitions)
  if (scene.continueBtn) {
    html += '<div class="btn-row">';
    html += '  <button class="btn-primary" data-continue="' + scene.continueBtn.next + '">' + scene.continueBtn.text + '</button>';
    html += '</div>';
  }

  // End-scene buttons
  if (scene.isEnd) {
    html += '<div class="btn-row">';
    if (history.length > 1) {
      html += '<button class="btn-secondary" id="backBtn">← Go back</button>';
    }
    html += '<button class="btn-primary" id="restartBtn">Start again</button>';
    html += '</div>';
  }

  // Back button for non-ending scenes
  if (!scene.isEnd && !scene.continueBtn && history.length > 1) {
    html += '<div class="btn-row">';
    html += '  <button class="btn-secondary" id="backBtn">← Go back</button>';
    html += '</div>';
  }

  html += '</div>'; // close .card

  app.innerHTML = html;
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Re-trigger card entrance animation
  var card = app.querySelector('.card');
  if (card) {
    card.style.animation = 'none';
    card.offsetHeight; // force reflow
    card.style.animation = '';
  }

  // Bind event listeners
  bindEvents();
}

function bindEvents() {
  // Choice buttons
  var choiceBtns = document.querySelectorAll('.choice-btn');
  for (var i = 0; i < choiceBtns.length; i++) {
    choiceBtns[i].addEventListener('click', function () {
      renderScene(this.getAttribute('data-next'));
    });
  }

  // Continue button
  var continueBtn = document.querySelector('[data-continue]');
  if (continueBtn) {
    continueBtn.addEventListener('click', function () {
      renderScene(this.getAttribute('data-continue'));
    });
  }

  // Back button
  var backBtn = document.getElementById('backBtn');
  if (backBtn) {
    backBtn.addEventListener('click', goBack);
  }

  // Restart button
  var restartBtn = document.getElementById('restartBtn');
  if (restartBtn) {
    restartBtn.addEventListener('click', restart);
  }
}

function goBack() {
  if (history.length > 1) {
    history.pop();
    var prev = history[history.length - 1];
    renderScene(prev, false);
  }
}

function restart() {
  history = [];
  renderScene('intro');
}

// ---- HELP MODAL ----
helpBtn.addEventListener('click', function () {
  helpModal.classList.add('open');
});

helpClose.addEventListener('click', function () {
  helpModal.classList.remove('open');
});

helpModal.addEventListener('click', function (e) {
  if (e.target === helpModal) {
    helpModal.classList.remove('open');
  }
});

// ---- INIT ----
renderScene('intro');
