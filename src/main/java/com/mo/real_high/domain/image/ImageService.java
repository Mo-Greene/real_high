package com.mo.real_high.domain.image;

import com.mo.real_high.domain.ai.AiStrategy;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Slf4j
@Service
public class ImageService {

	private final Map<String, AiStrategy> aiStrategies;

	public ImageService(Map<String, AiStrategy> aiStrategies) {
		this.aiStrategies = aiStrategies;
	}

	/**
	 * 이미지 렌더링
	 * @param model
	 * @param baseImage
	 * @param modifiedImage
	 * @return
	 */
	public byte[] generateImage(AiKey model, MultipartFile baseImage, MultipartFile modifiedImage) {

		AiStrategy strategy = aiStrategies.get(model.getBeanName());

		return strategy.generateImage(baseImage, modifiedImage);
	}
}
