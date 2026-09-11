package vn.tuhoc.vinaeatery.modules.table.dtos.requests;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.table.domains.converters.CategoryTableSurchargeTypeConverter;
import vn.tuhoc.vinaeatery.modules.table.domains.enums.CategoryTableSurchargeTypeEnum;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryTableUpdateRequestDTO {
    @NotBlank(message = "Tên loại bàn ăn không được để trống!")
    String name;

    @NotNull(message = "Loại phụ thu không được để trống!")
    @Convert(converter = CategoryTableSurchargeTypeConverter.class)
    CategoryTableSurchargeTypeEnum surchargeType;

    @NotNull(message = "Giá trị phụ thu không được để trống!")
    Long surchargeValue;

    String description;
}
