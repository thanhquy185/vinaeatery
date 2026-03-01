package vn.tuhoc.vinaeatery.domain.dto;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RoleUpdateDTO {
    // Properties
    @NotNull(message = "Tên chức vụ không được để trống!")
    private String name;
    @NotNull(message = "Cách tính lương không được để trống!")
    private String salaryType;
    @NotNull(message = "Tiền lương không được để trống!")
    private Long salaryValue;
    // @NotNull(message = "Thời gian cập nhật không được để trống!")
    private String updateAt;
}
