package vn.tuhoc.vinaeatery.service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.entity.Customer;
import vn.tuhoc.vinaeatery.domain.entity.User;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Async
    public void sendRegisterSuccessEmail(String emailReceiver, User user, Customer customer, String passwordNoHash) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");

            helper.setTo(emailReceiver);
            helper.setSubject("VINAEATERY - Đăng ký tài khoản thành công");

            String html = """
                    <!DOCTYPE html>
                    <html style="font-family: Arial, sans-serif; margin:0; padding:0;">
                      <body style="margin:0; padding:0; background:#f5f5f5;">
                        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5; padding:20px 0;">
                          <tr>
                            <td align="center">

                              <!-- Container chính -->
                              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden;">

                                <!-- Header với logo + tên hệ thống -->
                                <tr>
                                  <td style="background:#b91c1c; padding:20px; display:flex; align-items:center; justify-content:center;">
                                    <img src={{brandImage}} alt="VINAEATERY Logo" width="50" height="50" style="margin-right:15px; border-radius:6px;">
                                    <h2 style="margin:0; color:#ffffff; font-size:24px;">VINAEATERY</h2>
                                  </td>
                                </tr>

                                <!-- Nội dung chính -->
                                <tr>
                                  <td style="padding:30px; font-size:16px; color:#333333;">
                                    <p>Xin chào <b>{{username}}</b>,</p>
                                    <p>
                                      Chúc mừng bạn đã đăng ký tài khoản thành công trên hệ thống VINAEATERY.
                                    </p>

                                    <p style="margin-top:20px;">Thông tin tài khoản của bạn:</p>

                                    <table width="100%%" cellpadding="8" cellspacing="0" style="background:#fafafa; border:1px solid #e1e1e1; border-radius:6px;">
                                      <tr>
                                        <td><b>Họ và tên:</b></td>
                                        <td>{{fullname}}</td>
                                      </tr>
                                      <tr>
                                        <td><b>Số điện thoại:</b></td>
                                        <td>{{phone}}</td>
                                      </tr>
                                      <tr>
                                        <td><b>Email:</b></td>
                                        <td>{{email}}</td>
                                      </tr>
                                      <tr>
                                        <td><b>Tên tài khoản:</b></td>
                                        <td>{{username}}</td>
                                      </tr>
                                      <tr>
                                        <td><b>Mật khẩu:</b></td>
                                        <td>{{password}}</td>
                                      </tr>
                                    </table>

                                    <p style="margin-top:25px;">Bạn có thể đăng nhập ngay tại:</p>

                                    <p style="text-align:center; margin:20px 0;">
                                      <a href="{{loginUrl}}"
                                         style="background:#b91c1c; color:#ffffff; padding:12px 28px;
                                                text-decoration:none; border-radius:8px; font-size:16px;">
                                        Đăng nhập ngay
                                      </a>
                                    </p>

                                    <p style="margin-top:30px;">
                                      Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.
                                    </p>
                                  </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                  <td style="background:#f0f0f0; padding:15px; text-align:center; color:#666;">
                                    <p style="margin:0; font-size:14px;">
                                      © 2025 VINAEATERY – Hệ thống quản lý nhà hàng
                                    </p>
                                  </td>
                                </tr>

                              </table>
                            </td>
                          </tr>
                        </table>
                      </body>
                    </html>
                    """
                    .replace("{{brandImage}}", "http://localhost:5173/favicon/brand-image.png")
                    .replace("{{fullname}}", customer.getFullname())
                    .replace("{{phone}}", customer.getPhone() != null ? customer.getPhone() : "Chưa cập nhật")
                    .replace("{{email}}", customer.getEmail())
                    .replace("{{username}}", user.getUsername())
                    .replace("{{password}}", passwordNoHash)
                    .replace("{{loginUrl}}", "http://localhost:5173/public");

            helper.setText(html, true);

            mailSender.send(message);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Gửi mail thất bại!");
        }
    }

}
