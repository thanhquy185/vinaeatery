package vn.tuhoc.vinaeatery.domain.request;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.entity.CategoryAllowance;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class CategoryAllowanceCreateRequest {
    @Valid
    private FormSecurityDTO formSecurity;
    @Valid
    private CategoryAllowance categoryAllowance;
}
