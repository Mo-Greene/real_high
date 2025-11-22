package com.mo.real_high;

import java.io.IOException;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;

@Controller
public class PageController {

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
	public String showImagePage(HttpSession session, Model model) {
		if (session.getAttribute("uploadedImage") == null) {
			return "redirect:/main";
		}
		return "image";
	}

	@GetMapping("/image/content")
	public ResponseEntity<byte[]> serveImage(HttpSession session) {
		byte[] imageBytes = (byte[]) session.getAttribute("uploadedImage");
		String mimeType = (String) session.getAttribute("uploadedImageContentType");

		if (imageBytes == null) {
			return ResponseEntity.notFound().build();
		}

		return ResponseEntity.ok()
				.contentType(MediaType.parseMediaType(mimeType))
				.body(imageBytes);
	}

	/**
	 * 이미지 파일 파싱
	 * @param file
	 * @param redirectAttributes
	 * @return
	 */
	@PostMapping("/image")
	public String uploadImage(@RequestParam("image") MultipartFile file, RedirectAttributes redirectAttributes,
			HttpSession session) {

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
			session.setAttribute("uploadedImage", file.getBytes());
			session.setAttribute("uploadedImageContentType", mimeType);

			return "redirect:/image";
		} catch (IOException e) {
			e.printStackTrace();
			redirectAttributes.addFlashAttribute("error", "파일 처리에 실패했습니다.");
			return "redirect:/image";
		}
	}
}
