package vn.tuhoc.vinaeatery.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class InsuranceDetailForCrud {
    // Properties
    private Integer insuranceId;
    private Integer employeeId;
    private Integer categoryInsuranceId;
}
