package com.mo.real_high.domain.image;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.web.multipart.MultipartFile;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ImageController.class)
class ImageControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockitoBean
	private ImageService imageService;

	@Test
	@DisplayName("실패 - 지원하지 않는 model 값으로 요청하면 400 Bad Request를 반환한다.")
	void generateImage_Fail_WithInvalidModel() throws Exception {
		// given
		String invalidModel = "invalid-model-name";
		MockMultipartFile baseImage = new MockMultipartFile("baseImage", "base.jpg", MediaType.IMAGE_JPEG_VALUE, "base".getBytes());
		MockMultipartFile modifiedImage = new MockMultipartFile("modifiedImage", "modified.png", MediaType.IMAGE_PNG_VALUE, "modified".getBytes());

		given(imageService.generateImage(eq(invalidModel), any(MultipartFile.class), any(MultipartFile.class)))
			.willThrow(new IllegalArgumentException("Unknown value: " + invalidModel));

		// when
		ResultActions actions = mockMvc.perform(multipart("/generate/{model}", invalidModel)
			.file(baseImage)
			.file(modifiedImage)
			.contentType(MediaType.MULTIPART_FORM_DATA));

		// then
		actions
			.andDo(print())
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$.message").exists())
			.andExpect(jsonPath("$.message").value("Unknown value: " + invalidModel));
	}
}