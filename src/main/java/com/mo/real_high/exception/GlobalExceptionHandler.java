package com.mo.real_high.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

	public record ErrorResponse(String message) {
	}

	/**
	 * 사진 업로드 에러
	 * @param e
	 * @return
	 */
	@ExceptionHandler(MultipartFileEx.class)
	public ResponseEntity<ErrorResponse> handleMultipartFileEx(MultipartFileEx e) {

		log.error("MULTIPART FILE ERROR : {}", e.getMessage());
		ErrorResponse response = new ErrorResponse(e.getMessage());

		return new ResponseEntity<>(response, BAD_REQUEST);
	}

	/**
	 * 제미니 응답 에러
	 * @param e
	 * @return
	 */
	@ExceptionHandler(GeminiResponseEx.class)
	public ResponseEntity<ErrorResponse> handleGeminiResponseEx(GeminiResponseEx e) {

		log.error("GEMINI RESPONSE ERROR : {}", e.getMessage());
		ErrorResponse response = new ErrorResponse(e.getMessage());

		return new ResponseEntity<>(response, INTERNAL_SERVER_ERROR);
	}

	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	public ResponseEntity<ErrorResponse> handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException e) {

		log.error("BINDING ERROR : {}", e.getMessage());

		String errorMessage = String.format(
			"'%s' 필드에 잘못된 값 '%s'이(가) 입력되었습니다. 허용되는 값들 중 하나를 사용해주세요.",
			e.getName(),
			e.getValue()
		);

		ErrorResponse response = new ErrorResponse(errorMessage);

		return new ResponseEntity<>(response, BAD_REQUEST);
	}

	@ExceptionHandler(RuntimeException.class)
	public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException e) {

		log.error("RUNTIME ERROR : {}", e.getMessage());
		ErrorResponse response = new ErrorResponse(e.getMessage());

		return new ResponseEntity<>(response, BAD_REQUEST);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorResponse> handleException(Exception e) {

		log.error("EXCEPTION : {}", e.getMessage());
		ErrorResponse response = new ErrorResponse(e.getMessage());

		return new ResponseEntity<>(response, BAD_REQUEST);
	}
}
