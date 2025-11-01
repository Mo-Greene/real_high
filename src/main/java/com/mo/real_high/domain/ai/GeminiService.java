package com.mo.real_high.domain.ai;

import com.google.genai.Client;
import com.google.genai.types.*;
import com.mo.real_high.exception.GeminiResponseEx;
import com.mo.real_high.exception.MultipartFileEx;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

import static com.mo.real_high.config.GeminiConfig.GEMINI_MODEL;
import static com.mo.real_high.config.GeminiConfig.GEMINI_PROMPT;

@Component("gemini")
@RequiredArgsConstructor
public class GeminiService implements AiStrategy {

	private final Client geminiClient;

	

	/**
	 * 이미지 렌더링
	 * @param baseImage
	 * @param modifiedImage
	 * @return
	 */
	@Override
	public byte[] generateImage(MultipartFile baseImage, MultipartFile modifiedImage) {

		Part baseImagePart;
		Part modifiedImagePart;
		Part textPrompt = Part.fromText(GEMINI_PROMPT);

		try {
			baseImagePart = Part.fromBytes(baseImage.getBytes(), baseImage.getContentType());
			modifiedImagePart = Part.fromBytes(modifiedImage.getBytes(), modifiedImage.getContentType());
		} catch (IOException e) {
			throw new MultipartFileEx("Multipart File Error.", e);
		}

		Content content = Content.fromParts(baseImagePart, modifiedImagePart, textPrompt);
		List<Content> contents = List.of(content);

		GenerateContentResponse response = geminiClient.models.generateContent(
			GEMINI_MODEL,
			contents,
			null
		);

		List<Candidate> responseContents = response.candidates().orElseThrow(() -> new GeminiResponseEx("No Candidate"));
		Content responseContent = responseContents.get(0).content().orElseThrow(() -> new GeminiResponseEx("No Contents"));
		List<Part> parts = responseContent.parts().orElseThrow(() -> new GeminiResponseEx("No Parts"));
		Blob blob = parts.get(0).inlineData().orElseThrow(() -> new GeminiResponseEx("No Blob"));
		return blob.data().orElseThrow(() -> new GeminiResponseEx("No Data"));
	}
}
