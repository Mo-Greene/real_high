package com.mo.real_high.config;

import com.google.genai.Client;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GeminiConfig {

	@Value("${gemini.api.key}")
	private String apiKey;

	public static final String GEMINI_MODEL = "gemini-2.5-flash-image-preview";
	public static final String GEMINI_PROMPT = "Create a realistic interior design photo. " +
		"Take the furniture from the second image and place it in the room from the first image. " +
		"Adjust the lighting, shadows, and perspective to make it look like a natural part of the room.";

	@Bean
	public Client client() {
		return Client.builder()
			.apiKey(apiKey)
			.build();
	}
}
