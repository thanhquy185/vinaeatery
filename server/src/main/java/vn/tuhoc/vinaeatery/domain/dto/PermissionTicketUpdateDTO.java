package vn.tuhoc.vinaeatery.domain.dto;

import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.enumm.PermissionTicketStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.PermissionTicketStatusConverter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PermissionTicketUpdateDTO {
    // Properties
    private Integer employeeHandleId;
    @Convert(converter = PermissionTicketStatusConverter.class)
    private PermissionTicketStatusEnum status;
}