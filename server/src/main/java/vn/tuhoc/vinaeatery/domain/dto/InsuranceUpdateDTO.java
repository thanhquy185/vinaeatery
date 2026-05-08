package vn.tuhoc.vinaeatery.domain.dto;

import java.util.List;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.entity.InsuranceDetailForCrud;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class InsuranceUpdateDTO {
    // Properties
    @NotNull(message = "Tên bảo hiểm không được để trống!")
    private String name;
    @NotNull(message = "Tháng không được để trống!")
    private String month;
    private String note;
    private List<InsuranceDetailForCrud> insuranceDetails;
}
