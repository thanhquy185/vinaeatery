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
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.EmployeeSubInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.FoodInfoResponseDTO2;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantSubInfoResponseDTO;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UseFoodDetailResponseDTO {
    Integer id;

    RestaurantSubInfoResponseDTO restaurant;

    FoodInfoResponseDTO2 food;

    EmployeeSubInfoResponseDTO employee;

    String startAt;

    String endAt;

    @Convert(converter = UseFoodStatusConverter.class)
    UseFoodStatusEnum status;
}
