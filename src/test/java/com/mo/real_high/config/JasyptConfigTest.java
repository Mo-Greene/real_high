package com.mo.real_high.config;

import org.jasypt.encryption.StringEncryptor;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(classes = JasyptConfig.class)
class JasyptConfigTest {

    @Autowired
    private StringEncryptor jasyptStringEncryptor;

    @DisplayName("Jasypt 암호화 및 복호화 테스트")
    @Test
    void jasypt_encrypt_decrypt_test() {
        String plainText = "이것은 테스트입니다.";

        String encryptedText = jasyptStringEncryptor.encrypt(plainText);
        System.out.println("Encrypted Text: " + encryptedText);
        String decryptedText = jasyptStringEncryptor.decrypt(encryptedText);

        assertThat(decryptedText).isEqualTo(plainText);
    }
}
