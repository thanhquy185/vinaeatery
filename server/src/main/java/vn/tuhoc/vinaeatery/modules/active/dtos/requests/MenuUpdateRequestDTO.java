package vn.tuhoc.vinaeatery.modules.active.dtos.requests;

import java.util.List;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.MenuTypeConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.MenuTypeEnum;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MenuUpdateRequestDTO {
    @NotBlank(message = "Tên thực đơn không được để trống!")
    String name;

    @NotNull(message = "Loại thực đơn không được để trống!")
    @Convert(converter = MenuTypeConverter.class)
    MenuTypeEnum type;

    @NotNull(message = "Giá tiền không được để trống!")
    @Min(value = 0)
    Long price;

    String description;

    List<MenuDetailUpdateRequestDTO> menuDetails;
}
