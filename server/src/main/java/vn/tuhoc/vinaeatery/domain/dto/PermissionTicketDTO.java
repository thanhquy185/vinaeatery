package vn.tuhoc.vinaeatery.domain.dto;

import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.entity.CategoryPermissionTicket;
import vn.tuhoc.vinaeatery.domain.enumm.PermissionTicketStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.PermissionTicketStatusConverter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PermissionTicketDTO {
    // Properties
    private Integer id;
    private Integer restaurantId;
    private String createAt;
    private EmployeeDTO employeeHandle;
    private EmployeeDTO employeeMain;
    private CategoryPermissionTicket categoryPermissionTicket;
    private String date;
    private String reason;
    @Convert(converter = PermissionTicketStatusConverter.class)
    private PermissionTicketStatusEnum status;
}
