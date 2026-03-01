package vn.tuhoc.vinaeatery.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.entity.Customer;
import vn.tuhoc.vinaeatery.domain.entity.User;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.domain.enumm.UserIsUsingEnum;
import vn.tuhoc.vinaeatery.domain.enumm.UserMethodEnum;
import vn.tuhoc.vinaeatery.domain.enumm.UserRoleEnum;
import vn.tuhoc.vinaeatery.repository.CustomerRepository;
import vn.tuhoc.vinaeatery.repository.UserRepository;

import org.springframework.format.datetime.DateFormatter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {
    private final EmailService emailService;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        String email;
        // String firstName;
        // String lastName;
        String name;
        String avatar;
        UserMethodEnum userMethodEnum = null;
        // System.out.println(oAuth2User.getAttributes());
        if (registrationId.equals("google")) {
            // Lấy thông tin cơ bản từ Google
            userMethodEnum = UserMethodEnum.GOOGLE;
            email = oAuth2User.getAttribute("email");
            // firstName = oAuth2User.getAttribute("first_name");
            // lastName = oAuth2User.getAttribute("last_name");
            name = oAuth2User.getAttribute("name");
            avatar = oAuth2User.getAttribute("picture");
        } else if (registrationId.equals("facebook")) {
            // Lấy thông tin cơ bản từ Facebook
            userMethodEnum = UserMethodEnum.FACEBOOK;
            email = oAuth2User.getAttribute("email");
            // firstName = oAuth2User.getAttribute("given_name");
            // lastName = oAuth2User.getAttribute("family_name");
            name = oAuth2User.getAttribute("name");
            Map<String, Object> pictureObj = (Map<String, Object>) oAuth2User.getAttributes().get("picture");
            Map<String, Object> dataObj = (Map<String, Object>) pictureObj.get("data");
            avatar = (String) dataObj.get("url");
        } else {
            email = "";
            avatar = "";
            // lastName = "";
            // firstName = "";
            name = "";
            userMethodEnum = UserMethodEnum.HANDMADE;
        }
        Map<String, Object> attributes = new HashMap<>(oAuth2User.getAttributes());
        if (email == null || email.isEmpty()) {
            email = registrationId + "_" + oAuth2User.getAttribute("id") + "@example.com";

        }
        attributes.put("email", email);

        // Kiểm tra user trong DB, nếu chưa có thì tạo mới
        // -
        UserMethodEnum finalUserMethodEnum = userMethodEnum;
        // -
        String finalEmail = email;
        // -
        Customer customerExistsByEmail = this.customerRepository.findOneByEmail(finalEmail);
        if (customerExistsByEmail == null) {
            User newUser = new User();
            newUser.setCreateAt(LocalDateTime.now()
                    .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            newUser.setUsername(finalEmail);
            newUser.setPassword(this.passwordEncoder.encode("123456"));
            newUser.setRole(UserRoleEnum.CUSTOMER);
            newUser.setIsUsing(UserIsUsingEnum.USING);
            newUser.setMethod(finalUserMethodEnum);
            newUser.setStatus(CommonStatusEnum.ACTIVE);
            User userCreated = this.userRepository.save(newUser);

            Customer newCustomer = new Customer();
            newCustomer.setUserId(userCreated.getId());
            newCustomer.setImage(avatar);
            newCustomer.setFullname(name);
            newCustomer.setPhone(null);
            newCustomer.setEmail(finalEmail);
            newCustomer.setStatus(CommonStatusEnum.ACTIVE);
            Customer customerCreated = this.customerRepository.save(newCustomer);

            if (customerCreated != null) {
                this.emailService.sendRegisterSuccessEmail(customerCreated.getEmail(),
                        userCreated, customerCreated, "123456");
            }

        }
        if (customerExistsByEmail != null && customerExistsByEmail.getStatus() == CommonStatusEnum.INACTIVE) {
            throw new OAuth2AuthenticationException(
                    new OAuth2Error("account_disabled"),
                    "Thông tin khách hàng không còn sử dụng");
        }

        // Tạo DefaultOAuth2User để Spring Security dùng
        // - Lấy user từ DB sau khi tạo hoặc đã tồn tại
        User userExistsByUsernameIsEmail = this.userRepository.findOneByUsername(finalEmail);
        if (customerExistsByEmail != null && customerExistsByEmail.getStatus() == CommonStatusEnum.INACTIVE
                || userExistsByUsernameIsEmail.getStatus() == CommonStatusEnum.INACTIVE) {
            throw new OAuth2AuthenticationException(
                    new OAuth2Error("account_disabled"),
                    "Thông tin tài khoản khách hàng không còn sử dụng");
        }
        // - Tạo authorities
        List<GrantedAuthority> authorities = List
                .of(new SimpleGrantedAuthority("ROLE_" + userExistsByUsernameIsEmail.getRole().name()));
        // - Add id để sử dụng sau này
        attributes.put("id", userExistsByUsernameIsEmail.getId());

        return new DefaultOAuth2User(authorities, attributes, "email");
    }
}