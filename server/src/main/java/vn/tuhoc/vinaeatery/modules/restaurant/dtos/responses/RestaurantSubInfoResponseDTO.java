package vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses;

import jakarta.persistence.Convert;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.global.domains.converters.CommonStatusConverter;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RestaurantSubInfoResponseDTO {
    Integer id;

    String name;

    String openAt;

    String closeAt;

    String phone;

    String email;

    Double latitude;

    Double longitude;

    String houseNumber;

    String streetName;

    String ward;

    String province;

    String description;

    @Convert(converter = CommonStatusConverter.class)
    CommonStatusEnum status;
}
