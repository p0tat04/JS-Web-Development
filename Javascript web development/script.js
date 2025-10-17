const quizData = [
  { question: "What does 'let' declare in JavaScript?", options: ["A constant value", "A changeable variable", "A function", "An array"], correct: 1 },
  { question: "Which is the strict equality operator?", options: ["==", "=", "===", "!="], correct: 2 },
  { question: "What is the purpose of a for loop?", options: ["To declare variables", "To repeat code a set number of times", "To handle events", "To style elements"], correct: 1 },
  { question: "How do you select an element by ID in the DOM?", options: ["querySelector", "getElementById", "createElement", "appendChild"], correct: 1 }
];

let currentQuestion = 0;
let score = 0;
let selectedAnswer = -1;
let timerInterval;
let timeLeft = 30;
let highScore = localStorage.getItem('jsQuizHighScore') || 0;

function updateProgress() {
  const progress = ((currentQuestion + 1) / quizData.length) * 100;
  document.getElementById('progress-fill').style.width = progress + '%';
  document.getElementById('current-q').textContent = currentQuestion + 1;
  document.getElementById('total-q').textContent = quizData.length;
}

function startTimer() {
  timeLeft = 30;
  document.getElementById('timer-container').style.display = 'block';
  document.getElementById('timer-text').textContent = timeLeft;
  document.getElementById('timer-fill').style.width = '100%';
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('timer-text').textContent = timeLeft;
    document.getElementById('timer-fill').style.width = (timeLeft / 30 * 100) + '%';
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      nextQuestion();
    }
  }, 1000);
}

function clearTimer() {
  if (timerInterval) clearInterval(timerInterval);
}

function loadQuestion() {
  const q = quizData[currentQuestion];
  document.getElementById('question').textContent = q.question;
  const optionsDiv = document.getElementById('options');
  optionsDiv.innerHTML = '';
  q.options.forEach((option, index) => {
    const btn = document.createElement('button');
    btn.textContent = option;
    btn.classList.add('option');
    btn.onclick = () => selectOption(index);
    optionsDiv.appendChild(btn);
  });
  document.getElementById('next-btn').style.display = 'none';
  updateProgress();
  startTimer();
}

function selectOption(index) {
  if (selectedAnswer !== -1) return;
  selectedAnswer = index;
  clearTimer();
  const options = document.querySelectorAll('.option');
  options.forEach((opt, i) => {
    opt.disabled = true;
    if (i === quizData[currentQuestion].correct) opt.classList.add('correct');
    else if (i === index) opt.classList.add('incorrect');
  });
  document.getElementById('next-btn').style.display = 'block';
}

function nextQuestion() {
  if (selectedAnswer === quizData[currentQuestion].correct) score++;
  currentQuestion++;
  selectedAnswer = -1;
  if (currentQuestion < quizData.length) loadQuestion();
  else showScore();
}

function showScore() {
  clearTimer();
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('score-container').style.display = 'block';
  const percentage = Math.round((score / quizData.length) * 100);
  document.getElementById('score-circle-text').textContent = score;
  document.getElementById('total-score').textContent = quizData.length;
  let feedback = "";
  if (percentage >= 80) feedback = "🌟 Maayohas amaw ah! JS godz!";
  else if (percentage >= 60) feedback = "👍 Nayska! Padayun!";
  else feedback = "💡Looks like you have to study more. You did well! Try again.";
  document.getElementById('feedback').textContent = feedback;
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('jsQuizHighScore', highScore);
  }
  document.getElementById('high-score').style.display = 'block';
  document.getElementById('high-score-val').textContent = highScore;
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  selectedAnswer = -1;
  document.getElementById('question-container').style.display = 'block';
  document.getElementById('score-container').style.display = 'none';
  document.getElementById('high-score').style.display = 'none';
  loadQuestion();
}

document.addEventListener('DOMContentLoaded', loadQuestion);
