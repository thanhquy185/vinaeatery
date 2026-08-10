package vn.tuhoc.vinaeatery.modules.global.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
// import vn.tuhoc.vinaeatery.modules.global.services.EmailService;

@RestController
@RequestMapping("/api/v1/email")
@RequiredArgsConstructor
public class EmailController {
    // private final EmailService emailService;

    @GetMapping("/send")
    public String sendEmail() {
        // emailService.sendRegisterSuccessEmail(
        // "thanhquyfu@gmail.com",
        // "Quý Thanh",
        // "http://localhost:5173/public");

        return "Đã gửi!";
    }
}
