// Danh sách câu hỏi sắp xếp theo đúng thứ tự yêu cầu
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

// Lấy các phần tử DOM
const container = document.getElementById("answerBoxes");
const hiddenInput = document.getElementById("hiddenInput");
const checkBtn = document.getElementById("checkBtn");
const nextBtn = document.getElementById("nextBtn");
const resultDisplay = document.getElementById("result");
const gameImage = document.getElementById("gameImage");
const questionTitle = document.getElementById("questionTitle");

// Hàm xóa dấu tiếng Việt phục vụ so sánh đáp án
function removeVietnameseTones(str) {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
}

// Hàm tải câu hỏi dựa trên chỉ số currentIndex
function loadQuestion() {
    const currentQuestion = questionList[currentIndex];

    // ĐỔI TẠI ĐÂY: Hiển thị ngắn gọn dạng "Câu X" thay vì "Câu hỏi số X/Y"
    questionTitle.textContent = `Câu ${currentIndex + 1}`;
    gameImage.src = currentQuestion.image;

    // Tính toán độ dài chuỗi không tính khoảng trắng
    cleanAnswer = currentQuestion.answer.replace(/\s/g, "");
    maxChars = cleanAnswer.length;

    // Reset giao diện và ô nhập dữ liệu
    hiddenInput.value = "";
    hiddenInput.maxLength = maxChars;
    resultDisplay.innerHTML = "";
    resultDisplay.className = "";

    // Ẩn nút "Câu tiếp theo", hiện nút "Kiểm tra"
    nextBtn.style.display = "none";
    checkBtn.style.display = "inline-block";

    // Tạo các ô chữ mới
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

// Đồng bộ dữ liệu gõ lên ô hiển thị
hiddenInput.addEventListener("input", () => {
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

// Hiệu ứng viền sáng ô hiện tại
function updateFocusStyle() {
    const currentLen = hiddenInput.value.length;
    letterBoxElements.forEach((box, index) => {
        if (index === currentLen && document.activeElement === hiddenInput) {
            box.classList.add("active");
        } else {
            box.classList.remove("active");
        }
    });
}

// Nhấn vào vùng ô chữ thì focus vào input ẩn
container.addEventListener("click", () => {
    if (nextBtn.style.display === "none") {
        hiddenInput.focus();
        updateFocusStyle();
    }
});

hiddenInput.addEventListener("focus", updateFocusStyle);
hiddenInput.addEventListener("blur", () => {
    letterBoxElements.forEach(box => box.classList.remove("active"));
});

// Xử lý kiểm tra đáp án
function checkAnswer() {
    const currentQuestion = questionList[currentIndex];
    const userValue = hiddenInput.value.trim().toLowerCase();

    const correctValueWithTone = cleanAnswer.toLowerCase();
    const correctValueNoTone = removeVietnameseTones(cleanAnswer).toLowerCase();

    resultDisplay.classList.remove("success", "error");

    if (userValue === correctValueWithTone || userValue === correctValueNoTone) {

        // Đổ chữ có dấu chuẩn lên giao diện
        let boxIndex = 0;
        for (let char of currentQuestion.answer) {
            if (char !== " ") {
                letterBoxElements[boxIndex].textContent = char;
                letterBoxElements[boxIndex].classList.add("filled");
                boxIndex++;
            }
        }

        // Tắt nhấp nháy active
        letterBoxElements.forEach(box => box.classList.remove("active"));
        hiddenInput.blur();

        // ĐỔI TẠI ĐÂY: Nếu là câu cuối cùng thì không hiện nút "Câu tiếp theo" nữa, giữ nguyên mọi thứ và thông báo phá đảo
        if (currentIndex === questionList.length - 1) {
            checkBtn.style.display = "none";
            nextBtn.style.display = "none";

            questionTitle.textContent = "HẾT";
            resultDisplay.innerHTML = "🎉 Chính xác! Chúc mừng bạn!";
            resultDisplay.classList.add("success");
        } else {
            // Nếu chưa phải câu cuối, đổi nút "Kiểm tra" thành "Câu tiếp theo" như cũ
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

// Xử lý khi nhấn nút "Câu Tiếp Theo"
function nextQuestion() {
    currentIndex++;
    if (currentIndex < questionList.length) {
        loadQuestion();
    }
}

// Đăng ký sự kiện nút bấm
checkBtn.addEventListener("click", checkAnswer);
nextBtn.addEventListener("click", nextQuestion);

// Phím tắt Enter
hiddenInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        if (nextBtn.style.display === "inline-block") {
            nextQuestion();
        } else {
            checkAnswer();
        }
    }
});

// Chạy câu hỏi đầu tiên khi tải trang
loadQuestion();