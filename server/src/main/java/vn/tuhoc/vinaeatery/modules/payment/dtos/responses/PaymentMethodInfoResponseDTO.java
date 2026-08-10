package vn.tuhoc.vinaeatery.modules.payment.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentMethodInfoResponseDTO {
    private Integer id;

    private String image;

    private String name;
}
