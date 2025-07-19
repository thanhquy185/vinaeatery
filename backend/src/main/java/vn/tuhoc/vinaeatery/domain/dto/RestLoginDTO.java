package vn.tuhoc.vinaeatery.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.Role;

@Getter
@Setter
public class RestLoginDTO {
    // Properties
    @JsonProperty("access_token")
    private String accessToken;
    private UserLogin userLogin;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserLogin {
        private Integer id;
        private String image;
        private String fullname;
        private String birthday;
        private String gender;
        private String phone;
        private String email;
        private String address;
        private String username;
        private Role role;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserGetAccount {
        private UserLogin userLogin;
    }
}