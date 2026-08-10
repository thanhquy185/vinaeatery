package vn.tuhoc.vinaeatery.modules.table.dtos.responses;

import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.modules.table.domains.converters.CategoryTableSurchargeTypeConverter;
import vn.tuhoc.vinaeatery.modules.table.domains.enums.CategoryTableSurchargeTypeEnum;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CategoryTableCrudResponseDTO {
    private Integer id;

    private String name;

    @Convert(converter = CategoryTableSurchargeTypeConverter.class)
    private CategoryTableSurchargeTypeEnum surchargeType;

    private Long surchargeValue;

    private String description;
}
