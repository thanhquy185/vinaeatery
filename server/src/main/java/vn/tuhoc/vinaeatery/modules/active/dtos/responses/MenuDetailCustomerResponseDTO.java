package vn.tuhoc.vinaeatery.modules.active.dtos.responses;

import jakarta.persistence.Convert;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.UseFoodStatusConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.UseFoodStatusEnum;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.FoodInfoResponseDTO;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MenuDetailCustomerResponseDTO {
    FoodInfoResponseDTO food;

    @Convert(converter = UseFoodStatusConverter.class)
    UseFoodStatusEnum status;
}
