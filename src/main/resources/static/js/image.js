// 1. HTML 요소 가져오기
const imageContainer = document.getElementById('imageContainer');
const roomImage = document.getElementById('roomImage');
const furnitureWrapper = document.getElementById('furnitureWrapper');
const furniturePreview = document.getElementById('furniturePreview');
const furnitureFileInput = document.getElementById('furnitureFileInput');
const actionButton = document.getElementById('actionButton');
const buttonText = document.getElementById('buttonText');
const mainContent = document.getElementById('mainContent');
const adLoadingPage = document.getElementById('adLoadingPage');
const footerSingleButton = document.getElementById('footer-single-button');
const footerMultiButton = document.getElementById('footer-multi-button');
const downloadButton = document.getElementById('downloadButton');
const addFurnitureButton = document.getElementById('addFurnitureButton');
const resetButton = document.getElementById('resetButton');

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

        // [수정] <img> 태그의 로드가 완료된 후 위치를 계산합니다.
        furniturePreview.onload = () => {
            const roomWidth = roomImage.offsetWidth;
            const roomHeight = roomImage.offsetHeight;

            // 2. 가구의 원본 종횡비를 가져옵니다.
            const furnAspectRatio = furniturePreview.naturalWidth / furniturePreview.naturalHeight;
            if (!furnAspectRatio || isNaN(furnAspectRatio)) {
                console.error("가구 이미지의 종횡비를 읽을 수 없습니다.");
                return;
            }

            // 3. 너비를 기준으로 초기 높이를 계산합니다. (height: auto 대신)
            const initialWidth = roomWidth * 0.4;
            const initialHeight = initialWidth / furnAspectRatio; // [수정]

            // 4. 명시적인 width와 height를 설정합니다.
            furnitureWrapper.style.width = `${initialWidth}px`;
            furnitureWrapper.style.height = `${initialHeight}px`; // [수정]

            // 5. offsetHeight 대신 계산된 initialHeight를 사용해 top을 설정합니다.
            furnitureWrapper.style.left = `${(roomWidth - initialWidth) / 2}px`;
            furnitureWrapper.style.top = `${(roomHeight - initialHeight) / 2}px`; // [수정]

            // 6. 상호작용 시작
            makeInteractive(furnitureWrapper, imageContainer);
        };
    };
    reader.readAsDataURL(file);

    buttonText.textContent = '가구 배치 완료';
    actionButton.classList.remove('bg-[#17181a]');
    actionButton.classList.add('bg-[#007bff]');

    footerMultiButton.classList.add('hidden');
    footerSingleButton.classList.remove('hidden');
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

