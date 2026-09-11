package vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses;

import jakarta.persistence.Convert;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.global.domains.converters.CommonGenderConverter;
import vn.tuhoc.vinaeatery.modules.global.domains.converters.CommonStatusConverter;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonGenderEnum;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CustomerInfoResponseDTO {
    Integer id;

    String image;

    String fullname;

    String birthdate;

    @Convert(converter = CommonGenderConverter.class)
    CommonGenderEnum gender;

    String phone;

    String email;

    String houseNumber;

    String streetName;

    String ward;

    String province;

    String description;

    @Convert(converter = CommonStatusConverter.class)
    CommonStatusEnum status;
}
