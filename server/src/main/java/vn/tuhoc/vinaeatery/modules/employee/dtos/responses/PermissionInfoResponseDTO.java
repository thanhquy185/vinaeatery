package vn.tuhoc.vinaeatery.modules.employee.dtos.responses;

import java.util.List;

import jakarta.persistence.Convert;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.global.domains.converters.CommonStatusConverter;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PermissionInfoResponseDTO {
    Integer id;

    String name;

    @Convert(converter = CommonStatusConverter.class)
    CommonStatusEnum status;

    List<PermissionDDetailResponseDTO> permissionDetails;
}
