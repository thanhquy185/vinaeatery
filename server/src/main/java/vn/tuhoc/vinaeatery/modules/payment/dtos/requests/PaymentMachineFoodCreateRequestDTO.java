package vn.tuhoc.vinaeatery.modules.payment.dtos.requests;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentMachineFoodCreateRequestDTO {
    Integer foodId;

    Long quantity;

    Long price;

    String foodNameSnapshot;

    String foodUnitSnapshot;

    Long foodPriceSnapshot;

    Long totalPriceDetail;
}
