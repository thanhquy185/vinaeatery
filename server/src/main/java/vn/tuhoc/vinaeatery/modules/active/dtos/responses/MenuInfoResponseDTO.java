package vn.tuhoc.vinaeatery.modules.active.dtos.responses;

import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.MenuTypeConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.MenuTypeEnum;
import vn.tuhoc.vinaeatery.modules.global.domains.converters.CommonStatusConverter;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MenuInfoResponseDTO {
    private Integer id;

    private String name;

    @Convert(converter = MenuTypeConverter.class)
    private MenuTypeEnum type;

    private Long price;

    private String description;

    @Convert(converter = CommonStatusConverter.class)
    private CommonStatusEnum status;
}
