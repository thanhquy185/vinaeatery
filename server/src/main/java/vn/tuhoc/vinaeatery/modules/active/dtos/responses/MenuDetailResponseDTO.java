package vn.tuhoc.vinaeatery.modules.active.dtos.responses;

import java.util.List;

import jakarta.persistence.Convert;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.MenuTypeConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.MenuTypeEnum;
import vn.tuhoc.vinaeatery.modules.global.domains.converters.CommonStatusConverter;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantSubInfoResponseDTO;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MenuDetailResponseDTO {
    Integer id;

    RestaurantSubInfoResponseDTO restaurant;

    String name;

    @Convert(converter = MenuTypeConverter.class)
    MenuTypeEnum type;

    Long price;

    String description;

    @Convert(converter = CommonStatusConverter.class)
    CommonStatusEnum status;

    List<MenuDDetailResponseDTO> menuDetails;
}
