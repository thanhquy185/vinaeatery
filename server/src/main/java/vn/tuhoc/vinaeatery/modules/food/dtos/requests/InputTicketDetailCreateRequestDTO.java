package vn.tuhoc.vinaeatery.modules.food.dtos.requests;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InputTicketDetailCreateRequestDTO {
    Integer ingredientId;

    Long quantity;

    Long inputPrice;

    String ingredientNameSnapshot;

    Long ingredientInputPriceSnapshot;

    Long totalInputPriceDetail;
}
