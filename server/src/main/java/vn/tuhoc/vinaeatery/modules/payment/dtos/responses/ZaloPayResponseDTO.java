package vn.tuhoc.vinaeatery.modules.payment.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ZaloPayResponseDTO {
    private int returnCode;

    private String returnMessage;

    private String orderUrl; // link QR code để quét

    private String zpTransToken;
}
