package vn.tuhoc.vinaeatery.modules.table.dtos.responses;

import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.modules.global.domains.converters.CommonStatusConverter;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TableInfoResponseDTO {
    private Integer id;

    private FloorInfoResponseDTO floor;

    private CategoryTableInfoResponseDTO categoryTable;

    private String name;

    private Integer seats;

    private String description;

    @Convert(converter = CommonStatusConverter.class)
    private CommonStatusEnum status;

}
