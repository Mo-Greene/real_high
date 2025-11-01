package com.mo.real_high.domain.ai;

import org.springframework.web.multipart.MultipartFile;

public interface AiStrategy {

	byte[] generateImage(MultipartFile baseImage, MultipartFile modifiedImage);

}
