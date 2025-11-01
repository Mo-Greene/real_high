package com.mo.real_high;

import com.mo.real_high.exception.MultipartFileEx;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Controller
public class PageController {

	private final String UPLOAD_DIR = "src/main/resources/static/uploads/";

	/**
	 * 랜딩 페이지
	 * @return
	 */
	@GetMapping("/")
	public String getIndexPage() {
		return "index";
	}

	/**
	 * 사진 업로드 설명 페이지
	 * @return
	 */
	@GetMapping("/main")
	public String getMainPage() {
		return "main";
	}

	@GetMapping("/image")
	public String uploadImage(@RequestParam("image") MultipartFile file, RedirectAttributes redirectAttributes) {
		if (file.isEmpty()) {
			redirectAttributes.addFlashAttribute("error", "업로드할 파일을 선택해주세요.");
			return "redirect:/image";
		}
		if (!file.getContentType().startsWith("image")) {
			redirectAttributes.addFlashAttribute("error", "이미지 파일만 업로드할 수 있습니다.");
			return "redirect:/image";
		}

		try {
			File uploadDir = new File(UPLOAD_DIR);
			if (!uploadDir.exists()) {
				uploadDir.mkdirs();
			}

			String originalFilename = file.getOriginalFilename();
			String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
			String storedFilename = UUID.randomUUID().toString() + extension;

			Path path = Paths.get(UPLOAD_DIR + storedFilename);
			Files.write(path, file.getBytes());

			redirectAttributes.addFlashAttribute("imageName", storedFilename);
			return "redirect:/image";

		} catch (IOException e) {
			redirectAttributes.addFlashAttribute("error", "파일 업로드에 실패했습니다.");
			return "redirect:/image";
		}
	}
}
