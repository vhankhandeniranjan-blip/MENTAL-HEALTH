
// ==========================================
// 1. MOBILE NAVIGATION
// ==========================================

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.textContent = "☰";
        });
    });
}


// ==========================================
// 2. EXPANDABLE CHALLENGE CARDS
// ==========================================

const expandButtons = document.querySelectorAll(".expand-button");

expandButtons.forEach(button => {
    button.addEventListener("click", () => {
        const content = button.nextElementSibling;
        const isExpanded = button.getAttribute("aria-expanded") === "true";

        content.hidden = isExpanded;
        button.setAttribute("aria-expanded", String(!isExpanded));

        button.textContent = isExpanded ? "Learn more +" : "Show less −";
    });
});


// ==========================================
// 3. MOOD CHECK-IN
// ==========================================

const moodOptions = document.querySelectorAll(".mood-option");
const moodMessage = document.getElementById("mood-message");

const moodMessages = {
    Happy: "That's lovely! Enjoy the positive moments and share your happiness with others. 😊",

    Okay: "It's perfectly fine to have an ordinary day. Take things one step at a time. 🌿",

    Worried: "It's okay to feel worried. Try taking a gentle breath and consider talking to someone you trust. 💚",

    Sad: "Your feelings matter. Be kind to yourself and remember that you don't have to face difficult moments alone. 💙",

    Tired: "You deserve some rest. Take a break, drink some water and give yourself time to recharge. 🌱"
};

moodOptions.forEach(option => {
    option.addEventListener("click", () => {
        const mood = option.dataset.mood;

        moodOptions.forEach(item => {
            item.classList.remove("selected");
            item.setAttribute("aria-pressed", "false");
        });

        option.classList.add("selected");
        option.setAttribute("aria-pressed", "true");

        moodMessage.textContent = moodMessages[mood];
    });

    option.setAttribute("aria-pressed", "false");
});


// ==========================================
// 4. BREATHING EXERCISE
// ==========================================

const breathingCircle = document.getElementById("breathing-circle");
const breathingText = document.getElementById("breathing-text");
const breathingInstruction = document.getElementById("breathing-instruction");

const startBreathing = document.getElementById("start-breathing");
const stopBreathing = document.getElementById("stop-breathing");

let breathingInterval = null;
let breathingTimeout = null;
let breathingRunning = false;

function stopBreathingExercise() {
    breathingRunning = false;

    clearInterval(breathingInterval);
    clearTimeout(breathingTimeout);

    breathingInterval = null;
    breathingTimeout = null;

    if (breathingCircle) {
        breathingCircle.classList.remove("inhale", "exhale");
    }

    if (breathingText) {
        breathingText.textContent = "Ready?";
    }

    if (breathingInstruction) {
        breathingInstruction.textContent =
            "Get comfortable and begin when you are ready.";
    }

    if (startBreathing) {
        startBreathing.disabled = false;
    }

    if (stopBreathing) {
        stopBreathing.disabled = true;
    }
}

function runBreathingCycle() {
    if (!breathingRunning) return;

    breathingCircle.classList.remove("exhale");
    breathingCircle.classList.add("inhale");

    breathingText.textContent = "Breathe in";
    breathingInstruction.textContent =
        "Gently breathe in for 4 seconds.";

    breathingTimeout = setTimeout(() => {
        if (!breathingRunning) return;

        breathingCircle.classList.remove("inhale");
        breathingText.textContent = "Breathe out";
        breathingInstruction.textContent =
            "Slowly breathe out for 6 seconds.";

        breathingTimeout = setTimeout(() => {
            if (!breathingRunning) return;

            breathingCircle.classList.add("exhale");

            breathingTimeout = setTimeout(() => {
                runBreathingCycle();
            }, 6000);

        }, 0);

    }, 4000);
}

if (
    breathingCircle &&
    breathingText &&
    breathingInstruction &&
    startBreathing &&
    stopBreathing
) {
    startBreathing.addEventListener("click", () => {
        if (breathingRunning) return;

        breathingRunning = true;

        startBreathing.disabled = true;
        stopBreathing.disabled = false;

        runBreathingCycle();
    });

    stopBreathing.addEventListener("click", stopBreathingExercise);
}


// ==========================================
// 5. POSITIVE REMINDERS
// ==========================================

const reminderElement = document.getElementById("positive-reminder");
const nextReminderButton = document.getElementById("next-reminder");

const reminders = [
    "You do not have to be perfect to be amazing.",

    "Your feelings are valid and deserve to be heard.",

    "Small progress is still progress.",

    "It is okay to ask for help when you need it.",

    "You are more than your marks and achievements.",

    "Take a break. You deserve time to rest.",

    "Be kind to yourself, just as you are kind to others.",

    "Every new day is another opportunity to grow."
];

let reminderIndex = 0;

if (reminderElement && nextReminderButton) {
    nextReminderButton.addEventListener("click", () => {
        reminderIndex = (reminderIndex + 1) % reminders.length;

        reminderElement.textContent = reminders[reminderIndex];
    });
}


// ==========================================
// 6. MENTAL HEALTH AWARENESS QUIZ
// ==========================================

