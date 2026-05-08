package vn.tuhoc.vinaeatery.domain.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CategoryPermissionTicketUpdateDTO {
    // Properties
    @NotNull(message = "Tên loại đơn xin phép không được để trống!")
    private String name;
    private String description;
}
