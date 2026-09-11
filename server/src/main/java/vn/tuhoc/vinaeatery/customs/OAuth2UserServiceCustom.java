package vn.tuhoc.vinaeatery.customs;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.auth.domains.entities.UserEntity;
import vn.tuhoc.vinaeatery.modules.auth.domains.enums.UserMethodEnum;
import vn.tuhoc.vinaeatery.modules.auth.domains.enums.UserRoleEnum;
import vn.tuhoc.vinaeatery.modules.auth.dtos.requests.UserCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.responses.UserDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.auth.services.UserServiceImplement;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;
import vn.tuhoc.vinaeatery.modules.global.services.EmailService;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.CustomerEntity;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.CustomerRegisterRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.CustomerDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.services.CustomerServiceImplement;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

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

import java.util.*;

@Service
@RequiredArgsConstructor
public class OAuth2UserServiceCustom implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {
    private final EmailService emailService;
    private final UserServiceImplement userService;
    private final CustomerServiceImplement customerService;
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
            @SuppressWarnings("unchecked")
            Map<String, Object> pictureObj = (Map<String, Object>) oAuth2User.getAttributes().get("picture");
            @SuppressWarnings("unchecked")
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
            email = registrationId + "_" + oAuth2User.getAttribute("id") +
                    "@example.com";

        }
        attributes.put("email", email);

        // Kiểm tra user trong DB, nếu chưa có thì tạo mới
        // -
        UserMethodEnum finalUserMethodEnum = userMethodEnum;
        // -
        String finalEmail = email;
        // -
        CustomerEntity customerExistsByEmail = this.customerService.handleGetOneByEmailNotThrowException(finalEmail);
        if (ValidationUtil.isNull(customerExistsByEmail)) {
            UserCreateRequestDTO userCreateRequestDTO = UserCreateRequestDTO.builder()
                    .username(finalEmail)
                    .password(this.passwordEncoder.encode("vinaeatery"))
                    .role(UserRoleEnum.CUSTOMER)
                    .method(finalUserMethodEnum)
                    .status(CommonStatusEnum.ACTIVE)
                    .build();
            UserDetailResponseDTO userCreated = this.userService.handleCreate(userCreateRequestDTO);

            CustomerRegisterRequestDTO customerRegisterRequestDTO = CustomerRegisterRequestDTO.builder()
                    .userId(userCreated.getId())
                    .image(avatar)
                    .fullname(name)
                    .phone(null)
                    .email(finalEmail)
                    .status(CommonStatusEnum.ACTIVE)
                    .build();
            CustomerDetailResponseDTO customerCreated = this.customerService.handleRegister(customerRegisterRequestDTO);
            if (ValidationUtil.nonNull(customerCreated)) {
                this.emailService.sendRegisterSuccessEmail(
                        customerCreated.getEmail(),
                        userCreated,
                        customerCreated,
                        "vinaeatery");
            }

        }
        if (ValidationUtil.nonNull(customerExistsByEmail)
                && customerExistsByEmail.getStatus().equals(CommonStatusEnum.INACTIVE)) {
            throw new OAuth2AuthenticationException(
                    new OAuth2Error("CUSTOMER_DISABLED"),
                    "Thông tin khách hàng không còn sử dụng");
        }

        // Tạo DefaultOAuth2User để Spring Security dùng
        // - Lấy user từ DB sau khi tạo hoặc đã tồn tại
        UserEntity userExistsByUsernameIsEmail = this.userService.handleGetByUsername(finalEmail);
        if (userExistsByUsernameIsEmail.getStatus().equals(CommonStatusEnum.INACTIVE)) {
            throw new OAuth2AuthenticationException(
                    new OAuth2Error("CUSTOMER_ACCOUNT_DISABLED"),
                    "Thông tin tài khoản khách hàng không còn sử dụng");
        }
        // - Tạo authorities
        List<GrantedAuthority> authorities = List
                .of(new SimpleGrantedAuthority("ROLE_" +
                        userExistsByUsernameIsEmail.getRole().name()));
        // - Add id để sử dụng sau này
        attributes.put("id", userExistsByUsernameIsEmail.getId());

        return new DefaultOAuth2User(authorities, attributes, "email");
    }
}