package vn.tuhoc.vinaeatery.modules.employee.dtos.requests;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.global.domains.converters.CommonStatusConverter;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PermissionDeleteRequestDTO {
    @NotNull(message = "Trạng thái không được để trống!")
    @Convert(converter = CommonStatusConverter.class)
    CommonStatusEnum status;
}
