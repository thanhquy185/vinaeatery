package vn.tuhoc.vinaeatery.modules.active.dtos.responses;

import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.UseFoodStatusConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.UseFoodStatusEnum;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.FoodInfoResponseDTO;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UseFoodSummaryResponseDTO {
    private Integer id;

    private FoodInfoResponseDTO food;

    private String startAt;

    private String endAt;

    @Convert(converter = UseFoodStatusConverter.class)
    private UseFoodStatusEnum status;
}
