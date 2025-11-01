package com.mo.real_high.domain.image;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum AiKey {

	GEMINI("gemini");
	//AI 추가

	private final String beanName;
}
