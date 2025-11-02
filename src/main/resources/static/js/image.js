// 1. HTML 요소 가져오기
const imageContainer = document.getElementById('imageContainer');
const roomImage = document.getElementById('roomImage');
const furnitureWrapper = document.getElementById('furnitureWrapper');
const furniturePreview = document.getElementById('furniturePreview');
const furnitureFileInput = document.getElementById('furnitureFileInput');
const actionButton = document.getElementById('actionButton');
const buttonText = document.getElementById('buttonText');
const loadingSpinner = document.getElementById('loadingSpinner');

let furnitureFile = null;

// 2. 버튼 클릭 이벤트
actionButton.addEventListener('click', () => {
    const currentText = buttonText.textContent.trim();

    if (currentText === '가구 사진 불러오기') {
        furnitureFileInput.click();
    } else if (currentText === '가구 배치 완료') {
        generateAndSendImage();
    }
});

// 3. 가구 파일 선택 이벤트
furnitureFileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;
    furnitureFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
        furniturePreview.src = e.target.result;
        furnitureWrapper.classList.remove('hidden');

        furniturePreview.onload = () => {
            const roomRect = roomImage.getBoundingClientRect();
            const initialWidth = roomRect.width * 0.4;
            furnitureWrapper.style.width = `${initialWidth}px`;
            furnitureWrapper.style.height = `auto`;

            furnitureWrapper.style.left = `${(roomRect.width - initialWidth) / 2}px`;
            furnitureWrapper.style.top = `${(roomRect.height - furnitureWrapper.offsetHeight) / 2}px`;

            makeInteractive(furnitureWrapper, imageContainer);
        };
    };
    reader.readAsDataURL(file);

    buttonText.textContent = '가구 배치 완료';
    actionButton.classList.remove('bg-[#17181a]');
    actionButton.classList.add('bg-[#007bff]');
});

// 4. [수정] 드래그 및 리사이즈 기능 (모바일 터치 이벤트 지원)
function makeInteractive(element, container) {
    let isDragging = false, isResizing = false;
    let startX, startY, startWidth, startHeight, startLeft, startTop;
    let activeHandle = null;

    // --- 이벤트 핸들러 함수 정의 ---

    // (공통) 이벤트 좌표 반환 (마우스/터치 호환)
    function getEventCoords(e) {
        return e.touches ? e.touches[0] : e;
    }

    // (1) 드래그/리사이즈 시작 (mousedown, touchstart)
    function dragStart(e) {
        const handle = e.target.closest('.resize-handle');
        const coords = getEventCoords(e);

        if (handle) {
            // 리사이즈 시작
            isResizing = true;
            isDragging = false;
            activeHandle = handle;
        } else {
            // 드래그 시작
            isDragging = true;
            isResizing = false;
        }

        e.preventDefault();

        startX = coords.clientX;
        startY = coords.clientY;
        startWidth = element.offsetWidth;
        startHeight = element.offsetHeight;
        startLeft = element.offsetLeft;
        startTop = element.offsetTop;
    }

    // (2) 드래그/리사이즈 중 (mousemove, touchmove)
    function dragMove(e) {
        // 시작되지 않았다면 무시
        if (!isDragging && !isResizing) return;

        // 모바일에서 스크롤 방지
        e.preventDefault();

        const coords = getEventCoords(e);
        const { clientX, clientY } = coords;

        const deltaX = clientX - startX;
        const deltaY = clientY - startY;

        if (isDragging) {
            let newLeft = startLeft + deltaX;
            let newTop = startTop + deltaY;

            // 컨테이너 경계 체크
            newLeft = Math.max(0, Math.min(newLeft, container.clientWidth - startWidth));
            newTop = Math.max(0, Math.min(newTop, container.clientHeight - startHeight));

            element.style.left = `${newLeft}px`;
            element.style.top = `${newTop}px`;

        } else if (isResizing && activeHandle) {
            let newWidth = startWidth, newHeight = startHeight, newLeft = startLeft, newTop = startTop;
            const aspectRatio = furniturePreview.naturalWidth / furniturePreview.naturalHeight;

            if (activeHandle.classList.contains('bottom-right')) {
                newWidth = startWidth + deltaX;
                newHeight = startHeight + deltaY;
            } else if (activeHandle.classList.contains('bottom-left')) {
                newWidth = startWidth - deltaX;
                newHeight = startHeight + deltaY;
                newLeft = startLeft + deltaX;
            } else if (activeHandle.classList.contains('top-right')) {
                newWidth = startWidth + deltaX;
                newHeight = startHeight - deltaY;
                newTop = startTop + deltaY;
            } else if (activeHandle.classList.contains('top-left')) {
                newWidth = startWidth - deltaX;
                newHeight = startHeight - deltaY;
                newLeft = startLeft + deltaX;
                newTop = startTop + deltaY;
            }

            // 최소 크기 제한
            newWidth = Math.max(20, newWidth);
            newHeight = Math.max(20, newHeight);

            // 종횡비 유지 (기존 로직과 동일)
            if (newWidth / aspectRatio > newHeight) {
                newWidth = newHeight * aspectRatio;
            } else {
                newHeight = newWidth / aspectRatio;
            }

            // 경계 체크 (기존 로직과 동일)
            if (newLeft < 0) newLeft = 0;
            if (newTop < 0) newTop = 0;
            if (newLeft + newWidth > container.clientWidth) newWidth = container.clientWidth - newLeft;
            if (newTop + newHeight > container.clientHeight) newHeight = container.clientHeight - newTop;

            element.style.width = `${newWidth}px`;
            element.style.height = `${newHeight}px`;
            element.style.left = `${newLeft}px`;
            element.style.top = `${newTop}px`;
        }
    }

    // (3) 드래그/리사이즈 종료 (mouseup, touchend, mouseleave, touchcancel)
    function dragEnd() {
        isDragging = false;
        isResizing = false;
        activeHandle = null;
    }

    // (A) 가구 요소(element)에 대한 이벤트
    // 마우스 시작
    element.addEventListener('mousedown', dragStart);
    // 터치 시작 (passive: false로 스크롤 방지)
    element.addEventListener('touchstart', dragStart, { passive: false });

    // (B) 전체 컨테이너(container)에 대한 이벤트
    // 마우스 이동
    container.addEventListener('mousemove', dragMove);
    // 터치 이동 (passive: false로 스크롤 방지)
    container.addEventListener('touchmove', dragMove, { passive: false });

    // 마우스 종료
    container.addEventListener('mouseup', dragEnd);
    container.addEventListener('mouseleave', dragEnd);
    // 터치 종료
    container.addEventListener('touchend', dragEnd);
    container.addEventListener('touchcancel', dragEnd);
}


