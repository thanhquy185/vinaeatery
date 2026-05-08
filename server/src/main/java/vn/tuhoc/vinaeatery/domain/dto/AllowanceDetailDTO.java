package vn.tuhoc.vinaeatery.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.entity.CategoryAllowance;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AllowanceDetailDTO {
    // Properties
    private Integer allowanceId;
    private Integer employeeId;
    private Integer categoryAllowanceId;
    private CategoryAllowance categoryAllowance;
}
