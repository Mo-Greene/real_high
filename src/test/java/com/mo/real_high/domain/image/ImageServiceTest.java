package com.mo.real_high.domain.image;

import com.mo.real_high.domain.ai.AiStrategy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ImageServiceTest {

	private ImageService imageService;

	@Mock
	private AiStrategy geminiStrategy;

	@BeforeEach
	void setUp() {
		imageService = new ImageService(Map.of(AiKey.GEMINI.getBeanName(), geminiStrategy));
	}

	@Test
	@DisplayName("GEMINI 모델 키로 요청 시, 결과반환")
	void generateImage_WithGeminiKey_ShouldCallCorrectStrategy() {
		//given
		AiKey model = AiKey.GEMINI;
		MultipartFile baseImage = new MockMultipartFile("base.jpg", "base.jpg", "image/jpeg", "baseImage".getBytes());
		MultipartFile modifiedImage = new MockMultipartFile("modified.png", "modified.png", "image/png", "modifiedImage".getBytes());

		byte[] expectedResult = "gemini-generated-image".getBytes();

		when(geminiStrategy.generateImage(baseImage, modifiedImage)).thenReturn(expectedResult);

		//when
		byte[] actualResult = imageService.generateImage(model, baseImage, modifiedImage);

		//then
		assertThat(actualResult).isEqualTo(expectedResult);

		verify(geminiStrategy, times(1)).generateImage(baseImage, modifiedImage);
	}
}