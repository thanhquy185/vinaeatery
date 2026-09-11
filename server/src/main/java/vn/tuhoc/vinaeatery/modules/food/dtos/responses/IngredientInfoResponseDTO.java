package vn.tuhoc.vinaeatery.modules.food.dtos.responses;

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
public class IngredientInfoResponseDTO {
    Integer id;

    CategoryIngredientInfoResponseDTO categoryIngredient;

    String name;

    String unit;

    Long capacity;

    String dateCreate;

    String dateRemove;

    Long inputPrice;

    Long inventory;

    String note;

    @Convert(converter = CommonStatusConverter.class)
    CommonStatusEnum status;
}
