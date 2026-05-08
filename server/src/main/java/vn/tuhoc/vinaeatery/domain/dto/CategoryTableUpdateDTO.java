package vn.tuhoc.vinaeatery.domain.dto;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.enumm.CategoryTableSurchargeTypeEnum;
import vn.tuhoc.vinaeatery.repository.converter.CategoryTableSurchargeTypeConverter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CategoryTableUpdateDTO {
    @NotNull(message = "Tên loại bàn không được để trống!")
    private String name;
    @Convert(converter = CategoryTableSurchargeTypeConverter.class)
    private CategoryTableSurchargeTypeEnum surchargeType;
    private Long surchargeValue;
    private String description;
}
