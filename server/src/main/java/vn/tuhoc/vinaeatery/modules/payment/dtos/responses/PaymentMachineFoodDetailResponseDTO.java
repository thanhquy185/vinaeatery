package vn.tuhoc.vinaeatery.modules.payment.dtos.responses;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.FoodInfoResponseDTO3;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentMachineFoodDetailResponseDTO {
    FoodInfoResponseDTO3 food;

    Long quantity;

    Long price;

    String foodNameSnapshot;

    String foodUnitSnapshot;

    Long foodPriceSnapshot;

    Long totalPriceDetail;
}
