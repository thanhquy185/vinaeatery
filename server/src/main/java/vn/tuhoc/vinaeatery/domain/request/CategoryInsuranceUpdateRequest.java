package vn.tuhoc.vinaeatery.domain.request;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.dto.CategoryInsuranceUpdateDTO;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class CategoryInsuranceUpdateRequest {
    @Valid
    private FormSecurityDTO formSecurity;
    @Valid
    private CategoryInsuranceUpdateDTO categoryInsurance;
}
