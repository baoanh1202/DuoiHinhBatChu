const answer = "Hà Nội"; // Đáp án gốc có dấu đầy đủ

// Tính toán độ dài chuẩn (loại bỏ dấu cách) để giới hạn số ký tự nhập vào input ẩn
const cleanAnswer = answer.replace(/\s/g, "");
const maxChars = cleanAnswer.length;

const container = document.getElementById("answerBoxes");
const hiddenInput = document.getElementById("hiddenInput");
const checkBtn = document.getElementById("checkBtn");
const resultDisplay = document.getElementById("result");

let letterBoxElements = []; // Lưu danh sách các ô div hiển thị để map ký tự

// Hàm loại bỏ dấu tiếng Việt để so sánh chính xác nếu người dùng gõ không dấu
function removeVietnameseTones(str) {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
}

// 1. Tạo giao diện các ô chữ
createBoxes();

function createBoxes() {
    container.innerHTML = "";
    letterBoxElements = [];

    for (let char of answer) {
        if (char === " ") {
            const space = document.createElement("div");
            space.className = "space";
            container.appendChild(space);
        } else {
            const box = document.createElement("div");
            box.className = "letter-box";
            container.appendChild(box);
            letterBoxElements.push(box); // Đẩy vào mảng quản lý
        }
    }

    // Giới hạn độ dài input ẩn bằng số ký tự thực tế cần điền
    hiddenInput.maxLength = maxChars;
    updateFocusStyle();
}

// 2. Đồng bộ từ Input ẩn lên các ô hiển thị
hiddenInput.addEventListener("input", () => {
    let value = hiddenInput.value;

    // Phân phối từng ký tự vào các ô tương ứng
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

// 3. Cập nhật hiệu ứng viền sáng (Active) cho ô hiện tại đang gõ
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

// 4. Khi bấm vào vùng ô chữ -> Focus vào input ẩn để kích hoạt bàn phím
container.addEventListener("click", () => {
    hiddenInput.focus();
    updateFocusStyle();
});

hiddenInput.addEventListener("focus", updateFocusStyle);
hiddenInput.addEventListener("blur", () => {
    // Xóa trạng thái active khi người dùng click ra ngoài hẳn
    letterBoxElements.forEach(box => box.classList.remove("active"));
});

// 5. Kiểm tra đáp án và hiển thị chữ có dấu chuẩn khi đúng
function checkAnswer() {
    const userValue = hiddenInput.value.trim().toLowerCase();

    // Tạo 2 phương án chuẩn để so sánh: một bản giữ nguyên dấu, một bản xóa dấu
    const correctValueWithTone = cleanAnswer.toLowerCase();
    const correctValueNoTone = removeVietnameseTones(cleanAnswer).toLowerCase();

    resultDisplay.classList.remove("success", "error");

    // Người dùng gõ có dấu hay không dấu đều chấp nhận
    if (userValue === correctValueWithTone || userValue === correctValueNoTone) {

        resultDisplay.innerHTML = "🎉 Chính xác! Chúc mừng bạn!";
        resultDisplay.classList.add("success");

        // --- ĐOẠN THÊM VÀO: Hiển thị lại đáp án đầy đủ dấu lên các ô chữ ---
        let boxIndex = 0;
        for (let char of answer) {
            if (char !== " ") {
                letterBoxElements[boxIndex].textContent = char;
                letterBoxElements[boxIndex].classList.add("filled");
                boxIndex++;
            }
        }

        // Ẩn ô nhấp nháy active đi sau khi đã thắng
        letterBoxElements.forEach(box => box.classList.remove("active"));
        hiddenInput.blur();
        // ------------------------------------------------------------------

    } else {
        resultDisplay.innerHTML = "❌ Sai rồi! Thử lại nhé!";
        resultDisplay.classList.add("error");
    }
}

// Sự kiện click nút kiểm tra
checkBtn.addEventListener("click", checkAnswer);

// Nhấn Enter cũng kiểm tra được đáp án
hiddenInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        checkAnswer();
    }
});

// Tự động focus lần đầu khi tải trang
hiddenInput.focus();