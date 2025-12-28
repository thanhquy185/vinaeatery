package vn.tuhoc.vinaeatery.domain.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.dto.CategoryTableUpdateDTO;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class CategoryTableUpdateRequest {
    private FormSecurityDTO formSecurity;
    private CategoryTableUpdateDTO categoryTable;
}
