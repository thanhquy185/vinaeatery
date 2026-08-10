package vn.tuhoc.vinaeatery.modules.table.dtos.requests;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import vn.tuhoc.vinaeatery.modules.global.domains.converters.CommonStatusConverter;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;
import vn.tuhoc.vinaeatery.modules.table.domains.converters.CategoryTableSurchargeTypeConverter;
import vn.tuhoc.vinaeatery.modules.table.domains.enums.CategoryTableSurchargeTypeEnum;

@Data
public class CategoryTableCreateRequestDTO {
    @NotNull(message = "Mã nhà hàng không được để trống!")
    private Integer restaurantId;

    @NotBlank(message = "Tên loại bàn ăn không được để trống!")
    private String name;

    @NotNull(message = "Loại phụ thu không được để trống!")
    @Convert(converter = CategoryTableSurchargeTypeConverter.class)
    private CategoryTableSurchargeTypeEnum surchargeType;

    @NotNull(message = "Giá trị phụ thu không được để trống!")
    private Long surchargeValue;

    private String description;

    @NotNull(message = "Trạng thái không được để trống!")
    @Convert(converter = CommonStatusConverter.class)
    private CommonStatusEnum status;
}
