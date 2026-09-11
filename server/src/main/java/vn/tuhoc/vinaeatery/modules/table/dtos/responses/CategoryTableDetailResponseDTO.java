package vn.tuhoc.vinaeatery.modules.table.dtos.responses;

import jakarta.persistence.Convert;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.global.domains.converters.CommonStatusConverter;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantSubInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.domains.converters.CategoryTableSurchargeTypeConverter;
import vn.tuhoc.vinaeatery.modules.table.domains.enums.CategoryTableSurchargeTypeEnum;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryTableDetailResponseDTO {
    Integer id;

    RestaurantSubInfoResponseDTO restaurant;

    String name;

    @Convert(converter = CategoryTableSurchargeTypeConverter.class)
    CategoryTableSurchargeTypeEnum surchargeType;

    Long surchargeValue;

    String description;

    @Convert(converter = CommonStatusConverter.class)
    CommonStatusEnum status;
}