const quizQuestions = [
    { question: "What does mental health describe?", options: ["Only physical fitness", "How we think, feel and behave", "Only academic performance", "Only sleeping habits"], answer: 1, explanation: "Mental health includes our thoughts, feelings and behaviour." },
    { question: "Which is a helpful first response when a friend shares a concern?", options: ["Listen without judging", "Make jokes about it", "Share it with classmates", "Tell them to ignore it"], answer: 0, explanation: "Listening respectfully can help a friend feel heard. Encourage support from a trusted adult when needed." },
    { question: "What is one healthy way to approach a large school task?", options: ["Avoid it completely", "Try to finish everything without breaks", "Divide it into smaller steps", "Compare your progress with everyone"], answer: 2, explanation: "Smaller steps can make a demanding task feel more manageable." },
    { question: "Which statement about emotions is most accurate?", options: ["Only positive emotions are acceptable", "Everyone should feel the same way", "Difficult feelings mean someone has failed", "All feelings deserve to be noticed and understood"], answer: 3, explanation: "Feelings are part of being human; noticing them can help us decide what support we need." },
    { question: "What is a respectful response to bullying?", options: ["Join in so you fit in", "Support the person and tell a trusted adult", "Spread the story online", "Blame the person being bullied"], answer: 1, explanation: "Bullying should be taken seriously. A trusted adult can help address it safely." },
    { question: "Which habit can support everyday wellbeing?", options: ["Regular rest and enjoyable activity", "Skipping breaks every day", "Staying online all night", "Keeping every worry secret"], answer: 0, explanation: "Rest and enjoyable activities can support general wellbeing." },
    { question: "Why can comparing ourselves with social media posts be misleading?", options: ["Every post shows a full daily reality", "Online posts always show the whole context", "Posts may show selected moments, not the full picture", "Everyone has the same experiences"], answer: 2, explanation: "People often share selected moments, so a post rarely shows the whole context." },
    { question: "Who can a young person approach when a problem feels difficult to manage?", options: ["No one; they must solve it alone", "Only strangers online", "A trusted adult such as a parent, teacher or counsellor", "Anyone who promises to keep every secret"], answer: 2, explanation: "A trusted adult can help a young person find appropriate support." }
];

const quizQuestion = document.getElementById("quiz-question");
const quizOptions = document.getElementById("quiz-options");
const quizFeedback = document.getElementById("quiz-feedback");

const quizCounter = document.getElementById("quiz-counter");
const quizProgress = document.getElementById("quiz-progress");

const nextQuestionButton = document.getElementById("next-question");
const quizContent = document.getElementById("quiz-content");

const quizResult = document.getElementById("quiz-result");
const resultScore = document.getElementById("result-score");
const resultMessage = document.getElementById("result-message");

const restartQuizButton = document.getElementById("restart-quiz");

let currentQuestion = 0;
let score = 0;
let answerSelected = false;

function loadQuestion() {
    if (!quizQuestion || !quizOptions) return;

    const question = quizQuestions[currentQuestion];

    answerSelected = false;

    quizQuestion.textContent = question.question;

    quizOptions.innerHTML = "";

    question.options.forEach((option, index) => {
        const button = document.createElement("button");

        button.className = "quiz-option";
        button.textContent = option;

        button.addEventListener("click", () => {
            selectAnswer(index, button);
        });

        quizOptions.appendChild(button);
    });

    quizCounter.textContent =
        `Question ${currentQuestion + 1} of ${quizQuestions.length}`;

    quizProgress.style.width =
        `${((currentQuestion + 1) / quizQuestions.length) * 100}%`;

    quizFeedback.textContent = "";

    nextQuestionButton.disabled = true;

    nextQuestionButton.textContent =
        currentQuestion === quizQuestions.length - 1
            ? "See Results"
            : "Next Question";
}

function selectAnswer(selectedIndex, selectedButton) {
    if (answerSelected) return;

    answerSelected = true;

    const question = quizQuestions[currentQuestion];
    const optionButtons = quizOptions.querySelectorAll(".quiz-option");

    optionButtons.forEach(button => {
        button.disabled = true;
    });

    if (selectedIndex === question.answer) {
        score++;

        selectedButton.classList.add("correct");

        quizFeedback.textContent = question.explanation;
        quizFeedback.style.color = "#168B83";

    } else {
        selectedButton.classList.add("wrong");

        optionButtons[question.answer].classList.add("correct");

        quizFeedback.textContent =
            `Not quite. ${question.explanation}`;

        quizFeedback.style.color = "#C45B4A";
    }

    nextQuestionButton.disabled = false;
}

function showQuizResult() {
    quizContent.hidden = true;
    quizResult.hidden = false;

    resultScore.textContent =
        `${score} / ${quizQuestions.length}`;

    if (score === quizQuestions.length) {
        resultMessage.textContent =
            "Excellent! You have a strong understanding of mental health awareness.";

    } else if (score >= Math.ceil(quizQuestions.length / 2)) {
        resultMessage.textContent =
            "Good effort! Keep learning and spreading awareness.";

    } else {
        resultMessage.textContent =
            "Thank you for participating! Explore the website to learn more and try again.";
    }
}

if (
    quizQuestion &&
    quizOptions &&
    nextQuestionButton &&
    quizContent &&
    quizResult
) {
    loadQuestion();

    nextQuestionButton.addEventListener("click", () => {
        if (!answerSelected) return;

        if (currentQuestion < quizQuestions.length - 1) {
            currentQuestion++;
            loadQuestion();

        } else {
            showQuizResult();
        }
    });

    restartQuizButton.addEventListener("click", () => {
        currentQuestion = 0;
        score = 0;
        answerSelected = false;

        quizContent.hidden = false;
        quizResult.hidden = true;

        loadQuestion();
    });
}
