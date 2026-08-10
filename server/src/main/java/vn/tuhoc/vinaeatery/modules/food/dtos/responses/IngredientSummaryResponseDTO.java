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
public class IngredientSummaryResponseDTO {
    private Integer id;

    private CategoryIngredientInfoResponseDTO categoryIngredient;

    private String name;

    private String unit;

    private Long capacity;

    private Long inputPrice;

    private Long inventory;

    @Convert(converter = CommonStatusConverter.class)
    private CommonStatusEnum status;
}
