package vn.tuhoc.vinaeatery.modules.employee.dtos.responses;

import java.util.List;

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
public class PermissionInfoResponseDTO {
    private Integer id;

    private String name;

    @Convert(converter = CommonStatusConverter.class)
    private CommonStatusEnum status;

    private List<PermissionDDetailResponseDTO> permissionDetails;
}
