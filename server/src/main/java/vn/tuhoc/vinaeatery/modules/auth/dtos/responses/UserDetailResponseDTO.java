package vn.tuhoc.vinaeatery.modules.auth.dtos.responses;

import jakarta.persistence.Convert;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.auth.domains.converters.UserMethodConverter;
import vn.tuhoc.vinaeatery.modules.auth.domains.converters.UserRoleConverter;
import vn.tuhoc.vinaeatery.modules.auth.domains.enums.UserMethodEnum;
import vn.tuhoc.vinaeatery.modules.auth.domains.enums.UserRoleEnum;
import vn.tuhoc.vinaeatery.modules.global.domains.converters.CommonStatusConverter;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserDetailResponseDTO {
    Integer id;

    @Convert(converter = UserRoleConverter.class)
    UserRoleEnum role;

    String username;

    @Convert(converter = UserMethodConverter.class)
    UserMethodEnum method;

    @Convert(converter = CommonStatusConverter.class)
    CommonStatusEnum status;
}
