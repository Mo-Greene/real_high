package com.mo.real_high.config;

import com.google.genai.Client;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GeminiConfig {

	@Value("${gemini.api.key}")
	private String apiKey;

	public static final String GEMINI_MODEL = "gemini-2.5-flash-image";
	public static final String GEMINI_PROMPT = "You will be given two images. " +
			"The first image is the original, empty room (this is the base background). " +
			"The second image is a composite showing a piece of furniture crudely placed in that room (this is the user's desired placement). " +
			"Your task is to use these two images as context. " +
			"Create a single, new, photorealistic image that shows the furniture from the second image realistically integrated into the room from the first image. " +
			"Follow the placement and scale from the second image, but fix all lighting, shadows, and perspective to make it look completely natural.";

	@Bean
	public Client client() {
		return Client.builder()
				.apiKey(apiKey)
				.build();
	}
}
