package vn.tuhoc.vinaeatery.modules.food.dtos.requests;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.food.domains.converters.FoodStatusConverter;
import vn.tuhoc.vinaeatery.modules.food.domains.enums.FoodStatusEnum;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FoodDeleteRequestDTO {
    @NotNull(message = "Trạng thái không được để trống!")
    @Convert(converter = FoodStatusConverter.class)
    FoodStatusEnum status;
}