// 7. [수정 v5] 이미지 합성, 전송, 그리고 결과 이미지를 화면에 업데이트
async function generateAndSendImage() {

    // [유지] 1. UI를 숨기기 전에, 현재 화면의 모든 크기와 위치 값을 먼저 읽어옵니다.
    const furnLeft = furnitureWrapper.offsetLeft;
    const furnTop = furnitureWrapper.offsetTop;
    const furnWidth = furnitureWrapper.offsetWidth;
    const furnHeight = furnitureWrapper.offsetHeight;

    const roomLeft = roomImage.offsetLeft;
    const roomTop = roomImage.offsetTop;
    const roomWidth = roomImage.offsetWidth;
    const roomHeight = roomImage.offsetHeight;

    // [유지] 2. 이제 값을 다 읽었으니 UI를 숨기고 로딩 페이지를 표시합니다.
    if (mainContent) mainContent.classList.add('hidden');
    adLoadingPage.classList.remove('hidden');

    try {
        // --- 1. 'modifiedImage' (합성본) 생성 ---
        const bgImg = await loadImage(roomImage.src);
        const fgImg = await loadImage(furniturePreview.src);

        const canvas = document.createElement('canvas');
        canvas.width = bgImg.naturalWidth;
        canvas.height = bgImg.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(bgImg, 0, 0);

        // --- [좌표 계산 로직] ---

        // 2. object-contain으로 인한 <img> 내부의 실제 이미지 크기 및 여백 계산
        const naturalRatio = bgImg.naturalWidth / bgImg.naturalHeight;
        const rectRatio = roomWidth / roomHeight;

        let renderedWidth, renderedHeight, offsetX, offsetY;

        // [유지] 0으로 나누기 방지
        if (roomHeight === 0 || roomWidth === 0) {
            throw new Error("이미지 렌더링 크기를 읽을 수 없습니다. (0px)");
        }

        if (naturalRatio > rectRatio) {
            renderedWidth = roomWidth;
            renderedHeight = roomWidth / naturalRatio;
            offsetX = 0;
            offsetY = (roomHeight - renderedHeight) / 2;
        } else {
            renderedHeight = roomHeight;
            renderedWidth = roomHeight * naturalRatio;
            offsetX = (roomWidth - renderedWidth) / 2;
            offsetY = 0;
        }

        // 3. 단일 스케일 비율 계산
        const ratio = bgImg.naturalWidth / renderedWidth;

        // 4. 'imageContainer' 기준, 실제 이미지(여백 제외)의 시작점
        const renderedImageLeft = roomLeft + offsetX;
        const renderedImageTop = roomTop + offsetY;

        // 5. 실제 이미지 기준, 가구의 상대 위치
        const relativeX = furnLeft - renderedImageLeft;
        const relativeY = furnTop - renderedImageTop;

        // 6. 캔버스에 그릴 최종 좌표 및 크기 계산
        const drawX = relativeX * ratio;
        const drawY = relativeY * ratio;
        const drawWidth = furnWidth * ratio;
        const drawHeight = furnHeight * ratio;

        // 캔버스에 가구 그리기
        ctx.drawImage(fgImg, drawX, drawY, drawWidth, drawHeight);

        const modifiedBlob = await new Promise(resolve => {
            canvas.toBlob(resolve, 'image/png');
        });

        if (!modifiedBlob) {
            throw new Error('Canvas to Blob 변환에 실패했습니다.');
        }

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

        // --- [수정] 5. AI 결과 이미지를 다운로드 대신 화면에 표시 ---
        const resultBlob = await response.blob();

        // [신규] Blob을 브라우저 메모리에 로드하고 URL 생성
        const newImageUrl = URL.createObjectURL(resultBlob);

        // [신규] roomImage의 src를 새 결과 이미지로 교체
        roomImage.src = newImageUrl;

        // [신규] 기존 가구(furnitureWrapper) 숨기기 및 초기화
        furnitureWrapper.classList.add('hidden');
        furniturePreview.src = ''; // 가구 미리보기 이미지 소스 제거
        furnitureFile = null; // 파일 상태 초기화

    } catch (error) {
        console.error('Error:', error);
        alert(error.message || '이미지 생성 중 오류가 발생했습니다.');
    } finally {
        // [유지] 로딩 페이지 숨기고 메인 콘텐츠 표시
        adLoadingPage.classList.add('hidden');
        if (mainContent) mainContent.classList.remove('hidden');

        footerSingleButton.classList.add('hidden');
        footerMultiButton.classList.remove('hidden');
    }
}

// 8. [신규] 멀티 버튼 이벤트 리스너
downloadButton.addEventListener('click', async () => {
    // 현재 roomImage의 src (blob: URL)를 fetch하여 blob으로 변환
    try {
        const response = await fetch(roomImage.src);
        const blob = await response.blob();
        triggerDownload(blob, 'generated_image.png');
    } catch (err) {
        console.error('Error downloading image:', err);
        alert('이미지 다운로드에 실패했습니다.');
    }
});

addFurnitureButton.addEventListener('click', () => {
    // "가구 사진 불러오기"와 동일하게 파일 입력창을 엽니다.
    furnitureFileInput.click();
});

resetButton.addEventListener('click', () => {
    // /main으로 페이지를 이동시킵니다.
    window.location.href = '/main';
});