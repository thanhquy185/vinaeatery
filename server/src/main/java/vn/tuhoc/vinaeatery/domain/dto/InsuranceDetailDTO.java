package vn.tuhoc.vinaeatery.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.entity.CategoryInsurance;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class InsuranceDetailDTO {
    // Properties
    private Integer insuranceId;
    private Integer employeeId;
    private Integer categoryInsuranceId;
    private CategoryInsurance categoryInsurance;
}
