package vn.tuhoc.vinaeatery.modules.food.dtos.responses;

import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.modules.global.domains.converters.CommonStatusConverter;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantSubInfoResponseDTO;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class IngredientDetailResponseDTO {
    private Integer id;

    private RestaurantSubInfoResponseDTO restaurant;

    private CategoryIngredientInfoResponseDTO categoryIngredient;

    private String name;

    private String unit;

    private Long capacity;

    private String dateCreate;

    private String dateRemove;

    private Long inputPrice;

    private Long inventory;

    private String note;

    @Convert(converter = CommonStatusConverter.class)
    private CommonStatusEnum status;
}
