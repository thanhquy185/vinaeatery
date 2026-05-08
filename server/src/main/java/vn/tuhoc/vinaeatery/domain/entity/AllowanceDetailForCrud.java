package vn.tuhoc.vinaeatery.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AllowanceDetailForCrud {
    // Properties
    private Integer allowanceId;
    private Integer employeeId;
    private Integer categoryAllowanceId;
}
