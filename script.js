const questionList = [
    { answer: "Hà Nội", image: "src/hanoi.png" },
    { answer: "Cao Bằng", image: "src/caobang.png" },
    { answer: "Nghệ An", image: "src/nghean.png" },
    { answer: "Đồng Tháp", image: "src/dongthap.png" },
    { answer: "Hải Phòng", image: "src/haiphong.png" },
    { answer: "Đồng Nai", image: "src/dongnai.png" }
];

let currentIndex = 0;
let letterBoxElements = [];
let cleanAnswer = "";
let maxChars = 0;
let isGameStarted = false;

const gameContainer = document.querySelector(".game");
const container = document.getElementById("answerBoxes");
const hiddenInput = document.getElementById("hiddenInput");
const startBtn = document.getElementById("startBtn");
const checkBtn = document.getElementById("checkBtn");
const nextBtn = document.getElementById("nextBtn");
const resultDisplay = document.getElementById("result");
const gameImage = document.getElementById("gameImage");
const questionTitle = document.getElementById("questionTitle");

function removeVietnameseTones(str) {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
}

function initStartScreen() {
    isGameStarted = false;
    document.body.classList.add("is-start");
    gameContainer.classList.add("is-start");
    gameImage.src = "src/batdau.png";
    container.innerHTML = "";
    startBtn.style.display = "inline-block";
    checkBtn.style.display = "none";
    nextBtn.style.display = "none";
    resultDisplay.innerHTML = "";
}

function loadQuestion() {
    const currentQuestion = questionList[currentIndex];

    questionTitle.textContent = `Câu ${currentIndex + 1}`;
    gameImage.src = currentQuestion.image;

    cleanAnswer = currentQuestion.answer.replace(/\s/g, "");
    maxChars = cleanAnswer.length;

    hiddenInput.value = "";
    hiddenInput.maxLength = maxChars;
    resultDisplay.innerHTML = "";
    resultDisplay.className = "";

    nextBtn.style.display = "none";
    checkBtn.style.display = "inline-block";

    container.innerHTML = "";
    letterBoxElements = [];

    for (let char of currentQuestion.answer) {
        if (char === " ") {
            const space = document.createElement("div");
            space.className = "space";
            container.appendChild(space);
        } else {
            const box = document.createElement("div");
            box.className = "letter-box";
            container.appendChild(box);
            letterBoxElements.push(box);
        }
    }

    hiddenInput.focus();
    updateFocusStyle();
}

hiddenInput.addEventListener("input", () => {
    if (!isGameStarted) return;
    let value = hiddenInput.value;
    letterBoxElements.forEach((box, index) => {
        if (value[index]) {
            box.textContent = value[index];
            box.classList.add("filled");
        } else {
            box.textContent = "";
            box.classList.remove("filled");
        }
    });
    updateFocusStyle();
});

function updateFocusStyle() {
    if (!isGameStarted) return;
    const currentLen = hiddenInput.value.length;
    letterBoxElements.forEach((box, index) => {
        if (index === currentLen && document.activeElement === hiddenInput) {
            box.classList.add("active");
        } else {
            box.classList.remove("active");
        }
    });
}

container.addEventListener("click", () => {
    if (isGameStarted && nextBtn.style.display === "none") {
        hiddenInput.focus();
        updateFocusStyle();
    }
});

hiddenInput.addEventListener("focus", updateFocusStyle);
hiddenInput.addEventListener("blur", () => {
    letterBoxElements.forEach(box => box.classList.remove("active"));
});

function checkAnswer() {
    const currentQuestion = questionList[currentIndex];
    const userValue = hiddenInput.value.trim().toLowerCase();

    const correctValueWithTone = cleanAnswer.toLowerCase();
    const correctValueNoTone = removeVietnameseTones(cleanAnswer).toLowerCase();

    resultDisplay.classList.remove("success", "error");

    if (userValue === correctValueWithTone || userValue === correctValueNoTone) {
        let boxIndex = 0;
        for (let char of currentQuestion.answer) {
            if (char !== " ") {
                letterBoxElements[boxIndex].textContent = char;
                letterBoxElements[boxIndex].classList.add("filled");
                boxIndex++;
            }
        }

        letterBoxElements.forEach(box => box.classList.remove("active"));
        hiddenInput.blur();

        if (currentIndex === questionList.length - 1) {
            checkBtn.style.display = "none";
            nextBtn.style.display = "none";
            questionTitle.textContent = "CHIẾN THẮNG!";
            resultDisplay.innerHTML = "🏆 Xuất sắc! Bạn đã phá đảo trò chơi!";
            resultDisplay.classList.add("success");
        } else {
            checkBtn.style.display = "none";
            nextBtn.style.display = "inline-block";
            resultDisplay.innerHTML = "🎉 Chính xác! Chúc mừng bạn!";
            resultDisplay.classList.add("success");
        }
    } else {
        resultDisplay.innerHTML = "❌ Sai rồi! Thử lại nhé!";
        resultDisplay.classList.add("error");
    }
}

function nextQuestion() {
    currentIndex++;
    if (currentIndex < questionList.length) {
        loadQuestion();
    }
}

startBtn.addEventListener("click", () => {
    isGameStarted = true;
    document.body.classList.remove("is-start");
    gameContainer.classList.remove("is-start");
    startBtn.style.display = "none";
    currentIndex = 0;
    loadQuestion();
});

checkBtn.addEventListener("click", checkAnswer);
nextBtn.addEventListener("click", nextQuestion);

hiddenInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        if (nextBtn.style.display === "inline-block") {
            nextQuestion();
        } else {
            checkAnswer();
        }
    }
});

initStartScreen();