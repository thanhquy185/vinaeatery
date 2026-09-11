package vn.tuhoc.vinaeatery.modules.food.dtos.requests;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.global.domains.converters.CommonStatusConverter;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class IngredientCreateRequestDTO {
    @NotNull(message = "Mã nhà hàng không được để trống!")
    Integer restaurantId;

    @NotBlank(message = "Tên nguyên liệu không được để trống!")
    String name;

    @NotNull(message = "Loại nguyên liệu không được để trống!")
    Integer categoryIngredientId;

    @NotNull(message = "Đơn vị tính không được để trống!")
    String unit;

    @NotNull(message = "Dung lượng không được để trống!")
    Long capacity;

    String dateCreate;

    String dateRemove;

    Long inputPrice;

    Long inventory;

    String note;

    @NotNull(message = "Trạng thái không được để trống!")
    @Convert(converter = CommonStatusConverter.class)
    CommonStatusEnum status;
}
