package vn.tuhoc.vinaeatery.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.domain.enumm.UserIsUsingEnum;
import vn.tuhoc.vinaeatery.domain.enumm.UserMethodEnum;
import vn.tuhoc.vinaeatery.domain.enumm.UserRoleEnum;

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
        private String createAt;
        private String username;
        private UserRoleEnum role;
        private UserMethodEnum method;
        private UserIsUsingEnum isUsing;
        private CommonStatusEnum status;

    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserGetAccount {
        private UserLogin userLogin;
    }
}