package vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ExpenseIngredientTableBodyResponseDTO {
    private String name;

    private Long inputPrice;

    private Long quantity;

    private Long expense;

    private Integer rowSpan;
}
