package vn.tuhoc.vinaeatery.modules.food.dtos.responses;

import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.modules.global.domains.converters.CommonStatusConverter;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SupplierInfoResponseDTO {
    private Integer id;

    private String fullname;

    private String phone;

    private String email;

    private String houseNumber;

    private String streetName;

    private String ward;

    private String province;

    @Convert(converter = CommonStatusConverter.class)
    private CommonStatusEnum status;
}
