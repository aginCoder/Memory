// Cấu hình mật khẩu (4 số)
const CORRECT_PASSWORD = '0107'; // Bạn có thể thay đổi mật khẩu ở đây

// Lấy các phần tử DOM
const passwordPage = document.getElementById('passwordPage');
const contentPage = document.getElementById('contentPage');
const passwordInput = document.getElementById('passwordInput');
const submitBtn = document.getElementById('submitBtn');
const errorMessage = document.getElementById('errorMessage');
const backBtn = document.getElementById('backBtn');

// Bàn phím số
const keyButtons = document.querySelectorAll('.key-btn[data-key]');
const deleteBtn = document.getElementById('deleteBtn');
const clearBtn = document.getElementById('clearBtn');

// Các phần tử cho slider ảnh
const imageCards = document.querySelectorAll('.image-card');
const imageStack = document.querySelector('.image-stack');

// Variables cho swipe/drag
let currentImageIndex = 0;
let startX = 0;
let startY = 0;
let isDragging = false;

// ============ XỬ LÝ MẬT KHẨU ============
submitBtn.addEventListener('click', checkPassword);
passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkPassword();
    }
});

// ============ XỬ LÝ BÀN PHÍM SỐ ============
keyButtons.forEach(button => {
    button.addEventListener('click', () => {
        const key = button.getAttribute('data-key');
        if (passwordInput.value.length < 4) {
            passwordInput.value += key;
            errorMessage.textContent = '';
            // Phát âm thanh nhẹ (nếu muốn)
            playKeySound();
        }
    });
});

deleteBtn.addEventListener('click', () => {
    passwordInput.value = passwordInput.value.slice(0, -1);
    errorMessage.textContent = '';
});

clearBtn.addEventListener('click', () => {
    passwordInput.value = '';
    errorMessage.textContent = '';
});

function playKeySound() {
    // Tạo âm thanh nhẹ khi bấm phím (tuỳ chọn)
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

function checkPassword() {
    const inputValue = passwordInput.value;
    
    if (inputValue === CORRECT_PASSWORD) {
        errorMessage.textContent = '';
        // Chuyển sang trang nội dung
        passwordPage.classList.remove('active');
        contentPage.classList.add('active');
        updateImageDisplay();
    } else {
        errorMessage.textContent = '❌ Mật khẩu sai, thử lại nhé!';
        passwordInput.value = '';
        passwordInput.focus();
        // Animation shake
        passwordInput.classList.add('shake');
        setTimeout(() => {
            passwordInput.classList.remove('shake');
        }, 300);
    }
}

// ============ XỬ LÝ SLIDER ẢNH ============

// Cập nhật hiển thị ảnh
function updateImageDisplay() {
    imageCards.forEach((card, index) => {
        card.classList.remove('active');
        if (index === currentImageIndex) {
            card.classList.add('active');
        }
    });
}

// Vuốt sang ảnh tiếp theo
function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % imageCards.length;
    updateImageDisplay();
}

// Vuốt lại ảnh trước đó
function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + imageCards.length) % imageCards.length;
    updateImageDisplay();
}

// Touch events cho mobile
imageStack.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

imageStack.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - startX;
    const diffY = currentY - startY;
    
    // Kiểm tra xem là vuốt ngang hay dọc
    if (Math.abs(diffX) > Math.abs(diffY)) {
        e.preventDefault();
    }
});

imageStack.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    
    const endX = e.changedTouches[0].clientX;
    const diffX = endX - startX;
    
    // Nếu vuốt sang trái (diffX âm) -> ảnh tiếp theo
    if (diffX < -50) {
        nextImage();
    }
    // Nếu vuốt sang phải (diffX dương) -> ảnh trước
    else if (diffX > 50) {
        prevImage();
    }
});

// Mouse events cho desktop
imageStack.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const currentX = e.clientX;
    const currentY = e.clientY;
    const diffX = currentX - startX;
    const diffY = currentY - startY;
    
    // Kiểm tra xem là kéo ngang hay dọc
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 20) {
        document.body.style.cursor = 'grabbing';
    }
});

document.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    document.body.style.cursor = 'auto';
    
    const endX = e.clientX;
    const diffX = endX - startX;
    
    // Nếu kéo sang trái (diffX âm) -> ảnh tiếp theo
    if (diffX < -50) {
        nextImage();
    }
    // Nếu kéo sang phải (diffX dương) -> ảnh trước
    else if (diffX > 50) {
        prevImage();
    }
});

// Bấm chuột vào ảnh để xem tiếp
imageStack.addEventListener('click', (e) => {
    // Chỉ chuyển ảnh nếu không phải drag
    const diffX = e.clientX - startX;
    if (Math.abs(diffX) < 10) {
        nextImage();
    }
});

// ============ NÚT QUAY LẠI ============
backBtn.addEventListener('click', () => {
    contentPage.classList.remove('active');
    passwordPage.classList.add('active');
    passwordInput.value = '';
    passwordInput.focus();
    currentImageIndex = 0;
});

// Focus vào input khi tải trang
window.addEventListener('load', () => {
    passwordInput.focus();
});

// Chặn copy-paste mật khẩu
passwordInput.addEventListener('paste', (e) => {
    // Nếu muốn cho phép paste, xóa dòng này
    e.preventDefault();
});
