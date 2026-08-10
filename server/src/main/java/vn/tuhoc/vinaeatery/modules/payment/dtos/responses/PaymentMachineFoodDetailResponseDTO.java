package vn.tuhoc.vinaeatery.modules.payment.dtos.responses;

import lombok.Builder;
import lombok.Data;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.FoodInfoResponseDTO3;

@Data
@Builder
public class PaymentMachineFoodDetailResponseDTO {
    private FoodInfoResponseDTO3 food;

    private Long quantity;

    private Long price;

    private String foodNameSnapshot;

    private String foodUnitSnapshot;

    private Long foodPriceSnapshot;

    private Long totalPriceDetail;
}
