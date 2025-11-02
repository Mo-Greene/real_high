package com.mo.real_high;

import com.mo.real_high.exception.MultipartFileEx;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
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
import java.util.Base64;
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

	/**
	 * 이미지 페이지
	 * @param model
	 * @return
	 */
	@GetMapping("/image")
	public String showImagePage(Model model) {
		if (!model.containsAttribute("base64Image")) {
			return "redirect:/main";
		}
		return "image";
	}

	/**
	 * 이미지 파일 파싱
	 * @param file
	 * @param redirectAttributes
	 * @return
	 */
	@PostMapping("/image")
	public String uploadImage(@RequestParam("image") MultipartFile file, RedirectAttributes redirectAttributes) {

		if (file.isEmpty()) {
			redirectAttributes.addFlashAttribute("message", "업로드할 파일을 선택해주세요.");
			return "redirect:/image";
		}

		String mimeType = file.getContentType();
		if (mimeType == null || !mimeType.startsWith("image")) {
			redirectAttributes.addFlashAttribute("error", "이미지 파일만 업로드할 수 있습니다.");
			return "redirect:/image";
		}

		try {
			byte[] imageBytes = file.getBytes();
			String base64Image = Base64.getEncoder().encodeToString(imageBytes);

			redirectAttributes.addFlashAttribute("base64Image", base64Image);
			redirectAttributes.addFlashAttribute("mimeType", mimeType);

			return "redirect:/image";
		} catch (IOException e) {
			e.printStackTrace();
			redirectAttributes.addFlashAttribute("error", "파일 처리에 실패했습니다.");
			return "redirect:/image";
		}
	}
}
