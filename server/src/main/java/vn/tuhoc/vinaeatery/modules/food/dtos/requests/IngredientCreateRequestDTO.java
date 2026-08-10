package vn.tuhoc.vinaeatery.modules.food.dtos.requests;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import vn.tuhoc.vinaeatery.modules.global.domains.converters.CommonStatusConverter;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;

@Data
public class IngredientCreateRequestDTO {
    @NotNull(message = "Mã nhà hàng không được để trống!")
    private Integer restaurantId;

    @NotBlank(message = "Tên nguyên liệu không được để trống!")
    private String name;

    @NotNull(message = "Loại nguyên liệu không được để trống!")
    private Integer categoryIngredientId;

    @NotNull(message = "Đơn vị tính không được để trống!")
    private String unit;

    @NotNull(message = "Dung lượng không được để trống!")
    private Long capacity;

    private String dateCreate;

    private String dateRemove;

    private Long inputPrice;

    private Long inventory;

    private String note;

    @NotNull(message = "Trạng thái không được để trống!")
    @Convert(converter = CommonStatusConverter.class)
    private CommonStatusEnum status;
}
