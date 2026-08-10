package vn.tuhoc.vinaeatery.modules.active.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.FoodInfoResponseDTO;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class BillDDetailResponseDTO {
    private FoodInfoResponseDTO food;

    private Long quantity;

    private Long price;

    private String foodNameSnapshot;

    private String foodUnitSnapshot;

    private Long foodPriceSnapshot;

    private Long totalPriceDetail;
}
