package com.mo.real_high.config;

import org.jasypt.encryption.StringEncryptor;
import org.jasypt.encryption.pbe.PooledPBEStringEncryptor;
import org.jasypt.encryption.pbe.config.SimpleStringPBEConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JasyptConfig {

	@Value("${jasypt.encryptor.password}")
	private String key;

	@Value("${jasypt.encryptor.algorithm}")
	private String algorithm;

	@Value("${jasypt.encryptor.pool-size}")
	private String poolSize;

	@Bean(name = "jasyptStringEncryptor")
	public StringEncryptor stringEncryptor() {
		PooledPBEStringEncryptor encryptor = new PooledPBEStringEncryptor();
		SimpleStringPBEConfig config = new SimpleStringPBEConfig();
		config.setPassword(key);
		config.setAlgorithm(algorithm);
		config.setPoolSize(poolSize);
		config.setSaltGeneratorClassName("org.jasypt.salt.RandomSaltGenerator");
		encryptor.setConfig(config);
		return encryptor;
	}
}
