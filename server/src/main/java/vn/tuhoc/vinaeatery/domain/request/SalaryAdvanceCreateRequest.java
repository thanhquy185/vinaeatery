package vn.tuhoc.vinaeatery.domain.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.entity.SalaryAdvance;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class SalaryAdvanceCreateRequest {
    private FormSecurityDTO formSecurity;
    private SalaryAdvance salaryAdvance;
}
