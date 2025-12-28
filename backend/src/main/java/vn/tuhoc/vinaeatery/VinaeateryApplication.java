package vn.tuhoc.vinaeatery;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
// @SpringBootApplication(exclude = {
// 		org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class,
// 		org.springframework.boot.actuate.autoconfigure.security.servlet.ManagementWebSecurityAutoConfiguration.class
// })
@EnableFeignClients
@EnableAsync
public class VinaeateryApplication {
	public static void main(String[] args) {
		SpringApplication.run(VinaeateryApplication.class, args);

		// PasswordEncoder encoder = new BCryptPasswordEncoder();
		// System.out.println(encoder.encode("employee0"));
		// System.out.println(encoder.encode("employee1"));
		// System.out.println(encoder.encode("employee2"));
		// System.out.println(encoder.encode("employee3"));
		// System.out.println(encoder.encode("employee4"));
		// System.out.println(encoder.encode("customer0"));
		// System.out.println(encoder.encode("customer1"));
	}
}