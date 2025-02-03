package com.monamour.monamour;

import com.monamour.monamour.service.UserService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

@SpringBootApplication
public class MonamourApplication {

	public static void main(String[] args) {
		SpringApplication.run(MonamourApplication.class, args);
	}

}
