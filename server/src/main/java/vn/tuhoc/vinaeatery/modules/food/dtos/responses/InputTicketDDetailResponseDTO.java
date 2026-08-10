package vn.tuhoc.vinaeatery.modules.food.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class InputTicketDDetailResponseDTO {
    private IngredientInfoResponseDTO ingredient;

    private Long quantity;

    private Long inputPrice;

    private String ingredientNameSnapshot;

    private Long ingredientInputPriceSnapshot;

    private Long totalInputPriceDetail;
}
