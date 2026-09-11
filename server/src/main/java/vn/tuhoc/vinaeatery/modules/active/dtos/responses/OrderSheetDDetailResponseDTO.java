package vn.tuhoc.vinaeatery.modules.active.dtos.responses;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.FoodInfoResponseDTO3;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderSheetDDetailResponseDTO {
    FoodInfoResponseDTO3 food;

    Long quantity;

    Long price;

    String foodNameSnapshot;

    String foodUnitSnapshot;

    Long foodPriceSnapshot;

    Long totalPriceDetail;
}
