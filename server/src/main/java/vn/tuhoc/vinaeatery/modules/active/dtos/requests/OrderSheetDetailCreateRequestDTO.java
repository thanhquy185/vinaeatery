package vn.tuhoc.vinaeatery.modules.active.dtos.requests;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderSheetDetailCreateRequestDTO {
    Integer foodId;

    Long quantity;

    Long price;

    String foodNameSnapshot;

    String foodUnitSnapshot;

    Long foodPriceSnapshot;

    Long totalPriceDetail;
}
