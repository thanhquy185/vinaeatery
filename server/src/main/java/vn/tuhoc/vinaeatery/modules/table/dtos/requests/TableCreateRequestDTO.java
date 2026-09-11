package vn.tuhoc.vinaeatery.modules.table.dtos.requests;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.global.domains.converters.CommonStatusConverter;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TableCreateRequestDTO {
    @NotNull(message = "Mã nhà hàng không được để trống!")
    Integer restaurantId;

    @NotBlank(message = "Tên bàn ăn không được để trống!")
    String name;

    @NotNull(message = "Tầng không được để trống!")
    Integer floorId;

    @NotNull(message = "Loại bàn ăn không được để trống!")
    Integer categoryTableId;

    @NotNull(message = "Số chỗ ngồi không được để trống!")
    @Min(value = 0)
    Integer seats;

    String description;

    @NotNull(message = "Trạng thái không được để trống!")
    @Convert(converter = CommonStatusConverter.class)
    CommonStatusEnum status;
}
