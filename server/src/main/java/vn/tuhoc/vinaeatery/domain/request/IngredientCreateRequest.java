package vn.tuhoc.vinaeatery.domain.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.entity.Ingredient;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class IngredientCreateRequest {
    private FormSecurityDTO formSecurity;
    private Ingredient ingredient;
}
