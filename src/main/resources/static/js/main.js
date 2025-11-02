const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const nextButton = document.getElementById('nextButton');
const mainImage = document.getElementById('mainImage');
const buttonText = nextButton.querySelector('p');

const roomFileInput = document.getElementById('roomFileInput');
const uploadForm = document.getElementById('uploadForm');

/**
 * 최초 버튼 클릭
 */
nextButton.addEventListener('click', () => {
    const currentText = buttonText.textContent;

    if (currentText === '다음으로') {
        step1.classList.add('opacity-20');
        step2.classList.remove('opacity-20');
        mainImage.style.opacity = '0';
        setTimeout(() => {
            mainImage.style.backgroundImage = 'url(/image/image_2.png)';
            mainImage.style.opacity = '1';
        }, 300);
        buttonText.textContent = '사진 불러오기';
    } else if (currentText === '사진 불러오기') {
        roomFileInput.click();
    }
});

roomFileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        buttonText.textContent = '업로드 중...';
        nextButton.disabled = true;
        uploadForm.submit();
    }
});