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
public class CategoryAllowanceUpdateDTO {
    // Properties
    @NotNull(message = "Tên loại phụ cấp không được để trống!")
    private String name;
    @NotNull(message = "Số tiền không được để trống!")
    private Integer money;
    private String description;
}
