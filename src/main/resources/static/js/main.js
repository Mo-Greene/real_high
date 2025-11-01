const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const nextButton = document.getElementById('nextButton');
const mainImage = document.getElementById('mainImage');
const buttonText = nextButton.querySelector('p');

// 1. 초기 "다음으로" 버튼 클릭
nextButton.addEventListener('click', () => {
    if (buttonText.textContent === '다음으로') {
        // UI 업데이트: 2단계로 이동
        step1.classList.add('opacity-20');
        step2.classList.remove('opacity-20');
        mainImage.style.opacity = '0';
        setTimeout(() => {
            mainImage.style.backgroundImage = 'url(/image/image_2.png)';
            mainImage.style.opacity = '1';
        }, 300);
        buttonText.textContent = '사진 불러오기';
    } else if (buttonText.textContent === '사진 불러오기') {
        // '사진 불러오기' 버튼 클릭 시 /image 페이지로 이동
        window.location.href = '/image';
    }
});
