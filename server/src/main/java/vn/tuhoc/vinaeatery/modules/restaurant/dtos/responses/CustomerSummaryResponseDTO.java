package vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses;

import jakarta.persistence.Convert;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.auth.dtos.responses.UserInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.global.domains.converters.CommonGenderConverter;
import vn.tuhoc.vinaeatery.modules.global.domains.converters.CommonStatusConverter;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonGenderEnum;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CustomerSummaryResponseDTO {
    Integer id;

    UserInfoResponseDTO user;

    String imageUrl;

    String imagePublicId;

    String fullname;

    String birthdate;

    @Convert(converter = CommonGenderConverter.class)
    CommonGenderEnum gender;

    String phone;

    String email;

    @Convert(converter = CommonStatusConverter.class)
    CommonStatusEnum status;
}