// 5. 이미지 로드 헬퍼
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

// 6. [신규] 디버깅용 다운로드 헬퍼 함수
function triggerDownload(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 7. [수정] 이미지 합성, (디버깅 다운로드), 2개 파일 전송, 결과 표시
async function generateAndSendImage() {
    loadingSpinner.classList.remove('hidden');
    actionButton.disabled = true;
    buttonText.textContent = '생성 중...';

    try {
        // --- 1. 'modifiedImage' (합성본) 생성 ---
        const bgImg = await loadImage(roomImage.src);
        const fgImg = await loadImage(furniturePreview.src);

        const canvas = document.createElement('canvas');
        canvas.width = bgImg.naturalWidth;
        canvas.height = bgImg.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(bgImg, 0, 0);

        const roomRect = roomImage.getBoundingClientRect();
        const furnWrapperRect = furnitureWrapper.getBoundingClientRect();
        const widthRatio = bgImg.naturalWidth / roomRect.width;
        const heightRatio = bgImg.naturalHeight / roomRect.height;
        const relativeX = furnWrapperRect.left - roomRect.left;
        const relativeY = furnWrapperRect.top - roomRect.top;
        const drawX = relativeX * widthRatio;
        const drawY = relativeY * heightRatio;
        const drawWidth = furnWrapperRect.width * widthRatio;
        const drawHeight = furnWrapperRect.height * heightRatio;
        ctx.drawImage(fgImg, drawX, drawY, drawWidth, drawHeight);

        const modifiedBlob = await (await fetch(canvas.toDataURL('image/png'))).blob();

        // --- 2. 'baseImage' (원본) 생성 ---
        const baseImageBlob = await (await fetch(roomImage.src)).blob();

        // --- 3. FormData에 두 파일 담기 ---
        const formData = new FormData();
        formData.append('baseImage', baseImageBlob, 'base_image.png');
        formData.append('modifiedImage', modifiedBlob, 'modified_image.png');

        // --- 4. 서버로 전송 ---
        const response = await fetch('/generate/gemini', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`AI 이미지 생성 실패: ${response.statusText}`);
        }

        // --- [요청 2: AI 결과 이미지를 화면에 표시] ---
        const resultBlob = await response.blob();

        triggerDownload(resultBlob, 'generated_image.png');

    } catch (error) {
        console.error('Error:', error);
        alert(error.message || '이미지 생성 중 오류가 발생했습니다.');
    } finally {
        loadingSpinner.classList.add('hidden');
        actionButton.disabled = false;

        buttonText.textContent = '가구 사진 불러오기';
        actionButton.classList.remove('bg-[#007bff]');
        actionButton.classList.add('bg-[#17181a]');
    }
}