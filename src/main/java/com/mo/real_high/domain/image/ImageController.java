package com.mo.real_high.domain.image;

import com.google.common.net.HttpHeaders;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
public class ImageController {

	private final ImageService imageService;

	@PostMapping(value = "/generate/{model}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<byte[]> generateCombinedImage(@PathVariable("model") AiKey model,
	                                                    @RequestParam("baseImage") MultipartFile baseImage,
	                                                    @RequestParam("modifiedImage") MultipartFile modifiedImage) {

		byte[] generatedImage = imageService.generateImage(model, baseImage, modifiedImage);

		String originalFilename = baseImage.getOriginalFilename();
		String filenameWithoutExtension = "generated_image";
		if (originalFilename != null && originalFilename.contains(".")) {
			filenameWithoutExtension = originalFilename.substring(0, originalFilename.lastIndexOf("."));
		}
		String newFilename = filenameWithoutExtension + "_fix.png";

		return ResponseEntity.ok()
			.contentType(MediaType.IMAGE_PNG)
			.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + newFilename + "\"")
			.body(generatedImage);
	}
}
