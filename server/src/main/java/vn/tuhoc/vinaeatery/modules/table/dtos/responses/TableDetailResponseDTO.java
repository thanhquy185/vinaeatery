package vn.tuhoc.vinaeatery.modules.table.dtos.responses;

import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.modules.global.domains.converters.CommonStatusConverter;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantSubInfoResponseDTO;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TableDetailResponseDTO {
    private Integer id;

    private RestaurantSubInfoResponseDTO restaurant;

    private FloorInfoResponseDTO floor;

    private CategoryTableInfoResponseDTO categoryTable;

    private String name;

    private Integer seats;

    private String description;

    @Convert(converter = CommonStatusConverter.class)
    private CommonStatusEnum status;

}
