package vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses;

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
public class RestaurantSummaryResponseDTO {
    private Integer id;

    private ManagerInfoResponseDTO manager;

    private String name;

    private String phone;

    private String email;

    @Convert(converter = CommonStatusConverter.class)
    private CommonStatusEnum status;
}
