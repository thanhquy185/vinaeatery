package vn.tuhoc.vinaeatery.modules.active.dtos.requests;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BillDetailCreateRequestDTO {
    Integer foodId;

    Long quantity;

    Long price;

    String foodNameSnapshot;

    String foodUnitSnapshot;

    Long foodPriceSnapshot;

    Long totalPriceDetail;
}
