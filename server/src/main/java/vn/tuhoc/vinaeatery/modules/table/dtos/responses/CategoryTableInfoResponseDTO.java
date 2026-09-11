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
import vn.tuhoc.vinaeatery.modules.table.domains.converters.CategoryTableSurchargeTypeConverter;
import vn.tuhoc.vinaeatery.modules.table.domains.enums.CategoryTableSurchargeTypeEnum;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryTableInfoResponseDTO {
    Integer id;

    String name;

    @Convert(converter = CategoryTableSurchargeTypeConverter.class)
    CategoryTableSurchargeTypeEnum surchargeType;

    Long surchargeValue;

    String description;

    @Convert(converter = CommonStatusConverter.class)
    CommonStatusEnum status;

}
