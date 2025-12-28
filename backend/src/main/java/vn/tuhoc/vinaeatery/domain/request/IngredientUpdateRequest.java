package vn.tuhoc.vinaeatery.domain.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.dto.IngredientUpdateDTO;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class IngredientUpdateRequest {
    private FormSecurityDTO formSecurity;
    private IngredientUpdateDTO ingredient;
}
