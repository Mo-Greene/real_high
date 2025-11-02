package com.mo.real_high.domain.image;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;

@Getter
@RequiredArgsConstructor
public enum AiKey {

	GEMINI("gemini");
	//AI 추가

	private final String value;

	public static AiKey fromValue(String value) {
		if (value == null) {
			throw new IllegalArgumentException("Value cannot be null");
		}

		return Arrays.stream(AiKey.values())
			.filter(key -> key.value.equals(value))
			.findFirst()
			.orElseThrow(() -> new IllegalArgumentException("Unknown value: " + value));
	}
}
