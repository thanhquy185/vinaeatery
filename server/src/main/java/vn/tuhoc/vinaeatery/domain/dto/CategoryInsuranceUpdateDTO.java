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
public class CategoryInsuranceUpdateDTO {
    // Properties
    @NotNull(message = "Tên loại bảo hiểm không được để trống!")
    private String name;
    @NotNull(message = "% công ty không được để trống!")
    private Float companyPercent;
    @NotNull(message = "% nhân viên không được để trống!")
    private Float employeePercent;
    private String description;
}
