package vn.tuhoc.vinaeatery.modules.food.dtos.responses;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InputTicketDDetailResponseDTO {
    IngredientInfoResponseDTO ingredient;

    Long quantity;

    Long inputPrice;

    String ingredientNameSnapshot;

    Long ingredientInputPriceSnapshot;

    Long totalInputPriceDetail;
}
