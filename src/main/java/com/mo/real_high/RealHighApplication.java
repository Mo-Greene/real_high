package com.mo.real_high;

import com.ulisesbocchio.jasyptspringboot.annotation.EnableEncryptableProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableEncryptableProperties
public class RealHighApplication {

	public static void main(String[] args) {
		SpringApplication.run(RealHighApplication.class, args);
	}

}
